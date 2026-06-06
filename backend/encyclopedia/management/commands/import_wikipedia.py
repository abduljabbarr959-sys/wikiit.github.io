import urllib.request
import urllib.error
import json
import time
import re

from django.core.management.base import BaseCommand

from encyclopedia.models import Entry


WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1'
USER_AGENT = 'wikiit/1.0 (educational project)'


def fetch_json(url: str) -> dict | None:
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except (urllib.error.HTTPError, urllib.error.URLError, OSError, json.JSONDecodeError):
        return None


def wikipedia_markdown(data: dict) -> str:
    lines = [f'# {data.get("title", "Untitled")}', '']
    extract = data.get('extract', '')
    if extract:
        lines.append(extract)
        lines.append('')
    content_url = data.get('content_urls', {}).get('desktop', {}).get('page')
    if content_url:
        lines.append(f'---')
        lines.append(f'*Source: [{data["title"]}]({content_url})*')
    return '\n'.join(lines)


class Command(BaseCommand):
    help = 'Import entries from Wikipedia using the free REST API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count', type=int, default=5,
            help='Number of articles to import (default: 5)'
        )
        parser.add_argument(
            '--query', type=str, default='',
            help='Search query for specific articles (imports top results)'
        )
        parser.add_argument(
            '--delay', type=float, default=0.5,
            help='Seconds between API calls (default: 0.5)'
        )

    def handle(self, *args, **options):
        count = options['count']
        query = options['query']
        delay = options['delay']

        if query:
            self.import_search(query, count, delay)
        else:
            self.import_random(count, delay)

    def import_random(self, count: int, delay: float):
        imported = 0
        attempts = 0
        max_attempts = count * 3

        while imported < count and attempts < max_attempts:
            attempts += 1
            data = fetch_json(f'{WIKIPEDIA_API}/page/random/summary')
            if not data:
                self.stdout.write(self.style.WARNING('API error, retrying...'))
                time.sleep(delay * 2)
                continue

            title = data.get('title', '').strip()
            if not title:
                continue

            if Entry.objects.filter(title=title).exists():
                self.stdout.write(f'Skipping duplicate: {title}')
                time.sleep(delay)
                continue

            content = wikipedia_markdown(data)
            Entry.objects.create(title=title, content=content)
            imported += 1
            self.stdout.write(self.style.SUCCESS(f'[{imported}/{count}] Imported: {title}'))
            time.sleep(delay)

        self.stdout.write(self.style.SUCCESS(f'Done. Imported {imported} articles.'))

    def import_search(self, query: str, count: int, delay: float):
        search_url = (
            'https://en.wikipedia.org/w/api.php'
            '?action=query'
            '&list=search'
            '&srsearch=' + urllib.parse.quote(query) +
            '&format=json'
            '&srlimit=' + str(min(count, 50))
        )
        data = fetch_json(search_url)
        if not data:
            self.stdout.write(self.style.ERROR('Search API error.'))
            return

        results = data.get('query', {}).get('search', [])
        if not results:
            self.stdout.write(self.style.WARNING('No search results found.'))
            return

        imported = 0
        for result in results[:count]:
            title = result.get('title', '').strip()
            if not title:
                continue

            if Entry.objects.filter(title=title).exists():
                self.stdout.write(f'Skipping duplicate: {title}')
                continue

            summary_data = fetch_json(f'{WIKIPEDIA_API}/page/summary/{urllib.parse.quote(title)}')
            if not summary_data:
                self.stdout.write(self.style.WARNING(f'Could not fetch: {title}'))
                time.sleep(delay)
                continue

            content = wikipedia_markdown(summary_data)
            Entry.objects.create(title=title, content=content)
            imported += 1
            self.stdout.write(self.style.SUCCESS(f'[{imported}/{len(results[:count])}] Imported: {title}'))
            time.sleep(delay)

        self.stdout.write(self.style.SUCCESS(f'Done. Imported {imported} articles.'))
