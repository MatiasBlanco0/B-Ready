// Import modules
const express = require('express');
const cors = require('cors');
const dbFunctions = require('./dbFunctions.js');

// Create a new express application
const app = express();
const port = process.env.PORT || 8080;

function errorToObj(error) {
    // If it is an error return an object with the message
    if (error instanceof Error) {
        return { message: error.toString() };
    }
    // If it is not an error return the valua
    else {
        return error;
    }
}

app.use(cors());
app.use(express.json());

app.all('*', (req, res, next) => {
    let emptyBody = Object.keys(req.body).length <= 0;
    let isEmpty = false;
    if (emptyBody) {
        res.json({ message: "Body was empty, Content-Type header didn't match the type of body or there was another error" });
    }
    for (const key in req.body) {
        if (req.body[key] === undefined || req.body[key] === "") {
            isEmpty = true;
        }
    }
    if (isEmpty) {
        res.json({ message: "Some key of the body was undefined or an empty string" });
    }
    if (!(emptyBody && isEmpty)) {
        next();
    }
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

app.post('/update', (req, res) => {
    console.log("\nRecibi una request POST en /update");
    dbFunctions.updateDoneExercises(req.body['email'], req.body['contrasenia'], req.body['id'], req.body['ejercicios'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));