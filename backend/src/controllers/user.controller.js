import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateRefreshTokenAndAccessToken = async (user) => {
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res, next) => {
  const { fullname, email, phoneNumber, password, role } = req.body;
  if (!fullname || !email || !phoneNumber || !password || !role) {
    throw new ApiError(400, "Information mising");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, "User Already Exist with this email.");
  }
  let newUser = await User.create({
    fullname,
    email,
    phoneNumber,
    password,
    role,
  });

  newUser = {
    _id: newUser._id,
    fullname: newUser.fullname,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    role: newUser.role,
  };

  return res.status(200).send(new ApiResponse(200, newUser, "User was Create"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(
      400,
      "Requried filds Information Missing like email etc .. requried filds"
    );
  }

  let user = await User.findOne({ email });

  if (!user || !user.isPasswordCorrect(password)) {
    throw new ApiError(401, "User is not Found or Password is does not match");
  }
  const { accessToken, refreshToken } =
    await generateRefreshTokenAndAccessToken(user);
  const option = {
    httpOnly: true,
    secure: true,
  };

  user = {
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile,
    refreshToken: refreshToken,
    accessToken: accessToken,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .send(
      new ApiResponse(
        200,
        { user, accessToken: accessToken, refreshToken },
        "User was Success Fully Resigter"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  return res
    .status(201)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .send(new ApiResponse(201, {}, "user Logout Successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { email, bio, skills, fullname, phoneNumber } = req.body;
  const file = req.file;
  let user = req.user;

  if (!fullname || !email || !phoneNumber || !bio || !skills) {
    throw new ApiError(
      400,
      "Requried filds Information Missing like fullname , email etc .. requried filds"
    );
  }

  const skillsArray = skills.split(",");
  user.fullname = fullname;
  user.email = email;
  user.phoneNumber = phoneNumber;
  user.profile.bio = bio;
  user.profile.skills = skillsArray;
  // user.profile.profilePicture = file;

  await user.save();
  user = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile,
  };

  return res
    .status(200)
    .send(new ApiResponse(200, user, "Profile Update successfully"));
});

export { register, login, logout, updateUserProfile };
