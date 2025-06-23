-- Añadimos la columna user_id a la tabla de notas.
alter table public.notes
  add column user_id uuid;

-- Creamos una relación (llave foránea) con la tabla de usuarios de Supabase.
-- Esto asegura que cada nota esté asociada a un usuario real.
alter table public.notes
  add constraint notes_user_id_fkey
  foreign key (user_id)
  references auth.users (id) on delete cascade;
