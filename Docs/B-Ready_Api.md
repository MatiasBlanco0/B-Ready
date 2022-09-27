# B-Ready API

# Endpoints

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

Status 403: la token de acceso no era valida

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

Status 500: Error interno

# Referencias
- [Codigos de status de http](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- Requiere Autenticacion: Mandar la token de acceso en el header `Authorization` de forma, `Bearer <token>`