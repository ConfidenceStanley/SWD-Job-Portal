const API_URL = "http://localhost:5000/api";

const jobsDiv = document.getElementById("jobs");
const welcomeEl = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

// Frontend protection
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "job_seeker") {
  window.location.href = "login.html";
}

// Welcome text
welcomeEl.innerText = "Welcome! Browse available jobs below.";

// Load jobs
async function loadJobs() {
  const res = await fetch(`${API_URL}/jobs`);
  const data = await res.json();

  jobsDiv.innerHTML = "";

  data.jobs.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";

    div.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.company}</p>
      <p>${job.location}</p>
      <a href="job.html?id=${job._id}">View Details</a>
    `;

    jobsDiv.appendChild(div);
  });
}

loadJobs();

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
});
