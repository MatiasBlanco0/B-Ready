document.addEventListener("DOMContentLoaded", () =>{
    response = document.getElementById("response");
    error = document.getElementById("error");
    result = document.getElementById("result");

    fetch("http://localhost:8080/getAssignments", {
        method: "post",
        body: {"email": "test@test.test"}
    })
    .then(response => 
        console.log(response)
        )
    .catch(err => console.log(err))
});