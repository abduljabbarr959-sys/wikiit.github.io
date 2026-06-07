# Docker

**Docker** is a platform for developing, shipping, and running applications in containers. Containers package software with all its dependencies, ensuring it runs consistently across environments.

## Containers vs Virtual Machines

| Feature | Container | VM |
|---------|-----------|-----|
| Start Time | Milliseconds | Minutes |
| Size | MBs | GBs |
| OS | Shares host kernel | Full OS per VM |
| Isolation | Process-level | Hypervisor-level |

## Dockerfile

A `Dockerfile` defines how to build a container image:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver"]
```

## Common Commands

```bash
docker build -t myapp .      # Build an image
docker compose up             # Start services
docker compose down           # Stop services
docker ps                     # List running containers
```

## Docker Compose

This project uses `docker-compose.yml` to orchestrate the frontend and backend together:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
  frontend:
    build: ./frontend
    ports:
      - "80:80"
```

See also: [Python](/wiki/Python), [Django](/wiki/Django), [Git](/wiki/Git)
