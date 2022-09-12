document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    const imgI = document.getElementById("imgI");
    const imgD = document.getElementById("imgD");

    imgI.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/");
    });

    imgD.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/secundaria/belgrano/tic");
    });

    document.querySelector("#logB").addEventListener("click", () => {
        window.location.replace("file:///C:/Users/47297821/Documents/Proyectos%20Unity/B-Ready/Front-end/reg.html");
    });
});

