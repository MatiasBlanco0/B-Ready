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

    // if("digamos que estoy logeado"){
    //     document.querySelector(".Hyperlinks").style.display = "none";
    //     document.querySelector("#MenuIco").style.display = "flex"
    //     document.querySelector("#Menu").style.display = "flex";
    //     document.querySelector(".log").style.display = "block";
    //     document.querySelector(".log1").style.display = "block";
    //     document.querySelector(".deslog").style.display = "none";
    // }
    // else{
    //     document.querySelector(".log").style.display = "none";
    //     document.querySelector(".deslog").style.display = "block";
    // }
}); 

