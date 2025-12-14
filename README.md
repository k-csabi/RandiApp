# RandiApp - Full Stack Dating & Event Planner

**DateWheel** is a modern web application designed to gamify the dating experience. It solves the common problem of "what should we do?" by randomly selecting dates and activities, managed through a robust admin interface.

> 🚧 **Project Status:** Prototype / MVP (Created for a University Project)

## 🛠 Tech Stack
This project was built using industry-standard enterprise technologies:

* **Backend:** Java 17, Spring Boot (Web, JPA, Security)
* **Frontend:** React.js, Vite, Axios
* **Database:** PostgreSQL
* **Tools:** Maven, Git

## ✨ Key Features
* **User Management:** Secure Registration and Login flow with Token-based authentication.
* **Gamification:** Interactive "Wheel of Fortune" to select random dating activities.
* **Data Management:** Full CRUD operations for managing date ideas and questions.
* **Import System:** Bulk import functionality for parsing structured text data (CSV-style).

## 🚀 How to Run locally

### Prerequisites
* Java 17+ JDK
* Node.js & npm
* PostgreSQL installed and running

### Installation
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/k-csabi/RandiApp.git](https://github.com/k-csabi/RandiApp.git)
    ```
2.  **Backend Setup:**
    * Open the folder in IntelliJ IDEA.
    * Update `src/main/resources/application.properties` with your local Postgres credentials.
    * Run the `RandiAppApplication.java`.
3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🔮 Future Improvements (Roadmap)
* [ ] Dockerization (Docker Compose for one-click start)
* [ ] CI/CD Pipeline setup (GitHub Actions)
