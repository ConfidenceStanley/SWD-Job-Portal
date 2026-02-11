const API_URL = "http://localhost:5000/api";

const form = document.getElementById("applyForm");
const messageEl = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

// Frontend protection
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "job_seeker") {
  window.location.href = "login.html";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
});

// Apply
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const jobId = new URLSearchParams(window.location.search).get("id");
  const resumeFile = document.getElementById("resume").files[0];

  if (!resumeFile) {
    messageEl.innerText = "Please upload your resume";
    messageEl.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);

  try {
    const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      messageEl.innerText = data.message;
      messageEl.style.color = "red";
      return;
    }

    messageEl.innerText = "Application submitted successfully";
    messageEl.style.color = "green";

  } catch (error) {
    console.error(error);
    messageEl.innerText = "Something went wrong";
    messageEl.style.color = "red";
  }
});
