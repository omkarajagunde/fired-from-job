import math
import os
import random
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.scrapper_agent import run_job as scrapper_job
from app.insights_agent import run_job as insights_job

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    scrapper_secs = int(os.getenv("SCRAPPER_AGENT_SCHEDULE", 86400))    # default: 1 day
    insights_secs = int(os.getenv("INSIGHTS_AGENT_SCHEDULE", 604800))   # default: 1 week

    scheduler = BackgroundScheduler()
    scheduler.add_job(scrapper_job, IntervalTrigger(seconds=scrapper_secs))
    scheduler.add_job(insights_job, IntervalTrigger(seconds=insights_secs))
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

_started_at = datetime.now(timezone.utc).isoformat()


def _build_gauge_ticks():
    ticks = []
    for i in range(21):
        a = math.pi - (i / 20) * math.pi
        r1, r2 = 168, (178 if i % 5 == 0 else 174)
        ticks.append({
            "x1": round(200 + r1 * math.cos(a), 2),
            "y1": round(220 - r1 * math.sin(a), 2),
            "x2": round(200 + r2 * math.cos(a), 2),
            "y2": round(220 - r2 * math.sin(a), 2),
        })
    return ticks


def _get_market_data():
    now = datetime.now(timezone.utc)
    utc_time = f"{now.hour:02d}:{now.minute:02d} UTC"
    run_id = f"#FFJ-{now.year}-{now.month:02d}{now.day:02d}-{now.hour:02d}{now.minute:02d}"
    job_count = f"{12847392 + random.randint(0, 499):,}"
    gauge_value = 58
    return {
        "utcTime": utc_time,
        "runId": run_id,
        "jobCount": job_count,
        "roles": [
            {"name": "AI Engineer",       "vol": "82,141", "pct": "+24.6%", "pos": True,  "w": 1.00, "accent": True },
            {"name": "Software Engineer", "vol": "71,402", "pct": "+4.1%",  "pos": True,  "w": 0.87, "accent": False},
            {"name": "Data Scientist",    "vol": "54,019", "pct": "+18.0%", "pos": True,  "w": 0.66, "accent": False},
            {"name": "Product Manager",   "vol": "38,760", "pct": "-7.2%",  "pos": False, "w": 0.47, "accent": False},
            {"name": "DevOps / SRE",      "vol": "29,114", "pct": "+11.4%", "pos": True,  "w": 0.35, "accent": False},
            {"name": "UX Designer",       "vol": "17,320", "pct": "-12.8%", "pos": False, "w": 0.21, "accent": False},
        ],
        "gauge": {
            "ticks": _build_gauge_ticks(),
            "value": gauge_value,
            "angle": -90 + (gauge_value / 100) * 180,
        },
        "industries": [
            {"name": "Financial Services",  "pct": "+19.4%"},
            {"name": "Health & Biotech",    "pct": "+14.8%"},
            {"name": "Energy / Climate",    "pct": "+12.1%"},
            {"name": "Defense & Aerospace", "pct": "+9.7%"},
            {"name": "Logistics",           "pct": "+6.2%"},
        ],
        "workModes": [
            {"name": "HYBRID",    "mode": "hybrid", "pct": 62, "delta": "▲ 4.1", "pos": True },
            {"name": "REMOTE",    "mode": "remote", "pct": 23, "delta": "▼ 6.3", "pos": False},
            {"name": "IN OFFICE", "mode": "office", "pct": 15, "delta": "▲ 2.2", "pos": True },
        ],
        "yoe": [
            {"label": "JUNIOR\n0–2 YOE", "pct": 34, "h": "34%", "peak": False},
            {"label": "MID\n4–5 YOE",    "pct": 48, "h": "48%", "peak": True },
            {"label": "SENIOR\n8+ YOE",  "pct": 18, "h": "18%", "peak": False},
        ],
    }


@app.get("/health")
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok", "deployed_at": _started_at})


@app.get("/events")
async def get_events() -> JSONResponse:
    return JSONResponse(_get_market_data())
