document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8080/assignments", {
        method: "post",
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        // nombre: "Juancito", email: "juan@gmail.com", contrasenia: "Juanprogamer10"
        // nombre: "Nahuel_P", email: "nahuelPer@gmail.com", contrasenia: "Nahuelsinho7"
        body: JSON.stringify({
            email: "nahuelPer@gmail.com",
            contrasenia: "Nahuelsinho7"
        })
    })
        .then(response => {
            console.log(typeof response);
            console.log(response);
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            console.log("Datos: ");
            console.log(data);
        })
        .catch(err => {
            console.log("Error: ");
            console.log(err);
        });
});