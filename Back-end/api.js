// Import modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbFunctions = require('./dbFunctions.js');
const jwt = require('jsonwebtoken');

// Create a new express application
const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

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

function validateBody(req, res, next) {
    if (Object.keys(req.body).length <= 0) {
        return res.status(400).json({ message: "Body was empty, Content-Type header didn't match the type of body or there was another error" });
    } else {
        next()
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}

app.all('*', (req,res,next)=>{console.log("Hola"); next()})

app.post('/login', validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /login");
    if (req.body['email'] !== undefined || req.body['contrasenia'] !== undefined) {
        if (req.body['email'] !== "" || req.body['contrasenia'] !== "") {
            dbFunctions.logIn(req.body['email'], req.body['contrasenia'])
                .then(result => {
                    if (result === true) {
                        const payload = { email: req.body['email'] };
                        const accessToken = generateAccessToken(payload);
                        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
                        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
                    } else {
                        return res.json(errorToObj(result));
                    }
                });
        } else {
            return res.status(400).json({ message: "Email or Contrasenia were empty strings" });
        }
    } else {
        return res.status(400).json({ message: "Email or Contrasenia were undefined" });
    }
});

app.post('/register', validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /register");
    if (req.body['nombre'] !== undefined || req.body['email'] !== undefined || req.body['contrasenia'] !== undefined) {
        if (req.body['nombre'] !== "" || req.body['email'] !== "" || req.body['contrasenia'] !== "") {
            dbFunctions.register(req.body['nombre'], req.body['email'], req.body['contrasenia'])
                .then(result => {
                    return res.json(errorToObj(result));
                });
        } else {
            return res.status(400).json({ message: "Nombre, Email or Contrasenia were empty strings" });
        }
    } else {
        return res.status(400).json({ message: "Nombre, Email or Contrasenia were unefined" });
    }
});

// Tendria que ser GET
app.post('/assignments', (req, res) => {
    console.log("\nRecibi una request POST en /assignments");
    dbFunctions.getAssignments(req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/assignmentInfo', (req, res) => {
    console.log("\nRecibi una request POST en /assignmentInfo");
    if (req.body['id'] !== undefined) {
        if (req.body['id'] !== "") {
            dbFunctions.getAssignmentInfo(req.body['id'], req.body['email'], req.body['contrasenia'])
                .then(result => {
                    res.json(errorToObj(result));
                });
        } else {
            res.status(400).json({ message: "Id was an empty string" });
        }
    } else {
        res.status(400).json({ message: "Id was undefined" });
    }
});

app.post('/addAssignment', validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /addAssignment");
    dbFunctions.addAssignment(req.body['email'], req.body['contrasenia'], req.body['nombre'], req.body['descripcion'], req.body['ejercicios'], req.body['ejerciciosHechos'], req.body['materia'], req.body['fecha'], req.body['difficultad'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/addUser', validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /addUser");
    dbFunctions.addUserToAssignment(req.body['email'], req.body['id'], req.body['duenio'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.delete('/delete', validateBody, (req, res) => {
    console.log("\nRecibi una request DELETE en /delete");
    dbFunctions.deleteAssignment(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.put('/update', validateBody, (req, res) => {
    console.log("\nRecibi una request PUT en /update");
    dbFunctions.updateDoneExercises(req.body['email'], req.body['contrasenia'], req.body['id'], req.body['ejercicios'])
        .then(result => {
            res.json(errorToObj(result));
        });
});

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));