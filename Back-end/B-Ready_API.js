// Import modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbFunctions = require('./dbFunctions.js');
const jwt = require('jsonwebtoken');

// Priority weights
const w1 = 1;
const w2 = 1;
const w3 = 1;

// Create a new express application
const app = express();
const port = process.env.PORT || 9000;

const corsOptions = {
    credentials: true,
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:9000', 'http://127.0.0.1:9000']
};

app.use(cors(corsOptions));
app.use(express.json());

function validateBody(req, res, next) {
    if (Object.keys(req.body).length <= 0) {
        return res.status(400).json({ message: "Body was empty, Content-Type header didn't match the type of body or there was another error" });
    } else {
        next()
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
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
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE + 'm' });
}

app.get('/user', authenticateToken, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request GET en /user");
    res.send(req.user.email);
});

app.post('/token', validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request POST en /token");
    if (req.body.refreshToken === undefined) return res.sendStatus(401);
    const refreshToken = req.body.refreshToken.split(' ')[1];
    const email = req.body.email;
    if (refreshToken === undefined || email === undefined) return res.sendStatus(401);
    if (refreshToken === "" || refreshToken === "null" || email === "") return res.sendStatus(401);

    dbFunctions.tokenExists(email, refreshToken).then(result => {
        if (result === false) return res.sendStatus(403);
        if (result instanceof Error) {
            if (result.message.includes("is not a valid")) return res.status(400).json({ message: result.message })
            return res.sendStatus(500);
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ email: user.email });
            return res.json({ accessToken: accessToken });
        });
    });
});

app.delete('/logout', validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request DELETE en /logout");
    const email = req.body.email;
    dbFunctions.tokenExists(email, req.body.token).then(result => {
        if (result === false) return res.sendStatus(403);
        if (result instanceof Error) return res.sendStatus(500);

        dbFunctions.updateToken(email, "null").then(result => {
            if (result === true) return res.sendStatus(204)
            if (result instanceof Error) return res.status(400).json({ message: result.message });
            return res.sendStatus(500);
        });
    });
});

app.post('/login', validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request POST en /login");
    const email = req.body.email;
    const password = req.body.contrasenia;
    if (email === undefined || password === undefined) return res.status(400).json({ message: "Email or Contrasenia were undefined" });
    if (email === "" || password === "") return res.status(400).json({ message: "Email or Contrasenia were empty strings" });

    dbFunctions.logIn(email, password)
        .then(result => {
            if (result === false) return res.status(401).json({ message: "Wrong email or password" });
            if (result instanceof Error) {
                const message = result.message;
                if (message.includes("is not a valid")) return res.status(400).json({ message: message });
                return res.sendStatus(500);
            }

            const payload = { email: email };
            const accessToken = generateAccessToken(payload);
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
            dbFunctions.updateToken(email, refreshToken)
                .then(result => {
                    if (result === true) {
                        return res.json({ accessToken: accessToken, refreshToken: refreshToken });
                    }
                    return res.sendStatus(500);
                });
        });
});

app.post('/register', validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request POST en /register");
    const email = req.body.email;
    const password = req.body.contrasenia;
    const name = req.body.nombre;
    if (name === undefined || email === undefined || password === undefined) return res.status(400).json({ message: "Nombre, Email or Contrasenia were undefined" });
    if (name === "" || email === "" || password === "") return res.status(400).json({ message: "Nombre, Email or Contrasenia were empty strings" });

    dbFunctions.register(name, email, password)
        .then(result => {
            if (result === true) return res.sendStatus(201);
            if (result instanceof Error) {
                const message = result.message;
                if (message.includes("already is a user")) return res.status(400).json({ message: message });
                if (message.includes("is not a valid")) return res.status(400).json({ message: message });
            }
            return res.sendStatus(500);
        });
});

app.get('/assignments', authenticateToken, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request GET en /assignments");
    dbFunctions.getAssignments(req.user.email)
        .then(result => {
            if (result instanceof Error) return res.sendStatus(500);

            const assignments = result.map(assignment => {
                let newAssignment = {};
                let daysLeft = Math.floor((new Date(assignment.fechaentrega).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysLeft <= 0) daysLeft = 1;
                newAssignment.id = assignment.id;
                newAssignment.nombre = assignment.nombre;
                newAssignment.materia = assignment.materia;
                newAssignment.fechaEntrega = assignment.fechaentrega;
                newAssignment.ejHoy = Math.floor((assignment.cantej - assignment.cantejhechos) / daysLeft);
                newAssignment.dificultad = assignment.dificultad;
                newAssignment.prioridad = w1 * newAssignment.ejHoy - w2 * daysLeft + w3 * assignment.dificultad;
                return newAssignment;
            });
            return res.json(assignments.filter(assignment => assignment.ejHoy > 0));
        });
});

app.post('/assignmentsByDay', authenticateToken, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request POST en /assignmentsByDay");
    const date = req.body.fecha;
    if (date === undefined) return res.status(400).json({ message: "Date was undefined" });
    if (date === "") return res.status(400).json({ message: "Date was an empty string" });

    dbFunctions.getAssignmentsByDay(req.user.email, date)
        .then(result => {
            if (result instanceof Error) {
                if (result.message.includes("is not a valid")) return res.status(400).json({ message: result.message });
                return res.sendStatus(500);
            }
            return res.json(result);
        });
});

app.get('/assignment/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request GET en /assignment/" + id);
    if (isNaN(id)) return res.status(400).json({ message: "Id is not a number" });

    dbFunctions.getAssignmentInfo(id, req.user.email)
        .then(result => {
            if (result instanceof Error) {
                if (result.message.includes("is not a valid assignment id")) return res.status(400).json({ message: "Id is not a valid assignment id" });
                return res.sendStatus(500);
            }
            if (Object.keys(result).length === 0) return res.status(404).json({ message: "Assignment not found" });

            let assignment = {
                nombre: result[0].nombre,
                descripcion: result[0].descripcion,
                materia: result[0].materia,
                fechaEntrega: result[0].fechaentrega,
                ejercicios: result[0].cantej,
                ejerciciosHechos: result[0].cantejhechos,
                dificultad: result[0].dificultad,
                integrantes: []
            };
            result.forEach(obj => {
                assignment.integrantes.push(obj.email);
            });
            return res.json(assignment);
        });
});

app.post('/assignment', authenticateToken, validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request POST en /assignment");
    dbFunctions.addAssignment(req.user.email, req.body.nombre, req.body.descripcion, req.body.ejercicios, req.body.ejerciciosHechos, req.body.materia, req.body.fecha, req.body.dificultad)
        .then(result => {
            if (result === true) return res.sendStatus(201);
            if (result instanceof Error) {
                const message = result.message;
                if (message.includes("is not a valid")) return res.status(400).json({ message: message });
            }
            return res.sendStatus(500);
        });
});

app.post('/user', authenticateToken, validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request POST en /user");
    dbFunctions.addUserToAssignment(req.body.email, req.body.id, req.user.email)
        .then(result => {
            if (result === true) return res.sendStatus(201);
            if (result instanceof Error) {
                const message = result.message;
                if (message.includes("is not a valid")) return res.status(400).json({ message: message });
                if (message.includes("is not a user")) return res.status(400).json({ message: message });
                if (message.includes("is not the owner of the assignment")) return res.status(400).json({ message: message });
                if (message.includes("is already an owner of the assignment")) return res.status(400).json({ message: message });
            }
            return res.sendStatus(500);
        });
});

app.delete('/assignment/:id', authenticateToken, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request DELETE en /assignmet");
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "El id no era un numero" });
    dbFunctions.deleteAssignment(id, req.user.email)
        .then(result => {
            if (result === true) return res.sendStatus(204);
            if (result instanceof Error) {
                const message = result.message;
                if (message.includes("is not a valid")) return res.status(400).json({ message: message });
                if (message.includes("is not an owner of the assignment")) return res.status(400).json({ message: message });
            }
            return res.sendStatus(500);
        });
});

app.put('/assignment', authenticateToken, validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request PUT en /assignment");
    dbFunctions.updateDoneExercises(req.user.email, req.body.id, req.body.ejercicios)
        .then(result => {
            if (result === true) return res.sendStatus(201);
            if (result instanceof Error) {
                const message = result.message;
                if (message.includes("is not a valid")) return res.status(400).json({ message: message });
                if (message.includes("is not an owner of the assignment")) return res.status(400).json({ message: message });
            }
            return res.sendStatus(500);
        });
});

app.get('/style', authenticateToken, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request GET en /style");
    dbFunctions.getStyle(req.user.email)
        .then(result => {
            if (result instanceof Error) return res.sendStatus(500);
            if (result.length === 0) return res.sendStatus(404);
            return res.json(result[0]);
        });
});

app.put('/style', authenticateToken, validateBody, (req, res) => {
    console.log("\n" + (new Date(Date.now())).toISOString() + ": Recibi una request PUT en /style");
    dbFunctions.updateStyle(req.user.email, req.body.estilo)
        .then(result => {
            if (result instanceof Error) {
                if (result.message.includes("is not a valid")) return res.status(400).json({ message: result.message });
                return res.sendStatus(500);
            }
            return res.sendStatus(201);
        })
})

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));

// At the start of the day set trabajoHoy to 0
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        dbFunctions.sqlQuery('UPDATE tarea SET tarea.trabajoHoy = 0');
    }
}, 1000 * 60 * 60);