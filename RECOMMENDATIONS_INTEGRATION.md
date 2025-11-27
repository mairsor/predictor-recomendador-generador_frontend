# Sistema de Recomendaciones - Frontend

## 📋 Funcionalidades Implementadas

### Para ALUMNO

#### `/student/recommendations`
Panel completo de recomendaciones personalizadas que incluye:

**1. Resumen del Estudiante (Cards superiores):**
- **Progreso**: Porcentaje de avance en la malla curricular
- **Promedio**: Nota promedio y tasa de aprobación
- **Mejor Línea**: Línea de carrera con mejor desempeño
- **Cursos Jalados**: Cantidad de cursos obligatorios reprobados

**2. Tab "Recomendaciones":**
- Lista de cursos recomendados ordenados por prioridad
- Score de recomendación para cada curso
- Badges indicando:
  - Ranking (#1, #2, #3...)
  - Si es un curso jalado
  - Si es obligatorio
- Razones de la recomendación:
  - Similitud de contenido
  - Score colaborativo
  - Performance en líneas relacionadas
- Prerequisitos y si están cumplidos
- Líneas de carrera del curso

**3. Tab "Mi Desempeño":**
- Análisis por línea de carrera
- Gráfico de barras con tu promedio en cada línea
- Lista de cursos pendientes de aprobar

**4. Tab "Mi Historial":**
- Resumen de cursos aprobados vs jalados
- Gráficos de progreso

---

## 🔧 Configuración

### Variables de Entorno

Asegúrate de tener configurado en `.env.local`:

```env
NEXT_PUBLIC_RECOMENDADOR_URL=http://localhost:8001
```

### Iniciar el Servicio de Recomendación

El frontend necesita que el servicio de recomendación esté corriendo:

```bash
# En el directorio recomendador_cursos_api
cd recomendador_cursos_api
python apy.py
```

El servicio debe estar disponible en `http://localhost:8001`

---

## 🎨 Componentes Creados

### Servicios
- **`services/recommenderService.ts`**: Cliente API para el sistema de recomendación
  - Tipos TypeScript completos
  - Métodos para estudiantes, cursos, estadísticas
  - Timeout de 30 segundos para operaciones de ML

### Páginas
- **`app/student/recommendations/page.tsx`**: Página principal de recomendaciones
  - Vista completa con tabs
  - Cards de resumen
  - Componente `CourseRecommendationCard` interno

### Actualizaciones
- **`components/common/Sidebar.tsx`**: 
  - Agregado ícono `Lightbulb` para Recomendaciones
  - Ruta actualizada a `/student/recommendations`

---

## 📡 Endpoints Utilizados

### Para Estudiantes
- `GET /api/students/{student_id}` - Info completa del estudiante
- `GET /api/students/{student_id}/recommendations` - Recomendaciones (top 10)
- `GET /api/students/{student_id}/history` - Historial académico

### Parámetros
- `top_k`: Número de recomendaciones (default: 10)

---

## 🚀 Próximos Pasos

### Para completar el módulo de estudiantes:
1. ✅ Panel de recomendaciones (COMPLETADO)
2. ⏳ Vista detallada de curso individual
3. ⏳ Comparación de cursos
4. ⏳ Exportar recomendaciones a PDF

### Para otros roles:
1. **Profesor**:
   - Panel de análisis de cursos
   - Lista de estudiantes recomendados
   
2. **Admin**:
   - Dashboard de estadísticas del sistema
   - Gestión y visualización de todo el sistema

---

## 🐛 Troubleshooting

### Error: "No se encontró el código de alumno"
- Verifica que el usuario tenga un `alumno.codigo` en el perfil
- El código debe coincidir con los datos en el recomendador

### Error de conexión al recomendador
- Verifica que el servicio esté corriendo en el puerto 8001
- Revisa la URL en `.env.local`
- Asegúrate de que los modelos estén cargados

### Recomendaciones vacías
- El estudiante debe tener historial académico en el sistema
- Verifica que los datos estén correctamente cargados en `data/`

---

## 📝 Notas Técnicas

- El servicio usa **Flask** (no FastAPI) en puerto **8001**
- Timeout de 30 segundos para operaciones de ML
- Los modelos se cargan al iniciar el servidor
- Las recomendaciones se generan en tiempo real
