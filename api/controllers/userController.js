import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @DESC Get all users data
 * @ROUTE /api/v1/user
 * @method GET
 * @access public
 */
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "User data not found" });
  }
  console.log(req.me);

  res.status(200).json(users);
});

/**
 * @DESC Get Single users data
 * @ROUTE /api/v1/user/:id
 * @method GET
 * @access public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User data not found" });
  }

  res.status(200).json(user);
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const createUser = asyncHandler(async (req, res) => {
  // get values
  const { name, email, mobile, password, gender } = req.body;

  // validations
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // email check
  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    return res
      .status(400)
      .json({ message: "This Email already exists. please, login" });
  }

  // hash password
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({
    name,
    email,
    mobile,
    password: hashPass,
    gender,
  });

  res.status(200).json({ user, message: "Account created. please login" });
});

/**
 * @DESC Delete User
 * @ROUTE /api/v1/user/:id
 * @method DELETE
 * @access public
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.status(200).json(user);
});

/**
 * @DESC Update User
 * @ROUTE /api/v1/user/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateUser = asyncHandler(async (req, res) => {
  const {
    name,
    gender,
    birthDate,
    mobile,
    address,
    city,
    state,
    country,
    zipcode,
  } = req.body;

  const image = req.file

  const loggedInUser = req.me;
  const user = await User.findOne({ email: loggedInUser.email });

  const id = user._id;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      mobile,
      gender,
      address,
      city,
      state,
      country,
      zipcode,
      birthDate,
      photo : image?.filename
    },
    { new: true }
  );

  res.status(200).json({ message: "user updated successfully", updatedUser });
});
