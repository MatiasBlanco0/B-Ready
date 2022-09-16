document.addEventListener("DOMContentLoaded", () => {
    const fecha = new Date();
    let diaClickeado;
    const fondo = document.getElementById("fondoNegro");    


    const renderCalendario = () => {
        fecha.setDate(1);

        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const diasMes = document.querySelector(".dias");
        const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
        const primerDiaIndex = fecha.getDay();
        const ultimoDiaPrevio = new Date(fecha.getFullYear(), fecha.getMonth(), 0).getDate();
        const ultimoDiaIndex = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDay();

        let dias = "";
        const proximosDias = 7 - ultimoDiaIndex - 1; //medio bugeado

        document.querySelector(".fecha h1").innerHTML = meses[fecha.getMonth()];
        document.querySelector(".fecha p").innerHTML = fecha.toLocaleDateString("es-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        for (let x = primerDiaIndex; x > 0; x--) {
            dias += `<div class="fecha-prev">${ultimoDiaPrevio - x + 1}</div>`;
        }

        for (let i = 1; i <= ultimoDia; i++) {
            if (i === new Date().getDate() && fecha.getMonth() === new Date().getMonth()) {
                dias += `<div class="hoy" id="` + i + `">${i}</div>`;
            }
            else {
                dias += `<div id="` + i + `">${i}</div>`;
            }
        }

        for (let j = 1; j <= proximosDias; j++) {
            dias += `<div class="fecha-next">${j}</div>`;
            diasMes.innerHTML = dias;
        }
        console.log(new Date(fecha.getFullYear(), fecha.getMonth(), 0));
    };
     const tareas = document.querySelector("#lista");
     let tareasAgregar = "";

    document.querySelector(".prev").addEventListener("click", () => {
        fecha.setMonth(fecha.getMonth() - 1);
        renderCalendario();
    });

    document.querySelector(".next").addEventListener("click", () => {
        fecha.setMonth(fecha.getMonth() + 1);
        renderCalendario();
    });

    renderCalendario();

    document.querySelector(".slider").addEventListener("input", () => {
        document.getElementById("valor").innerHTML = "Dificultad: " + document.querySelector(".slider").value;
    });

    document.querySelector(".dias").addEventListener("click", (evento) => {
        if (!evento.target.classList.contains("fecha-next") && !evento.target.classList.contains("fecha-prev")) {
            document.getElementById("tarea").style.display = "flex";
            diaClickeado = evento.target.id + " " + document.querySelector(".fecha h1").innerHTML + " " + document.querySelector(".fecha p").innerHTML.slice(-4);
        }
    });

    document.querySelector("#cruz").addEventListener("click", () => {
        document.getElementById("tarea").style.display = "none";
    });

    document.querySelector(".Agregar").addEventListener("click", () => {
        document.getElementById("formulario").style.display = "flex";
    });

    document.querySelector("#cancelar").addEventListener("click", () => {
        document.getElementById("formulario").style.display = "none";
    });

    document.querySelector("#fondoNegro").addEventListener("click", () => {
        if (document.getElementById("lista").style.display === "none") {
            document.getElementById("apertura").style.transform = "rotate(-90deg)";
            document.getElementById("lista").style.display = "flex";
        }
        else {
            document.getElementById("apertura").style.transform = "rotate(90deg)";
            document.getElementById("lista").style.display = "none";
        }
    });

    function checkNum(numero){
        const regEx = /^[1-9]\d*$/g;
        return regEx.test(numero);
    }

    document.querySelector("#ET").addEventListener("keydown", (evento) => {
        if(!checkNum(evento.key)){
            evento.preventDefault();
        }
    });
    document.querySelector("#EH").addEventListener("keydown", (evento) => {
        if(!checkNum(evento.key)){
            evento.preventDefault();
        }
    });

    //la idea es hacer un map para cada tarea recibida por el fetch una ves revisado que el usuario esta loggeado
    if("logeado === true"){
        //fetch de las tareas y que les va a pasar dependiendo sus parametros:
        if("tarea con tal dificultad se presenta"){
        tareasAgregar += `<div class="dificil"> <h4>Lengua</h4><br><h5>Leer el Martin Fierro</h5><br><h6>7 Ejercicios para hacer hoy</h6><br><h6>Se entrega el 14/9/2023</h6></div>`;
        }
        if("tarea con dificultad media se presenta"){
            tareasAgregar += `<div class="medio"> <h4>Geografia</h4><br><h5>Abrir Google Maps</h5><br><h6>1 Ejercicios para hacer hoy</h6><br><h6>Se entrega el 28/9/2023</h6></div>`;
        }
        if("tarea con dificultad facil se presenta"){
            tareasAgregar += `<div class="facil"> <h4>Fisica</h4><br><h5>Terminar la guia</h5><br><h6>4 Ejercicios para hacer hoy</h6><br><h6>Se entrega el 30/9/2023</h6></div>`;
        }
        tareas.innerHTML = tareasAgregar;
    }
    fondo.click();
});
