fetch("http://localhost:8080/getAssignments", {
    method: "post",
    headers: {"Content Type": "application/json"},
    body: JSON.stringify({"email": "test@test.test"})
})
.then(response => console.table(response.json()))
.catch(err => console.log(err))
.then(data => console.table(data))