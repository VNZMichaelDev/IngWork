-- =====================================================
-- ACTUALIZAR CATEGORÍAS A CATEGORÍAS DE CONSTRUCCIÓN
-- Ejecuta este script en Supabase SQL Editor
-- =====================================================

-- Primero, eliminar las categorías antiguas
DELETE FROM public.project_categories;

-- Insertar las nuevas categorías de construcción
INSERT INTO public.project_categories (name, description, icon, sort_order) VALUES
('Construcción', 'Proyectos de construcción nueva', 'building', 1),
('Mantenimiento y mejoramiento', 'Mantenimiento y mejoras de edificaciones', 'wrench', 2),
('Remodelación', 'Remodelación y renovación de espacios', 'home', 3),
('Servicios técnicos y documentación', 'Documentación técnica, planos, estudios', 'file-text', 4),
('Asesorías y consultorías', 'Asesoría técnica y consultoría profesional', 'briefcase', 5),
('Supervisión', 'Supervisión de obras y proyectos', 'eye', 6),
('Categoría A - Edificaciones esenciales', 'Hospitales, estaciones de bomberos, comisarías, centrales eléctricas, centrales de comunicaciones, centros de control, plantas de tratamiento de agua o energía', 'shield', 7),
('Categoría B - Edificaciones de uso especial', 'Escuelas, universidades, iglesias, cines, estadios, museos, centros comerciales, edificios públicos importantes', 'users', 8),
('Categoría C - Edificaciones comunes', 'Viviendas, oficinas, locales comerciales pequeños, talleres, edificios multifamiliares', 'home', 9),
('Categoría D - Edificaciones menores', 'Construcciones agrícolas ligeras, depósitos pequeños, cobertizos, garajes, cercos', 'box', 10);

-- Verificar que se insertaron correctamente
SELECT * FROM public.project_categories ORDER BY sort_order;
