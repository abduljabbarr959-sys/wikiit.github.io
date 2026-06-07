# wikiit

A warm-toned wiki encyclopedia built with Django REST Framework and React + TypeScript, deployed with Docker and Kubernetes.

## Features

- **View entries** — Browse and read encyclopedia entries with rendered Markdown
- **Create entries** — Add new pages with live Markdown preview
- **Edit entries** — Update existing content with split-pane live preview
- **Delete entries** — Remove entries with confirmation
- **Search** — Full-text substring search with highlighted results
- **Random page** — Navigate to a random entry
- **Dark/Light theme** — Toggleable theme with system preference detection
- **Responsive** — Mobile-friendly collapsible sidebar
- **Syntax highlighting** — Code blocks styled with Prism + react-syntax-highlighter

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 6, Django REST Framework, Python 3.12 |
| Frontend | React 19, TypeScript, Vite, React Router |
| Markdown | react-markdown, remark-gfm, react-syntax-highlighter |
| Container | Docker, docker-compose |
| Orchestration | Kubernetes (deployments, services, ingress) |

## Project Structure

```
├── backend/               # Django REST API
│   ├── encyclopedia/      # Wiki app (views, serializers, urls)
│   ├── wiki/              # Django project settings
│   ├── entries/           # Markdown entry files
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # Sidebar, Layout, ThemeToggle
│   │   ├── pages/         # Home, Entry, Search, NewEntry, EditEntry
│   │   ├── hooks/         # useTheme
│   │   ├── api.ts         # API client
│   │   └── types.ts       # TypeScript interfaces
│   ├── package.json
│   └── Dockerfile
├── k8s/                   # Kubernetes manifests
├── docker-compose.yml
└── README.md
```

## Quick Start

### Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `localhost:8000`.

### Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000/api/entries/`

### Kubernetes

```bash
# Build images
docker compose build

# Load images into cluster (minikube)
minikube image load wiki-backend:latest
minikube image load wiki-frontend:latest

# Deploy
kubectl apply -f k8s/
```

## Deployment

### PythonAnywhere (free)

1. Clone repo in a Bash console:
   ```bash
   git clone https://github.com/abduljabbarr959-sys/wikiit.github.io
   cd wikiit.github.io
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```
2. Go to **Web** tab → **Add a new web app** → **Manual config** → Python 3.10
3. Set virtualenv to `~/wikiit.github.io/venv`
4. Copy the WSGI file from [`docs/pythonanywhere-wsgi.py`](docs/pythonanywhere-wsgi.py) into the WSGI config field (update `DJANGO_SECRET_KEY` with a long random value)
5. In Bash:
   ```bash
   cd ~/wikiit.github.io/backend
   python manage.py migrate
   python manage.py import_entries
   python manage.py collectstatic
   ```
6. Click **Reload**

Your API will be at `https://yourusername.pythonanywhere.com/api/entries/`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries/` | List entries (add `?search=query`) |
| GET | `/api/entries/:title/` | Get entry content |
| POST | `/api/entries/create/` | Create new entry |
| PUT | `/api/entries/:title/` | Update entry |
| DELETE | `/api/entries/:title/` | Delete entry |
| GET | `/api/entries/random/` | Get random entry |

## License

MIT
