# TaskFlow

Next.js ve Supabase ile geliştirilmiş proje ve görev takip uygulaması.

## Yerel kurulum

Node.js 22 gereklidir. `.env.example` dosyasını `.env.local` olarak kopyalayıp Supabase proje URL'sini ve publishable key'i ekleyin.

```bash
npm ci
npm run dev
```

Veritabanı şeması `supabase/migrations` klasöründedir. Yeni bir Supabase projesinde CLI ile projeyi bağladıktan sonra migration'ları uygulayın:

```bash
supabase link --project-ref PROJE_REF
supabase db push
```

Mevcut canlı projede iki migration zaten uygulanmış ve CLI geçmişiyle eşitlenmiştir; aynı dosyaları SQL Editor'de yeniden çalıştırmayın.

## Kontroller

Pull request açıldığında GitHub Actions biçimlendirme, ESLint, TypeScript ve production build kontrollerini çalıştırır. Yerelde aynı kontroller için:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

## Teknolojiler

- Next.js, React ve TypeScript
- Tailwind CSS
- dnd-kit
- React Hook Form ve Zod
- Frappe Gantt
- Supabase
