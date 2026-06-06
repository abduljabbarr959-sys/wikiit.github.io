import os

from django.conf import settings
from django.core.management.base import BaseCommand

from encyclopedia.models import Entry


def _entries_dir():
    return getattr(settings, 'WIKI_ENTRIES_DIR',
                   os.path.join(settings.BASE_DIR, "entries"))


class Command(BaseCommand):
    help = 'Import entries from .md files into the database'

    def handle(self, *args, **options):
        entries_dir = _entries_dir()
        if not os.path.isdir(entries_dir):
            self.stdout.write(f'Entries directory not found: {entries_dir}')
            return

        count = 0
        for filename in sorted(os.listdir(entries_dir)):
            if not filename.endswith('.md'):
                continue
            title = filename[:-3]
            filepath = os.path.join(entries_dir, filename)
            with open(filepath, 'r') as f:
                content = f.read()

            Entry.objects.update_or_create(
                title=title,
                defaults={'content': content},
            )
            count += 1

        self.stdout.write(self.style.SUCCESS(f'Imported {count} entries'))
