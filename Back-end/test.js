document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8080/assignments", {
        method: "post",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            // nombre: "Juancito", email: "juan@gmail.com", contrasenia: "Juanprogamer10"
            // nombre: "Nahuel_P", email: "nahuelPer@gmail.com", contrasenia: "Nahuelsinho7"
            //id: 1,
            email: "nahuelPer@gmail.com",
            //duenio: "juan@gmail.com",
            nombre: "Nahuel_P",
            contrasenia: "Nahuelsinho7"
        })
    })
        .catch(err => {
            console.log("Error: ");
            console.log(err);
        })
        .then(response => {
            console.table(response);
            if (response.ok === true) {
                response.json();
            }
        })
        .then(data => {
            console.log("Datos: ");
            console.log(data);
        })
});