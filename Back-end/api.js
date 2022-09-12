// Import modules
const mysql = require('mysql');
const sha256 = require('js-sha256');
const express = require('express');
const cors = require('cors');
const dbFunctions = require('./dbFunctions.js');

// -------------------------------------------------------------------------------------------------------------------
// express
// -------------------------------------------------------------------------------------------------------------------

// Create a new express application
const app = express();
const port = process.env.PORT || 8080;

function errorToObj(error) {
    if (error instanceof Error) {
        return {message: error.toString()};
    }
    else {
        return error;
    } 
}

app.use(cors());
app.use(express.json());

app.all('*', (req, res, next) => {
    if (Object.keys(req.body).length <= 0) {
        res.json({ message: "Body was empty, Content-Type header didn't match the type of body or there was another error" });
    }
    next();
});

app.post('/login', (req, res) => {
    console.log("\nRecibi una request POST en /login");
    dbFunctions.logIn(req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/register', (req, res) => {
    console.log("\nRecibi una request POST en /register");
    dbFunctions.register(req.body['nombre'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/assignments', (req, res) => {
    console.log("\nRecibi una request POST en /assignments");
    dbFunctions.getAssignments(req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/assignmentInfo', (req, res) => {
    console.log("\nRecibi una request POST en /assignmentInfo");
    dbFunctions.getAssignmentInfo(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/addAssignment', (req, res) => {
    console.log("\nRecibi una request POST en /addAssignment");
    dbFunctions.addAssignment(req.body['email'], req.body['contrasenia'], req.body['nombre'], req.body['descripcion'], req.body['ejercicios'], req.body['ejerciciosHechos'], req.body['materia'], req.body['fecha'], req.body['difficultad'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/addUser', (req, res) => {
    console.log("\nRecibi una request POST en /addUser");
    dbFunctions.addUserToAssignment(req.body['email'], req.body['id'], req.body['duenio'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/delete', (req, res) => {
    console.log("\nRecibi una request POST en /delete");
    dbFunctions.deleteAssignment(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));