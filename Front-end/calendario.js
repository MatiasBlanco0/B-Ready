const fecha = new Date();

const renderCalendario = () => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const diasMes = document.querySelector(".dias");
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    const primerDiaIndex = fecha.getDay();
    const ultimoDiaPrevio = new Date(fecha.getFullYear(), fecha.getMonth(), 0).getDate();
    const ultimoDiaIndex = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDay();

    let dias = "";
    const proximosDias = 7 - ultimoDiaIndex;

    document.querySelector(".fecha h1").innerHTML = meses[fecha.getMonth()];
    document.querySelector(".fecha p").innerHTML = fecha.toLocaleDateString("es-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    for (let x = primerDiaIndex; x > 0; x--) {
        dias += `<div class="fecha-prev">${ultimoDiaPrevio - x + 1}</div>`;
    }

    for (let i = 1; i <= ultimoDia; i++) {

        if (i === new Date().getDate() && fecha.getMonth() === new Date().getMonth()) {
            dias += `<div class="hoy">${i}</div>`;
        }
        else {
            dias += `<div>${i}</div>`;
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

document.querySelector(".dias").addEventListener("click", (evento) => {
    if(!evento.target.classList.contains("fecha-next") && !evento.target.classList.contains("fecha-prev")){
        //abrir cuadro de tarea
    }
});