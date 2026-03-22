# Arborist Backend

Basic Django backend for the Arborist project.

## Requirements

- Python 3.14+
- PowerShell (Windows)

## Project Setup

From the backend folder:

```powershell
cd C:\Users\Administrator\quiz6datastalgo\backend
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

## Database Setup

Run migrations:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Create an admin user:

```powershell
python manage.py createsuperuser
```

## Run the Server

Option 1 (single command):

```powershell
./start-backend.ps1
```

Option 2 (manual):

```powershell
python manage.py runserver
```

Backend runs at:

- http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/

## Useful Commands

```powershell
python manage.py check
python manage.py showmigrations
python manage.py test
```

## Notes

- `requirements.txt` contains pinned package versions.
- `manage.py` is configured to use the project virtual environment interpreter automatically when available.

## Git Commit Checklist

Before committing, run:

```powershell
python manage.py check
python manage.py showmigrations
python manage.py test
python manage.py runserver
```

Quick checks:

- No import or migration errors
- Server starts successfully at `http://127.0.0.1:8000/`
- Admin login works at `http://127.0.0.1:8000/admin/`