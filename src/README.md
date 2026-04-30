# Mergington High School Activities

This directory contains the FastAPI backend and the static frontend for the "Mergington High School" extracurricular activity website.

This project provides:

- A FastAPI application that exposes a small REST API for listing activities and managing signups.
- A minimal static frontend (HTML/JS/CSS) served from `/static` that consumes the API.

## Quick start

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
.venv\Scripts\activate     # Windows (PowerShell)
pip install -r requirements.txt
```

2. Run the application from the repository root (recommended):

```bash
python -m uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
```

3. Open the app in your browser:

- Frontend: http://localhost:8000/static/index.html
- Interactive API docs (Swagger): http://localhost:8000/docs
- Alternative API docs (ReDoc): http://localhost:8000/redoc

## Endpoints

- GET /activities
  - Return all activities and their details. Supports optional query parameters for filtering by day, start_time, and end_time.

- GET /activities/days
  - Return a list of all days that have scheduled activities.

- POST /activities/{activity_name}/signup
  - Register a student for an activity. Requires query parameters:
    - email (student email)
    - teacher_username (teacher performing the action) — basic authentication/authorization is simulated using teacher usernames.

- POST /activities/{activity_name}/unregister
  - Remove a student from the activity. Requires the same query parameters as signup.

Notes:
- Use the interactive docs at `/docs` to explore request/response formats and try the endpoints.

## Initial teacher accounts (development)

The repository seeds a few teacher accounts when the database is empty. These are for local development and testing only; passwords are set in the code and hashed when inserted:

| username    | password   |
|-------------|------------|
| mrodriguez  | art123     |
| mchen       | chess456   |
| principal   | admin789   |

## Data and storage

- The application uses MongoDB (configured in *src/backend/database.py*). By default it connects to `mongodb://localhost:27017/` and uses the `mergington_high` database.
- Sample activities and teacher accounts are seeded automatically when the database is empty.

## Development

- Frontend files are under *src/static/* (HTML, CSS, and JS).
- Backend code is under *src/backend/*.
- Use the provided `docs/how-to-develop.md` for additional development and debugging tips.

## Troubleshooting

- If relative imports fail when running `uvicorn`, run the app using the module form from the repository root as shown above (`python -m uvicorn src.app:app ...`).
- Ensure MongoDB is running locally or adjust the connection string in *src/backend/database.py*.

## License

This project is open-source. See the repository root LICENSE for details.
