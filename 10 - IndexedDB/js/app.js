// Campos del Formulario
let DB;

const mascotaInput = document.querySelector('#mascota');
const tipoInput = document.querySelector('#tipo');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// INterfaz del usuario (lo que ve)
const titulo = document.querySelector('#administra');
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(citas) {
        this.citas = [...this.citas, citas];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id)
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

}

class UI {
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    imprimirCitas(){

        this.limpiarHTML();

        const objectStore = DB.transaction('citas').objectStore('citas');

        objectStore.openCursor().onsuccess = function(e){
            
            const cursor = e.target.result;

            if(cursor){
                const {mascota,tipo,propietario,telefono,fecha,hora,sintomas,id} = cursor.value;
            
                const divCita = document.createElement('div');
                divCita.classList.add('cita','p-3');
                divCita.dataset.id = id;
    
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title','font-weight-bolder');
                mascotaParrafo.textContent = mascota;
    
                const tipoParrafo = document.createElement('p');
                tipoParrafo.innerHTML  = `
                    <span class="font-weight-bolder">Tipo: </span> ${tipo}
                `;
    
                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML  = `
                    <span class="font-weight-bolder">Propiertario: </span> ${propietario}
                `;
    
                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML  = `
                    <span class="font-weight-bolder">Telefono: </span> ${telefono}
                `;
    
                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML  = `
                    <span class="font-weight-bolder">Fecha: </span> ${fecha}
                `;
    
                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML  = `
                    <span class="font-weight-bolder">Hora: </span> ${hora}
                `;
    
                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML  = `
                    <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
                `;
    
                // Boton para eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn', 'btn-info', 'mr-2');
                btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> ';
    
    
                btnEliminar.onclick = () => eliminarCita(id);

                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);
    
                // Agregar parrafos al divCita
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(tipoParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);
    
                // Agregar cita al HTML
                contenedorCitas.appendChild(divCita);

                // Ve al siguiente elemento
                cursor.continue();
            }

        }
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild( contenedorCitas.firstChild)
        }
    }

}

const ui = new UI();
const administrarCitas = new Citas();

window.onload = () => {
    eventListeners();

    crearDB();


}

// Registro de eventos
function eventListeners(){
    mascotaInput.addEventListener('input',datosCitas);
    tipoInput.addEventListener('input',datosCitas);
    propietarioInput.addEventListener('input',datosCitas);
    telefonoInput.addEventListener('input',datosCitas);
    fechaInput.addEventListener('input',datosCitas);
    horaInput.addEventListener('input',datosCitas);
    sintomasInput.addEventListener('input',datosCitas);

    formulario.addEventListener('submit',nuevaCita);
}

// Objeto Principal
const citaObj = {
    mascota: '',
    tipo: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agregar los datos al objeto
function datosCitas(e){
    citaObj[e.target.name] = e.target.value;
}


// Agregar Cita
function nuevaCita(e){
    e.preventDefault();

    const {mascota,tipo,propietario,telefono,fecha,hora,sintomas} = citaObj;

    if(mascota === '' || tipo === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios','error');

        return;
    }

    if(editando){
        

        administrarCitas.editarCita({...citaObj});

        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            contenedorCitas.style.display = 'block';
            titulo.style.display = 'block';
            titulo.innerHTML = 'Administra tus Citas'
    
            editando = false;

            ui.imprimirAlerta('Actualizando...');
        }

        transaction.onerror = () => {
            console.log('Hubo un error')
        }



        


    } else {
        // Generar Id para el objeto cita
        citaObj.id = Date.now();

        administrarCitas.agregarCita({...citaObj});

        // Insertar Regidtro
        const transaction = DB.transaction(['citas'], 'readwrite');

        const objectStore = transaction.objectStore('citas');

        objectStore.add(citaObj);

        transaction.oncomplete = function() {
            ui.imprimirAlerta('Agregado...');
        }
    }

    

    reiniciarObjeto();

    formulario.reset();

    // Mostrar HTML
    ui.imprimirCitas();
}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.tipo = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';    
}

function eliminarCita(id){
    // Eliminar Cita
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    // Mensaje en Pantalla
    ui.imprimirAlerta('Eliminado...');

    transaction.oncomplete = () => {
        // Refrescar las citas
        ui.imprimirCitas();
    }
    
}

// Cargar modo edicion
function cargarEdicion(cita){
    const {mascota,tipo,propietario,telefono,fecha,hora,sintomas, id} = cita;

    //Llenar inputs
    mascotaInput.value = mascota;
    tipoInput.value = tipo;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.tipo = tipo;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;


    // Cambiar el texto del boton Agregar cita
    formulario.querySelector('button[type="submit"]').textContent = 'Confirmar Cambios';
    contenedorCitas.style.display = 'none';
    titulo.innerHTML = 'Modifica la Cita...';

    editando = true;

}

function crearDB() {
    // Creando base de datos en version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // Si hay error
    crearDB.onerror = function(){
        console.log('err')
    }

    // Si todo bien
    crearDB.onsuccess = function(){
        DB = crearDB.result;

        // Mostrar citas
        ui.imprimirCitas();
    }

    // Definir esquema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas',{
            keyPath: 'id',
            autoIncrement: true
        });

        objectStore.createIndex('mascota','mascota', {unique: false});
        objectStore.createIndex('tipo','tipo', {unique: false});
        objectStore.createIndex('propietario','propietario', {unique: false});
        objectStore.createIndex('telefono','mascota', {unique: false});
        objectStore.createIndex('fecha','fecha', {unique: false});
        objectStore.createIndex('hora','hora', {unique: false});
        objectStore.createIndex('sintomas','sintomas', {unique: false});
        objectStore.createIndex('id','id', {unique: true});

        console.log('DB crado y listo')

    }


}