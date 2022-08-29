document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("");
    const logo = document.getElementById("logo");
    const registrarse = document.getElementsByClassName("Register");
    const imgI = document.getElementById("imgI");
    const imgD = document.getElementById("imgD");
});

imgI.addEventListener("click", () => {
    window.location.replace("https://campus.ort.edu.ar/");
});

imgD.addEventListener("click", () => {
    window.location.replace("https://campus.ort.edu.ar/secundaria/belgrano/tic");
});

logo.addEventListener("click", () => {
    window.location.replace("index.html");
});

function cambiar() {
    registrarse.style.display = "flex";
}