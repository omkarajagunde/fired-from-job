from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

_started_at = datetime.now(timezone.utc).isoformat()


@app.get("/health")
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok", "deployed_at": _started_at})


@app.get("/events")
async def get_events() -> JSONResponse:
    pass
