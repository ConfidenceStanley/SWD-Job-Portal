const API_URL = "http://localhost:5000/api";

const titleEl = document.getElementById("title");
const companyEl = document.getElementById("company");
const locationEl = document.getElementById("location");
const salaryEl = document.getElementById("salary");
const descriptionEl = document.getElementById("description");
const applyBtn = document.getElementById("applyBtn");

async function loadJobDetails() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!jobId) return;

  const res = await fetch(`${API_URL}/jobs/${jobId}`);
  const job = await res.json();

  titleEl.innerText = job.title;
  companyEl.innerText = job.company;
  locationEl.innerText = job.location;
  salaryEl.innerText = job.salary || "Not specified";
  descriptionEl.innerText = job.description;

  // Apply button logic
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "job_seeker") {
    applyBtn.href = `apply.html?id=${jobId}`;
  } else {
    applyBtn.style.display = "none";
  }
}

loadJobDetails();
