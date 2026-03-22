# Service Marketplace Project
Both Backend & Frontend Have Specific readme.txt for more info.

A full-stack service marketplace application featuring a React frontend and a Django backend.

## Project Structure

This repository is divided into two main parts:

- **/frontend**: The user interface built with React. See the [Frontend README](./frontend/README.md) for detailed setup and script instructions.
- **/backend**: The API and database management built with Python and Django. See the [Backend README](./backend/README.md) for database and server setup.

## Getting Started

To run this project locally, you will need to start both servers in separate terminal windows.

### Prerequisites
- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.x](https://www.python.org/) (for the backend)

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install django djangorestframework  # Add any other required dependencies
python manage.py runserver
