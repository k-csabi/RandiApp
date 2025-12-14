# RandiApp - Full Stack Dating & Event Planner

**DateWheel** is a modern web application designed to gamify the dating experience. It solves the common problem of "what should we do?" by randomly selecting dates and activities.

> 🚧 **Project Status:** Prototype / MVP (Created for a University Project)

## 🛠 Tech Stack
* **Backend:** Java 17, Spring Boot (Web, JPA, Security)
* **Frontend:** React.js, Vite
* **Database:** PostgreSQL
* **DevOps:** Docker & Docker Compose

## ✨ Key Features
* **User Management:** Secure Registration/Login with Tokens.
* **Gamification:** "Wheel of Fortune" for random dating activities.
* **Data Import:** Bulk import functionality for question decks.

## 🚀 How to Run (The Easy Way - Docker)
You don't need to install Java, Node.js, or Postgres locally! Just use Docker.

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/k-csabi/RandiApp.git
    ```
2.  **Run the app:**
    ```bash
    docker-compose up --build
    ```
3.  **Open in browser:**
    Go to `http://localhost:8080`

---

## 🐢 How to Run (The Hard Way - Manual)
If you don't have Docker, you can run it manually:

### Prerequisites
* Java 17+ JDK
* Node.js & npm
* PostgreSQL installed and running

### Installation
1.  **Backend Setup:**
    * Open folder in IntelliJ IDEA.
    * Update `application.properties` with your local DB credentials.
    * Run `RandiAppApplication.java`.
2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🔮 Roadmap
* [x] Dockerization (One-click start) ✅
* [ ] CI/CD Pipeline setup (GitHub Actions)
* [ ] Unit Tests
