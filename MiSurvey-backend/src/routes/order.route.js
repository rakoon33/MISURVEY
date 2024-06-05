let express = require("express");
let router = express.Router();
const request = require("request");
const moment = require("moment");
const crypto = require("crypto");
const querystring = require("qs");
const config = require("config");
const { UserPackage, ServicePackage } = require("../models");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares");

const path = require('path');

// Kiểm tra dữ liệu đầu vào
function validateInput(input, fieldName) {
  if (!input) {
    throw new Error(`${fieldName} is required`);
  }
}

// Hàm sắp xếp
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

// tạo url thanh toán
router.post("/create_payment", authMiddleware.tokenVerification, async function (req, res) {
  try {
    const { packageId, bankCode, language } = req.body;
    res.cookie("packageId", packageId, { maxAge: 900000, httpOnly: true });
    const companyID = req.user ? req.user.companyID : null;
    if (companyID) {
      res.cookie("companyID", companyID, { maxAge: 900000, httpOnly: true });
    }

    const servicePackage = await ServicePackage.findByPk(packageId);
    if (!servicePackage) {
      return res.status(404).json({ message: "Gói dịch vụ không tồn tại" });
    }

    const amount = servicePackage.Price;
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const ipAddr =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const tmnCode = config.get("vnp_TmnCode");
    const secretKey = config.get("vnp_HashSecret");
    const vnpUrlBase = config.get("vnp_Url");
    const returnUrl = config.get("vnp_ReturnUrl");

    validateInput(tmnCode, "vnp_TmnCode");
    validateInput(secretKey, "vnp_HashSecret");
    const orderId = moment().format("DDHHmmss");
    const locale = language || "vn";
    const currCode = "VND";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(amount * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    const vnpUrl =
      vnpUrlBase + "?" + querystring.stringify(vnp_Params, { encode: false });

    // Return the URL to the frontend
    res.json({ vnpUrl });
  } catch (error) {
    console.error("Lỗi tạo URL thanh toán:", error.message);
    res.status(500).json({ message: error.message });
  }
});


router.get("/vnpay_return", async (req, res) => { // Add middleware here
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const sortedParams = sortObject(vnp_Params);

    const secretKey = config.get("vnp_HashSecret");
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      console.log("Giao dịch thành công với dữ liệu:", sortedParams);

      const {
        vnp_TxnRef,
        vnp_Amount,
        vnp_ResponseCode,
        vnp_TransactionStatus,
      } = sortedParams;

      if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
        const packageId = req.cookies.packageId;
        const companyID = req.cookies.companyID;

        const servicePackage = await ServicePackage.findByPk(packageId);
        if (!servicePackage) {
          throw new Error("Service package not found");
        }

        // Check for existing active package
        const currentPackage = await UserPackage.findOne({
          where: {
            CompanyID: companyID,
            IsActive: true
          }
        });

        // Deactivate existing active package if present
        if (currentPackage) {
          currentPackage.IsActive = false;
          await currentPackage.save();
        }

        // Create new package
        const newUserPackage = {
          PackageID: packageId,
          StartDate: new Date(),
          EndDate: moment().add(servicePackage.Duration, "days").toDate(),
          CompanyID: companyID,
          IsActive: true // Explicitly set IsActive to true
        };

        const userPackage = await UserPackage.create(newUserPackage);
        res.redirect(`${process.env.FRONTEND_URL}/#/subscription-plans`);
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/#/subscription-plans`);
      }
    } else {
      console.error("Xác minh thất bại do không trùng khớp mã băm");
      res.sendFile(path.join(__dirname, 'public/html', 'failure.html'));
    }
  } catch (error) {
    console.error("Lỗi xử lý phản hồi từ VNPAY:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;