# 💻 School Management - Frontend

Cliente web para el Sistema de Gestión Escolar construido con React, TypeScript y Vite.

## 🚀 Tecnologías

- **React 18**
- **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend API corriendo (ver repositorio backend)

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd school-management-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar VITE_API_URL con la URL del backend
```

## 🏃 Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para producción

```bash
npm run build
```

## 🐳 Ejecutar con Docker

```bash
docker build -t school-frontend .
docker run -p 5173:5173 school-frontend
```

## 📱 Funcionalidades

### Rol Admin
- Ver reportes generales
- Supervisar todas las calificaciones
- Generar reportes por grado/materia/alumno

### Rol Maestro
- Gestionar calificaciones de sus materias
- Ver reportes de sus alumnos
- Registrar nuevas calificaciones
