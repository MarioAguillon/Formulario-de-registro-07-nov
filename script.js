document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. DECLARACIÓN DE VARIABLES Y ELEMENTOS DEL DOM =====
    const form = document.getElementById('formulario');
    const descripcionTextArea = document.getElementById('descripcion');
    const contadorElement = document.getElementById('contador');
    const btnEnviar = document.getElementById('btnEnviar');
    const btnBorrar = document.getElementById('btnBorrar');
    
    // Variables de la Barra de Progreso
    const barra = document.getElementById("barra"); 
    
    // LISTA ORIGINAL COMPLETA DE CAMPOS (usada para validación final)
    const campos = [ 
        "nombre", "apellido", "email", "edad", "nacimiento", "genero", 
        "pais", "descripcion", "terminos",
    ];

    // ¡NUEVA LISTA PARA EL PROGRESO! EXCLUYE 'terminos'
    const camposSoloProgreso = [ 
        "nombre", "apellido", "email", "edad", "nacimiento", "genero", 
        "pais", "descripcion",
    ];
    
    // Variables de Estilo
    const colorBordeNormal = '#555555'; 
    const colorError = '#FF4500'; 
    
    // Variable para el Contador de Caracteres
    const maxLen = descripcionTextArea ? descripcionTextArea.maxLength : 150;


// --------------------------------------------------------------------------
// --- FUNCIÓN DE ACTUALIZACIÓN DE PROGRESO (CORREGIDA) ---
// --------------------------------------------------------------------------

    function actualizarProgreso() {
        let completados = 0;
        // El total es ahora la longitud del array SIN el checkbox
        const total = camposSoloProgreso.length; 

        camposSoloProgreso.forEach((id) => {
            const campo = document.getElementById(id);
            if (!campo) return; 

            // Esta iteración solo revisa campos de texto, números, fechas y selects.
            if (campo.value && campo.value.trim() !== "") {
                completados++;
            }
        });

        // Calculamos el porcentaje solo con los campos que deben mover la barra
        const porcentaje = Math.round((completados / total) * 100);
        
        // Actualiza el ancho del div 'barra'
        if (barra) {
            barra.style.width = porcentaje + "%";
        }
    }


// --------------------------------------------------------------------------
// ===== 2. CONFIGURACIÓN DE EVENT LISTENERS =====
// --------------------------------------------------------------------------

    // a. Inicializar y actualizar contador de caracteres y progreso
    if (descripcionTextArea && contadorElement) {
        contadorElement.textContent = `0/${maxLen} caracteres`;
        descripcionTextArea.addEventListener('input', () => {
            contadorElement.textContent = `${descripcionTextArea.value.length}/${maxLen} caracteres`;
            
            // Lógica de color del contador
            if (descripcionTextArea.value.length >= maxLen * 0.9) {
                contadorElement.style.color = '#DC3545'; 
            } else {
                contadorElement.style.color = colorError; 
            }
            // ¡Actualiza la barra!
            actualizarProgreso();
        });
    }

    // b. Conectar solo los campos de 'camposSoloProgreso' a la función de progreso
    camposSoloProgreso.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            // 'input' para texto, 'change' para selects/checkboxes
            campo.addEventListener('input', actualizarProgreso);
            campo.addEventListener('change', actualizarProgreso);
        }
    });

    // c. Evento principal: Validar y descargar JSON
    btnEnviar.addEventListener('click', validarYDescargar);

    // d. Limpiar formulario y errores al borrar
    btnBorrar.addEventListener('click', () => {
        form.reset();
        document.querySelectorAll('.error').forEach(e => e.textContent = "");
        if (contadorElement) {
            contadorElement.textContent = `0/${maxLen} caracteres`;
            contadorElement.style.color = colorError; 
        }
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.style.border = `1px solid ${colorBordeNormal}`; 
        });
        
        // Resetear el progreso de la barra
        if (barra) {
            barra.style.width = "0%";
        }
    });

    // Llama a la función al cargar la página para inicializar la barra.
    actualizarProgreso(); 


// --------------------------------------------------------------------------
// --- FUNCIÓN PRINCIPAL DE VALIDACIÓN Y DESCARGA (SIN CAMBIOS) ---
// --------------------------------------------------------------------------

    // Helper para crear/obtener el elemento de error
    const getErrorElement = (idCampo) => {
        let errorElement = document.getElementById(`error-${idCampo}`);
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.className = 'error';
            errorElement.id = `error-${idCampo}`;
            errorElement.style.color = colorError; 
            errorElement.style.fontSize = '0.9rem'; 
            
            const inputElement = document.getElementById(idCampo);
            if (inputElement) {
                inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling); 
            } else if (idCampo === 'terminos') {
                document.querySelector('.campo-checkbox')?.appendChild(errorElement);
            }
        }
        return errorElement;
    };


    function validarYDescargar() {
        let valido = true;
        
        // 1. Limpiamos errores previos y restauramos bordes
        document.querySelectorAll('.error').forEach(e => e.textContent = "");
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.style.border = `1px solid ${colorBordeNormal}`; 
        });

        // 2. Validaciones (Múltiples validaciones)
        
        // Nombre
        const nombreInput = document.getElementById('nombre');
        if (nombreInput?.value.trim() === "") {
            getErrorElement('nombre').textContent = "El nombre es obligatorio.";
            nombreInput.style.border = `2px solid ${colorError}`; 
            valido = false;
        }

        // Apellido
        const apellidoInput = document.getElementById('apellido');
        if (apellidoInput?.value.trim() === "") {
            getErrorElement('apellido').textContent = "El apellido es obligatorio.";
            apellidoInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Email
        const emailInput = document.getElementById('email');
        const emailVal = emailInput?.value.trim();
        if (!emailVal || !emailVal.includes("@") || emailVal.length < 5) {
            getErrorElement('email').textContent = "Ingrese un correo válido.";
            emailInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }
        
        // Edad
        const edadInput = document.getElementById('edad');
        const edadVal = parseInt(edadInput?.value);
        if (!edadInput?.value || edadVal < 1 || edadVal > 120) {
            getErrorElement('edad').textContent = "Ingrese una edad válida (1 a 120).";
            edadInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Fecha de Nacimiento
        const nacimientoInput = document.getElementById('nacimiento');
        if (nacimientoInput?.value === "") {
            getErrorElement('nacimiento').textContent = "Seleccione una fecha.";
            nacimientoInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }
        
        // Género
        const generoInput = document.getElementById('genero');
        if (generoInput?.value === "") {
            getErrorElement('genero').textContent = "Seleccione un género.";
            generoInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }
        
        // País
        const paisInput = document.getElementById('pais');
        if (paisInput?.value.trim() === "") {
            getErrorElement('pais').textContent = "Ingrese un país.";
            paisInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Descripción
        const descripcionInput = document.getElementById('descripcion');
        if (descripcionInput?.value.trim() === "") {
            getErrorElement('descripcion').textContent = "Ingrese una descripción.";
            descripcionInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Términos (Este campo sigue siendo OBLIGATORIO para el envío, pero no para la barra)
        const terminosInput = document.getElementById('terminos');
        if (!terminosInput?.checked) {
            getErrorElement('terminos').textContent = "Debe aceptar los términos y condiciones.";
            valido = false;
        }


        // 3. Generar y descargar JSON si es válido
        if (valido) {
            const datos = {
                nombre: document.getElementById('nombre').value.toUpperCase(),
                apellido: document.getElementById('apellido').value.toUpperCase(),
                email: emailInput.value,
                edad: edadVal,
                nacimiento: nacimientoInput.value,
                genero: generoInput.value,
                pais: paisInput.value,
                descripcion: descripcionInput.value,
                terminos: terminosInput.checked,
                fechaRegistro: new Date().toISOString() 
            };

            const blob = new Blob([JSON.stringify(datos, null, 2)], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const fecha = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
            a.download = `registro_${fecha}_${datos.apellido}.json`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); 
            URL.revokeObjectURL(url);

            alert("✅ Formulario válido. Se ha generado y descargado el archivo JSON.");
        }
        
        return valido;
    }
});