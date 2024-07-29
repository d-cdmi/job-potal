import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const applyJob = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.id;

  if (!jobId) {
    throw new ApiError(400, "information missing");
  }
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });
  if (existingApplication) {
    throw new ApiError(400, "you have already applied for this job");
  }
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "job not found");

  const application = await Application.create({
    job: jobId,
    applicant: userId,
  });
  job.application.push(application._id);
  await job.save();

  return res
    .status(201)
    .send(new ApiResponse(200, [], "Job Applied successfully"));
});

const allApplyJob = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const application = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      options: { sort: { created: -1 } },
      populate: { path: "company", option: { sort: { createdAt: -1 } } },
    });

  if (!application) {
    throw new ApiError(404, "No applications");
  }

  return res.status(200).send(new ApiResponse(200, application));
});

const applicants = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId).populate({
    path: "application",
    options: { sort: { createdAt: -1 } },
    populate: { path: "applicant" },
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  return res.status(200).send(new ApiResponse(200, job));
});

const updateStatus = asyncHandler(async (req, res) => {
  const {status} = req.body;
  const applicantId = req.params.id;

  if (!status || !applicantId) {
    throw new ApiError(400, "status and applicantId request");
  }

  const application = await Application.findById(applicantId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  application.status = status;
  await application.save();
  return res.status(200).send(new ApiResponse(200, application));
});

export { applyJob, allApplyJob, applicants, updateStatus };
