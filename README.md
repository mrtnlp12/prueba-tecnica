# Sistema de Autenticación y Dashboard

Sistema web completo que implementa registro de usuarios, autenticación y un dashboard protegido.

## Características

- Registro de usuarios con validación
- Autenticación mediante JWT
- Dashboard protegido para usuarios autenticados
- Arquitectura dockerizada (frontend + backend + base de datos)

## Tecnologías

- **Frontend**: Next + TypeScript
- **Backend**: Node.js + Express
- **Base de datos**: MongoDB
- **Contenedorización**: Docker y Docker Compose

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/)


## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone git@github.com:mrtnlp12/prueba-tecnica.git
   ```

2. Navegar a la carpeta `prueba-tecnica`
   ```bash
   cd prueba-tecnica
   ```

2. **Configurar variables de entorno**
   
   Crear archivo `.env` en la carpeta `backend`:
   ```env
   JWT_SECRET=tu_llave_secreta_aqui
   MONGODB_URI=mongodb://mongodb:27017/auth
   ```

3. Iniciar la aplicación
   ```bash
   docker compose up --build -d
   ```

   La aplicación estará disponible en:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

## Detener la aplicación

```bash
docker compose down
```

## Rutas principales

- **Login**: http://localhost:3000/auth/login
- **Registro**: http://localhost:3000/auth/signup
- **Dashboard**: http://localhost:3000/dashboard

## Documentación API

### Endpoints principales
- `GET api/v1/auth/verify` Verificar autenticación
- `POST /api/v1/auth/signup`: Registro de usuarios
- `POST /api/v1/auth/login`: Autenticación de usuarios
- `GET /api/v1/users`: Obtener usuarios