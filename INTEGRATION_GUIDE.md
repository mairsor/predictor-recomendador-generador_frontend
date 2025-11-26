# Integración de APIs - Frontend

Este documento explica cómo usar las APIs del backend, predictor y recomendador en el frontend.

## Configuración

Las URLs de las APIs se configuran en `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3003/api
NEXT_PUBLIC_PREDICTOR_URL=http://localhost:8000
NEXT_PUBLIC_RECOMENDADOR_URL=http://localhost:8001
```

**Nota:** El backend usa el puerto **3003** con prefijo `/api`.

## Servicios Disponibles

### 1. API Backend (api.ts)
Cliente axios para la API principal de NestJS con autenticación JWT.

```typescript
import api from '@/services/api';

// Ejemplo: obtener usuarios
const response = await api.get('/users');
```

### 2. Predictor Service (predictorService.ts)
Servicio para predicciones de demanda de cursos.

```typescript
import { predictorService } from '@/services';

// Predicción general
const prediction = await predictorService.predict({
  scope: 'general',
  model_type: 'random_forest'
});

// Predicción específica
const prediction = await predictorService.predict({
  scope: 'specific',
  specific_courses: ['CURSO001', 'CURSO002']
});

// Obtener historial
const history = await predictorService.getHistory(10);
```

### 3. Recomendador Service (recomendadorService.ts)
Servicio para recomendaciones de cursos.

```typescript
import { recomendadorService } from '@/services';

// Recomendaciones para estudiante
const recommendations = await recomendadorService.getRecommendations({
  student_id: '20200001',
  top_n: 10
});

// Recomendaciones híbridas
const hybrid = await recomendadorService.getHybridRecommendations('20200001', 10);

// Cursos similares
const similar = await recomendadorService.getSimilarCourses('CURSO001', 5);
```

## Hooks Personalizados

### usePredictions

Hook para manejar predicciones con estado de carga y errores:

```typescript
import { usePredictions } from '@/hooks/usePredictions';

function MyComponent() {
  const { predict, loading, error } = usePredictions();

  const handlePredict = async () => {
    const result = await predict({
      scope: 'general',
      model_type: 'random_forest'
    });
    
    if (result) {
      console.log('Predicciones:', result.results);
    }
  };

  return (
    <div>
      <button onClick={handlePredict} disabled={loading}>
        {loading ? 'Prediciendo...' : 'Predecir'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### useRecommendations

Hook para manejar recomendaciones:

```typescript
import { useRecommendations } from '@/hooks/useRecommendations';

function MyComponent() {
  const { getHybridRecommendations, loading, error } = useRecommendations();

  const handleGetRecommendations = async () => {
    const result = await getHybridRecommendations('20200001', 10);
    
    if (result) {
      console.log('Recomendaciones:', result.recommendations);
    }
  };

  return (
    <div>
      <button onClick={handleGetRecommendations} disabled={loading}>
        {loading ? 'Cargando...' : 'Obtener Recomendaciones'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

## Ejemplos de Uso en Componentes

### Página de Predicciones

```typescript
'use client';

import { useState } from 'react';
import { usePredictions } from '@/hooks/usePredictions';
import type { PredictionResult } from '@/services';

export default function PredictionsPage() {
  const { predict, loading, error } = usePredictions();
  const [results, setResults] = useState<PredictionResult[]>([]);

  const handlePredict = async () => {
    const response = await predict({
      scope: 'general',
      model_type: 'random_forest'
    });

    if (response) {
      setResults(response.results);
    }
  };

  return (
    <div className="p-6">
      <h1>Predicción de Demanda</h1>
      
      <button 
        onClick={handlePredict}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Prediciendo...' : 'Ejecutar Predicción'}
      </button>

      {error && <div className="alert-error">{error}</div>}

      <div className="mt-6">
        {results.map((result) => (
          <div key={result.curso_id} className="card">
            <h3>{result.curso_nombre}</h3>
            <p>Demanda: {result.prediccion_demanda}</p>
            <p>Confianza: {result.confidence}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Página de Recomendaciones

```typescript
'use client';

import { useState } from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import type { CourseRecommendation } from '@/services';

export default function RecommendationsPage() {
  const { getHybridRecommendations, loading, error } = useRecommendations();
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [studentId, setStudentId] = useState('');

  const handleGetRecommendations = async () => {
    const response = await getHybridRecommendations(studentId, 10);

    if (response) {
      setRecommendations(response.recommendations);
    }
  };

  return (
    <div className="p-6">
      <h1>Recomendaciones de Cursos</h1>
      
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="ID del estudiante"
        className="input"
      />

      <button 
        onClick={handleGetRecommendations}
        disabled={loading || !studentId}
        className="btn-primary"
      >
        {loading ? 'Cargando...' : 'Obtener Recomendaciones'}
      </button>

      {error && <div className="alert-error">{error}</div>}

      <div className="mt-6">
        {recommendations.map((rec) => (
          <div key={rec.curso_id} className="card">
            <h3>{rec.curso_nombre}</h3>
            <p>Score: {rec.score.toFixed(2)}</p>
            <p>{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Manejo de Errores

Todos los servicios y hooks manejan errores automáticamente:

- **401 Unauthorized**: Redirige al login automáticamente
- **Otros errores**: Se capturan en el estado `error` de los hooks
- **Network errors**: Se manejan como errores generales

## Tipos TypeScript

Todos los tipos están exportados desde `@/services`:

```typescript
import type {
  PredictionRequest,
  PredictionResponse,
  PredictionResult,
  RecommendationRequest,
  RecommendationResponse,
  CourseRecommendation,
} from '@/services';
```

## Testing

Para probar las conexiones:

```bash
# 1. Asegúrate de que todos los servicios estén corriendo
docker-compose ps

# 2. Verifica los healthchecks
curl http://localhost:4000  # Backend
curl http://localhost:8000  # Predictor
curl http://localhost:8001/api/health  # Recomendador

# 3. Inicia el frontend
npm run dev
```
