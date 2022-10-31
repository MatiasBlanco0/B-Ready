document.addEventListener("DOMContentLoaded", () => {
    //variables
    const visibilidad = document.getElementById("Visibilidad");
    const perfil = document.getElementById("Perfil");
    const estilo = document.getElementById("Estilo");
    const ayuda = document.getElementById("Ayuda");
    const visibilidadO = document.getElementById("VisibilidadO");
    const perfilO = document.getElementById("PerfilO");
    const estiloO = document.getElementById("EstiloO");
    const ayudaO = document.getElementById("AyudaO");
    const dropdowns = document.querySelectorAll(".PD");
    const variables = document.querySelectorAll(".tipo");

    const urlParams = new URLSearchParams(window.location.search);
    let accessToken = urlParams.get("at");
    let refreshToken = urlParams.get("rt");

    document.querySelector("#logo").addEventListener("click", () => {
        window.location.replace("index.html");
    });

    visibilidad.addEventListener("focus", () => {
        visibilidadO.style.display = "flex";
        perfilO.style.display = "none";
        estiloO.style.display = "none";
        ayudaO.style.display = "none";
        document.getElementById("sectores").style.height = "100vh";
    });
    perfil.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "flex";
        estiloO.style.display = "none";
        ayudaO.style.display = "none";
        document.getElementById("sectores").style.height = "100vh";
    });
    estilo.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "none";
        estiloO.style.display = "flex";
        ayudaO.style.display = "none";
        document.getElementById("sectores").style.height = "200vh";
    });
    ayuda.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "none";
        estiloO.style.display = "none";
        ayudaO.style.display = "flex";
        document.getElementById("sectores").style.height = "125vh";
    });

    if ("chequea si la token de login existe usando un fetch") {
        perfil.focus();
        visibilidadO.style.display = "none";
    }
    else {
        perfil.style.display = "none";
        perfilO.style.display = "none";
        visibilidad.focus();
    }
    
    const lista = document.querySelectorAll("p.respuestas");
    dropdowns.forEach(DD => {
        DD.addEventListener("click", function handleClick(event) {
            if (DD.getAttribute("rotate") == null) {
                if (DD.style.transform == "rotate(180deg)") {
                    DD.style.transform = "rotate(0deg)";
                    lista.forEach(element => {
                        if(element === ((DD.parentNode).parentNode).lastElementChild){
                            element.style.display = "none";
                        }
                    });
                }//node parent, selectores de dom
                else {
                    DD.style.transform = "rotate(180deg)";
                    lista.forEach(element => {
                        if(element === ((DD.parentNode).parentNode).lastElementChild){
                            element.style.display = "flex";
                        }
                    });
                }
            }
        });
    });

    /* function BuscarCookie(nombre) {
        let cookie = document.cookie;
        let prefijo = nombre + "=";
        let inicio = cookie.indexOf("; " + prefijo);

        //check si el indexOf no encuentra nada
        if (inicio == -1) {
            inicio = cookie.indexOf(prefijo);
            //si no es igual a cero
            if (inicio != 0) {
                return null;
            }
        }
        else {
            inicio += 2;
            let fin = cookie.indexOf(";", inicio);
            if (fin == -1) {
                fin = cookie.length;
            }
        }
        //crea un substring desde que encuentra la cookie que se busca y sigue hasta el final
        return decodeURI(cookie.substring(inicio + prefijo.length, fin)); //fijar si la cookie viene codificada y es necesario el decodeURI
    }

    let accessToken = BuscarCookie("BReadyAccessToken");
    let refreshToken = BuscarCookie("BReadyRefreshToken"); */

    function refreshAccess() {
        fetch("http://localhost:9000/token", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: refreshToken
                })
            })
                .then(response => {
                    if (response.status === 401 || response.status === 400) { //la refresh token es invalida
                        window.location.replace("reg.html");
                    }
                    else if (response.status === 403) { //la refresh token no es la correcta
                        window.location.replace("reg.html");
                    }
                    else if (response.status === 200) { //todo esta bien
                        response.json();
                    }
                    else { //Error interno
                        window.location.replace("reg.html");
                    }
                })
                .then(data => {
                    if(data !== undefined){
                        if(data.accessToken !== undefined){
                            window.location.replace(`config.html?at=${data.accessToken}&rt=${refreshToken}`);
                        }
                    }
                })
                .catch(err => {
                    console.log("Error: ");
                    console.log(err);
                });
    }

    if (accessToken == null) {
        if (refreshToken != null) {
            refreshAccess();   
        }
    }

    let estiloSelected = "";
    let temaSelected = "";

    function activado(nombre) {
        var elemento = document.getElementsByName(nombre);
        console.log(nombre);

        for (i = 0; i < elemento.length; i++) {
            if (elemento[i].checked) {
                if (nombre == "Estilos") {
                    estiloSelected = elemento[i].value;
                }
                else if (nombre == "Tema") {
                    temaSelected = elemento[i].value;
                }
            }
        }
    }

    variables.forEach(V => {
        V.addEventListener("change", () => {
            activado(V.getAttribute("name"));
            if (temaSelected != "" && estiloSelected != "") {
                fetch("http://localhost:9000/style", {
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        estilo: temaSelected + "-" + estiloSelected
                    })
                })
                    .then(response => {
                        if(response.status === 201){ //se modifico el estilo correctamente
                            window.alert("Estilo cambiado con exito");
                        }
                        else if(response.status === 404){
                            // TODo: poner valores por default
                        }
                        else if (response.status === 403){
                            refreshAccess();
                        }
                        else{ //otros errores (revisar con blanco)

                        }
                    })
            }
        });
    })
});