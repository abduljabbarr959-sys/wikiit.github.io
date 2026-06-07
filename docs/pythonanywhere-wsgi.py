"""
PythonAnywhere WSGI configuration

1. Go to Web tab -> click the WSGI file link
2. Replace everything with the code below
3. Update the SECRET_KEY with a long random value
"""

import sys
import os

path = os.path.expanduser('~/wikiit.github.io/backend')
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'wiki.settings'
os.environ['DJANGO_DEBUG'] = 'False'
os.environ['DJANGO_SECRET_KEY'] = 'generate-a-long-random-key-here'
os.environ['CORS_ALLOWED_ORIGINS'] = 'https://abduljabbarr959-sys.github.io'
os.environ['CSRF_TRUSTED_ORIGINS'] = 'https://abduljabbarr959-sys.github.io'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
