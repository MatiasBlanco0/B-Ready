# B-Ready API

# Indice

- [B-Ready API](#b-ready-api)
- [Indice](#indice)
- [Usar la api en un nuevo dispositivo](#usar-la-api-en-un-nuevo-dispositivo)
  - [Crear la base de datos](#crear-la-base-de-datos)
  - [Instalar modulos de node](#instalar-modulos-de-node)
  - [Crear el archivo .env](#crear-el-archivo-env)
- [Endpoints](#endpoints)
  - [register](#register)
    - [**POST**:](#post)
  - [login](#login)
    - [**POST**:](#post-1)
  - [logout](#logout)
    - [**DELETE**:](#delete)
  - [token](#token)
    - [**POST**:](#post-2)
  - [assignments](#assignments)
    - [**GET**:](#get)
  - [assignmentsByDay](#assignmentsbyday)
    - [**POST**:](#post-3)
  - [assignment](#assignment)
    - [**GET**:](#get-1)
    - [**POST**:](#post-4)
    - [**PUT**:](#put)
    - [**DELETE**:](#delete-1)
  - [user](#user)
    - [**POST**:](#post-5)
  - [style](#style)
    - [**GET**:](#get-2)
    - [**PUT**:](#put-1)
- [Referencias](#referencias)

# Usar la api en un nuevo dispositivo

Para utilizar la api en un nuevo dispositivo, hay que crear la base de datos, instalar los modulos de node y crear el archivo .env.

## Crear la base de datos

Si tenes phpMyAdmin (http://localhost/phpMyAdmin), crear una nueva base de datos con el nombre `b-ready`. Mientras tenes seleccionada la base de datos que creaste recien, hacer click en la pestaña de importar y seleccionar el archivo b-ready.sql que esta en la carpeta de Back-end.

Si no tenes phpMyAdmin, pincho.

## Instalar modulos de node

Abrir la consola de powershell, cmd o la terminal de vs code en la carpeta de .../B-Ready/Back-end, ahi correr el siguiente comando `npm i`. Esto deberia descargar todas las dependencias del proyecto.

## Crear el archivo .env

Ir a la carpeta Back-end del repositorio y crear un archivo con el nombre `.env`, ahi poner las dos cosas que te pase por mensaje privado del campus y tambien poner `ACCESS_TOKEN_LIFE=15`.

# Endpoints

Un endpoint es el path que esta despues de la url. La url es la ip del servidor seguido por el puerto que usa la api (9000), ej: 127.0.0.1:1234. Si la computadora hostenado a la api quiere accederla, tiene que usar localhost o 127.0.0.1 como la ip

## register

### **POST**:

**Body**:
```json
{
    "email": <email>,
    "contrasenia": <contraseña>,
    "nombre": <nombre>
}
```
**Respuestas**:

Status 201: Registro exitoso

Status 400: problema con algun atributo del body, ver el mensaje enviado

Status 500: Error interno

## login

### **POST**: 

**Body**:
```json
{
    "email": <email>,
    "contrasenia": <contraseña>
}
```
**Respuestas**:

Status 200: Login exitoso, se envian las tokens de acceso y refrescado

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: Email o contrasenia incorrecta

Status 500: Error interno

## logout

### **DELETE**:

**Body**:
```json
{
    "email": <email>,
    "token": <token de refrescado>
}
```
**Respuestas**:

Status 204: Logout exitoso

Status 403: Acceso denegado, la token o el email son incorrectos

Status 400: problema con algun atributo del body, ver el mensaje enviado

Status 500: Error interno

## token

### **POST**:

**Body**:
```json
{
    "email": <email>,
    "token": <token de refrescado>
}
```
**Respuestas**:

Status 200: Refrescado exitoso, se envia una nueva token de acceso

Status 401: la token era undefined

Status 403: token o email incorrecto

Status 500: Error interno

## assignments

### **GET**:

Requiere Autenticacion

**Body**:

No tiene porque es GET

**Respuestas**:

Status 200: se envia un array de objetos de este formato
```json
{
    "id": <id>,
    "nombre": <nombre>,
    "materia": <materia>,
    "fechaEntrega": <fecha de entrega>,
    "ejHoy": <ejercicios de hoy de esta tarea>,
    "prioridad": <prioridad>
}
```
Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

## assignmentsByDay

### **POST**:

Rquiere Autenticacion

**Body**:
```json
  {
    "fecha": <fecha>
  }
```
**Respuestas**:

Status 200: se envia un array de objetos de este formato:
```json
  {
    "id":<id>,
    "nombre":<nombre>
  }
```
Status 400: Hubo un problema con alguno de los atributos de body, ver el mensaje enviado.

Status 401: No se paso la token de acceso en header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

## assignment

### **GET**:

Requiere Autenticacion

Agregar el id de la tarea en la url, `/assignment/<id>`

**Body**:

No tiene porque es GET

**Respuestas**:

Status 200: Devuelve un objeto con la informacion de la tarea,
```json
{
    "cantEj": <cantidad de ejercicios>,
    "cantEjHechos": <cantidad de ejercicios hechos>,
    "dificultad": <dificultad>,
    "descripcion": <descripcion>,
    "integrantes": [<integrantes>]
}
```

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 404: La tarea no existe

Status 500: Error interno

### **POST**:

Requiere Autenticacion

**Body**:
```json
{
    "nombre": <nombre>,
    "descripcion": <descripcion>,
    "ejercicios": <ejercicios>,
    "ejerciciosHechos": <ejercicios hechos>,
    "materia": <materia>,
    "fecha": <fecha de entrega>,
    "dificultad": <dificultad>
}
```
**Respuestas**:

Status 201: Se creo la tarea exitosamente

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

### **PUT**:

Requiere Autenticacion

**Body**:
```json
{
    "id": <id de la tarea>,
    "ejercicios": <ejercicios hechos>
}
```
**Respuestas**:

Status 201: Se actualizo la cantidad de ejercicios hechos exitosamente

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

### **DELETE**:

Requiere Autenticacion

**Body**:
```json
{
    "id": <id de la tarea>
}
```
**Respuestas**:

Status 204: Se borro la tarea exitosamente

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

## user

### **POST**:

Requiere Autenticacion

**Body**:
```json
{
    "email": <email>,
    "id": <id de la tarea>
}
```
**Respuestas**:

Status 201: Se agrego al usuario a la tarea exitosamente

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

## style

### **GET**:

Requiere Autenticacion

**Body**:

No tiene porque es GET

**Respuestas**:

Status 200: El string de estilo, "[Claro/Oscuro] [Protanopia/Deuteranopia/Tritanopia/Nada]"

Status 500: Error interno

### **PUT**:

Requiere Autenticacion

**Body**:
```json
{
    "estilo": <estilo ("[Claro/Oscuro] [Protanopia/Deuteranopia/Tritanopia/""]")>
}
```
**Respuestas**:

Status 201: Se modifico el estilo correctamente

Status 400: Problema con algun atributo del body, ver el mensaje enviado

Status 401: No se paso la token de acceso en el header de `Authorization`

Status 403: la token de acceso no era valida o expiro, refrescarla en [/token](#token)

Status 500: Error interno

# Referencias
- [Codigos de status de http](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- Requiere Autenticacion: Mandar la token de acceso en el header `Authorization` de forma, `Bearer <token>`, es decir `Authorization: Bearer <token>`