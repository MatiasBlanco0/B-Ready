document.addEventListener("DOMContentLoaded", () => {
    //variables
    const visibilidad = document.getElementById("Visibilidad");
    const perfil = document.getElementById("Perfil");
    const privacidad = document.getElementById("Privacidad");
    const estilo = document.getElementById("Estilo");
    const ayuda = document.getElementById("Ayuda");
    const visibilidadO = document.getElementById("VisibilidadO");
    const perfilO = document.getElementById("PerfilO");
    const privacidadO = document.getElementById("PrivacidadO");
    const estiloO = document.getElementById("EstiloO");
    const ayudaO = document.getElementById("AyudaO");

    //foto perfil
    const BackgroundInput = document.getElementById("fondoInput");
    const profileBack = document.getElementById("editar");

    BackgroundInput.addEventListener("change", () => {
        profileBack.src = BackgroundInput.value;
        console.log(profileBack.src);
        console.log(BackgroundInput.value);
    });

    visibilidad.addEventListener("focus", () => {
        visibilidadO.style.display = "flex";
        perfilO.style.display = "none";
        privacidadO.style.display = "none";
        estiloO.style.display = "none";
        ayudaO.style.display = "none";
    });
    perfil.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "flex";
        privacidadO.style.display = "none";
        estiloO.style.display = "none";
        ayudaO.style.display = "none";
    });
    privacidad.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "none";
        privacidadO.style.display = "flex";
        estiloO.style.display = "none";
        ayudaO.style.display = "none";
    });
    estilo.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "none";
        privacidadO.style.display = "none";
        estiloO.style.display = "flex";
        ayudaO.style.display = "none";
    });
    ayuda.addEventListener("focus", () => {
        visibilidadO.style.display = "none";
        perfilO.style.display = "none";
        privacidadO.style.display = "none";
        estiloO.style.display = "none";
        ayudaO.style.display = "flex";
    });

    if ("chequea si la token de login existe usando un fetch") {
        perfil.focus();
        visibilidadO.style.display = "none";
    }
    else {
        perfil.style.display = "none";
        perfilO.style.display = "none"; s
        visibilidad.focus();
    }
});