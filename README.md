

# Plantilla Base para Proyectos Node.js

Este repositorio es una plantilla que puedes utilizar como base para futuros proyectos Node.js.

## Autor

Creado por [Diego Cruz Lugo](https://github.com/DiegoCL311)

## Características

- **TypeScript:** Lenguaje de programación.
- **Node.js:** Plataforma de desarrollo.
- **Express:** Framework web para Node.js.
- **Autenticación:** Sistema de ejemplo base de autenticación.
- **JWT:** Utilización de tokens JWT para protección de rutas y sesiones.
- **Validación de datos de la solicitud:** Utilización de libreria Joi para validar los datos en las solicitudes.
- **Pruebas Unitarias:** Implementación de pruebas unitarias utilizando Jest y supertest.
- **Sistema de Manejo de Errores:** Implementación de un sistema de manejo de errores a nivel de controlador.
- **Sistema de Respuestas:** Implementación de un sistema respuestas para mejorar la facilidad de uso.
- **Código Limpio y Estructurado:** Utilización de buenas prácticas de desarrollo.
- **Conexión a Múltiples Bases de Datos:** Soporte para MySQL, PostgreSQL, MSSQL, MongoDB, con conexiones listas para usar.
- **ORM (Sequelize):** Utilización y configuración de Sequelize como ORM para facilitar la interacción con la capa de datos.
- **Tipado Fuerte en TypeScript:** Implementación de tipado fuerte de los objetos de la aplicación para facilitar el desarrollo a largo plazo.
- **Patrón de Loaders:** Utilización del patrón de Loaders para la configuración de la aplicación.

## Instalación

Para utilizar esta plantilla, simplemente clona este repositorio:

```bash
git clone https://github.com/DiegoCL311/node-template.git

```

Instala las dependencias
```bash
cd node-template
npm install
```

Levanta el proyecto en modo desarrollo:
```bash
npm run dev
```

Levanta el proyecto en modo producción:
```bash
npm run production
```

## Docker

Levanta el proyecto utilizando Docker
```bash
docker-compose up
```
#### Listo, ahora solo falta implementar la lógica de tu negocio, algunos de tus requisitos no funcionales están resueltos :) 
