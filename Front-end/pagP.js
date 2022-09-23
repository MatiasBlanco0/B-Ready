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

    document.querySelector("#logB").addEventListener("click", () => {
        window.location.replace("file:///C:/Users/47297821/Documents/Proyectos%20Unity/B-Ready/Front-end/reg.html");
    });

    document.querySelector("#MenuIco").addEventListener("click", () => {
        if (!abierto) {
            Menu.style.top = "18.5%";
            Menu.style.transition = "1s";
            document.body.style.overflow = "hidden";
            document.getElementById("pagina").style.filter = "blur(2px)";
            abierto = true;
        }
        else {
            Menu.style.top = "-100%";
            Menu.style.transition = "1s";
            document.body.style.overflow = "scroll";
            abierto = false;
            document.getElementById("pagina").style.filter = "none";
        }
    });

    document.getElementById("pagina").addEventListener("click", () => {
        if (abierto) {
            Menu.style.top = "-100%";
            Menu.style.transition = "1s";
            document.body.style.overflow = "scroll";
            abierto = false;
            document.getElementById("pagina").style.filter = "none";
        }
    });
});

