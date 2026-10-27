# The Corner — GZU Campus Marketplace

A full-stack campus marketplace built for Great Zimbabwe University students to buy, sell, and discover items across halls and campuses.

## 🏗️ Repository Structure (Monorepo)

```
the-corner/
├── app/                    # Next.js 16 App Router pages
│   ├── (pages)/            # Student-facing pages: browse, sell, search, listings…
│   ├── admin/              # Admin + Evaluation dashboard
│   ├── admin-login/        # Staff authentication portal
│   └── api/                # Next.js serverless API routes (auth, search, reviews…)
├── backend/                # Django REST Framework backend
│   ├── listings/           # Core app: models, views, serializers, embeddings
│   ├── the_corner/         # Django project settings, urls, wsgi
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile            # For Railway / Render deployment
├── components/             # Shared React components
├── evaluation/             # NLP & search evaluation datasets and scripts
├── lib/                    # Frontend utilities (auth, api, reviews…)
└── public/                 # Static assets and images
```

---

## 🚀 Deployment

### Frontend → Vercel

1. Import this repo on [vercel.com](https://vercel.com).
2. Set the **Root Directory** to `.` (repo root).
3. Add these **Environment Variables** in the Vercel project settings:
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://your-railway-backend.up.railway.app/api` |
   | `GEMINI_API_KEY` | `your_gemini_api_key` |
4. Deploy. Vercel auto-detects Next.js.

### Backend → Railway (Recommended)

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub Repo**.
2. Select this repository.
3. Set the **Root Directory** to `backend/`.
4. Add a **PostgreSQL** plugin from the Railway dashboard — Railway auto-sets `DATABASE_URL`.
5. Add these **Environment Variables** in Railway:
   | Variable | Value |
   |---|---|
   | `DJANGO_SECRET_KEY` | (generate a strong random string) |
   | `DJANGO_DEBUG` | `False` |
   | `DATABASE_URL` | (auto-set by Railway Postgres plugin) |
   | `IMAGEKIT_PUBLIC_KEY` | `your_imagekit_public_key` |
   | `IMAGEKIT_PRIVATE_KEY` | `your_imagekit_private_key` |
   | `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/your_id` |
   | `GEMINI_API_KEY` | `your_gemini_api_key` |
6. Railway runs `gunicorn the_corner.wsgi:application` (from Procfile).
7. After deploy, run migrations via Railway shell:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
8. Copy your Railway backend URL into Vercel's `NEXT_PUBLIC_API_URL`.

---

## 🛠️ Local Development

### Frontend
```bash
npm install
cp .env.example .env
# Edit .env and set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Fill in your local Postgres credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 🔐 Admin & Evaluation Access

Navigate to `/admin-login` on your deployed domain.

**With Django backend deployed (live data):**
- Log in with your Django superuser account (created via `createsuperuser`).

**Standalone / demo mode (no backend needed):**
| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | ✅ Staff — full admin access |
| `hilz_admin` | `Amdatboi` | ✅ Staff — full admin access |
| `tendai_k` | `student123` | ❌ Student — 403 rejected |

---

## 🤖 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.3, React 19, TypeScript, Tailwind CSS 4 |
| Animation | Framer Motion, GSAP, Anime.js |
| 3D | React Three Fiber / Drei |
| Charts | Recharts |
| Backend | Django 5, Django REST Framework, Simple JWT |
| Database | PostgreSQL + pgvector (semantic search) |
| AI / Embeddings | Sentence-Transformers (`all-MiniLM-L6-v2`), Gemini API |
| Image Storage | ImageKit |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 📊 Evaluation

The `/evaluation` route (same as `/admin`) contains a full **NLP & Search Evaluation dashboard** showing:
- MRR@10, NDCG@10, MAP for semantic search
- Intent classifier accuracy, precision, recall, F1
- Latency comparison (neural vs. keyword baseline)
- Test query browser with ground-truth ranking

Evaluation data lives in [`evaluation/search_results.json`](evaluation/search_results.json) and [`evaluation/classifier_results.json`](evaluation/classifier_results.json) and is bundled into the frontend — no backend needed to view it.
