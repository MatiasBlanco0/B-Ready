document.addEventListener("DOMContentLoaded", () => {
    const fecha = new Date();
    let diaClickeado;
    const fondo = document.getElementById("fondoNegro");
    const lista = document.getElementById("lista");
    const listaCosas = document.getElementById("listaCosas");
    const enviar = document.getElementById("Enviar");
    lista.style.display = "none";
    let dificultadN = 0;
    const mes = {
        "Enero": 1,
        "Febrero": 2,
        "Marzo": 3,
        "Abril": 4,
        "Mayo": 5,
        "Junio": 6,
        "Julio": 7,
        "Agosto": 8,
        "Septiembre": 9,
        "Octubre": 10,
        "Noviembre": 11,
        "Diciembre": 12,
    };


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
        dificultadN = (document.querySelector(".slider").value / 100) * 256 - 128;
    });

    let tareasDiarias = "";

    document.querySelector(".dias").addEventListener("click", (evento) => {
        if (!evento.target.classList.contains("fecha-next") && !evento.target.classList.contains("fecha-prev")) {
            let dia = evento.target.id;
            if (dia.length == 1) {
                dia = dia.padStart(2, "0");
            }

            document.getElementById("tarea").style.display = "flex";
            diaClickeado = document.querySelector(".fecha p").innerHTML.slice(-4) + "-" + mes[document.querySelector(".fecha h1").innerHTML] + "-" + dia; //no es un tema de que no ande, el tema es que cuando haces click en un dia te devuelve la fecha pero en si las tareas no tienen id creo (no se)

            fetch("http://localhost:9000/assignmentsByDay", {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fecha: diaClickeado
                })
            })
                .then(response => {
                    if(response.status === 200){
                        return response.json();
                    }
                    else if(response.status === 403){
                        location.reload();
                    }
                    else{ //errores 401, 400 y 500 
                        window.location.replace("index.html");
                    }
                })
                .then(data =>  {
                    if(data.length !== 0){
                        tareasDiarias += `<li class="displays">${data.nombre}</li>`; 
                    }
                    else{
                        tareasDiarias += `<li>Aun no hay tareas ingresadas</li>`;
                    }
                    listaCosas.innerHTML = tareasDiarias;
                })
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

    fondo.addEventListener("click", () => {
        if (lista.style.display === "none") {
            document.getElementById("apertura").style.transform = "rotate(-90deg)";
            lista.style.display = "flex";
        }
        else {
            document.getElementById("apertura").style.transform = "rotate(90deg)";
            lista.style.display = "none";
        }
    });

    enviar.addEventListener("click", () => {
        fetch("http://localhost:9000/assignment", {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "nombre": document.querySelector("#primerI"),
                "descripcion": document.querySelector("#descripcion"),
                "ejercicios": document.querySelector("#ET"),
                "ejerciciosHechos": document.querySelector("#EH"),
                "materia": document.querySelector("#NM"),
                "dificultad": dificultadN,
                "fecha": diaClickeado
            })
        })
            .then(response => {
                if(response.status === 201){ //todo joya
                    location.reload();
                }
                else if(response.status === 400){ //error en campos
                    document.querySelector("#error").display = "flex";
                }
                else if(response.status === 403){ //autenticación
                    location.reload(); //hace un refresh para que el codigo de la refresh token se ejecute
                }
                else{ //error interno, etc
                    location.reload();
                }
            })
    });

    function checkNum(numero) {
        const regEx = /^[1-9]\d*$/g;
        return regEx.test(numero);
    }

    document.querySelector("#ET").addEventListener("keydown", (evento) => {
        if (!checkNum(evento.key)) {
            evento.preventDefault();
        }
    });
    document.querySelector("#EH").addEventListener("keydown", (evento) => {
        if (!checkNum(evento.key)) {
            evento.preventDefault();
        }
    });

    //la idea es hacer un map para cada tarea recibida por el fetch una ves revisado que el usuario esta loggeado
    // if("logeado === true"){
    //     //fetch de las tareas y que les va a pasar dependiendo sus parametros:
    //     if("tarea con tal dificultad se presenta"){
    //     tareasAgregar += `<div class="dificil"> <h4>Lengua</h4><br><h5>Leer el Martin Fierro</h5><br><h6>7 Ejercicios para hacer hoy</h6><br><h6>Se entrega el 14/9/2023</h6></div>`;
    //     }
    //     if("tarea con dificultad media se presenta"){
    //         tareasAgregar += `<div class="medio"> <h4>Geografia</h4><br><h5>Abrir Google Maps</h5><br><h6>1 Ejercicios para hacer hoy</h6><br><h6>Se entrega el 28/9/2023</h6></div>`;
    //     }
    //     if("tarea con dificultad facil se presenta"){
    //         tareasAgregar += `<div class="facil"> <h4>Fisica</h4><br><h5>Terminar la guia</h5><br><h6>4 Ejercicios para hacer hoy</h6><br><h6>Se entrega el 30/9/2023</h6></div>`;
    //     }
    //     tareas.innerHTML = tareasAgregar;
    // }
    // else{
    //     document.getElementById("logeate").style.display = "flex";
    // }
    fondo.click();

    document.querySelector("#logo").addEventListener("click", () => {
        window.location.replace("index.html");
    });

    //momento copy paste >:)
    function BuscarCookie(nombre) {
        let cookie = document.cookie;
        let prefijo = nombre + "=";
        let inicio = cookie.indexOf("; " + prefijo);

        //check si el indexOf no encuentra nada
        if (inicio == -1) {
            inicio = cookie.indexOf(prefijo);
            //si no es igual a cero
            if (inicio != 0) {
                return null;
            }
        }
        else {
            inicio += 2;
            let fin = cookie.indexOf(";", inicio);
            if (fin == -1) {
                fin = cookie.length;
            }
        }
        //crea un substring desde que encuentra la cookie que se busca y sigue hasta el final
        return decodeURI(cookie.substring(inicio + prefijo.length, fin)); //fijar si la cookie viene codificada y es necesario el decodeURI
    }

    let accessToken = BuscarCookie("BReadyAccessToken");
    let refreshToken = BuscarCookie("BReadyRefreshToken");

    if (accessToken == null) {
        if (refreshToken != null) {
            fetch("http://localhost:9000/token", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: refreshToken
                })
            })
                .then(response => {
                    if (response.status === 401 || response.status === 400) { //la refresh token es invalida
                        window.location.replace("index.html");
                    }
                    else if (response.status === 403) { //la refresh token no es la correcta
                        window.location.replace("index.html");
                    }
                    else if (response.status === 200) { //todo esta bien
                        location.reload();
                    }
                    else { //Error interno
                        window.location.replace("index.html");
                    }
                })
                .catch(err => {
                    console.log("Error: ");
                    console.log(err);
                });
        }
        else {
            //window.location.replace("index.html");
            console.log("elpepe");
        }
    }
    else {
        fetch("http://localhost:9000/assignments", {
            method: "GET",
            headers: {
                "Authorization": accessToken
            }
        })
            .then(response => { 
                if (response.status === 200) {
                    return response.json();
                }
                else { //error interno
                    location.reload();
                }
            })
            .then(data => {
                if (data.length === 0) {
                    tareas.innerHTML = `<h4>Terminaste todo, tomate un descanso</h4>`;
                }
                else {
                    data.sort((a, b) => { //ordena segun el resultado de las prioridades
                        b.prioridad - a.prioridad;
                    });
                    data.forEach(tarea => {
                        if (tarea.dificultad >= 42 && tarea.dificultad < 128) {//falta la descripcion
                            tareasAgregar += `<div class="dificil"> <h4>${tarea.nombre}</h4><h4>${tarea.materia}</h4><br><br><h6>${tarea.ejHoy} Ejercicios para hacer hoy</h6><br><h6>Fecha de entrega: ${tarea.fechaEntrega}</h6></div>`;
                        }
                        else if (tarea.dificultad >= -43 && tarea.dificultad < 42) {
                            tareasAgregar += `<div class="medio"> <h4>${tarea.nombre}</h4><h4>${tarea.materia}</h4><br><br><h6>${tarea.ejHoy} Ejercicios para hacer hoy</h6><br><h6>Fecha de entrega: ${tarea.fechaEntrega}</h6></div>`;
                        }
                        else {
                            tareasAgregar += `<div class="facil"> <h4>${tarea.nombre}</h4><h4>${tarea.materia}</h4><br><br><h6>${tarea.ejHoy} Ejercicios para hacer hoy</h6><br><h6>Fecha de entrega: ${tarea.fechaEntrega}</h6></div>`;
                        }
                    });
                    tareas.innerHTML = tareasAgregar;
                }
            })
            .catch(err => {
                console.log("Error: ");
                console.log(err);
            });
    }
});