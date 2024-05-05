const express = require('express');
const router = express.Router();
const moment = require('moment');
const config = require('config');
const qs = require('qs');
const crypto = require('crypto');



router.get('/create_payment_url', (req, res) => {
  res.send(`
    <form method="POST" action="/order/create_payment_url">
      Amount: <input type="number" name="amount"><br>
      <button type="submit">Pay</button>
    </form>
  `);
});

router.post('/create_payment_url', (req, res) => {
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('DDHHmmss');
  const amount = req.body.amount;
  const tmnCode = config.get('vnp_TmnCode');
  const secretKey = config.get('vnp_HashSecret');
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: amount * 100,
    vnp_OrderInfo: `Payment for order ID ${orderId}`,
    vnp_OrderType: 'other',
    vnp_TxnRef: orderId,
    vnp_ReturnUrl: config.get('vnp_ReturnUrl'),
    vnp_CreateDate: createDate
  };

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  vnp_Params.vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  const vnpUrl = `${config.get('vnp_Url')}?${qs.stringify(vnp_Params, { encode: false })}`;
  res.redirect(vnpUrl);
});

router.get('/vnpay_return', (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', config.get('vnp_HashSecret'));
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    res.send(`Payment successful with response code ${vnp_Params.vnp_ResponseCode}`);
  } else {
    res.send('Checksum failed');
  }
});

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = router;
