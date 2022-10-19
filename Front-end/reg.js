document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    const registrarse = document.getElementById("Register");
    const login = document.getElementById("LogIn");
    const imgI = document.getElementById("imgI");
    const imgD = document.getElementById("imgD");
    const email = document.getElementById("mail");
    const contrasenia = document.getElementById("contraseña");
    const contraseniaConfirm = document.getElementById("conC");
    const nombreUsuario = document.getElementById("nombre");
    const enviarReg = document.getElementById("enviarReg");
    const condicion1 = document.getElementById("condicion1");
    const condicion2 = document.getElementById("condicion2");
    const error = document.getElementById("errores");
    const toggle = document.getElementById("TOGGLE");
    let pantalla = 0;
    let alerta = document.getElementById("alerta");
    let alertaT = document.getElementById("alertaT");

    //LA VARIABLE MAS IMPORTANTE :O
    let loggeado = false;
    
    imgI.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/");
    });

    imgD.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/secundaria/belgrano/tic");
    });

    logo.addEventListener("click", () => {
        window.location.replace("index.html");
    });

    function checkEmail(mailIngresado) {
        const checker = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; //preguntar con nacho para que pueda agarrar mails como el de ort
        return checker.test(mailIngresado);
    }

    //momento parse
    //function revisarURL(url) {
    //    var queryStart = url.indexOf("=") + 1,
    //        queryEnd = url.indexOf("#"),
    //}

    let parametros = new URLSearchParams(location.search);
    let gmail = parametros.get("mail");

    if (gmail !== null) {
        toggle.click();
        cambiar();
        email.value = gmail;
    }

    enviarReg.addEventListener("click", () => {
        if (nombreUsuario.value == "" || contrasenia.value == "" || email.value == "" || contraseniaConfirm.value == "") {
            document.getElementById("errores").style.display = "flex";
            error.textContent = "Falta completar algun campo";
        }
        else if (checkEmail(email.value) == false) {
            document.getElementById("errores").style.display = "flex";
            error.textContent = "Ingrese un email valido";
        }
        else if (contraseniaConfirm.value != contrasenia.value) {
            document.getElementById("errores").style.display = "flex";
            error.textContent = "Las contraseñas no coinciden";
        }
    });

    contrasenia.addEventListener("keydown", () => {
        let tieneMayus = false;
        let tieneNum = false;
        if (contrasenia.value.length >= 5) {
            condicion1.style.color = "green";
        }
        else {
            condicion1.style.color = "red";
        }

        for (let i = 0; i < contrasenia.value.length; i++) {
            if (contrasenia.value[i].toUpperCase() === contrasenia.value[i]) {
                tieneMayus = true;
                break;
            }

        }

        for (let i = 0; i < contrasenia.value.length; i++) {
            if (!isNaN(contrasenia.value[i])) {
                tieneNum = true;
                break;
            }
        }

        if (tieneMayus === true && tieneNum === true) {
            condicion2.style.color = "green";
        }
        else {
            condicion2.style.color = "red";
        }
    });

    toggle.addEventListener("click", cambiar);

    function cambiar() {
        if (pantalla == 0) {
            document.getElementById("Register").style.display = "block";
            document.getElementById("LogIn").style.display = "none";
            document.getElementById("HyperPol").style.display = "flex";
            document.getElementById("HyperReg").style.display = "none";
            pantalla = 1;
        }
        else {
            document.getElementById("LogIn").style.display = "block";
            document.getElementById("Register").style.display = "none";
            document.getElementById("HyperReg").style.display = "flex";
            document.getElementById("HyperPol").style.display = "none";
            pantalla = 0;
        }
    }

    //register
    enviarReg.addEventListener("click", () => {
        fetch("http://localhost:9000/register", {
            method: "post",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                contrasenia: contrasenia.value,
                nombre: nombreUsuario.value
            })
        })
            .then(response => {
                console.log(typeof response);
                console.log(response);
                if (response.status === 201) {
                    location.reload();
                }
                else if (response.status === 400) {
                    return response.json();
                }
                else if (response.status === 500) {
                    //error interno
                }
            })
            .then(data => {
                if (data !== undefined && data !== null) {
                    if (data.message.includes("already is a user")) {
                        alerta.style.display = "flex";
                        alertaT.innerHTML = "El usuario que se a intentado crear ya existe";
                    }
                    else if (data.message.includes("is not a valid")) {
                        alerta.style.display = "flex";
                        alertaT.innerHTML = "Algun campo ingresado no es texto, o valor valido";
                    }
                    else if (data.message.includes("were undefined")) {
                        alerta.style.display = "flex";
                        alertaT.innerHTML = "Algun campo es indefinido";
                    }
                    else if (data.message.includes("were empty strings")) {
                        alerta.style.display = "flex";
                        alertaT.innerHTML = "Algun campo esta vacio";
                    }
                    else {
                        alerta.style.display = "flex";
                        alertaT.innerHTML = "Error desconocido, porfavor intentarlo mas tarde";
                    }
                }
            })
            .catch(err => {
                console.log("Error: ");
                console.log(err);
                document.getElementById("alerta").style.display = "flex";
            });
    });

    document.querySelector("#cruz").addEventListener("click", () => {
        location.reload(true);
    });

    document.querySelector(".Enviar").addEventListener("click", () => {
        //logIn
        fetch("http://localhost:9000/login", {
            method: "post",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: document.querySelector("#iCorreo").value,
                contrasenia: document.querySelector("#iContrasenia").value
            })
        })
            .then(response => {
                console.log(typeof response);
                console.log(response);
                if (response.status === 200) {
                    window.location.replace("calendario.html");
                }
                else if (response.status === 401) {
                    document.getElementById("infoIncorrecta").style.display = "flex";
                }
                else if (response.status === 400) {
                    return response.json();
                }
                else {
                    //error interno probablemente
                }
            })
            .then(data => {
                console.log("Datos: ");
                console.log(data);
                if (data !== undefined && data !== null) {
                    if (data.message !== undefined) {
                        if (data.message.includes("is not a valid")) {
                            alerta.style.display = "flex";
                            alertaT.innerHTML = "Algun campo ingresado no es texto, o valor valido";
                        }
                        else if (data.message.includes("were undefined")) {
                            alerta.style.display = "flex";
                            alertaT.innerHTML = "Algun campo es indefinido";
                        }
                        else if (data.message.includes("were empty strings")) {
                            alerta.style.display = "flex";
                            alertaT.innerHTML = "Algun campo esta vacio";
                        }
                        else {
                            alerta.style.display = "flex";
                            alertaT.innerHTML = "Error desconocido, porfavor intentarlo mas tarde";
                        }
                    }
                }
            })
            .catch(err => {
                console.log("Error: ");
                console.log(err);
            });
    });
});