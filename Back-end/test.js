fetch("http://localhost:8080/getAssignments", {
    method: "get",
    body: new URLSearchParams({
        "email": "test@test.test"
    })
})
.then(response => response.json())
.then(data => console.log(data))