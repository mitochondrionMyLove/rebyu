.PHONY: install dev migrate up down logs test lint format train-demo

install:
	python -m pip install -r requirements-dev.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

migrate:
	alembic upgrade head

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f api worker beat

test:
	pytest -q

lint:
	ruff check app tests scripts

format:
	ruff format app tests scripts

train-demo:
	python scripts/train_demo.py
