// variables
const email = document.querySelector('#email');
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');

const btnEnviar = document.querySelector('#enviar');
const formularioEnviar = document.querySelector('#enviar-mail');
const resetBtn = document.querySelector('#resetBtn');

eventListeners();

function eventListeners() {
     document.addEventListener('DOMContentLoaded', inicioApp);

     email.addEventListener('blur', validarFormulario);
     asunto.addEventListener('blur', validarFormulario);
     mensaje.addEventListener('blur', validarFormulario);

     formularioEnviar.addEventListener('submit', enviarEmail);

     resetBtn.addEventListener('click', resetFormulario);
}

function inicioApp() {
     btnEnviar.disabled = true;
     btnEnviar.classList.add('cursor-not-allowed', 'opacity-50')
}

function validarFormulario(e) {

     e.target.classList.remove('border-red-500');

     if (e.target.value.length > 0) {
          e.target.style.borderBottomColor = 'green';
     } else {
          e.target.style.borderBottomColor = 'red';
          e.target.classList.add('border', 'border-red-500');
     }

     if (this.type === 'email') {
          validarEmail(this);
     }

     if (email.value !== '' && asunto.value !== '' && mensaje.value !== '') {
          btnEnviar.disabled = false;
          btnEnviar.classList.remove('opacity-50');
          btnEnviar.classList.remove('cursor-not-allowed');
     }
}

function resetFormulario(e) {
     formularioEnviar.reset();
     e.preventDefault();
}

function enviarEmail(e) {

     e.preventDefault();

     const spinner = document.querySelector('#spinner');
     spinner.style.display = 'flex';

     const enviado = document.createElement('p');
     enviado.textContent = 'Mensaje Enviado Correctamente';
     enviado.classList.add('bg')

     setTimeout(() => {
          spinner.style.display = 'none';

          document.querySelector('#loaders').appendChild(enviado);

          setTimeout(() => {
               enviado.remove();
               formularioEnviar.reset();
          }, 5000);
     }, 3000);
     resetFormulario();
}

function validarEmail(campo) {
     const mensaje = campo.value;

     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

     if (re.test(mensaje.toLowerCase())) {
          campo.style.borderBottomColor = 'green';
          campo.classList.remove('error');
     } else {
          campo.style.borderBottomColor = 'red';
          campo.classList.add('error');
     }
}