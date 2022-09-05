document.addEventListener("DOMContentLoaded", () =>{
    response = document.getElementById("response");
    error = document.getElementById("error");
    result = document.getElementById("result");

    fetch("http://localhost:8080/getAssignments", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"email": "test@test.test"})
    })
    .then(response => response.innerHTML = response.json())
    .catch(err => error.innerHTML = err)
    .then(data => result.innerHTML = data)
});