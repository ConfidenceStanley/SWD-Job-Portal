const API_URL = "http://localhost:5000/api";

const jobsDiv = document.getElementById("jobs");
const searchBtn = document.getElementById("searchBtn");

async function loadJobs(search = "") {
  let url = `${API_URL}/jobs`;
  if (search) {
    url += `?search=${search}`;
  }

  const res = await fetch(url);
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

// Initial load
loadJobs();

// Search
searchBtn.addEventListener("click", () => {
  const searchValue = document.getElementById("searchInput").value;
  loadJobs(searchValue);
});
