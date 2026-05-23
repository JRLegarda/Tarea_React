# Cursos App - Documentacion Completa

## 1. Resumen
Esta aplicacion es una SPA en React + Vite para autenticacion y gestion de cursos.

Objetivo funcional:
- Iniciar sesion contra backend.
- Guardar JWT en `localStorage`.
- Proteger rutas privadas con contexto de autenticacion.
- Listar cursos desde API.
- Crear cursos con formulario en Material UI.

Backend esperado:
- Base URL: `http://localhost:8080/auth`
- Login: `POST /api/auth/login`
- Listado de cursos: `GET /api/courses`
- Crear curso: `POST /api/courses`

---

## 2. Estado inicial del proyecto (lo que ya estaba)
Antes de implementar la tarea, el repositorio tenia:

- Proyecto Vite creado en `cursos-app`.
- Dependencias instaladas:
  - `react`, `react-dom`
  - `react-router-dom`
  - `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`
- Estructura de carpetas base ya creada:
  - `src/api/client.js`
  - `src/auth/AuthContext.jsx`
  - `src/auth/ProtectedRoute.jsx`
  - `src/pages/LoginPage.jsx`
  - `src/pages/CoursesPage.jsx`

Importante:
- `src/App.jsx` tenia la UI demo de Vite.
- Los archivos clave de la tarea (`client.js`, `AuthContext.jsx`, `ProtectedRoute.jsx`, `LoginPage.jsx`, `CoursesPage.jsx`) estaban vacios.

---

## 3. Arquitectura final
La app usa 4 capas simples:

1. Router (`App.jsx`): define rutas publicas/privadas.
2. Auth global (`AuthContext.jsx`): token, login, logout, estado autenticado.
3. Cliente HTTP (`api/client.js`): wrapper de `fetch` con JWT automatico.
4. Paginas (`LoginPage.jsx`, `CoursesPage.jsx`): UI y casos de uso.

Flujo general:
1. Usuario entra a `/login`.
2. Hace login -> backend devuelve token.
3. Token se guarda en `localStorage` y en contexto.
4. Usuario navega a `/courses`.
5. `request()` agrega `Authorization: Bearer <token>`.
6. Se listan cursos y se pueden crear nuevos.

---

## 4. Estructura de archivos

```text
cursos-app/
  src/
    api/
      client.js
    auth/
      AuthContext.jsx
      ProtectedRoute.jsx
    pages/
      LoginPage.jsx
      CoursesPage.jsx
    App.jsx
    main.jsx
    index.css
    App.css
```

---

## 5. Documentacion por archivo

## `src/main.jsx`
Responsabilidades:
- Render de la app.
- Envolver `App` en:
  - `BrowserRouter` (enrutamiento)
  - `AuthProvider` (estado global de auth)

Sin esto, no funcionarian ni rutas ni contexto.

## `src/App.jsx`
Responsabilidades:
- Definir rutas:
  - `/login` -> `LoginPage`
  - `/courses` -> `ProtectedRoute(CoursesPage)`
  - `*` -> redireccion a `/courses`

Comportamiento:
- Si no hay sesion y se intenta entrar a `/courses`, se redirige a `/login`.

## `src/api/client.js`
Responsabilidades:
- Centralizar llamadas HTTP.
- Leer token de `localStorage` en cada peticion.
- Agregar headers comunes:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (si hay token)
- Manejar errores HTTP (`!response.ok`).
- Retornar `null` para `204 No Content`.
- Retornar `response.json()` para respuestas con cuerpo.

Ventaja:
- Evita duplicar logica en cada pagina.

## `src/auth/AuthContext.jsx`
Responsabilidades:
- Crear contexto global de autenticacion.
- Estado `token` inicializado desde `localStorage`.
- Exponer API de auth:
  - `login(username, password)`
  - `logout()`
  - `isAuthenticated`
  - `token`

`login`:
- Hace `POST /api/auth/login`.
- Espera `data.token`.
- Guarda token en `localStorage` y en estado React.

`logout`:
- Limpia `localStorage`.
- Limpia estado local.

`useAuth()`:
- Hook para consumir auth en cualquier componente.

## `src/auth/ProtectedRoute.jsx`
Responsabilidades:
- Verificar `isAuthenticated`.
- Si no autenticado:
  - redirigir a `/login`
  - guardar `location` de origen en `state.from`
- Si autenticado:
  - renderizar `children`

Beneficio UX:
- Tras login, se puede volver automaticamente a la pagina que el usuario intento abrir.

## `src/pages/LoginPage.jsx`
Responsabilidades:
- Mostrar formulario de login (MUI).
- Controlar campos (`username`, `password`).
- Manejar estado de envio (`submitting`) y errores.
- Llamar `login()` del contexto.
- Redirigir a destino (por defecto `/courses`).

Detalles de UI:
- `Card` centrada.
- `TextField` para usuario y contrasena.
- `Button` con texto dinamico (`Ingresando...`).
- `Alert` para errores.

## `src/pages/CoursesPage.jsx`
Responsabilidades:
- Obtener cursos al montar (`useEffect` + `loadCourses`).
- Mostrar estados:
  - loading (`CircularProgress`)
  - vacio (mensaje)
  - datos (lista)
  - error (`Alert`)
- Crear curso con `Dialog` + formulario MUI.
- Refrescar listado tras crear.
- Cerrar sesion (`logout`).

Estados internos:
- `courses`, `loading`, `error`
- `open` (dialog)
- `form` (name, description)
- `saving`

## `src/index.css`
Responsabilidades:
- Estilos base globales.
- Layout minimo de pagina completa.
- Ajustes para login centrado y pagina de cursos.

## `src/App.css`
- Se dejo vacio para eliminar estilos del template de Vite y evitar conflicto visual.

---

## 6. Manejo de autenticacion y seguridad

Implementado:
- Persistencia del JWT en `localStorage`.
- Rutas privadas mediante `ProtectedRoute`.
- Header `Authorization` automatico en `request()`.

Consideraciones:
- Si el backend responde `401`, hoy se muestra error en pantalla.
- Mejora opcional futura: auto-logout al detectar `401`.

---

## 7. Contratos de datos esperados

## Login
Request:

```json
{
  "username": "usuario",
  "password": "clave"
}
```

Response esperada:

```json
{
  "token": "jwt_aqui"
}
```

## Curso (listado)
Se asume arreglo de objetos con al menos:

```json
{
  "id": 1,
  "name": "Curso",
  "description": "Descripcion"
}
```

## Crear curso
Request enviada:

```json
{
  "name": "Nuevo curso",
  "description": "Descripcion del curso"
}
```

Si tu backend usa otros nombres de campos, ajusta `CoursesPage.jsx`.

---

## 8. Como ejecutar
Desde `cursos-app`:

```bash
npm install
npm run dev
```

Build de produccion:

```bash
npm run build
npm run preview
```

---

## 9. Prueba funcional recomendada

1. Abrir app.
2. Intentar `/courses` sin token -> debe redirigir a `/login`.
3. Hacer login valido.
4. Verificar que carga lista de cursos.
5. Crear curso nuevo.
6. Confirmar que aparece en lista.
7. Cerrar sesion.
8. Intentar volver a `/courses` -> debe pedir login otra vez.

---

## 10. Cambios implementados (resumen rapido)
- Reemplazo de template Vite por app real de la tarea.
- Integracion completa con router + auth context.
- Cliente API reutilizable con JWT.
- Pagina login funcional.
- Pagina cursos funcional (listar + crear + logout).
- Limpieza de estilos para un UI simple y consistente con MUI.

---

## 11. Posibles mejoras
- Auto-logout en errores `401`.
- Validaciones de formulario mas estrictas.
- Toasts de exito/error (snackbar).
- Paginacion/busqueda de cursos.
- Tests unitarios de `request`, `AuthContext`, y paginas.
- Variables de entorno (`VITE_API_URL`) en lugar de URL hardcodeada.