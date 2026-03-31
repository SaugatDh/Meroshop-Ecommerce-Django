# Meroshop - E-commerce Platform

## Project Overview
This is a modern e-commerce platform for "Meroshop". It features a Django backend and a React frontend styled with Tailwind CSS.

## Technologies Used
*   **Backend:** Django, Django Rest Framework
*   **Frontend:** React (Vite), Tailwind CSS
*   **Database:** SQLite (development)
*   **Icons:** Material Symbols Outlined
*   **Fonts:** Manrope, Inter

## Project Structure
*   `heritage_hearth_backend/`: Django project configuration.
*   `shop/`: Django application for e-commerce logic (Models, Views, API).
*   `frontend/`: React frontend project.
*   `public/product/`: Directory for static product images.

## Setup Instructions

### Backend Setup
1.  Install Python dependencies:
    ```bash
    pip install django djangorestframework django-cors-headers
    ```
2.  Run migrations:
    ```bash
    python3 manage.py migrate
    ```
3.  Start the Django server:
    ```bash
    python3 manage.py runserver
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```

## API Endpoints
*   `GET /api/products/`: Returns a list of all products.

## License
MIT License
