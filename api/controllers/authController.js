import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import emailWithNodeMailer from "../helper/sendEmail.js";

/**
 * @DESC User login
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access public
 */
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All feilds are required" });

  // check email exists
  const loginUser = await User.findOne({ email: email });
  if (!loginUser)
    return res.status(404).json({ message: "user not found with this email" });

  // check password
  const matchPass = bcrypt.compareSync(password, loginUser.password);
  if (!matchPass) return res.status(404).json({ message: "wrong password" });

  // create access token
  const token = jwt.sign(
    { email: loginUser.email },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIREIN,
    }
  );

  // create refresh token
  // const refreshToken = jwt.sign(
  //   { email: loginUser.email },
  //   process.env.JWT_REFRESH_TOKEN_SECRET,
  //   {
  //     expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIREIN,
  //   }
  // );

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.MODE == "Development" ? false : true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .status(200)
    .json({ token, user: loginUser, message: "successfully logged in" });
});

/**
 * @DESC User login
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access private
 */
export const logout = expressAsyncHandler((req, res) => {
  res.clearCookie("accessToken").json({ message: "Logged Out" });
});

// /**
//  * @DESC User register
//  * @ROUTE /api/v1/auth/register
//  * @method POST
//  * @access public
//  */
// export const register = expressAsyncHandler(async (req, res) => {
//   // get values
//   const { name, email, password } = req.body;

//   // validations
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // email check
//   const emailCheck = await User.findOne({ email });

//   if (emailCheck) {
//     return res.status(400).json({
//       message: `Email already in use`,
//     });
//   }

//   // hash password
//   const hashPass = await bcrypt.hash(password, 10);

//   // create new user
//   const user = await User.create({
//     name,
//     email,
//     password: hashPass,
//   });

//   res.status(200).json({ message: "Acccount created. please login", user });
// });

/**
 * @DESC User register in process
 * @ROUTE /api/v1/auth/process-register
 * @method POST
 * @access public
 */
export const registerInProcess = expressAsyncHandler(async (req, res) => {
  // get values
  const { name, email, password } = req.body;

  // validations
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // email check
  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    return res.status(400).json({
      message: `Email already in use`,
    });
  }

  // hash password
  const hashPass = await bcrypt.hash(password, 10);

  const token = jwt.sign(
    {
      name,
      email,
      password: hashPass,
    },
    process.env.JWT_REGISTER_SECRET,
    {
      expiresIn: "1m",
    }
  );

  if (!token)
    return res.status(400).json({
      message: `Can't Genenrate Token`,
    });

  const clientURL = process.env.CLIENT_URL;

  const emailData = {
    email,
    subject: "Activation Email",
    html: `
      <h2>Hello ${name}</h2>
      <p><a target="_blank" href="${clientURL}/login?token=${token}">Click Here</a> to activate your account</p>
    `,
  };

  emailWithNodeMailer(emailData);

  res.status(200).json({
    message:
      "A verification mail has been sent to your email. Please, verify your account and login",
    token,
  });
});

/**
 * @DESC User verify
 * @ROUTE /api/v1/auth/verify-user
 * @method POST
 * @access private
 */
export const verifyRegisterUser = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Link expired. Registration Now",
    });
  }

  const decode = jwt.verify(token, process.env.JWT_REGISTER_SECRET);

  if (!decode) {
    return res.status(400).json({
      message: "can't decode user data",
    });
  }

  const verifyedUser = await User.create(decode);

  res.status(200).json({
    message: "user created successfully, please login",
    verifyedUser,
  });
});

/**
 * @DESC User forget password
 * @ROUTE /api/v1/auth/forget-password
 * @method POST
 * @access public
 */
export const forgetPassword = expressAsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Please, enter your email" });

    // check email
    const checkMail = await User.findOne({ email });
    if (!checkMail) {
      return res
        .status(400)
        .json({ message: "user not found, please register now" });
    }

    const token = jwt.sign({ email }, process.env.JWT_FORGOT_PASSWORD, {
      expiresIn: "30m",
    });

    const clientURL = process.env.CLIENT_URL;

    const emailData = {
      email,
      subject: "Reset Password",
      html: `
        <h2>Hey ${checkMail.name}</h2>
        <strong>You just request to change password.<a href="${clientURL}/reset-password?token=${token}">Click Here</a> to reset your password</strong>
      `,
    };

    emailWithNodeMailer(emailData);

    // rend res
    res
      .status(200)
      .json({ message: "please, check your email to reset password", token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

/**
 * @DESC User reset password
 * @ROUTE /api/v1/auth/reset-password
 * @method POST
 * @access private
 */
export const resetPassword = expressAsyncHandler(async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const decode = jwt.verify(token, process.env.JWT_FORGOT_PASSWORD);

    const user = await User.findOne({ email: decode.email });

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "enter the same password in both fields" });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    const id = user._id;
    const updatedPassword = await User.findByIdAndUpdate(
      id,
      {
        password: hashPass,
      },
      { new: true }
    );

    // rend res
    res.status(200).json({
      message: "password reset successfully, Please Login",
      updatedPassword,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

/**
 * @DESC User update password
 * @ROUTE /api/v1/auth/update-password
 * @method POST
 * @access private
 */
export const updatePassword = expressAsyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const loggedInUserData = req.me;
    const user = await User.findOne({ email: loggedInUserData.email });

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    // old pass match
    const matchOldPass = await bcrypt.compare(oldPassword, user.password);
    if (!matchOldPass) {
      return res
        .status(400)
        .json({ message: "Previous Password Didn't match" });
    }

    if (oldPassword === confirmPassword) {
      return res
        .status(400)
        .json({ message: "Sorry, can't update password with old password" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Enter the same password in both fields" });
    }

    const makeNewPassAsHash = await bcrypt.hash(newPassword, 10)

    const id = user._id;
    const updatePassword = await User.findByIdAndUpdate(id, {
      password : makeNewPassAsHash
    }, {new : true})

    // rend res
    res
      .clearCookie("accessToken")
      .status(200)
      .json({ message: "password updated successfully, Please Login Now", updatePassword });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

/**
 * @DESC logged in user data
 * @ROUTE /api/v1/auth/me
 * @method get
 * @access private
 */
export const loggedInUser = (req, res) => {
  // send data
  res.status(200).json(req.me);
};
