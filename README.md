# Tarea React — Gestión de Cursos

Aplicación web SPA (Single Page Application) construida con **React + Vite** que consume una API REST con autenticación JWT para gestionar cursos académicos.

Desarrollada como tarea del curso **Computación en Internet II — Grupo 5**, ICESI.

### Integrantes

- Martín Borrero
- Santiago Carlosama
- Camilo Andrés Martínez
- Juan Sebastián Rodríguez

---

## Funcionalidades

- **Login seguro** con usuario y contraseña contra una API REST
- **Token JWT** guardado en `localStorage` para persistir la sesión al recargar
- **Rutas protegidas** con `useContext` — si no has iniciado sesión, te redirige al login
- **Listado de cursos** obtenido desde el backend, mostrado en tarjetas con colores
- **Crear cursos** mediante un formulario en modal
- **Logout** que limpia el token y redirige al login

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework UI | React 19 + Vite 8 |
| Enrutamiento | React Router DOM v7 |
| Estado global | `useContext` + `useState` |
| Estilos | CSS puro |
| HTTP | `fetch` nativo con cliente reutilizable |
| Auth | JWT en `localStorage` |
| Backend | Spring Boot 3 (proyecto `auth`) |

---

## Estructura del proyecto

```
cursos-app/
├── src/
│   ├── api/
│   │   └── client.js           # Función request() reutilizable con JWT
│   ├── auth/
│   │   ├── AuthContext.jsx     # Contexto global de autenticación
│   │   └── ProtectedRoute.jsx  # Guarda rutas privadas
│   ├── pages/
│   │   ├── LoginPage.jsx       # Pantalla de login
│   │   └── CoursesPage.jsx     # Listado y creación de cursos
│   ├── styles/
│   │   ├── LoginPage.css       # Estilos del login
│   │   └── CoursesPage.css     # Estilos de cursos
│   ├── App.jsx                 # Configuración del router
│   └── main.jsx                # Punto de entrada
├── package.json
└── vite.config.js
```

---

## Correr el proyecto en local

Necesitas dos terminales abiertas al mismo tiempo: una para el backend y otra para el frontend.

**Requisitos:** Java 17+ y Node.js 18+

### Backend

```bash
cd cursos-back
gradlew.bat bootRun        # Windows
./gradlew bootRun          # Mac / Linux
```

Queda corriendo en `http://localhost:8080/auth`

### Frontend

```bash
cd cursos-app
npm install                # solo la primera vez
npm run dev
```

Queda corriendo en `http://localhost:5173`

Abre esa URL en el navegador e inicia sesión con uno de los usuarios de prueba.

---

## Usuarios de prueba

| Usuario | Contraseña | Puede listar cursos | Puede crear cursos |
|---|---|---|---|
| `admin` | `admin123` | ✅ | ✅ |
| `profesor` | `prof123` | ✅ | ❌ |
| `estudiante` | `est123` | ✅ | ❌ |

> Usa `admin` para tener acceso completo.

---

## Despliegue

La aplicación está desplegada en un servidor interno de la universidad y se accede a través de **ZeroTier**, una VPN que conecta tu computador a la red del laboratorio.

### Acceder a la aplicación

**Paso 1 — Conectarte a ZeroTier**

Asegúrate de que ZeroTier esté activo en tu computador y unido a la red del laboratorio. Sin esto el servidor no es alcanzable.

**Paso 2 — Abrir la app en el navegador**

```
http://10.147.17.110/clmb/cursos-app/
```

Eso es todo. Deberías ver la pantalla de login.

> Si la página no carga con ZeroTier activo, es posible que el backend no esté corriendo en el servidor.

---

### Cómo funciona el despliegue

```
Tu navegador
     │
  ZeroTier (VPN interna del laboratorio)
     │
  Servidor  10.147.17.110
     │
  Nginx
     ├── /clmb/cursos-app/   →  React (archivos estáticos)
     └── /clmb/courseapi/    →  Spring Boot (puerto 8090)
```

El **frontend** es la build de producción de Vite servida como archivos estáticos por Nginx.

El **backend** corre en el mismo servidor en el puerto `8090` de forma interna, y Nginx lo expone públicamente bajo `/clmb/courseapi/`.

---

### Configuraciones clave para el despliegue

El proyecto tiene tres ajustes que hacen que todo funcione bajo las rutas del servidor en vez de en `localhost`:

**`vite.config.js` — base path del frontend**
```js
export default defineConfig({
  plugins: [react()],
  base: '/clmb/cursos-app/',   // ← le dice a Vite en qué ruta vive la app
})
```

**`App.jsx` — basename del router**
```js
const router = createBrowserRouter([...], {
  basename: '/clmb/cursos-app'  // ← alinea React Router con la ruta de Nginx
});
```

**`src/api/client.js` — URL del backend**
```js
const API_URL = '/clmb/courseapi/auth';  // ← ruta relativa, Nginx la redirige al puerto 8090
```

Gracias a estas tres configuraciones, el frontend desplegado llama al backend a través de Nginx sin necesidad de conocer el puerto interno ni la IP directa.

---

### Proceso de despliegue (resumen)

Si necesitas volver a desplegar:

```bash
# 1. Generar la build de producción del frontend
cd cursos-app
npm run build
# → genera la carpeta dist/

# 2. Generar el .jar del backend
cd cursos-back
./gradlew bootJar -x test
# → genera build/libs/auth-0.0.1-SNAPSHOT.jar

# 3. Subir archivos al servidor
scp -r dist/* computacion2@10.147.17.110:/home/computacion2/sites/clmb/
scp build/libs/auth-0.0.1-SNAPSHOT.jar computacion2@10.147.17.110:/home/computacion2/sites/clmb/

# 4. En el servidor, correr el backend en segundo plano
ssh computacion2@10.147.17.110
cd /home/computacion2/sites/clmb
nohup java -jar auth-0.0.1-SNAPSHOT.jar > nohup.out 2>&1 &
```

Para ver los logs del backend en el servidor:
```bash
tail -f /home/computacion2/sites/clmb/nohup.out
```
