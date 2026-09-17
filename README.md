# TaskFlow

Şirket içi görev ve proje takibi için hazırlanmış iki haftalık MVP çalışmasıdır. Mevcut sürüm ilk hafta demosudur; arayüz akışları mock veriyle çalışır ve Supabase bağlantısı henüz tamamlanmamıştır.

## Çalıştırma

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır.

## Demo sayfaları

- `/overview` — genel durum ve proje ilerlemesi
- `/tasks` — aranabilir ve filtrelenebilir görev listesi
- `/board` — sürükle-bırak Kanban prototipi
- `/timeline` — Frappe Gantt zaman planı
- `/requests` — Zod doğrulamalı görev formu

## Teknolojiler

- Next.js 16, React 19 ve TypeScript
- Tailwind CSS
- dnd-kit
- React Hook Form ve Zod
- Frappe Gantt
- Supabase PostgreSQL, Auth ve RLS — bağlantı ikinci hafta

## Dokümantasyon

- [`docs/WEEK-1-PROGRESS.md`](docs/WEEK-1-PROGRESS.md)
- [`docs/TECHNICAL-NOTES.md`](docs/TECHNICAL-NOTES.md)

Supabase taslağı:

- [`supabase/README.md`](supabase/README.md)
- [`supabase/migrations/202609170001_initial_schema.sql`](supabase/migrations/202609170001_initial_schema.sql)
