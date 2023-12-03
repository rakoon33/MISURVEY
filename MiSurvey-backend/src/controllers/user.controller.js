const { userService } = require("../services");

const getUserDataController = async (req, res) => {
  try {
    const userID = req.user.id;

    if (!userID) {
      return res
        .status(400)
        .json({ message: "userID is required as a query parameter." });
    }

    const result = await userService.getUserData(userID);

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to retrieve user data." });
  }
};

const createUserController = async (req, res) => {
  try {
    console.log(req.body);
    const newUser = await userService.createUser(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUserController = async (req, res) => {
  console.log("Updating user");
  try {
    console.log(req.params.UserID);
    console.log(req.body);
    const result = await userService.updateUser(req.params.UserID, req.body);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.UserID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneUserController = async (req, res) => {
  try {
    const userDetails = await userService.getOneUser(req.params.UserID);
    res.json(userDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const userDetails = await userService.getOneUser(req.user.id);
    res.json(userDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsersController = async (req, res) => {
    try {
      const requestingUserRole = req.user.role;
      let requestingUserCompanyId = null;
  
      // Chỉ thiết lập CompanyID nếu người dùng không phải là SuperAdmin
      if (requestingUserRole !== 'SuperAdmin') {
        requestingUserCompanyId = req.user.companyID;
      }
  
      console.log(requestingUserRole);
      console.log(requestingUserCompanyId);
      const allUsers = await userService.getAllUsers(requestingUserRole, requestingUserCompanyId);
      res.json(allUsers);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

const searchUserController = async (req, res) => {
  try {
    const { column, searchTerm } = req.query;

    if (!column || !searchTerm) {
      return res
        .status(400)
        .json({
          message:
            "Both column and searchTerm are required as query parameters.",
        });
    }
    const result = await userService.searchUsers(column, searchTerm);

    if (result.status) {
      res.json(result.users);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to search users." });
  }
};

module.exports = {
  createUserController,
  updateUserController,
  deleteUserController,
  getOneUserController,
  getAllUsersController,
  searchUserController,
  getUserProfileController,
  getUserDataController,
};
