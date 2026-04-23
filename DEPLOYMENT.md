# Alpha Funding CRM — Deployment Guide (Railway)

## Prerequisites
- Railway account (railway.app)
- MongoDB Atlas cluster (free tier works)
- Redis Cloud or Railway Redis plugin

---

## 1. Local Development

### Backend
```bash
cd backend
cp .env.example .env          # fill in your values
pip install -r requirements.txt
python manage.py migrate       # creates SQLite for auth/sessions
python manage.py createsuperuser
python manage.py runserver     # http://localhost:8000

# In a separate terminal — Celery worker
celery -A config worker --loglevel=info

# In a separate terminal — Celery beat (periodic tasks)
celery -A config beat --loglevel=info
```

### Frontend
```bash
cd Frontend
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm install
npm run dev                    # http://localhost:3000
```

---

## 2. Railway Deployment

### Step 1 — Create project
```bash
npm install -g @railway/cli
railway login
railway init
```

### Step 2 — Add services

**Backend service:**
```bash
cd backend
railway up --service backend
```

Set environment variables in Railway dashboard:
```
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(50))">
DEBUG=False
MONGODB_URI=<your MongoDB Atlas connection string>
REDIS_URL=<Railway Redis plugin URL>
CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app
ALLOWED_HOSTS=your-backend.railway.app
```

**Frontend service:**
```bash
cd Frontend
railway up --service frontend
```

Set environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

**Celery worker service:**
In Railway dashboard, add a new service pointing to the same backend repo with start command:
```
celery -A config worker --loglevel=info --concurrency=2
```

### Step 3 — MongoDB Atlas setup
1. Create free cluster at mongodb.com/atlas
2. Add IP `0.0.0.0/0` to network access (or Railway's IP range)
3. Create database user
4. Copy connection string → set as `MONGODB_URI`

### Step 4 — Redis (Railway plugin)
1. In Railway project → Add Plugin → Redis
2. Copy `REDIS_URL` from plugin variables

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Railway Platform                     │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │  Next.js     │───▶│  Django DRF  │───▶│  MongoDB  │  │
│  │  (Frontend)  │    │  (Backend)   │    │  Atlas    │  │
│  └──────────────┘    └──────┬───────┘    └───────────┘  │
│                             │                           │
│                      ┌──────▼───────┐                   │
│                      │    Redis     │                   │
│                      │  (Cache +    │                   │
│                      │   Celery)    │                   │
│                      └──────────────┘                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Celery Worker  │  Celery Beat (periodic tasks)  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 4. Redis Usage Summary

| Use Case | Key Pattern | TTL |
|----------|-------------|-----|
| Dashboard stats | `dashboard_stats_{user_id}` | 2 min |
| Lead list | `leads_list_{user_id}_{params}` | 2 min |
| Lead detail | `leads_detail_{id}` | 2 min |
| Lender list | `lenders_list` | 10 min |
| Document list | `docs_list_{params}` | 5 min |
| User profile | `user_me_{user_id}` | 5 min |
| AI summaries | `ai_summary_{lead_id}` | 1 hr |
| CSV exports | `csv_export_{user_id}` | 5 min |
| Sessions | Django session backend | 7 days |
| Celery broker | Task queue | — |

## 5. MongoDB Collections

| Collection | Indexes |
|------------|---------|
| `leads` | case_id, status, stage, agent, created_at, text(full_name, company_name) |
| `tasks` | assignee, task_status, date, lead_id |
| `lenders` | name, status, type |
| `documents` | category, status, uploaded_at |
