#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path


def main():
    """Run administrative tasks."""
    project_python = Path(__file__).resolve().parent / 'venv' / 'bin' / 'activate' / 'Scripts' / 'python.exe'
    if project_python.exists():
        current_python = Path(sys.executable).resolve()
        if current_python != project_python.resolve():
            os.execv(str(project_python), [str(project_python), *sys.argv])

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arborist_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
