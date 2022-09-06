document.addEventListener("DOMContentLoaded", () =>{
    response = document.getElementById("response");
    error = document.getElementById("error");
    result = document.getElementById("result");

    fetch("http://localhost:8080/getAssignments", {
        method: "post",
        mode: "cors",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"email": "test@test.test"})
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