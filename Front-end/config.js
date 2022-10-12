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
        document.getElementById("sectores").style.height = "100vh";
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

    dropdowns.forEach(DD => {
        DD.addEventListener("click", function handleClick(event) {
            if (DD.getAttribute("rotate") == null) {
                if (DD.style.transform == "rotate(180deg)") {
                    DD.style.transform = "rotate(0deg)";
                }
                else {
                    DD.style.transform = "rotate(180deg)";
                }
            }
        });
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

    if (accessToken == null) {
        if (refreshToken != null) {
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
                        location.reload();
                    }
                    else { //Error interno
                        window.location.replace("reg.html");
                    }
                })
                .catch(err => {
                    console.log("Error: ");
                    console.log(err);
                });
        }
    }

    variables.forEach(V => {
        V.addEventListener("change", () => {
            fetch("http://localhost:9000/style", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ({

                })
            })
        });
    })
});