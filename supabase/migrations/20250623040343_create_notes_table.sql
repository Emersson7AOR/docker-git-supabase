-- Creación de la tabla de notas
create table public.notes (
    id bigserial primary key,
    created_at timestamp with time zone default now() not null,
    title text
);

-- Opcional: Añadimos un comentario para describir la tabla
comment on table public.notes is 'Almacena las notas de los usuarios.';
