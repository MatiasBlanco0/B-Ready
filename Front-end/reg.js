document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("");
    const logo = document.getElementById("logo");
    const registrarse = document.getElementsByClassName("Register");
    const imgI = document.getElementById("imgI");
    const imgD = document.getElementById("imgD");
    const email = document.getElementById("mail");
    const contrasenia = document.getElementById("contraseña"); 
    const contraseniaConfirm = document.getElementById("conC");
    const nombreUsuario = document.getElementById("nombre"); 
    const enviarReg = document.getElementById("enviarReg");
    const condicion1 = document.getElementById("condicion1");
    const condicion2 = document.getElementById("condicion2");
    const error = document.getElementById("errores");

    imgI.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/");
    });
    
    imgD.addEventListener("click", () => {
        window.location.replace("https://campus.ort.edu.ar/secundaria/belgrano/tic");
    });
    
    logo.addEventListener("click", () => {
        window.location.replace("index.html");
    });
    
    function checkEmail(mailIngresado) {
        const checker = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        return checker.test(mailIngresado);
    }
    
    enviarReg.addEventListener("click", () => {
        if (nombreUsuario.value == "" || contrasenia.value == "" || email.value == "" || contraseniaConfirm.value == ""){
            //faltan confirmar parametros
            console.log("si");
            error.classList.add("mostrar");
            error.value = "no flaco";
        }
        else if(checkEmail(email.value) == false){
            //el email no es correcto
        }
        else if(contraseniaConfirm.value != contrasenia.value){
            //las contraseñas no coinciden
        }
    });

    contrasenia.addEventListener("focus", () => {
        let tieneMayus = false;
        let tieneNum = false;
        if(contrasenia.value.length >= 5){
            condicion1.style.color = "green";
        }
        else{
            condicion1.style.color = "red";
        }

        for(let i = 0; i < contrasenia.value.length; i++){
            if(contrasenia.value[i].toUpperCase() === contrasenia.value[i]){
                tieneMayus = true;
                break;
            }
            
        }

        for(let i = 0; i < contrasenia.value.length; i++){
            if(!isNaN(contrasenia.value[i])){
                tieneNum = true;
                break;
            }
        }

        if(tieneMayus == true && tieneNum == true){
            condicion2.style.color = "green";
        }
        else{
            condicion2.style.color = "red";
        }
    });
});