import Company from "../models/company.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerCompany = asyncHandler(async (req, res) => {
  const { companyName, website, location } = req.body;

  if (!(companyName || website || location)) {
    throw new ApiError(401, "Information Mising");
  }
  let company = await Company.create({
    companyName,
    website,
    location,
    userId: req.user.id,
  });

  if (!company) {
    throw new ApiError(500, "Company Details are not Store");
  }

  return res
    .status(200)
    .send(new ApiResponse(200, company, "Company was Successfully Create"));
});

const getCompany = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const company = await Company.find({ userId });
  if (!company) {
    throw new ApiError(401, "Company Not Found");
  }

  return res.status(200).send(new ApiResponse(200, company));
  
});

const getComapnyById = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(401, "Company Not Found");
  }
  return res.status(200).send(new ApiResponse(200, company));
});

const updateCompany = asyncHandler(async (req, res) => {
  const { companyName, website, location } = req.body;

  const logoPath = req.path;

  const company = await Company.findById(req.params.id);
  if (!company) {
    throw new ApiError(401, "Company Not Found");
  }

  company.companyName = companyName || company.companyName;
  company.website = website || company.website;
  company.location = location || company.location;
  company.logoPath = logoPath || company.logoPath;
  await company.save();

  return res
    .status(200)
    .send(
      new ApiResponse(200, company, "Company Details was Successfully Updated")
    );
});

export { registerCompany, getCompany, getComapnyById, updateCompany };
