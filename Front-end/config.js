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

});