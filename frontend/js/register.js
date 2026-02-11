const API_URL = "http://localhost:5000/api";

const form = document.getElementById("registerForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();

  if (!res.ok) {
    messageEl.innerText = data.message;
    messageEl.style.color = "red";
    return;
  }

  messageEl.innerText = "Registration successful. Redirecting to login...";
  messageEl.style.color = "green";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});
