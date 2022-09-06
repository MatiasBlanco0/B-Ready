const fecha = new Date();
//fecha.setMonth(5);
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diasMes = document.querySelector(".dias");
const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth(), + 1, 0);

let dias = "";

document.querySelector(".fecha h1").innerHTML = meses[fecha.getMonth()];
document.querySelector(".fecha p").innerHTML = fecha.toLocaleDateString("es-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

for(let i = 1; i <= 31; i++){
    dias += `<div>${i}</div>`;
    diasMes.innerHTML = dias; //esto cambia el look, te hace sacar los dias en el html
}

console.log(ultimoDia);