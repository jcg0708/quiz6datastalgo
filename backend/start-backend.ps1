$python = Join-Path $PSScriptRoot "venv/bin/activate/Scripts/python.exe"

if (-not (Test-Path $python)) {
    Write-Error "Project Python not found at $python"
    exit 1
}

& $python manage.py makemigrations
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& $python manage.py migrate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& $python manage.py runserver 0.0.0.0:8000