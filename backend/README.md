
## SWD Resume Job Portal – Backend (MVP)

A RESTful backend for a simple job portal application that allows employers to post jobs and review applications, while job seekers can browse jobs and apply by uploading their resumes.

This project is built as a **Minimum Viable Product (MVP)** using Node.js, Express, and MongoDB.

---

## 🚀 Features

### Authentication & Authorization

* User registration and login with JWT
* Role-based access control:

  * `employer`
  * `job_seeker`
* Secure password hashing with bcrypt

### Job Management

* Employers can:

  * Create jobs
  * Update their own jobs
  * Delete their own jobs
  * View jobs they posted
* Public users can:

  * View all jobs
  * Search jobs
  * Browse jobs with pagination

### Job Applications

* Job seekers can apply to jobs
* Resume upload (PDF only)
* Employers can:

  * View applications for their jobs
  * Download and view uploaded resumes
  * Update application status (pending, reviewed, accepted, rejected)

### Notifications

* Email notification is sent to employer when a new job application is submitted

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (Authentication)**
* **Multer (File Upload)**
* **Nodemailer (Email Notification)**
* **bcryptjs (Password Hashing)**

## 🔐 Environment Variables

Create a `.env` file in the backend root:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password


---

## ▶️ How to Run the Project

bash
npm install
npm run dev


Server will start at:


http://localhost:5000


---

## 📡 API Endpoints

### Auth


POST   /api/auth/register
POST   /api/auth/login


### Jobs


POST   /api/jobs                       (Employer only)
GET    /api/jobs                       (Public + pagination + search)
GET    /api/jobs/:id                   (Public)
PUT    /api/jobs/:id                   (Employer + owner)
DELETE /api/jobs/:id                   (Employer + owner)
GET    /api/jobs/employer/my-jobs      (Employer dashboard)


### Applications

POST   /api/jobs/:id/apply
GET    /api/employer/jobs/:id/applications
PATCH  /api/employer/applications/:applicationId/status


## 📎 Resume Upload (MVP Approach)

* Resumes are uploaded as **PDF files**
* Stored locally in the `uploads/` directory
* Served publicly via Express:

  
  http://localhost:5000/uploads/<filename>.pdf
  


## 📧 Email Notification

* When a job seeker applies for a job:

  * An email notification is sent to the employer
* Implemented using **Nodemailer (Gmail SMTP)**


## 👨‍💻 Author

**Ohireimen Confidence Omon**
Computer Science Student
Federal Polytechnic Ilaro
