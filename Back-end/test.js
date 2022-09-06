document.addEventListener("DOMContentLoaded", () =>{
    fetch("http://localhost:8080/assignments", {
        method: "post",
        mode: "cors",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
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