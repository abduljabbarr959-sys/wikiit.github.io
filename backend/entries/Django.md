# Django

**Django** is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers at the Lawrence Journal-World in 2003, it was open-sourced in 2005.

## Core Philosophy

Django follows the **"batteries-included"** approach, providing everything needed to build web applications out of the box:

- **ORM** — Database abstraction layer supporting PostgreSQL, MySQL, SQLite, and more
- **Admin Panel** — Auto-generated admin interface for data management
- **Authentication** — Built-in user authentication, permissions, and sessions
- **URL Routing** — Clean, elegant URL design
- **Templating** — Django's own template engine with template inheritance

## Example: A Simple View

```python
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, Django!")
```

## Django REST Framework

This wiki's API is built with **Django REST Framework (DRF)**, a powerful toolkit for building Web APIs. DRF provides:

- Serializers for data conversion
- ViewSets for rapid API development
- Browsable API interface
- Authentication classes (Session, Token, JWT)

## Why Django?

- **Secure** — Protects against XSS, CSRF, SQL injection by default
- **Scalable** — Powers sites like Instagram, Pinterest, and Mozilla
- **Versatile** — Used for APIs, CMS platforms, e-commerce, and more

See also: [Python](/wiki/Python), [HTML](/wiki/HTML), [Git](/wiki/Git)
