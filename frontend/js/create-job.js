const API_URL = "http://localhost:5000/api";

const form = document.getElementById("createJobForm");
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

// Create job
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: title.value,
    company: company.value,
    location: location.value,
    salary: salary.value,
    description: description.value
  };

  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
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

  messageEl.innerText = "Job created successfully";
  messageEl.style.color = "green";

  setTimeout(() => {
    window.location.href = "employer-dashboard.html";
  }, 1200);
});
