.PHONY: help build up down logs shell db-shell clean restart ps

help:
	@echo "AI Station Docker Commands"
	@echo "=========================="
	@echo "make build       - Build Docker images"
	@echo "make up          - Start containers"
	@echo "make down        - Stop containers"
	@echo "make logs        - View logs"
	@echo "make shell       - Open shell in app container"
	@echo "make db-shell    - Open PostgreSQL shell"
	@echo "make clean       - Remove containers and volumes"
	@echo "make restart     - Restart all containers"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

shell:
	docker-compose exec app sh

db-shell:
	docker-compose exec db psql -U postgres -d ai_station

clean:
	docker-compose down -v

restart:
	docker-compose restart

ps:
	docker-compose ps
