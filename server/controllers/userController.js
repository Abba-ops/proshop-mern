import validator from "validator";
import User from "../models/userModel.js";
import genToken from "../utils/genToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    genToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, lastName, firstName } = req.body;

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw new Error("Password not strong enough");
  }

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    email,
    password,
    lastName,
    firstName,
  });

  if (user) {
    genToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      if (!validator.isStrongPassword(req.body.password)) {
        res.status(400);
        throw new Error("Password not strong enough");
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      lastName: updatedUser.lastName,
      firstName: updatedUser.firstName,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    } else {
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ message: "User deleted successfully" });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get a user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      lastName: updatedUser.lastName,
      firstName: updatedUser.firstName,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
