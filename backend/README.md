# Backend

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run server

```bash
uvicorn app.server:app --reload
```

Server runs at `http://localhost:8000`

## Docker

**Build**
```bash
docker build -t backend .
```

**Run**
```bash
docker run -p 8000:8000 backend
```
