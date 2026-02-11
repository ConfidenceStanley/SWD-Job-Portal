const API_URL = "http://localhost:5000/api";

const form = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    messageEl.innerText = data.message;
    messageEl.style.color = "red";
    return;
  }

  const role = data.user.role;

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", role);

  if (role === "job_seeker") {
    window.location.href = "./jobseeker-dashboard.html";
    console.log("Ok")
  } else if (role === "employer") {
    window.location.href = "./employer-dashboard.html";
  } else {
    alert("Unknown role: " + role);
  }

});
