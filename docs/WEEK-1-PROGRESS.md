# TaskFlow — 1. hafta ilerleme durumu

## Toplantı özeti

Proje iki haftalık MVP olarak planlandı. İlk haftanın sonunda arayüz akışı ve veri modeli doğrulandı; ekranlar şimdilik ortak mock veriyle çalışıyor. Supabase bağlantısı ve gerçek kullanıcı işlemleri ikinci haftaya bırakıldı. Bu nedenle proje tamamlanmış değil, yaklaşık yarı seviyesindedir.

## Yedi günlük geliştirme sırası

| Gün | Yapılan çalışma | Ortaya çıkan çıktı |
| --- | --- | --- |
| 1 | Jira, Asana, Linear, monday.com ve OpenProject araştırması | Ortak özellikler ve MVP kapsamı belirlendi. |
| 2 | Teknoloji ve veri modeli planlama | Next.js, Supabase, Zod, dnd-kit ve Frappe Gantt seçildi. |
| 3 | Next.js proje kurulumu ve ortak sayfa düzeni | Sol menü, üst alan ve sayfa yönlendirmeleri hazırlandı. |
| 4 | Ortak görev modeli ve Overview | Aynı görevlerin özet ve liste ekranlarında gösterilmesi sağlandı. |
| 5 | Kanban prototipi | Kartlar durum sütunları arasında sürüklenebiliyor; değişiklik henüz veritabanına yazılmıyor. |
| 6 | Görev talep formu | React Hook Form ile alan yönetimi, Zod ile veri doğrulama hazırlandı. |
| 7 | Gantt prototipi ve Supabase taslağı | Tarih, ilerleme ve bağımlılıklar görselleştirildi; SQL migration taslağı yazıldı. |

## Şu anda çalışan bölümler

- responsive uygulama menüsü
- Overview özet kartları ve proje ilerlemesi
- aranabilir ve filtrelenebilir görev listesi
- dnd-kit ile tarayıcı içinde çalışan Kanban
- React Hook Form ve Zod doğrulamalı görev formu
- Frappe Gantt ile zaman çizelgesi ve bağımlılıklar
- ortak TypeScript görev tipleri
- Supabase tablo ve RLS taslağı

## Bilerek tamamlanmayan bölümler

- Supabase projesinin canlı bağlantısı
- kullanıcı kaydı ve giriş
- Kanban hareketlerinin veritabanına kaydedilmesi
- formun gerçek görev oluşturması
- dosya yükleme
- yorumlar ve aktivite geçmişi
- bildirimler
- farklı kullanıcı rollerinin uçtan uca testi
- deployment

## İkinci hafta planı

| Gün | Hedef |
| --- | --- |
| 8 | Supabase projesini açmak ve migration dosyasını uygulamak |
| 9 | Auth, oturum ve korumalı sayfa akışını kurmak |
| 10 | Server tarafı Supabase sorgularını yazmak |
| 11 | Görev CRUD ve Kanban kayıt işlemlerini gerçek veriye bağlamak |
| 12 | Yorumlar ve temel aktivite geçmişini eklemek |
| 13 | RLS, form ve mobil görünüm testlerini yapmak |
| 14 | Hataları düzeltmek, demo verisini hazırlamak ve yayınlamak |

## Riskler ve karar bekleyen konular

- Çalışan, yönetici ve admin rollerinin tam yetki sınırları netleştirilmeli.
- Gantt MVP’de salt okunur mu kalacak, yoksa sürükleyerek tarih değiştirme gerekli mi karar verilmeli.
- Talep formunu şirket içindeki herkes mi, yalnızca giriş yapan kullanıcı mı dolduracak netleşmeli.
- İlk sürümde yorum ve dosya yükleme gerçekten gerekli mi onaylanmalı.

## “Overview / over-engineering” notu

- **Overview**, proje ve görevlerin genel durumunu tek ekranda gösteren yönetici özetidir. Projede `/overview` sayfası olarak hazırlandı.
- **Over-engineering**, ihtiyacın üzerinde karmaşık çözüm kurmak demektir. MVP’de yalnızca gerekli tablolar ve akışlar seçilerek bundan kaçınıldı.

Toplantıda yöneticiden hangi terimi kastettiğini netleştirmek gerekir.
