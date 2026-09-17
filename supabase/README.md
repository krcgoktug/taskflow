# Supabase durumu

`migrations/202609170001_initial_schema.sql` ilk veritabanı taslağıdır. Henüz canlı bir Supabase projesine uygulanmamıştır.

Taslakta şu yapılar bulunur:

- kullanıcı profilleri
- projeler ve proje üyeleri
- görevler ve alt görev bağlantısı
- Gantt bağımlılıkları
- görev yorumları
- temel RLS yetkilendirme kuralları

İkinci hafta adımları:

1. Supabase projesi oluşturmak.
2. SQL dosyasını migration olarak uygulamak.
3. `.env.local` içine URL ve publishable key eklemek.
4. TypeScript tiplerini Supabase şemasından üretmek.
5. Mock verileri gerçek sorgularla değiştirmek.
6. RLS kurallarını farklı kullanıcılarla test etmek.
