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

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE });
}

app.get("/hola", authenticateToken, (req, res) => {
    res.send(req.user);
});

app.post('/token', validateBody, (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    dbFunctions.tokenExists(req.body.email, refreshToken).then(result => {
        if (result === false) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ email: user.email });
            return res.json({ accessToken: accessToken });
        })
    })
});

app.delete('/logout', validateBody, (req, res) => {
    const email = req.body.email;
    dbFunctions.tokenExists(email, req.body.token).then(result => {
        if (result === false) return res.sendStatus(403);
        dbFunctions.updateToken(email, "").then(result => {
            if (result === true) {
                return res.sendStatus(204);
            }
            else {
                return result;
            }
        });
    });
});

app.post('/login', validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /login");
    const email = req.body.email;
    const password = req.body.contrasenia;
    if (email !== undefined || password !== undefined) {
        if (email !== "" || password !== "") {
            dbFunctions.logIn(email, password)
                .then(result => {
                    if (result === true) {
                        const payload = { email: email };
                        const accessToken = generateAccessToken(payload);
                        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
                        dbFunctions.updateToken(email, refreshToken).then(result => {
                            if (result === true) {
                                return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
                            }
                            else {
                                return res.json(errorToObj(result));
                            }
                        });
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
    const email = req.body.email;
    const password = req.body.contrasenia;
    const name = req.body.nombre;
    if (name !== undefined || email !== undefined || password !== undefined) {
        if (name !== "" || email !== "" || password !== "") {
            dbFunctions.register(name, email, password)
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

app.get('/assignments', authenticateToken, (req, res) => {
    console.log("\nRecibi una request POST en /assignments");
    dbFunctions.getAssignments(req.user.email)
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/assignmentInfo', authenticateToken, (req, res) => {
    console.log("\nRecibi una request POST en /assignmentInfo");
    const id = req.body.id;
    if (id !== undefined) {
        if (id !== "") {
            dbFunctions.getAssignmentInfo(id, req.user.email)
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

app.post('/addAssignment', authenticateToken, validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /addAssignment");
    dbFunctions.addAssignment(req.user.email, req.body.nombre, req.body.descripcion, req.body.ejercicios, req.body.ejerciciosHechos, req.body.materia, req.body.fecha, req.body.difficultad)
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.post('/addUser', authenticateToken, validateBody, (req, res) => {
    console.log("\nRecibi una request POST en /addUser");
    dbFunctions.addUserToAssignment(req.body.email, req.body.id, req.user.email)
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.delete('/delete', authenticateToken, validateBody, (req, res) => {
    console.log("\nRecibi una request DELETE en /delete");
    dbFunctions.deleteAssignment(req.body.id, req.user.email)
        .then(result => {
            res.json(errorToObj(result));
        });
});

app.put('/update', authenticateToken, validateBody, (req, res) => {
    console.log("\nRecibi una request PUT en /update");
    dbFunctions.updateDoneExercises(req.user.email, req.body.id, req.body.ejercicios)
        .then(result => {
            res.json(errorToObj(result));
        });
});

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));