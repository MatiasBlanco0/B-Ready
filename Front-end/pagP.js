document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    const imgI = document.getElementById("imgI");
    const imgD = document.getElementById("imgD");
    let abierto = false;
    const Menu = document.getElementById("Menu");

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

    function BuscarCookie(nombre) {
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
    let refreshToken = BuscarCookie("BReadyRefreshToken");

    if (accessToken != null) {
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

        if (refreshToken != null) {
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
                    }
                    else { //Error interno
                        location.reload();
                    }
                })
                .catch(err => {
                    console.log("Error: ");
                    console.log(err);
                });
        }
    }
});

