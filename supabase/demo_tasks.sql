with demo (code, title, description, status, priority, start_date, due_date, progress) as (
  values
    ('IT-101', 'İhtiyaç listesini netleştir', 'İlk sürümde yer alacak ekranları ve görev alanlarını belirle.', 'done'::public.task_status, 'high'::public.task_priority, '2026-09-15'::date, '2026-09-17'::date, 100),
    ('IT-102', 'Veritabanı şemasını kur', 'Proje, görev, üyelik ve bağımlılık tablolarını hazırla.', 'done'::public.task_status, 'high'::public.task_priority, '2026-09-17'::date, '2026-09-20'::date, 100),
    ('IT-103', 'Giriş ve erişim kurallarını bağla', 'Supabase oturumu ile proje üyeliği kurallarını kontrol et.', 'done'::public.task_status, 'high'::public.task_priority, '2026-09-20'::date, '2026-09-23'::date, 100),
    ('IT-104', 'Görev listesini canlı veriye bağla', 'Listeleme, filtreleme ve görev düzenleme akışlarını doğrula.', 'done'::public.task_status, 'medium'::public.task_priority, '2026-09-22'::date, '2026-09-25'::date, 100),
    ('IT-105', 'Kanban durum geçişlerini kontrol et', 'Kartların sütunlar arasında taşınmasını ve kaydını dene.', 'review'::public.task_status, 'high'::public.task_priority, '2026-09-24'::date, '2026-09-29'::date, 85),
    ('IT-106', 'Gantt tarihlerini ve bağımlılıkları dene', 'Görev süreleri ve önceki iş ilişkilerini zaman çizelgesinde kontrol et.', 'in_progress'::public.task_status, 'medium'::public.task_priority, '2026-09-25'::date, '2026-10-01'::date, 65),
    ('IT-107', 'Talep formunu test et', 'Zorunlu alanları ve hatalı tarih girişlerini dene.', 'review'::public.task_status, 'medium'::public.task_priority, '2026-09-26'::date, '2026-09-30'::date, 80),
    ('IT-108', 'Yetki senaryolarını gözden geçir', 'Üye ve proje sahibi işlemlerinin sınırlarını test et.', 'todo'::public.task_status, 'high'::public.task_priority, '2026-09-29'::date, '2026-10-02'::date, 0),
    ('IT-109', 'Dar ekran görünümünü düzelt', 'Görev listesi ve Kanban yerleşimini mobil boyutta kontrol et.', 'todo'::public.task_status, 'low'::public.task_priority, '2026-09-30'::date, '2026-10-03'::date, 0),
    ('IT-110', 'Yayın öncesi kontrol yap', 'Giriş, görev kaydı ve ekran geçişlerini son kez dene.', 'todo'::public.task_status, 'medium'::public.task_priority, '2026-10-02'::date, '2026-10-05'::date, 0)
)
insert into public.tasks (project_id, code, title, description, status, priority, assignee_id, created_by, start_date, due_date, progress)
select p.id, d.code, d.title, d.description, d.status, d.priority, p.owner_id, p.owner_id, d.start_date, d.due_date, d.progress
from public.projects p cross join demo d
where p.name = 'itserv' and p.owner_id = '2536aa7d-9d74-4ef8-ac8c-2599a4a6cca7'::uuid
on conflict (project_id, code) do nothing;

with links (before_code, after_code) as (
  values
    ('IT-101', 'IT-102'),
    ('IT-102', 'IT-103'),
    ('IT-103', 'IT-104'),
    ('IT-104', 'IT-105'),
    ('IT-104', 'IT-106'),
    ('IT-104', 'IT-107'),
    ('IT-105', 'IT-108'),
    ('IT-106', 'IT-110'),
    ('IT-107', 'IT-110'),
    ('IT-108', 'IT-110')
)
insert into public.task_dependencies (predecessor_task_id, successor_task_id)
select before_task.id, after_task.id
from links
join public.tasks before_task on before_task.code = links.before_code
join public.tasks after_task on after_task.code = links.after_code
where before_task.project_id = after_task.project_id
on conflict (predecessor_task_id, successor_task_id) do nothing;
