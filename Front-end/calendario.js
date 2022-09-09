const fecha = new Date();
let diaClickeado;

const renderCalendario = () => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const diasMes = document.querySelector(".dias");
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    const primerDiaIndex = fecha.getDay();
    const ultimoDiaPrevio = new Date(fecha.getFullYear(), fecha.getMonth(), 0).getDate();
    const ultimoDiaIndex = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDay();

    let dias = "";
    const proximosDias = 7 - ultimoDiaIndex + 5; //medio bugeado

    document.querySelector(".fecha h1").innerHTML = meses[fecha.getMonth()];
    document.querySelector(".fecha p").innerHTML = fecha.toLocaleDateString("es-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    for (let x = primerDiaIndex; x > 0; x--) {
        dias += `<div class="fecha-prev">${ultimoDiaPrevio - x + 1}</div>`;
    }

    for (let i = 1; i <= ultimoDia; i++) {

        if (i === new Date().getDate() && fecha.getMonth() === new Date().getMonth()) {
            dias += `<div class="hoy" id="`+i+`">${i}</div>`;
        }
        else {
            dias += `<div id="`+i+`">${i}</div>`;
        }
    }

    for (let j = 1; j <= proximosDias; j++) {
        dias += `<div class="fecha-next">${j}</div>`;
        diasMes.innerHTML = dias;
    }
};

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
    if(!evento.target.classList.contains("fecha-next") && !evento.target.classList.contains("fecha-prev")){
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

document.querySelector("#apertura").addEventListener("click", () => {
    document.getElementById("apertura").style.transform = "rotate(-90deg)";
    document.getElementById("lista").style.display = "flex";
});