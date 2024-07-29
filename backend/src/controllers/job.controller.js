import Job from "../models/job.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const postJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    experienceLevel,
    location,
    jobType,
    position,
    company,
  } = req.body;

  if (
    !(
      title ||
      description ||
      requirements ||
      salary ||
      experienceLevel ||
      location ||
      jobType ||
      position ||
      company
    )
  ) {
    throw new ApiError(400, "Information Missing ");
  }

  const job = await Job.create({
    title,
    description,
    requirements: requirements.split(","),
    salary: parseInt(salary),
    experienceLevel: parseInt(experienceLevel),
    location,
    jobType,
    position: parseInt(position),
    company,
    created_By: req.user.id,
  });

  if (!job) {
    throw new ApiError(500, "Job not created");
  }

  return res
    .status(200)
    .send(new ApiResponse(200, job, "new Job was Created successfully"));
});

const allJobs = asyncHandler(async (req, res) => {
  const { keyword = "" } = req.query;

  const query = {
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  };

  const jobs = await Job.find(query)
    .populate({ path: "company" })
    .sort({ createAt: -1 });

  if (!jobs) {
    throw new ApiError(404, "No Jobs found");
  }

  return res.status(200).send(new ApiResponse(200, jobs));
});

const jobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Please provide a valid id");
  }

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiResponse(400, "Job was not Found");
  }
  return res.status(200).send(new ApiResponse(200, job));
});

const adminCreateJob = asyncHandler(async (req, res) => {
  const adminId = req.user.id;

  const jobs = await Job.find({ created_By: adminId });

  if (!jobs.length) {
    throw new ApiError(400, "Job not Found");
  }

  return res.status(200).send(new ApiResponse(200, jobs));
});

export { postJob, allJobs, jobById, adminCreateJob };
