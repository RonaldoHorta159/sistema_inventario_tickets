-- 1. Dar permisos para Insertar, Actualizar y Eliminar datos
-- (Sin esto no puedes registrar el bien)
grant insert, update, delete on all tables in schema public to anon, authenticated;

-- 2. Dar permisos a las secuencias
-- (Esto es VITAL: permite que la base de datos genere automáticamente el ID 1, 2, 3...)
grant usage, select on all sequences in schema public to anon, authenticated;