from app.db.base import Base
from app.db.session import engine

# Import models so SQLAlchemy registers all tables.
from app.db import models  # noqa: F401


def create_all() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_all()
