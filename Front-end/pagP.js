document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    const imgI = document.getElementById("imgI");
    const imgD = document.getElementById("imgD");
    let abierto = false;
    const Menu = document.getElementById("Menu");

    const urlParams = new URLSearchParams(window.location.search);
    let accessToken = urlParams.get("at");
    let refreshToken = urlParams.get("rt");
    let estilo = urlParams.get("estilo");

    document.querySelector('.log').href = `calendario.html?at=${accessToken}&rt=${refreshToken}$estilo=${estilo}`;
    document.querySelector('#configuracion').href = `config.html?at=${accessToken}&rt=${refreshToken}&estilo=${estilo}`;
    document.querySelector('#register').href = `calendario.html?at=${accessToken}&rt=${refreshToken}$estilo=${estilo}`;
    document.querySelector('#config').href = `config.html?at=${accessToken}&rt=${refreshToken}&estilo=${estilo}`;

    if (accessToken != null && accessToken != "null") {
        //cambios cuando uno se logea
        document.querySelector(".Hyperlinks").style.display = "none";
        document.querySelector("#MenuIco").style.display = "flex"
        document.querySelector("#Menu").style.display = "flex";
        document.querySelector(".log").style.display = "block";
        document.querySelector(".log1").style.display = "block";
        document.querySelector(".deslog").style.display = "none";

    }
    else {
        document.querySelector(".log").style.display = "none";
        document.querySelector(".log1").style.display = "none";
        document.querySelector(".deslog").style.display = "block";

        if (refreshToken != null && refreshToken != "null") {
            fetch("http://localhost:9000/token", {
                method: "POST",
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
                        location.reload();
                    }
                    else if (response.status === 403) { //la refresh token no es la correcta
                        location.reload();
                    }
                    else if (response.status === 200) { //todo esta bien
                        document.querySelector(".Hyperlinks").style.display = "none";
                        document.querySelector("#MenuIco").style.display = "flex"
                        document.querySelector("#Menu").style.display = "flex";
                        document.querySelector(".log").style.display = "block";
                        document.querySelector(".log1").style.display = "block";
                        document.querySelector(".deslog").style.display = "none";
                        return response.json();
                    }
                    else { //Error interno
                        location.reload();
                    }
                })
                .then(data => {
                    window.location.replace(`index.html?at=${data.accessToken}&rt=${refreshToken}$estilo=${estilo}`);
                })
                .catch(err => {
                    console.log("Error: ");
                    console.log(err);
                });
        }
    }

    imgI.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/");
    });

    imgD.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/secundaria/belgrano/tic");
    });

    document.querySelector("#MenuIco").addEventListener("click", () => {
        if (!abierto) {
            Menu.style.top = "100px";
            Menu.style.transition = "1s";
            document.body.style.overflow = "hidden";
            document.getElementById("pagina").style.filter = "blur(2px)";
            abierto = true;
        }
        else {
            Menu.style.top = "-100px";
            Menu.style.transition = "1s";
            document.body.style.overflow = "scroll";
            abierto = false;
            document.getElementById("pagina").style.filter = "none";
        }
    });

    document.getElementById("pagina").addEventListener("click", () => {
        if (abierto) {
            Menu.style.top = "-100px";
            Menu.style.transition = "1s";
            document.body.style.overflow = "scroll";
            abierto = false;
            document.getElementById("pagina").style.filter = "none";
        }
    });

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
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                }
                else if (data.estilo === "Claro-Protanopia") {
                    r.style.setProperty("--color-principal", "#890BD4");
                    r.style.setProperty("--color-body", "#EBE300");
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                    r.style.setProperty("--color-texto", "#000");
                    r.style.setProperty("--color-texto2", "FFFFFF");
                }
                else if (data.estilo === "Oscuro-Protanopia") {
                    r.style.setProperty("--color-principal", "#370555");
                    r.style.setProperty("--color-body", "#AAD500");
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                    r.style.setProperty("--color-texto", "#000");
                    r.style.setProperty("--color-texto2", "FFFFFF");
                }
                else if (data.estilo === "Claro-Deuteranopia") {
                    r.style.setProperty("--color-principal", "#0B43D4");
                    r.style.setProperty("--color-body", "#EBE300");
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                    r.style.setProperty("--color-texto", "#000");
                    r.style.setProperty("--color-texto2", "FFFFFF");
                }
                else if (data.estilo === "Oscuro-Deuteranopia") {
                    r.style.setProperty("--color-principal", "#0B43D4");
                    r.style.setProperty("--color-body", "#EBE300");
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                }
                else if (data.estilo === "Claro-Tritanopia") {
                    r.style.setProperty("--color-principal", "#05E0E6");
                    r.style.setProperty("--color-body", "#EE0092");
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                }
                else if (data.estilo === "Oscuro-Tritanopia") {
                    r.style.setProperty("--color-principal", "#007E81");
                    r.style.setProperty("--color-body", "#A70066");
                    r.style.setProperty("--color-seccion", "#FFFFFF");
                }
            })
    }
    else {
        console.log(estilo);
        if (estilo === "Oscuro-Default") {//si es null o literalmente default
            r.style.setProperty("--color-principal", "#083163");
            r.style.setProperty("--color-body", "#4C7AAF");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
        else if (estilo === "Claro-Protanopia") {
            r.style.setProperty("--color-principal", "#890BD4");
            r.style.setProperty("--color-body", "#EBE300");
            r.style.setProperty("--color-seccion", "#FFFFFF");
            r.style.setProperty("--color-texto", "#000");
            r.style.setProperty("--color-texto2", "FFFFFF");
        }
        else if (estilo === "Oscuro-Protanopia") {
            r.style.setProperty("--color-principal", "#370555");
            r.style.setProperty("--color-body", "#AAD500");
            r.style.setProperty("--color-seccion", "#FFFFFF");
            r.style.setProperty("--color-texto", "#000");
            r.style.setProperty("--color-texto2", "FFFFFF");
        }
        else if (estilo === "Claro-Deuteranopia") {
            r.style.setProperty("--color-principal", "#0B43D4");
            r.style.setProperty("--color-body", "#EBE300");
            r.style.setProperty("--color-seccion", "#FFFFFF");
            r.style.setProperty("--color-texto", "#000");
            r.style.setProperty("--color-texto2", "FFFFFF");
        }
        else if (estilo === "Oscuro-Deuteranopia") {
            r.style.setProperty("--color-principal", "#0B43D4");
            r.style.setProperty("--color-body", "#EBE300");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
        else if (estilo === "Claro-Tritanopia") {
            r.style.setProperty("--color-principal", "#05E0E6");
            r.style.setProperty("--color-body", "#EE0092");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
        else if (estilo === "Oscuro-Tritanopia") {
            r.style.setProperty("--color-principal", "#007E81");
            r.style.setProperty("--color-body", "#A70066");
            r.style.setProperty("--color-seccion", "#FFFFFF");
        }
    }
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
});

