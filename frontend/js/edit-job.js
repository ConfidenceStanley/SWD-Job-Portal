const API_URL = "http://localhost:5000/api";

const form = document.getElementById("editJobForm");
const messageEl = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

// Frontend protection
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "employer") {
  window.location.href = "login.html";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
});

const jobId = new URLSearchParams(window.location.search).get("id");

// Load existing job
async function loadJob() {
  const res = await fetch(`${API_URL}/jobs/${jobId}`);
  const job = await res.json();

  title.value = job.title;
  company.value = job.company;
  location.value = job.location;
  salary.value = job.salary || "";
  description.value = job.description;
}

loadJob();

// Update job
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: title.value,
    company: company.value,
    location: location.value,
    salary: salary.value,
    description: description.value
  };

  const res = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    messageEl.innerText = data.message;
    messageEl.style.color = "red";
    return;
  }

  messageEl.innerText = "Job updated successfully";
  messageEl.style.color = "green";

  setTimeout(() => {
    window.location.href = "employer-dashboard.html";
  }, 1200);
});
