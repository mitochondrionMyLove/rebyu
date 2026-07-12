def test_liveness(client) -> None:
    response = client.get("/api/v1/bkt/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_health_checks_database(client) -> None:
    response = client.get("/api/v1/bkt/health/ready")
    assert response.status_code == 200
    assert response.json()["database"] == "ok"
