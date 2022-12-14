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
    let tareaID = "";
    const urlParams = new URLSearchParams(window.location.search);
    let accessToken = urlParams.get("at");
    let refreshToken = urlParams.get("rt");

    if (accessToken == null || refreshToken == null || accessToken === "" || refreshToken === "") {
        //window.location.replace("reg.html");
    }


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
        dificultadN = document.querySelector(".slider").value / 100 * 256 - 128;
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
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fecha: diaClickeado
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                    else if (response.status === 403) {
                        refreshAccess();
                    }
                    else { //errores 401, 400 y 500 
                        window.location.replace("index.html");
                    }
                })
                .then(data => {
                    tareasDiarias = "";
                    if (data.length !== 0) {
                        data.forEach((elem) => {
                            tareasDiarias += `<li class="displays" id="tarea-${elem.id}">${elem.nombre}</li>`;
                        })
                    }
                    else {
                        tareasDiarias = `<li>Aun no hay tareas ingresadas</li>`;
                    }
                    listaCosas.innerHTML = tareasDiarias;
                    const displays = document.querySelectorAll(".displays");
                    displays.forEach(D => {
                        D.addEventListener("click", (elemento) => {
                            document.querySelector(".info").style.display = "flex";
                            tareaID = elemento.target.id.split("-")[1];
                            fetch("http://localhost:9000/assignment/" + tareaID, {
                                method: "GET",
                                headers: {
                                    "Authorization": "Bearer " + accessToken
                                }
                            })
                                .then(response => {
                                    if (response.status === 200) {
                                        return response.json();
                                    }
                                    else if (response.status === 403) {
                                        refreshAccess();
                                    }
                                    else if (response.status === 401) {
                                        window.location.replace("reg.html");
                                    }
                                    else { // error interno, cuanod esto ocurra simplemente que el usuario vuelva a la pagina principal
                                        window.location.replace("index.html");
                                    }
                                })
                                .then(data => {
                                    document.querySelector(".Nombre").innerHTML = data.nombre;
                                    document.querySelector(".Materia").innerHTML = data.materia;
                                    document.querySelector(".Descripcion").innerHTML = data.descripcion;
                                    document.querySelector(".EjerciciosTotales").innerHTML = "Ejercicios: " + data.ejercicios;
                                    document.querySelector(".EjerciciosHechos").innerHTML = "Ejercicios hechos: " + data.ejerciciosHechos;
                                    document.querySelector(".Dificultad").innerHTML = "Dificultad: " + Math.floor((data.dificultad + 128) / 256 * 100);
                                    document.querySelector(".FechaEntrega").innerHTML = data.fechaEntrega.split('T')[0];
                                })

                            //eliminar tarea
                            document.querySelector(".Eliminar").addEventListener("click", (elemento) => {
                                fetch("http://localhost:9000/assignment/" + tareaID, {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": "Bearer " + accessToken
                                    }
                                })
                                    .then(response => {
                                        if (response.status === 204) {
                                            location.reload();
                                        }
                                        else if (response.status === 403) {
                                            refreshAccess();
                                        }
                                        else if (response.status === 401) {
                                            window.location.replace("reg.html");
                                        }
                                        else if (response.status === 400) {
                                            location.reload();
                                        }
                                        else { //error interno (500)
                                            window.location.replace("index.html");
                                        }
                                    })
                            })
                        });
                    })
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
        if (window.screen.width > 320) {
            if (lista.style.display === "none") {
                document.getElementById("apertura").style.transform = "rotate(-90deg)";
                lista.style.display = "flex";
            }
            else {
                document.getElementById("apertura").style.transform = "rotate(90deg)";
                lista.style.display = "none";
            }
        }
        else {
            if (lista.style.display === "none") {
                document.getElementById("apertura").style.transform = "rotate(0deg)";
                lista.style.display = "flex";
            }
            else {
                document.getElementById("apertura").style.transform = "rotate(180deg)";
                lista.style.display = "none";
            }
        }
    });

    enviar.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("http://localhost:9000/assignment", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "nombre": document.querySelector("#primerI").value,
                "descripcion": document.querySelector("#descripcion").value,
                "ejercicios": parseInt(document.querySelector("#ET").value),
                "ejerciciosHechos": parseInt(document.querySelector("#EH").value),
                "materia": document.querySelector("#NM").value,
                "dificultad": dificultadN,
                "fecha": diaClickeado
            })
        })
            .then(response => {
                if (response.status === 201) { //todo joya
                    location.reload();
                }
                else if (response.status === 400) { //error en campos
                    document.querySelector("#error").display = "flex";
                }
                else if (response.status === 403) { //autenticaci??n
                    refreshAccess(); //hace un refresh para que el codigo de la refresh token se ejecute
                }
                else { //error interno, etc
                    location.reload();
                }
            })
    });



    document.querySelector(".cancelar").addEventListener("click", () => {
        document.querySelector(".info").style.display = "none";
    })

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
        window.location.replace(`index.html?at=${accessToken}&rt=${refreshToken}`);
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

    const refreshAccess = () => {
        fetch("http://localhost:9000/token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "Bearer " + refreshToken
            })
        })
            .then(response => {
                if (response.status === 401 || response.status === 400) { //la refresh token es invalida
                    window.location.replace("reg.html");
                }
                else if (response.status === 403) { //la refresh token no es la correcta
                    window.location.replace("reg.html");
                }
                else if (response.status === 200) { //todo esta bien
                    return response.json();
                }
                else { //Error interno
                    window.location.replace("index.html");
                }
            })
            .then(data => {
                console.log(data);
                if (data) {
                    window.location.replace(`calendario.html?at=${data.accessToken}&rt=${refreshToken}`);
                }
            })
            .catch(err => {
                console.log("Error: ");
                console.log(err);
            });
    }

    if (accessToken == null) {
        if (refreshToken != null) {
            refreshAccess();
        }
        else {
            window.location.replace("index.html");
        }
    }
    else {
        fetch("http://localhost:9000/assignments", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                else if (response.status === 401) {
                    window.location.replace("reg.html");
                }
                else if (response.status === 403) {
                    refreshAccess();
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
                            tareasAgregar += `<div class="dificil" class="displays"> <h4>${tarea.nombre}</h4><h4>${tarea.materia}</h4><br><br><h6>${tarea.ejHoy} Ejercicios para hacer hoy</h6><br><h6>Fecha de entrega: ${tarea.fechaEntrega.split('T')[0]}</h6><div class="botonesT"><button class="completar" id="agenda-${tarea.id}">Completado</button></div></div>`;
                        }
                        else if (tarea.dificultad >= -43 && tarea.dificultad < 42) {
                            tareasAgregar += `<div class="medio" class="displays"> <h4>${tarea.nombre}</h4><h4>${tarea.materia}</h4><br><br><h6>${tarea.ejHoy} Ejercicios para hacer hoy</h6><br><h6>Fecha de entrega: ${tarea.fechaEntrega.split('T')[0]}</h6><div class="botonesT"><button class="completar" id="agenda-${tarea.id}">Completado</button></div></div>`;
                        }
                        else {
                            tareasAgregar += `<div class="facil" class="displays"> <h4>${tarea.nombre}</h4><h4>${tarea.materia}</h4><br><br><h6>${tarea.ejHoy} Ejercicios para hacer hoy</h6><br><h6>Fecha de entrega: ${tarea.fechaEntrega.split('T')[0]}</h6><div class="botonesT"><button class="completar" id="agenda-${tarea.id}">Completado</button></div></div>`;
                        }
                    });
                    tareas.innerHTML = tareasAgregar;
                }
                completar = document.querySelectorAll(".completar");
                let ejerciciosCompletados;
                let parent;
                completar.forEach(C => {
                    C.addEventListener("click", (elemento) => {
                        let padre = (C.parentNode).parentNode;
                        ejerciciosCompletados = (padre.childNodes[5].innerText.split(" ")[0]);
                        parent = elemento.target.id.split('-')[1];
                        console.log(padre);
                        completado(parent, ejerciciosCompletados);
                    })
                })

            })
            .catch(err => {
                console.log("Error: ");
                console.log(err);
            });
    }

    var r = document.querySelector(':root');
    //estilo de la pagina >:)
    fetch("http://localhost:9000/style", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.status === 200) { //recive un estilo con exito
                return response.json();
            }
            //no hay un else dado que si no recibe un estilo el default deberia aplicarse solo
        })
        .then(data => {
            console.log(data.estilo);
            if (data.estilo === "Oscuro-Default") {//si es null o literalmente default
                r.style.setProperty("--color-principal", "#083163");
                r.style.setProperty("--color-body", "#4C7AAF");
                r.style.setProperty("--color-seccion", "#8AA2BD");
                r.style.setProperty("--color-hoy", "#5c76a7");
            }
            else if (data.estilo === "Claro-Protanopia") {
                r.style.setProperty("--color-principal", "#890BD4");
                r.style.setProperty("--color-body", "#EBE300");
                r.style.setProperty("--color-seccion", "#d68fff");
                r.style.setProperty("--color-hoy", "#b251c7");
                r.style.setProperty("--color-tarea", "#a270d3");
            }
            else if (data.estilo === "Oscuro-Protanopia") {
                r.style.setProperty("--color-principal", "#370555");
                r.style.setProperty("--color-body", "#AAD500");
                r.style.setProperty("--color-seccion", "#7B3AA1");
                r.style.setProperty("--color-hoy", "#5f0d7c");
                r.style.setProperty("--color-tarea", "#640cad");
            }
            else if (data.estilo === "Claro-Deuteranopia") {
                r.style.setProperty("--color-principal", "#0B43D4");
                r.style.setProperty("--color-body", "#EBE300");
                r.style.setProperty("--color-seccion", "#4D75DB");
                r.style.setProperty("--color-hoy", "#0c3d99");
                r.style.setProperty("--color-tarea", "#0f18b7");
            }
            else if (data.estilo === "Oscuro-Deuteranopia") {
                r.style.setProperty("--color-principal", "#072163");
                r.style.setProperty("--color-body", "#CC7800");
                r.style.setProperty("--color-seccion", "#4161B0");
                r.style.setProperty("--color-hoy", "#19366e");
                r.style.setProperty("--color-tarea", "#063a7a");
            }
            else if (data.estilo === "Claro-Tritanopia") {
                r.style.setProperty("--color-principal", "#05E0E6");
                r.style.setProperty("--color-body", " #EE0092");
                r.style.setProperty("--color-seccion", "#1FF8FF");
                r.style.setProperty("--color-hoy", "#21a2cf");
                r.style.setProperty("--color-tarea", "#41b9c9");
            }
            else if (data.estilo === "Oscuro-Tritanopia") {
                r.style.setProperty("--color-principal", "#007E81");
                r.style.setProperty("--color-body", "#A70066");
                r.style.setProperty("--color-seccion", "#2D9597");
                r.style.setProperty("--color-hoy", "#00605e");
                r.style.setProperty("--color-tarea", "#02505a");
            }
        })

    //ejercicios completados
    function completado(id, ejercicios) {
        fetch(`http://localhost:9000/assignment`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: parseInt(id),
                ejercicios: parseInt(ejercicios)
            })
        })
            .then(response => {
                if (response.status === 201) {
                    document.querySelector("#confetti").style.display = "flex";
                    setTimeout(festejo, 4000);
                    setTimeout(refrescar, 5000);
                }
                else if (response.status === 403) {
                    refreshAccess();
                }
                else if (response.status === 401) {
                    window.location.replace("reg.html");
                }
                else {//error interno
                    window.location.replace("index.html");
                }
            })
            .then(data => {
                console.log(data);
            })
    }

    function festejo(){
        document.querySelector("#confetti").style.display = "none";
    }

    function refrescar(){
        location.reload();
    }

    //confetti
    let canvas = document.getElementById('confetti');

    canvas.width = 640;
    canvas.height = 480;

    let ctx = canvas.getContext('2d');
    let pieces = [];
    let numberOfPieces = 50;
    let lastUpdateTime = Date.now();

    function randomColor() {
        let colors = ['#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function update() {
        let now = Date.now(),
            dt = now - lastUpdateTime;

        for (let i = pieces.length - 1; i >= 0; i--) {
            let p = pieces[i];

            if (p.y > canvas.height) {
                pieces.splice(i, 1);
                continue;
            }

            p.y += p.gravity * dt;
            p.rotation += p.rotationSpeed * dt;
        }


        while (pieces.length < numberOfPieces) {
            pieces.push(new Piece(Math.random() * canvas.width, -20));
        }

        lastUpdateTime = now;

        setTimeout(update, 1);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(function (p) {
            ctx.save();

            ctx.fillStyle = p.color;

            ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
            ctx.rotate(p.rotation);

            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    function Piece(x, y) {
        this.x = x;
        this.y = y;
        this.size = (Math.random() * 0.5 + 0.75) * 15;
        this.gravity = (Math.random() * 0.5 + 0.75) * 0.1;
        this.rotation = (Math.PI * 2) * Math.random();
        this.rotationSpeed = (Math.PI * 2) * (Math.random() - 0.5) * 0.001;
        this.color = randomColor();
    }

    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    update();
    draw();
});