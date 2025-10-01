# Copilot Instructions for Expense Tracker Backend

## Project Overview
This is a Django 5.2.6 backend for an Expense Tracker application. The main components are:
- `backend/`: Django project settings, URLs, and WSGI/ASGI entry points.
- `expense/`: Main app for expense tracking, containing models, views, admin, and tests.

## Architecture & Data Flow
- **Models**: Defined in `expense/models.py`. Key models:
  - `UserDetail`: Stores user info (FullName, Email, Password, RegDate).
  - `Expense`: Stores expenses, linked to `UserDetail` via `UserId` (ForeignKey).
- **Views**: Placeholder in `expense/views.py`. No business logic yet.
- **URLs**: Only admin route is registered in `backend/urls.py`. No app-specific routes yet.
- **Database**: Uses SQLite by default (`db.sqlite3`).
- **Middleware**: Includes `corsheaders` for CORS support.

## Developer Workflows
- **Run Server**: Use `python manage.py runserver` from the `backend/` directory.
- **Migrations**:
  - Create: `python manage.py makemigrations expense`
  - Apply: `python manage.py migrate`
- **Admin Panel**: Accessible at `/admin/` after creating a superuser (`python manage.py createsuperuser`).
- **Testing**: Run tests with `python manage.py test expense`.

## Conventions & Patterns
- **App Registration**: All apps must be added to `INSTALLED_APPS` in `settings.py`.
- **Model Fields**: Use explicit field types and constraints (e.g., `unique=True` for emails).
- **Password Storage**: Currently plain text; consider using Django's built-in user model for security.
- **CORS**: Managed via `corsheaders` middleware.
- **No REST API**: No DRF or API endpoints yet; add views and URLs for API functionality.

## Integration Points
- **External Dependencies**: `corsheaders` (add to requirements if not present).
- **Static Files**: Served from `/static/` (see `STATIC_URL` in `settings.py`).

## Key Files
- `backend/settings.py`: Project configuration.
- `expense/models.py`: Data models.
- `backend/urls.py`: URL routing.
- `manage.py`: Django CLI entry point.

## Example Commands
- Start server: `python manage.py runserver`
- Make migrations: `python manage.py makemigrations expense`
- Migrate DB: `python manage.py migrate`
- Run tests: `python manage.py test expense`

---
**Update this file if you add new apps, models, or workflows.**
