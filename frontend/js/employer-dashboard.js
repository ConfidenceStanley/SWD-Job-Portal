const API_URL = "http://localhost:5000/api";

const jobsDiv = document.getElementById("jobs");
const welcomeEl = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

// Frontend protection
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "employer") {
  window.location.href = "login.html";
}

// Welcome message
welcomeEl.innerText = "Welcome! Manage your job postings below.";

// Load employer jobs
async function loadEmployerJobs() {
  const res = await fetch(`${API_URL}/jobs/employer/my-jobs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  const jobs = data.jobs;

  jobsDiv.innerHTML = "";

  if (!Array.isArray(jobs) || jobs.length === 0) {
    jobsDiv.innerText = "You have not posted any jobs yet.";
    return;
  }

  jobs.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";

    div.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.company}</p>
      <p>${job.location}</p>

      <a href="applications.html?jobId=${job._id}">View Applications</a><br/>
      <a href="edit-job.html?id=${job._id}">Edit Job</a><br/>
      <button onclick="deleteJob('${job._id}')">Delete Job</button>
    `;

    jobsDiv.appendChild(div);
  });
}


loadEmployerJobs();

// Delete job
async function deleteJob(jobId) {
  if (!confirm("Are you sure you want to delete this job?")) return;

  await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadEmployerJobs();
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
});
