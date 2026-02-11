const API_URL = "http://localhost:5000/api";

const container = document.getElementById("applications");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "employer") {
  window.location.href = "login.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

const jobId = new URLSearchParams(window.location.search).get("jobId");

async function loadApplications() {
  if (!jobId) {
    container.innerText = "Invalid job selected.";
    return;
  }

  const res = await fetch(
    `${API_URL}/employer/jobs/${jobId}/applications`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    container.innerText = "Failed to load applications.";
    return;
  }

  const data = await res.json();
  const applications = data.applications || [];

  container.innerHTML = "";

  if (applications.length === 0) {
    container.innerText = "No applications yet.";
    return;
  }

  applications.forEach(app => {
    const resumeLink = app.resumeUrl.startsWith("http")
      ? app.resumeUrl
      : `http://localhost:5000${app.resumeUrl}`;

    const div = document.createElement("div");
    div.className = "job-card";

    div.innerHTML = `
      <p><strong>Name:</strong> ${app.applicantId?.name || "N/A"}</p>
      <p><strong>Email:</strong> ${app.applicantId?.email || "N/A"}</p>
      <p>
        <strong>Status:</strong>
        <span id="status-${app._id}">${app.status}</span>
      </p>

      <div class="actions">
        <a href="${resumeLink}" target="_blank" class="resume-link">
          View Resume
        </a>

        <button onclick="updateStatus('${app._id}', 'accepted')">
          Approve
        </button>

        <button onclick="updateStatus('${app._id}', 'rejected')">
          Reject
        </button>

        <button onclick="updateStatus('${app._id}', 'reviewed')">
          Reviewed
        </button>
      </div>
    `;


    container.appendChild(div);
  });
}

async function updateStatus(applicationId, status) {
  const res = await fetch(
    `${API_URL}/employer/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }
  );

  if (!res.ok) {
    alert("Failed to update status");
    return;
  }

  document.getElementById(`status-${applicationId}`).innerText = status;
}

loadApplications();
