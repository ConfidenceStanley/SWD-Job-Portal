const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardLink = document.getElementById("dashboardLink");

// Protect page
if (!token) {
  window.location.href = "login.html";
}

// Dashboard link based on role
dashboardLink.href =
  role === "employer"
    ? "employer-dashboard.html"
    : "jobseeker-dashboard.html";

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
});

// Load profile
async function loadProfile() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const user = await res.json();

  document.getElementById("name").innerText = user.name;
  document.getElementById("email").innerText = user.email;
  document.getElementById("role").innerText = user.role;
  document.getElementById("createdAt").innerText =
    new Date(user.createdAt).toDateString();
}

loadProfile();
