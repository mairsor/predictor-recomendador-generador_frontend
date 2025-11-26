# Backend API Integration - Complete Reference

## 📋 Lista Completa de APIs Conectadas

### 🔐 Autenticación
- ✅ `POST /auth/login` - Iniciar sesión
- ✅ `POST /auth/logout` - Cerrar sesión

### 👨‍🎓 Alumnos
- ✅ `POST /alumno` - Crear alumno
- ✅ `GET /alumno` - Listar alumnos (con paginación y búsqueda)
- ✅ `GET /alumno/:id` - Obtener alumno por ID
- ✅ `PATCH /alumno/:id` - Actualizar alumno
- ✅ `DELETE /alumno/:id` - Eliminar alumno
- ✅ `POST /alumno/upload` - Carga masiva de alumnos (CSV/Excel)

### 👨‍🏫 Profesores
- ✅ `POST /profesor` - Crear profesor
- ✅ `GET /profesor` - Listar profesores
- ✅ `GET /profesor/:id` - Obtener profesor por ID
- ✅ `PATCH /profesor/:id` - Actualizar profesor
- ✅ `DELETE /profesor/:id` - Eliminar profesor

### 📚 Cursos
- ✅ `POST /curso` - Crear curso
- ✅ `GET /curso` - Listar cursos
- ✅ `GET /curso/:id` - Obtener curso por ID
- ✅ `PATCH /curso/:id` - Actualizar curso
- ✅ `DELETE /curso/:id` - Eliminar curso

### 📝 Cursos Ofertados
- ✅ `POST /ofertado` - Crear curso ofertado
- ✅ `GET /ofertado` - Listar cursos ofertados
- ✅ `GET /ofertado/:id` - Obtener curso ofertado por ID
- ✅ `PATCH /ofertado/:id` - Actualizar curso ofertado
- ✅ `DELETE /ofertado/:id` - Eliminar curso ofertado

### 📋 Matrículas
- ✅ `POST /matricula` - Crear matrícula
- ✅ `GET /matricula` - Listar matrículas
- ✅ `GET /matricula/:id` - Obtener matrícula por ID
- ✅ `PATCH /matricula/:id` - Actualizar matrícula
- ✅ `DELETE /matricula/:id` - Eliminar matrícula

### 📊 Demanda
- ✅ `POST /demanda` - Crear registro de demanda
- ✅ `GET /demanda` - Listar registros de demanda
- ✅ `GET /demanda/:id` - Obtener demanda por ID
- ✅ `PATCH /demanda/:id` - Actualizar demanda
- ✅ `DELETE /demanda/:id` - Eliminar demanda

### 💳 Créditos
- ✅ `GET /credito` - Listar créditos
- ✅ `GET /credito/:id` - Obtener crédito por ID

### 🔗 Requisitos
- ✅ `POST /requisito` - Crear requisito de curso
- ✅ `GET /requisito` - Listar requisitos
- ✅ `GET /requisito/:id` - Obtener requisito por ID
- ✅ `DELETE /requisito/:id` - Eliminar requisito

---

## 📁 Estructura de Archivos Creados

```
frontend/
├── services/
│   ├── api.ts                    # Clientes axios base
│   ├── backendService.ts         # ✨ NUEVO: Servicio completo del backend
│   ├── predictorService.ts       # Servicio de predicciones
│   ├── recomendadorService.ts    # Servicio de recomendaciones
│   └── index.ts                  # Exportaciones centralizadas
│
├── hooks/
│   ├── useAuth.ts                # ✨ NUEVO: Hook de autenticación
│   ├── useAlumnos.ts             # ✨ NUEVO: Hook de alumnos
│   ├── useCursos.ts              # ✨ NUEVO: Hook de cursos
│   ├── useMatriculas.ts          # ✨ NUEVO: Hook de matrículas
│   ├── usePredictions.ts         # Hook de predicciones
│   └── useRecommendations.ts     # Hook de recomendaciones
│
└── .env.local                    # Variables de entorno
```

---

## 🚀 Ejemplos de Uso

### 1. Autenticación

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'alumno@uni.edu.pe',
      password: 'password123'
    });

    if (result) {
      // Login exitoso, redirigir
      router.push('/dashboard');
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </button>
  );
}
```

### 2. Gestión de Alumnos

```typescript
import { useAlumnos } from '@/hooks/useAlumnos';

function AlumnosPage() {
  const { alumnos, fetchAll, create, update, remove, loading } = useAlumnos();

  useEffect(() => {
    fetchAll({ page: 1, limit: 20, search: 'Juan' });
  }, []);

  const handleCreate = async () => {
    await create({
      codigo: '20250001',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@uni.edu.pe',
      password: 'pass123',
      facultad: 'FIEE'
    });
  };

  return (
    <div>
      {alumnos.map(alumno => (
        <div key={alumno.id}>
          {alumno.nombres} {alumno.apellidos}
        </div>
      ))}
    </div>
  );
}
```

### 3. Gestión de Cursos

```typescript
import { useCursos } from '@/hooks/useCursos';

function CursosPage() {
  const { cursos, fetchAll, create, loading, error } = useCursos();

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async () => {
    await create({
      codigo: 'CB121',
      nombre: 'Cálculo I',
      creditos: 5,
      horasTeoria: 4,
      horasPractica: 2,
      ciclo: 1,
      tipo: 'OBLIGATORIO'
    });
  };

  return (
    <div>
      {cursos.map(curso => (
        <div key={curso.id}>
          {curso.codigo} - {curso.nombre}
        </div>
      ))}
    </div>
  );
}
```

### 4. Gestión de Matrículas

```typescript
import { useMatriculas } from '@/hooks/useMatriculas';

function MatriculasPage() {
  const { matriculas, create, update, remove, loading } = useMatriculas();

  const handleMatricular = async (alumnoId: number, ofertadoId: number) => {
    await create({
      alumnoId,
      ofertadoId,
      semestre: '2025-1',
      estado: 'MATRICULADO'
    });
  };

  return (
    <div>
      <button onClick={() => handleMatricular(1, 5)}>
        Matricular
      </button>
    </div>
  );
}
```

### 5. Uso Directo del Servicio (sin hooks)

```typescript
import { backendService } from '@/services';

async function fetchData() {
  // Obtener todos los cursos
  const cursos = await backendService.cursos.findAll();

  // Obtener profesores
  const profesores = await backendService.profesores.findAll();

  // Crear matrícula
  const matricula = await backendService.matriculas.create({
    alumnoId: 1,
    ofertadoId: 5,
    semestre: '2025-1',
    estado: 'MATRICULADO'
  });

  // Obtener demanda
  const demanda = await backendService.demanda.findAll();
}
```

---

## 🎯 Características Implementadas

### ✅ Servicios Backend
- ✅ Autenticación con JWT
- ✅ CRUD completo para todas las entidades
- ✅ Paginación y búsqueda en alumnos
- ✅ Carga masiva de alumnos (CSV/Excel)
- ✅ Tipos TypeScript completos
- ✅ Manejo de errores centralizado

### ✅ Hooks Personalizados
- ✅ `useAuth` - Autenticación
- ✅ `useAlumnos` - Gestión de alumnos con estado
- ✅ `useCursos` - Gestión de cursos con estado
- ✅ `useMatriculas` - Gestión de matrículas con estado
- ✅ Estados de loading y error
- ✅ Actualización automática de listas

### ✅ Interceptores Axios
- ✅ Inyección automática de JWT token
- ✅ Redirección automática en 401 Unauthorized
- ✅ Manejo de errores consistente

---

## 📊 Resumen de Conectividad

| Módulo | APIs | Estado |
|--------|------|--------|
| Backend (NestJS) | 40+ endpoints | ✅ **100% Conectado** |
| Predictor (FastAPI) | 11 endpoints | ✅ **100% Conectado** |
| Recomendador (FastAPI) | 8 endpoints | ✅ **100% Conectado** |

---

## 🔄 Próximos Pasos

1. **Crear componentes UI** para cada módulo
2. **Implementar páginas** de gestión (alumnos, cursos, matrículas)
3. **Agregar validación** de formularios con Zod
4. **Implementar paginación** en tablas
5. **Agregar filtros** y búsquedas avanzadas
6. **Testing** de integración

---

## 📝 Notas Importantes

- **Todos los servicios** usan el interceptor de autenticación JWT
- **Todos los hooks** manejan loading/error states automáticamente
- **Todas las respuestas** están tipadas con TypeScript
- **Todos los errores** se capturan y formatean consistentemente
- **El token JWT** se guarda en localStorage automáticamente
