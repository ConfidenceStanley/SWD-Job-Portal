const API_URL = "http://localhost:5000/api";

const jobsDiv = document.getElementById("jobs");
const searchBtn = document.getElementById("searchBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const limit = 5;
let currentSearch = "";
let totalPages = 1;

async function loadJobs() {
  const res = await fetch(
    `${API_URL}/jobs?page=${currentPage}&limit=${limit}&search=${currentSearch}`
  );

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

  totalPages = data.totalPages;
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
}

searchBtn.addEventListener("click", () => {
  currentSearch = document.getElementById("searchInput").value;
  currentPage = 1;
  loadJobs();
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadJobs();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadJobs();
  }
});

// Initial load
loadJobs();
