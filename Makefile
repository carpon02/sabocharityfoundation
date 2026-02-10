.PHONY: up down build logs restart health help

help:
	@echo "Available commands:"
	@echo "  make up      - Start all services (detached)"
	@echo "  make down    - Stop all services"
	@echo "  make build   - Rebuild all images"
	@echo "  make logs    - View logs for all services"
	@echo "  make health  - Check backend health"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up -d --build

logs:
	docker-compose logs -f

restart:
	docker-compose restart

health:
	curl http://localhost:5000/health
