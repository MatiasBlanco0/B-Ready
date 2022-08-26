document.addEventListener("DOMContentLoaded", () => {
    const logB = document.getElementById("logB");
    const regB = document.getElementById("regB");
    const logo = document.getElementById("logo");

    logo.addEventListener("click", () => {
        window.location.replace("index.html");
    });
});