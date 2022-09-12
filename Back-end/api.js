// Import modules
const mysql = require('mysql');
const sha256 = require('js-sha256');
const express = require('express');
const cors = require('cors');

// -------------------------------------------------------------------------------------------------------------------
// express
// -------------------------------------------------------------------------------------------------------------------

// Create a new express application
const app = express();
const port = process.env.PORT || 8080;

function errorToObj(error) {
    let errorObj = {};
    for (const key in error) {
        errorObj[key] = error[key];
    }
    return errorObj;
}

app.use(cors());
app.use(express.json());

app.all('*', (req, res, next) => {
    if (Object.keys(req.body).length <= 0) {
        res.json({ message: "Body was empty, Content-Type header didn't match the type of body or there was another error" });
    }
    next();
})

app.post('/login', (req, res) => {
    console.log("\nRecibi una request POST en /login");
    logIn(req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/register', (req, res) => {
    console.log("\nRecibi una request POST en /register");
    register(req.body['nombre'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/assignments', (req, res) => {
    console.log("\nRecibi una request POST en /assignments");
    getAssignments(req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/assignmentInfo', (req, res) => {
    console.log("\nRecibi una request POST en /assignmentInfo");
    getAssignmentInfo(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
})

app.post('/addAssignment', (req, res) => {
    console.log("\nRecibi una request POST en /addAssignment");
    addAssignment(req.body['email'], req.body['contrasenia'], req.body['nombre'], req.body['descripcion'], req.body['ejercicios'], req.body['ejerciciosHechos'], req.body['materia'], req.body['fecha'], req.body['difficultad'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/addUser', (req, res) => {
    console.log("\nRecibi una request POST en /addUser");
    addUserToAssignment(req.body['email'], req.body['id'], req.body['duenio'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/delete', (req, res) => {
    console.log("\nRecibi una request POST en /delete");
    deleteAssignment(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));