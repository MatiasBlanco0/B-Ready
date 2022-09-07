document.addEventListener("DOMContentLoaded", () =>{
    fetch("http://localhost:8080/assignments", {
        method: "post",
        mode: "cors",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            // nombre: "Juancito", email: "juan@gmail.com", contrasenia: "Juanprogamer10"
            // nombre: "Nahuel_P", email: "naguelPer@gmail.com", contrasenia: "Nahuelsinho7"
            id: 1,
            email: "juan@gmail.com",
            contrasenia: "juanprogamer"
        })
    })
    .catch(err => {
        console.log("Error: ");
        console.log(err);
    })
    .then(response => response.json())
    .then(data => {
        console.log("Datos: ");
        console.table(data);
    })
});