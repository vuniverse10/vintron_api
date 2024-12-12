import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import logging from "../../config/logging";
import User from "../models/user";
import signJWT from "../../tokenhub/signJTW";
import { generateOTP } from "../../utils";

// @ts-ignore
import validator from "validators";
import statuscodes from "../../config/response";
const crypto = require("crypto");
const insertUUID = crypto.randomUUID();
const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Token validated, user authorized.");

  return res.status(statuscodes.SUCCESS).json({
    message: "Token(s) validated",
  });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  console.log(">>>req.body", req.body);
  let { mobile } = req.body;
  let isDuplicateRecord = false;

  try {
    const salt = await bcryptjs.genSalt(10);
    let hashPassword = bcryptjs.hashSync(mobile, salt);
    const emailOTP = generateOTP();
    const mobileOTP = emailOTP;
    const username = "NA-USER";
    const userEmail = mobile + "@gmail.com";
    const moduleList = [{ moduleName: "HYDRATION", moduleID: "HYDRATION" }];
    const userRequest = {
      username: username,
      firstname: username,
      password: hashPassword,
      email: userEmail,
      mobile: mobile,
      emailOTP: emailOTP,
      mobileOTP: mobileOTP,
      userID: insertUUID,
      interestedCategories: moduleList,
    };
    const user = new User(userRequest);
    const insertResult = await user.save();
    return res
      .status(200)
      .json({ code: 200, message: "User Created Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 200, message: "Insertion Failed." });
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  let { email, emailOTP } = req.body;

  try {
    const updateResult = await User.findOneAndUpdate(
      {
        email: email,
        emailOTP: emailOTP,
      },
      {
        $set: {
          emailOTP: "",
          userStatus: 0,
          emailVerified: true,
          mobileVerified: true,
        },
      },
      {
        returnDocument: "after",
      }
    );
    if (!updateResult) {
      return res.status(500).json({
        code: 500,
        message: "Invalid Verification Code / Expired",
        data: null,
      });
    }
  } catch (error: any) {
    return res.status(statuscodes.INTERNAL_ERROR).json({
      code: statuscodes.INTERNAL_ERROR,
      message: error.message,
      error,
    });
  }
};

const verifyMobile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { mobile, verificationCode } = req.body;

  try {
    const updateResult = await User.findOneAndUpdate(
      {
        mobile: mobile,
        mobileOTP: verificationCode,
      },
      {
        $set: {
          mobileOTP: "",
          userStatus: 1,
          emailVerified: true,
          mobileVerified: true,
        },
      },
      {
        returnDocument: "after",
      }
    );
    if (updateResult) {
      return res.status(200).json({
        code: 200,
        message: "Verification Completed Successfully.",
        data: null,
      });
    } else {
      return res.status(204).json({
        code: 204,
        message: "Invalid Verification Code  / Expired",
        data: null,
      });
    }
  } catch (error: any) {
    return res.status(statuscodes.INTERNAL_ERROR).json({
      code: statuscodes.INTERNAL_ERROR,
      message: error.message,
      error,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username: identifier, password } = req.body;
  console.log("User Input:", req.body);

  try {
    // Find user by mobile, email, or username
    const user = await User.findOne({
      $or: [{ mobile: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(statuscodes.AUTHORIZATION).json({
        code: statuscodes.AUTHORIZATION,
        message: "Unauthorized",
      });
    }

    // Compare the password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(statuscodes.AUTHORIZATION).json({
        code: statuscodes.AUTHORIZATION,
        message: "Password mismatch",
      });
    }

    // Sign JWT and respond
    signJWT(user, (error, token) => {
      if (error) {
        return res.status(statuscodes.INTERNAL_ERROR).json({
          code: statuscodes.INTERNAL_ERROR,
          message: error.message,
          error,
        });
      }

      // Check user status
      if (user) {
        const returnResponse = {
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          status: user.userStatus,
          pkID: user._id,
          userID: user.userID,
          emailVerified: user.emailVerified,
          mobileVerified: user.mobileVerified,
          age: user.age,
          weight: user.weight,
          height: user.height,
          gender: user.gender,
          interestedCategories: user.interestedCategories
            ? user.interestedCategories
            : [],
          deviceID: user.deviceID,
          nutritionCalories:user.nutritionCalories,
        };
        return res.status(statuscodes.SUCCESS).json({
          code: statuscodes.SUCCESS,
          message: "Auth successful",
          token,
          user: returnResponse,
        });
      } else {
        return res.status(statuscodes.FAIL).json({
          code: statuscodes.FAIL,
          message: "Email verification pending",
          error: "Verification Pending",
        });
      }
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(statuscodes.INTERNAL_ERROR).json({
      code: statuscodes.INTERNAL_ERROR,
      message: "Something went wrong.",
      error: err.message || err,
    });
  }
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .select("-password")
    .exec()
    .then((users) => {
      if (!users.length)
        return res.status(statuscodes.FAIL).json({
          users: [],
          count: 0,
        });
      return res.status(statuscodes.SUCCESS).json({
        users: users,
        count: users.length,
      });
    })
    .catch((error) => {
      return res.status(statuscodes.INTERNAL_ERROR).json({
        message: error.message,
        error,
      });
    });
};

const Profile = (req: Request, res: Response, next: NextFunction) => {
  //const authRes = res['locals']['jwt'];
  const { userID } = req.body;
  User.find({ userID: userID })
    .select("-password")
    .exec()
    .then((users) => {
      console.log(">>>Profile Details", users);
      if (users.length !== 1) {
        return res.status(401).json({
          message: "Profile Not Found...!",
        });
      }
      return res.status(200).json({
        profile: users[0],
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  const authRes = res["locals"]["jwt"];
  try {
    res["locals"]["jwt"] = null;
    return res.status(200).json({ message: "Loggedout success" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { userName, email, age, weight, height, gender, userID } = req.body;

  try {
    const authRes = res["locals"]["jwt"];
    const updateResult = await User.findOneAndUpdate(
      { userID: userID },
      {
        $set: {
          userName: userName,
          email: email,
          age: age,
          weight: weight,
          height: height,
          gender: gender,
          userStatus: 1,
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (updateResult)
      return res.status(200).json({ message: "profile Updated Successfully" });
    else
      return res.status(500).json({
        message: "Unable to Update the Profile",
      });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const changePassword = (req: Request, res: Response, next: NextFunction) => {
  let {
    old_password: oldpassword,
    password,
    confirmpassword,
    userID,
  } = req.body;

  const matched = oldpassword != password ? true : false;
  if (!matched) {
    return res.status(422).json({
      message: "Old password and new password both are same.",
    });
  }
  //const authRes = res['locals']['jwt'];
  User.find({ userID: userID })
    .exec()
    .then((users: any) => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      bcryptjs.compare(oldpassword, users[0]["password"], (error, result) => {
        if (error)
          return res.status(401).json({ message: "Password Mismatch" });
        if (result) {
          const result = updatePassword({ userID: userID, password: password });
          if (!result)
            return res
              .status(422)
              .json({ message: "Unable to update the password" });
          return res.status(200).json({
            message: "Password changed successfully",
          });
        } else {
          return res.status(422).json({ message: "Old password not matched." });
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

async function updatePassword(userReq: any) {
  const salt = await bcryptjs.genSalt(10);
  let hashPassword = bcryptjs.hashSync(userReq.password, salt);

  const updateResult = await User.findOneAndUpdate(
    { userID: userReq.userID },
    {
      $set: {
        password: hashPassword,
        emailOTP: "",
      },
    },
    {
      returnDocument: "after",
    }
  );
  return updateResult ? true : false;
}

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email } = req.body;

  try {
    const verificationCode = generateOTP();
    const updateResult = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          emailOTP: verificationCode,
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updateResult)
      return res.status(200).json({
        message: "User not found / something went wrong.",
      });
    const emailRequest = {
      username: "User",
      email: email,
      emailOTP: verificationCode,
    };

    return res.status(201).json({ message: "Verification code sent to email" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const resetPassword = (req: Request, res: Response, next: NextFunction) => {
  let { email, password, verificationcode } = req.body;

  User.find({ email: email })
    .exec()
    .then((users: any) => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: "No User found with this email ID",
        });
      }
      let userID = users[0]["userID"];
      if (userID) {
        if (users[0]["emailOTP"] == verificationcode) {
          const result = updatePassword({ userID: userID, password: password });
          if (!result)
            return res
              .status(422)
              .json({ message: "Unable to update the password" });
          return res.status(200).json({
            message: "Success !. Please login to continue.",
          });
        } else {
          return res.status(422).json({
            message: "Invalid Verification Code.",
          });
        }
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

/*  Check Email Exists or not */
const checkEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email } = req.body;
  try {
    await User.find({ email: email })
      .exec()
      .then((users: any) => {
        if (users.length)
          return res.status(statuscodes.SUCCESS).json({
            message: `${email} exists`,
            code: 200,
            exists: true,
          });

        return res.status(statuscodes.FAIL).json({
          message: `${email} not exists`,
          code: 404,
          exists: false,
        });
      })
      .catch((error) => {
        return res.status(statuscodes.FAIL).json({
          message: `${email} not exists`,
          code: 404,
          exists: false,
        });
      });
  } catch (e) {
    return res.status(statuscodes.FAIL).json({
      message: `${email} not exists`,
      code: 404,
      exists: false,
    });
  }
};
/*  Check Email Exists or not end */

/* Check Mobile Exists or not */
const checkMobileExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { mobile } = req.body;
  try {
    await User.find({ mobile })
      .exec()
      .then((users: any) => {
        if (users.length)
          return res.status(statuscodes.SUCCESS).json({
            message: `${mobile} exists`,
            code: 200,
            exists: true,
          });

        return res.status(statuscodes.FAIL).json({
          message: `${mobile} not exists`,
          code: 404,
          exists: false,
        });
      })
      .catch((error) => {
        return res.status(statuscodes.FAIL).json({
          message: `${mobile} not exists`,
          code: 404,
          exists: false,
        });
      });
  } catch (e) {
    return res.status(statuscodes.FAIL).json({
      message: `${mobile} not exists`,
      code: 404,
      exists: false,
    });
  }
};
/* Check Mobile Exists or not End*/

const updateSelectedCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { categories, userID } = req.body;

  try {
    const authRes = res["locals"]["jwt"];
    const updateResult = await User.findOneAndUpdate(
      { userID: userID },
      {
        $set: {
          interestedCategories: categories,
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (updateResult)
      return res.status(200).json({ message: "Modules Added Successfully" });
    else
      return res.status(500).json({
        message: "Unable to assign Modules",
      });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const setUserNutrition = async (req: Request, res: Response) => {
  let  { calorie, userID } = req.body;

  try {
    const authRes = res["locals"]["jwt"];
    const updateResult = await User.findOneAndUpdate(
        { userID: userID },
        {
          $set: {
            nutritionCalories: calorie,
          },
        },
        {
          returnDocument: "after",
        }
    );

    if (updateResult)
      return res.status(200).json({ status:'success',code:200,message: "Calorie Updated Successfully" });
    else
      return res.status(500).json({
        status:'Fail',
        code:400,
        message: "Unable to assign Modules",
      });
  } catch (error: any) {
    return res.status(500).json({
      status:'Error',
      code:500,
      message: error.message,
      error,
    });
  }
}

export default {
  validateToken,
  register,
  login,
  getAllUsers,
  Profile,
  logoutUser,
  verifyEmail,
  verifyMobile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  checkEmailExists,
  checkMobileExists,
  updateSelectedCategories,
  setUserNutrition
};
