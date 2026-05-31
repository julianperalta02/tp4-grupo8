# TP4 - API REST de Alumnos

## Grupo 8

**Materia:** Programación III  
**Carrera:** Tecnicatura Universitaria en Programación  
**Cuatrimestre:** 1° cuatrimestre 2026  
**Profesor:** Gustavo Ramoscelli  
**Ayudante:** Maria Victoria Ruiz

---

## Integrantes

| Nombre | Parte del proyecto |
|---|---|
| Alejo | Parte 4 – Definición de rutas y endpoints |
| Nico | Parte 2 – Modelos de datos y validaciones con TypeScript |
| Julián | Parte 5 – Dockerización y deploy en Render |
| Román y Naza | Parte 3 – Controladores y lógica de negocio (CRUD) |
| Gian | Parte 6 – Pruebas con Postman y documentación final |

---

## Descripción del proyecto

API REST desarrollada con Node.js y Express que permite gestionar alumnos, materias, notas y profesores. Los datos se almacenan en archivos JSON que simulan una base de datos. La API expone endpoints CRUD completos para cada recurso, construidos siguiendo el patrón MVC (Modelo - Vista - Controlador), con modelos escritos en TypeScript para la validación de datos y middlewares dedicados para validar el body antes de llegar al controlador.

El proyecto se dockeriza y despliega en Render, y sus endpoints están documentados y probados con Postman.

---

## Metodología de trabajo con Git y GitHub

Se trabajó con **una rama por integrante**. El flujo fue secuencial: cada integrante tomó el `main` actualizado, creó su propia rama, desarrolló su parte, hizo `push` y abrió un **Pull Request** hacia `main`. Una vez aprobado y mergeado, el siguiente tomó la base actualizada y continuó.

```
main → rama-alejo   → PR → merge a main
main → rama-nico    → PR → merge a main
main → rama-julian  → PR → merge a main
main → rama-roman   → PR → merge a main
main → rama-naza    → PR → merge a main
main → rama-gian    → PR → merge a main
```

Cada integrante tiene al menos un commit en su propia rama y su correspondiente Pull Request aprobado.

---

## División de tareas por integrante

| Integrante | Archivos |
|---|---|
| Alejo | `routes/alumno.routes.js`, `routes/extras/*.routes.js` |
| Nico | `models/alumno.model.ts`, `models/extras/*.model.ts` |
| Julián | `Dockerfile`, configuración de Render |
| Román y Naza | `controllers/alumno.controller.js`, `controllers/*.controller.js`, `persistence/*.persistence.js`, `middleware/*.middleware.js` |
| Gian | `README.md`, colección de Postman |

---

## Distribución de carpetas y archivos

```
tp4_grupo8_backend/
├── app.js                                      # Punto de entrada
├── .env                                        # Variables de entorno (no subido a GitHub)
├── .gitignore
├── Dockerfile                                  # Imagen Docker del proyecto
├── package.json
├── tsconfig.json
├── README.md
│
├── core/
│   └── server.js                               # Configuración del servidor Express
│
├── routes/
│   ├── alumno.routes.js                        # Rutas de alumnos
│   └── extras/
│       ├── materia.routes.js
│       ├── nota.routes.js
│       └── profesor.routes.js
│
├── controllers/
│   ├── alumno.controller.js                    # CRUD de alumnos
│   ├── Materia.controller.js
│   ├── Nota.controller.js
│   └── Profesor.controller.js
│
├── middleware/
│   ├── alumno-validator.middleware.js          # Validación de body para POST
│   ├── materia-validator.middleware.js
│   ├── nota-validator.middleware.js
│   └── profesor-validator.middleware.js
│
├── models/
│   ├── persona.model.ts                        # Clase base
│   ├── alumno.model.ts
│   └── extras/
│       ├── materia.model.ts
│       ├── nota.model.ts
│       └── profesor.model.ts
│
├── persistence/
│   ├── alumno.persistence.js                   # Lectura/escritura de JSON
│   ├── materia.persistence.js
│   ├── nota.persistence.js
│   └── profesor.persistence.js
│
└── data/
    ├── alumnos.json                            # Base de datos simulada
    └── extras/
        ├── materias.json
        ├── notas.json
        └── profesores.json
```

---

## Explicación de funciones (90% del proyecto)

### `app.js`

Punto de entrada. Importa la clase `Server`, crea una instancia y llama a `listen()` para iniciar el servidor.

---

### `core/server.js` — clase `Server`

**`constructor()`**  
Inicializa Express, lee el puerto desde `.env` (fallback: 3000) y llama a `middleware()` y `rutas()`.

**`middleware()`**  
Aplica los middlewares globales: CORS para permitir peticiones externas, `express.json()` para parsear el body de las peticiones POST/PUT, y `express.urlencoded()` para datos de formularios.

**`rutas()`**  
Registra las cuatro rutas principales (`/alumnos`, `/materias`, `/notas`, `/profesores`) y define los manejadores de error globales para rutas no encontradas (404) y errores internos (500).

**`listen()`**  
Pone el servidor a escuchar en el puerto configurado e imprime un mensaje de confirmación en consola.

---

### `persistence/alumno.persistence.js`

Capa de acceso a datos que abstrae la lectura y escritura del archivo JSON. Utiliza `path.join` para construir la ruta de forma segura independientemente del sistema operativo.

**`readAlumnos()`**  
Lee el archivo `alumnos.json` con `fs.promises.readFile` y retorna el array parseado.

**`writeAlumnos(alumnos)`**  
Serializa el array recibido y sobreescribe el archivo JSON con formato indentado (`null, 2`), para mantener el archivo legible.

> Las funciones de persistencia de materias, notas y profesores siguen la misma estructura, apuntando a su archivo correspondiente en `data/extras/`.

---

### `middleware/alumno-validator.middleware.js`

**`alumnoValidator(req, res, next)`**  
Se ejecuta antes del controlador en las rutas POST. Valida que `nombre`, `apellido` y `email` sean strings no vacíos. Si hay errores los acumula en un array y devuelve un `400 Bad Request`. Si todo está bien llama a `next()` para continuar al controlador.

> Los middlewares de materia, nota y profesor siguen la misma lógica validando los campos propios de cada recurso.

---

### `controllers/alumno.controller.js`

Todos los métodos son asíncronos y usan `try/catch`.

**`getAlumnoAll(req, res)`**  
Obtiene todos los alumnos y aplica filtros opcionales por query params:
- `?isActive=true/false` → filtra por estado activo
- `?apellido=garcia` → filtra por apellido (case-insensitive, búsqueda parcial)

Imprime flags en consola indicando qué filtros se aplicaron y cuántos resultados se devolvieron.  
Respuestas: `200 OK`, `500`.

**`getAlumnoById(req, res)`**  
Busca un alumno por `legajo` (recibido como `req.params`). Convierte el parámetro a número con `Number()` para compararlo correctamente con el JSON.  
Respuestas: `200 OK`, `404 Not Found`, `500`.

**`postNewAlumno(req, res)`**  
Recibe `nombre`, `apellido` y `email` del body. Verifica que no haya un email duplicado (409). Genera el nuevo legajo automáticamente tomando el máximo existente + 1 (o empieza en 10001 si el array está vacío). Crea una instancia de `AlumnoModel` y persiste el nuevo alumno.  
Respuestas: `201 Created`, `409 Conflict`, `500`.

**`putAlumnoByLegajo(req, res)`**  
Busca el alumno por legajo usando `findIndex`. Crea una instancia de `AlumnoModel` con los datos actuales y aplica solo los campos que vienen en el body (los `undefined` se ignoran). Actualiza automáticamente el campo `modificacion` con la fecha del día.  
Respuestas: `200 OK`, `404 Not Found`, `500`.

**`deleteAlumnoByLegajo(req, res)`**  
Busca el índice del alumno y lo elimina del array con `splice`. Guarda el array resultante.  
Respuestas: `200 OK`, `404 Not Found`, `500`.

> Los controladores de Materia, Nota y Profesor siguen la misma estructura con los campos y validaciones propios de cada recurso.

---

### `models/persona.model.ts` — clase `PersonaModel`

Clase base con propiedades `protected` (`nombre`, `apellido`, `email`) para que puedan ser heredadas.

| Método | Descripción |
|---|---|
| `getNombre()` / `setNombre()` | Getter y setter del nombre |
| `getApellido()` / `setApellido()` | Getter y setter del apellido |
| `getNombreCompleto()` | Retorna `nombre + apellido` concatenados |
| `getEmail()` / `setEmail()` | Getter y setter del email |
| `getAllAttributes()` | Retorna un objeto plano con los atributos |
| `static validate(data)` | Valida que nombre, apellido y email sean strings no vacíos |

---

### `models/alumno.model.ts` — clase `AlumnoModel`

Extiende `PersonaModel`. Agrega `legajo`, `fechaAlta`, `modificacion` e `isActive`.

| Método | Descripción |
|---|---|
| `getLegajo()` | Retorna el número de legajo |
| `getFechaAlta()` | Retorna la fecha de alta |
| `getModificacion()` / `setModificacion()` | Getter y setter de la fecha de modificación |
| `getIsActive()` / `setIsActive()` | Getter y setter del estado activo |
| `getAllAttributes()` | Retorna todos los campos como objeto (override) |
| `static validate(data)` | Llama a `super.validate()` y agrega validaciones de `legajo`, `fechaAlta`, `modificacion` e `isActive` |

---

### `models/extras/materia.model.ts` — clase `MateriaModel`

Maneja los datos de una materia con `idMateria` (string), `nombre` y `cuatrimestre` (number). Incluye getters, setters, `getAllAttributes()` y un método estático `validate()` que verifica que los tres campos sean del tipo correcto.

### `models/extras/nota.model.ts` — clase `NotaModel`

Representa una nota con `id`, `legajo`, `idMateria`, `nota` y `fecha`. Permite modificar solo `nota` y `fecha` (los demás son inmutables una vez creada). Incluye `getAllAttributes()` y `validate()`.

### `models/extras/profesor.model.ts` — clase `ProfesorModel`

Extiende `PersonaModel`. Agrega `legajoProfesor` y `especialidad`. Incluye `getAllAttributes()` (override) y `validate()` (override) que llama a `super.validate()` y agrega las validaciones propias.

---

## Estructuras de los archivos JSON

### `data/alumnos.json`

```json
[
  {
    "legajo": 10001,
    "nombre": "Mora",
    "apellido": "García",
    "email": "m.garcia@facultad.edu.ar",
    "fechaAlta": "2026-03-02",
    "modificacion": "2026-03-02",
    "isActive": true
  }
]
```

### `data/extras/materias.json`

```json
[
  {
    "idMateria": "MAT101",
    "nombre": "Matemática I",
    "cuatrimestre": 1
  }
]
```

### `data/extras/notas.json`

```json
[
  {
    "id": 1,
    "legajo": 10001,
    "idMateria": "MAT101",
    "nota": 9,
    "fecha": "03-04-24"
  }
]
```

### `data/extras/profesores.json`

```json
[
  {
    "legajoProfesor": 20001,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "j.perez@facultad.edu.ar",
    "especialidad": "Programación"
  }
]
```

---

## Endpoints documentados con Postman

> Las capturas de pantalla se encuentran en la carpeta `/postman` del repositorio.

### Base URL
```
https://[url-render-pendiente].onrender.com
```

---

### ALUMNOS

#### GET /alumnos
Retorna todos los alumnos. Acepta filtros opcionales por query params.

```
GET /alumnos
GET /alumnos?isActive=true
GET /alumnos?apellido=garcia
```
Respuestas: `200 OK`, `500`

#### GET /alumnos/:legajo
```
GET /alumnos/10001
```
Respuestas: `200 OK`, `404 Not Found`, `500`

#### POST /alumnos
```
POST /alumnos
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "López",
  "email": "j.lopez@facultad.edu.ar"
}
```
El legajo se genera automáticamente. Respuestas: `201 Created`, `400 Bad Request`, `409 Conflict`, `500`

#### PUT /alumnos/:legajo
Solo se actualizan los campos enviados. El legajo no puede modificarse.
```
PUT /alumnos/10001
Content-Type: application/json

{
  "nombre": "Juan Pablo",
  "isActive": false
}
```
Respuestas: `200 OK`, `404 Not Found`, `500`

#### DELETE /alumnos/:legajo
```
DELETE /alumnos/10001
```
Respuestas: `200 OK`, `404 Not Found`, `500`

---

### MATERIAS

#### GET /materias
```
GET /materias
GET /materias?cuatrimestre=1
```
#### GET /materias/:idMateria — `GET /materias/MAT101`
#### POST /materias
```json
{ "idMateria": "PROG3", "nombre": "Programación III", "cuatrimestre": 2 }
```
#### PUT /materias/:idMateria — modifica `nombre` y/o `cuatrimestre`
#### DELETE /materias/:idMateria

Respuestas en todos: `200/201`, `400`, `404`, `409`, `500` según corresponda.

---

### NOTAS

#### GET /notas
```
GET /notas
GET /notas?legajo=10001
GET /notas?idMateria=MAT101
```
#### GET /notas/:id — `GET /notas/1`
#### POST /notas
```json
{ "legajo": 10001, "idMateria": "MAT101", "nota": 9, "fecha": "01-06-26" }
```
El id se genera automáticamente.
#### PUT /notas/:id — modifica `nota` y/o `fecha`
#### DELETE /notas/:id

---

### PROFESORES

#### GET /profesores
```
GET /profesores
GET /profesores?especialidad=programacion
```
#### GET /profesores/:legajoProfesor
#### POST /profesores
```json
{ "nombre": "Ana", "apellido": "Gómez", "email": "a.gomez@facultad.edu.ar", "especialidad": "Redes" }
```
El legajoProfesor se genera automáticamente.
#### PUT /profesores/:legajoProfesor — modifica nombre, apellido, email y/o especialidad
#### DELETE /profesores/:legajoProfesor

---

## Deploy

- **URL de la API (Render):** _pendiente_
- **Repositorio backend:** https://github.com/julianperalta02/tp4_grupo8_backend
- **Repositorio front-end:** https://github.com/NCastellini/tp4-front-grupo8

---

## Tecnologías utilizadas

- Node.js + Express 5
- TypeScript
- Docker
- Render
- Postman
- Git / GitHub


# BORRAR
### Lineas donde va la url de render: 309 y 424 