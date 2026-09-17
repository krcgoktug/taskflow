# Kullanılan teknolojiler ve görevleri

## Next.js

React tabanlı uygulama çatısıdır. `app` klasöründeki dosya yapısından sayfa adresleri üretir. Overview, görevler, Kanban, Gantt ve form ekranları ayrı route olarak oluşturuldu.

## React

Arayüzü bileşenlere ayırır. Örneğin `TaskTable`, `KanbanBoard` ve `RequestForm` birbirinden bağımsız bileşenlerdir.

## TypeScript

Görevlerin hangi alanlara sahip olduğunu kod seviyesinde tanımlar. Yanlış durum veya öncelik değerlerinin geliştirme sırasında fark edilmesini sağlar.

## Tailwind CSS

Arayüz stilleri için kullanılır. Responsive düzen, boşluklar, renkler, butonlar ve kart görünümleri doğrudan class isimleriyle hazırlanır.

## dnd-kit

Kanban kartlarını sürükleyip farklı durum sütunlarına bırakmayı sağlar. Şu anda değişiklik React state içinde tutulur; ikinci hafta Supabase `tasks.status` alanına yazılacaktır.

## React Hook Form

Form alanlarını, gönderme işlemini ve hata durumlarını yönetir. Her tuş vuruşunda bütün formu gereksiz yere yeniden işlemek yerine form işlemlerini daha düzenli tutar.

## Zod

Çalışma anında veri doğrulaması yapar. Başlık uzunluğu, zorunlu sorumlu ve bitiş tarihinin başlangıçtan önce olmaması gibi kuralları kontrol eder. TypeScript tek başına kullanıcıdan gelen veriyi çalışma anında doğrulamaz.

## Frappe Gantt

Başlangıç ve bitiş tarihlerini zaman çubuklarına dönüştürür. İlerleme yüzdesini ve görev bağımlılıklarını gösterir. Açık kaynak MIT lisanslı olduğu için MVP’de ücretsiz kullanılabilir.

## Supabase — ikinci hafta bağlantısı

PostgreSQL veritabanı, kullanıcı girişi ve RLS yetkilendirmesi için kullanılacaktır. SQL şeması hazırlanmıştır ancak henüz canlı projeye uygulanmamıştır.

## RLS

Row Level Security, veritabanı satırlarına kimlerin erişebileceğini belirler. Bir kullanıcı yalnızca üyesi olduğu projelerin görevlerini görebilmelidir. Bu kontrol yalnızca arayüzde değil, veritabanı seviyesinde yapılacaktır.

## Aynı veri farklı ekranlara nasıl bağlanıyor?

```text
tasks verisi
├── Overview: görev sayılarını hesaplar
├── Liste: bütün alanları satır olarak gösterir
├── Kanban: status alanına göre sütunlara böler
├── Gantt: startDate, dueDate, progress ve dependencyIds kullanır
└── Form: doğrulanan yeni görevi bu yapıya ekler
```

Gerçek Supabase bağlantısından sonra mock veri kaldırılacak ancak ekranların veri yapısı değişmeyecektir.

## Önemli dosyalar

- `src/lib/types.ts`: TypeScript veri tipleri
- `src/lib/mock-data.ts`: ilk hafta demo verisi
- `src/lib/validations/task.ts`: Zod form kuralları
- `src/components/kanban-board.tsx`: sürükle-bırak Kanban
- `src/components/request-form.tsx`: görev talep formu
- `src/components/gantt-chart.tsx`: Frappe Gantt bağlantısı
- `supabase/migrations/202609170001_initial_schema.sql`: PostgreSQL ve RLS taslağı

## Toplantı demo sırası

1. Overview ekranında projenin yaklaşık yarı seviyede olduğunu göster.
2. Görevler ekranında arama ve durum filtresini kullan.
3. Kanban’da bir kartı başka sütuna taşı ve bunun henüz yerel state olduğunu açıkla.
4. Formu önce eksik göndererek Zod hatalarını, sonra doğru doldurarak başarılı doğrulamayı göster.
5. Gantt’ta tarih çubukları ve bağımlılık oklarını göster.
6. İkinci hafta Supabase, Auth, RLS ve gerçek kayıt işlemlerinin yapılacağını anlat.
