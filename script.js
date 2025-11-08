document.addEventListener('DOMContentLoaded', () => {
    // 1. Captura de elementos
    const form = document.getElementById('formulario');
    const descripcionTextArea = document.getElementById('descripcion');
    const contadorElement = document.getElementById('contador');
    const btnEnviar = document.getElementById('btnEnviar');
    const btnBorrar = document.getElementById('btnBorrar');

    // Colores basados en la paleta Naranja Neón y Oscuro
    // Usamos el color del borde normal (#555555) y el color de error (#FF4500)
    const colorBordeNormal = '#555555'; // Borde oscuro de los inputs en el CSS
    const colorError = '#FF4500';      // Naranja Neón (para el borde de error)
    
    // Inicializar y actualizar contador de caracteres
    const maxLen = descripcionTextArea ? descripcionTextArea.maxLength : 150;
    if (descripcionTextArea && contadorElement) {
        contadorElement.textContent = `0/${maxLen} caracteres`;
        descripcionTextArea.addEventListener('input', () => {
            contadorElement.textContent = `${descripcionTextArea.value.length}/${maxLen} caracteres`;
            
            // Opcional: Cambia el color si se acerca al límite (manteniendo el estilo neón)
            if (descripcionTextArea.value.length >= maxLen * 0.9) {
                contadorElement.style.color = '#DC3545'; // Rojo estándar para advertencia
            } else {
                contadorElement.style.color = colorError; // Naranja Neón
            }
        });
    }

    // 2. Evento principal: Validar y descargar JSON
    btnEnviar.addEventListener('click', validarYDescargar);

    // 3. Limpiar formulario y errores al borrar
    btnBorrar.addEventListener('click', () => {
        form.reset();
        document.querySelectorAll('.error').forEach(e => e.textContent = "");
        if (contadorElement) {
            contadorElement.textContent = `0/${maxLen} caracteres`;
            contadorElement.style.color = colorError; // Asegurar el color neón inicial
        }
        // Restaurar bordes de inputs al color oscuro normal
        document.querySelectorAll('input, select, textarea').forEach(input => {
             input.style.border = `1px solid ${colorBordeNormal}`; // ¡Ajuste aquí!
        });
    });


    // --- FUNCIÓN PRINCIPAL DE VALIDACIÓN Y DESCARGA ---
    function validarYDescargar() {
        let valido = true;
        
        // Función para simplificar la obtención del elemento de error
        const getErrorElement = (idCampo) => {
            let errorElement = document.getElementById(`error-${idCampo}`);
            if (!errorElement) {
                errorElement = document.createElement('p');
                errorElement.className = 'error';
                errorElement.id = `error-${idCampo}`;
                errorElement.style.color = colorError; // Aplicar color Naranja Neón al texto de error
                errorElement.style.fontSize = '0.9rem'; // Estilo más legible
                
                const inputElement = document.getElementById(idCampo);
                if (inputElement) {
                    // Insertar después del input, dentro del div.campo
                    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling); 
                } else if (idCampo === 'terminos') {
                    document.querySelector('.campo-checkbox').appendChild(errorElement);
                }
            }
            return errorElement;
        };

        // 1. Limpiamos errores previos y restauramos bordes
        document.querySelectorAll('.error').forEach(e => e.textContent = "");
        document.querySelectorAll('input, select, textarea').forEach(input => {
             input.style.border = `1px solid ${colorBordeNormal}`; // ¡Ajuste aquí!
        });

        // 2. Validaciones (El resto de las validaciones lógicas es correcto)
        
        // Nombre
        const nombreInput = document.getElementById('nombre');
        if (nombreInput.value.trim() === "") {
            getErrorElement('nombre').textContent = "El nombre es obligatorio.";
            nombreInput.style.border = `2px solid ${colorError}`; // Naranja Neón para error
            valido = false;
        }

        // Apellido
        const apellidoInput = document.getElementById('apellido');
        if (apellidoInput.value.trim() === "") {
            getErrorElement('apellido').textContent = "El apellido es obligatorio.";
            apellidoInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Email
        const emailInput = document.getElementById('email');
        const emailVal = emailInput.value.trim();
        if (emailVal === "" || !emailVal.includes("@") || emailVal.length < 5) {
            getErrorElement('email').textContent = "Ingrese un correo válido.";
            emailInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }
        
        // Edad
        const edadInput = document.getElementById('edad');
        const edadVal = parseInt(edadInput.value);
        if (edadInput.value === "" || edadVal < 1 || edadVal > 120) {
            getErrorElement('edad').textContent = "Ingrese una edad válida (1 a 120).";
            edadInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Fecha de Nacimiento
        const nacimientoInput = document.getElementById('nacimiento');
        if (nacimientoInput.value === "") {
            getErrorElement('nacimiento').textContent = "Seleccione una fecha.";
            nacimientoInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }
        
        // Género
        const generoInput = document.getElementById('genero');
        if (generoInput.value === "") {
            getErrorElement('genero').textContent = "Seleccione un género.";
            generoInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }
        
        // País
        const paisInput = document.getElementById('pais');
        if (paisInput.value.trim() === "") {
            getErrorElement('pais').textContent = "Ingrese un país.";
            paisInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Descripción (Se requiere para generar el JSON)
        const descripcionInput = document.getElementById('descripcion');
        if (descripcionInput.value.trim() === "") {
            getErrorElement('descripcion').textContent = "Ingrese una descripción.";
            descripcionInput.style.border = `2px solid ${colorError}`;
            valido = false;
        }

        // Términos
        const terminosInput = document.getElementById('terminos');
        if (!terminosInput.checked) {
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
                fechaRegistro: new Date().toISOString() // Agregamos una marca de tiempo
            };

            const blob = new Blob([JSON.stringify(datos, null, 2)], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            // Personaliza el nombre del archivo con un sello de tiempo para evitar que se sobrescriba
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