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
    let estiloParam = urlParams.get("estilo");

    document.querySelector("#logo").addEventListener("click", () => {
        window.location.replace(`index.html?at=${accessToken}&rt=${refreshToken}&estilo=${estiloParam}`);
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
                        if (element === ((DD.parentNode).parentNode).lastElementChild) {
                            element.style.display = "none";
                        }
                    });
                }//node parent, selectores de dom
                else {
                    DD.style.transform = "rotate(180deg)";
                    lista.forEach(element => {
                        if (element === ((DD.parentNode).parentNode).lastElementChild) {
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
                    window.location.replace(`reg.html?estilo=${estiloParam}`);
                }
                else if (response.status === 403) { //la refresh token no es la correcta
                    window.location.replace(`reg.html?estilo=${estiloParam}`);
                }
                else if (response.status === 200) { //todo esta bien
                    response.json();
                }
                else { //Error interno
                    window.location.replace(`reg.html?estilo=${estiloParam}`);
                }
            })
            .then(data => {
                if (data !== undefined) {
                    if (data.accessToken !== undefined) {
                        window.location.replace(`config.html?at=${data.accessToken}&rt=${refreshToken}&estilo=${estiloParam}`);
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
    else {
        fetch("http://localhost:9000/style", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
            .then(response => {
                if (response.status === 200) { //agarro el estilo bien
                    return response.json();
                }
                else if (response.status === 403) {
                    refreshAccess();
                }
                else {
                    window.location.replace(`reg.html?estilo=${estiloParam}`);
                }
            })
            .then(data => {

            })
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
            if (temaSelected != "" && estiloSelected == "") {
                estiloSelected = "Default";
            }
            else if (estiloSelected != "" && temaSelected == "") {
                temaSelected = "Claro";
            }
            if (accessToken == null || accessToken == "null") {
                window.location.replace(`config.html?estilo=${temaSelected + '-' + estiloSelected}`);
            }
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
                    if (response.status === 201) { //se modifico el estilo correctamente
                        window.alert("Estilo cambiado con éxito, por favor refresque la página");
                    }
                    else if (response.status === 404) { //medio raro esto, en la documentacion de la api no figura un error 404
                        // TODo: poner valores por default
                    }
                    else if (response.status === 403) {
                        refreshAccess();
                    }
                    else { //otros errores (revisar con blanco)
                        location.reload();
                    }
                })
        });
    })

    let selectores = document.getElementsByClassName("selectores");
    let elementos = document.getElementsByTagName("*");
    var r = document.querySelector(':root');
    //estilo de la pagina >:)
    if (accessToken != null && accessToken != "null") {
        fetch("http://localhost:9000/style", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) { //recive un estilo con exito
                    return response.json();
                }
                //no hay un else dado que si no recibe un estilo el default deberia aplicarse solo
            })
            .then(data => {
                console.log(data.estilo);
                if (data.estilo === "Oscuro-Default") {//si es null o literalmente default
                    r.style.setProperty("--color-principal", "#083163");
                    r.style.setProperty("--color-body", "#4C7AAF");
                    r.style.setProperty("--color-generico", "#000000");
                    r.style.setProperty("--color-texto", "#ffff");
                }
                else if (data.estilo === "Claro-Protanopia") {
                    r.style.setProperty("--color-principal", "#890BD4");
                    r.style.setProperty("--color-body", "#EBE300");
                }
                else if (data.estilo === "Oscuro-Protanopia") {
                    r.style.setProperty("--color-principal", "#370555");
                    r.style.setProperty("--color-body", "#AAD500");
                    r.style.setProperty("--color-generico", "#000000");
                    r.style.setProperty("--color-texto", "#ffff");
                }
                else if (data.estilo === "Claro-Deuteranopia") {
                    r.style.setProperty("--color-principal", "#0B43D4");
                    r.style.setProperty("--color-body", "#EBE300");
                }
                else if (data.estilo === "Oscuro-Deuteranopia") {
                    r.style.setProperty("--color-principal", "#072163");
                    r.style.setProperty("--color-body", "#CC7800");
                    r.style.setProperty("--color-generico", "#000000");
                    r.style.setProperty("--color-texto", "#ffff");
                }
                else if (data.estilo === "Claro-Tritanopia") {
                    r.style.setProperty("--color-principal", "#05E0E6");
                    r.style.setProperty("--color-body", "#EE0092");
                }
                else if (data.estilo === "Oscuro-Tritanopia") {
                    r.style.setProperty("--color-principal", "#007E81");
                    r.style.setProperty("--color-body", "#A70066");
                    r.style.setProperty("--color-generico", "#000000");
                    r.style.setProperty("--color-texto", "#ffff");
                }
            })
    }
    else {
        console.log(estiloParam);
        if (estiloParam === "Oscuro-Default") {//si es null o literalmente default
            r.style.setProperty("--color-principal", "#083163");
            r.style.setProperty("--color-body", "#4C7AAF");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
        else if (estiloParam === "Claro-Protanopia") {
            r.style.setProperty("--color-principal", "#890BD4");
            r.style.setProperty("--color-body", "#EBE300");
            r.style.setProperty("--color-seccion", "#FFFFFF");
            r.style.setProperty("--color-texto", "#000");
            r.style.setProperty("--color-texto2", "FFFFFF");
        }
        else if (estiloParam === "Oscuro-Protanopia") {
            r.style.setProperty("--color-principal", "#370555");
            r.style.setProperty("--color-body", "#AAD500");
            r.style.setProperty("--color-seccion", "#FFFFFF");
            r.style.setProperty("--color-texto", "#000");
            r.style.setProperty("--color-texto2", "FFFFFF");
        }
        else if (estiloParam === "Claro-Deuteranopia") {
            r.style.setProperty("--color-principal", "#0B43D4");
            r.style.setProperty("--color-body", "#EBE300");
            r.style.setProperty("--color-seccion", "#FFFFFF");
            r.style.setProperty("--color-texto", "#000");
            r.style.setProperty("--color-texto2", "FFFFFF");
        }
        else if (estiloParam === "Oscuro-Deuteranopia") {
            r.style.setProperty("--color-principal", "#0B43D4");
            r.style.setProperty("--color-body", "#EBE300");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
        else if (estiloParam === "Claro-Tritanopia") {
            r.style.setProperty("--color-principal", "#05E0E6");
            r.style.setProperty("--color-body", "#EE0092");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
        else if (estiloParam === "Oscuro-Tritanopia") {
            r.style.setProperty("--color-principal", "#007E81");
            r.style.setProperty("--color-body", "#A70066");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
    }
});