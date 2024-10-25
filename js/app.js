//Codigo para enviar los datos a una hoja de excel usando sheetbest
const formulario = document.getElementById('formulario-registro');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Variables básicas del formulario
    const id = generarIdUnico();
    const fecha = document.getElementById('fecha').value;
    const nombre = document.getElementById('nombre').value;
    const boleta = document.getElementById('boleta').value;
    const materia = document.getElementById('materia').value;
    const profesor = document.getElementById('profesor').value;
    const mesaDeTrabajo = document.getElementById('mesa_trabajo').value;
    const carrera = document.getElementById('carrera').value; // Obtiene el valor seleccionado del campo carrera

    // Obtener la hora actual
    const hora = new Date().toLocaleTimeString();  // Obtener la hora actual en formato de 24 horas (ejemplo: "14:30:15")


    // Recopilar datos de equipos en un arreglo, cada elemento será una línea en Excel
    let datosEquipos = [];
    const equiposCheckbox = document.querySelectorAll('.contenedor-equipos input[type="checkbox"]');

    equiposCheckbox.forEach(checkbox => {
        if (checkbox.checked) {
            const cantidadInput = document.getElementById(checkbox.id + "_cantidad");
            const cantidad = cantidadInput ? cantidadInput.value : '1'; // Si hay un campo de cantidad, usa su valor; de lo contrario, asume '1'
            datosEquipos.push(`${checkbox.value}: ${cantidad}`);
        }
    });

    // Convertir el arreglo de datos de equipos en una cadena de texto con saltos de línea
    const datosEquiposTexto = datosEquipos.join('\n');


    // Recopilar datos de puntas en un arreglo
    let datosPuntas = [];
    const puntasCheckbox = document.querySelectorAll('.contenedor-puntas input[type="checkbox"]');

    puntasCheckbox.forEach(checkbox => {
        if (checkbox.checked) {
            const cantidadInput = document.getElementById(checkbox.id.replace('_check', ''));
            const cantidad = cantidadInput ? cantidadInput.value : '1';
            datosPuntas.push(`${checkbox.value}: ${cantidad}`);
        }
    });

    const datosPuntasTexto = datosPuntas.join('\n'); // Convertir a texto con saltos de línea

    // Recopilar herramientas agregadas
    const herramientas = Array.from(document.querySelectorAll('#lista-herramientas .herramienta-item'))
        .map(item => item.textContent.trim().replace('delete', '').trim()) // Eliminar texto del ícono de borrar
        .join('\n'); // Convierte la lista de herramientas en una cadena de texto separada por saltos de línea

   
    const respuesta = await fetch('https://sheet.best/api/sheets/9b7a3d95-91f9-45f2-969f-a0a8e73d8df4/tabs/ValeRegistro', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "ID": id,
            "HORA": hora,  // Enviar la hora del registro
            "FECHA": fecha,
            "NOMBRE": nombre,
            "BOLETA": boleta,
            "MATERIA": materia,
            "PROFESOR": profesor,
            "CARRERA": carrera,
            "EQUIPOS": datosEquiposTexto, // Asegúrate de que esta parte ya esté implementada
            "MESA DE TRABAJO": mesaDeTrabajo,
            "PUNTAS": datosPuntasTexto,
            "HERRAMIENTA": herramientas,

        })
    });

    Swal.fire({
        title: 'Registro completado con éxito',
        text: 'Tus datos han sido enviados Tu número de ID es:' +id,
        icon: 'success',
        confirmButtonText: 'OK'
    });

    //const data=await respuesta.json();
    limpiarFormulario();


    console.log(respuesta);
});

// Función para generar un ID de tres letras aleatorias
function generarIdUnico() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';

    do {
        id = '';
        for (let i = 0; i < 3; i++) {
            const indiceAleatorio = Math.floor(Math.random() * letras.length);
            id += letras[indiceAleatorio];
        }
    } while (idYaExiste(id));

    guardarId(id);
    return id;
}

// Función para verificar si un ID ya existe en localStorage
function idYaExiste(id) {
    const idsExistentes = JSON.parse(localStorage.getItem('idsGenerados') || '[]');
    return idsExistentes.includes(id);
}

// Función para guardar el ID en localStorage
function guardarId(id) {
    const idsExistentes = JSON.parse(localStorage.getItem('idsGenerados') || '[]');
    idsExistentes.push(id);
    localStorage.setItem('idsGenerados', JSON.stringify(idsExistentes));
}


function limpiarFormulario() {
    // Limpia todos los campos de texto y nÃºmero
    document.querySelectorAll('#formulario-registro input[type="text"], #formulario-registro input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Desmarca todos los checkboxes
    document.querySelectorAll('#formulario-registro input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Oculta los campos numÃ©ricos adicionales y resetea su valor a la mÃ­nima cantidad posible
    document.querySelectorAll('#formulario-registro input[type="number"]').forEach(input => {
        input.style.display = 'none';
        input.value = input.min;  // Restablece el valor al mÃ­nimo si tiene un atributo 'min'
    });

    // Borra todos los elementos dentro del contenedor de herramientas
    const listaHerramientas = document.getElementById('lista-herramientas');
    while (listaHerramientas.firstChild) {
        listaHerramientas.removeChild(listaHerramientas.firstChild);
    }
}


//Puntas
document.querySelectorAll('.contenedor-puntas input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        // Extrae la parte base del id del checkbox para construir el id del campo numérico
        var baseId = checkbox.id.replace('_check', '');
        var cantidadInputId = baseId;
        var cantidadInput = document.getElementById(cantidadInputId);

        // Asegúrate de que el campo numérico existe antes de cambiar su display
        if (cantidadInput) {
            cantidadInput.style.display = checkbox.checked ? 'inline-block' : 'none'; // 'inline-block' para que aparezca en la misma línea
        } else {
            // Si el campo numérico no se encuentra, muestra un mensaje de error en la consola
            console.error('No se encontró el campo numérico con id:', cantidadInputId);
        }
    });
});

//Herramientas
document.addEventListener('DOMContentLoaded', function () {
    var inputHerramienta = document.getElementById('herramienta-input');
    var botonAgregar = document.getElementById('agregar-herramienta');
    var listaHerramientas = document.getElementById('lista-herramientas');

    // Función para eliminar la herramienta de la lista
    function eliminarHerramienta(event) {
        event.target.parentElement.remove();
    }

    // Función para agregar la herramienta a la lista
    function agregarHerramienta() {
        var herramienta = inputHerramienta.value.trim();
        if (herramienta) {
            var elementoLista = document.createElement('div'); // Crear un nuevo div para la herramienta
            elementoLista.classList.add('herramienta-item'); // Añadir clase para estilos

            // Crear y agregar el ícono de basura
            var iconoBasura = document.createElement('span');
            iconoBasura.classList.add('material-symbols-outlined');
            iconoBasura.textContent = 'delete';
            iconoBasura.style.cursor = 'pointer';
            iconoBasura.addEventListener('click', eliminarHerramienta);
            elementoLista.appendChild(iconoBasura);

            // Agregar el texto de la herramienta
            var textoHerramienta = document.createTextNode(' ' + herramienta);
            elementoLista.appendChild(textoHerramienta);

            listaHerramientas.appendChild(elementoLista);
            inputHerramienta.value = '';
        } else {
            alert('Por favor, escribe el nombre de una herramienta.');
        }
    }

    botonAgregar.addEventListener('click', agregarHerramienta);
});


//Equipos
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los checkboxes dentro del contenedor de equipos
    var checkboxes = document.querySelectorAll('.contenedor-equipos input[type="checkbox"]');

    // Función para manejar el cambio de estado del checkbox
    function toggleNumericField() {
        // Seleccionar el campo numérico asociado. Está en el mismo contenedor div que el checkbox
        var numericField = this.parentNode.querySelector('.numericos');

        // Solo cambiar el estilo si numericField no es null
        if (numericField) {
            numericField.style.display = this.checked ? 'inline-block' : 'none';
        }
    }
    // Añadir el event listener a cada checkbox
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', toggleNumericField);
    });
});



//Modifica el formulario
const btnModificar = document.getElementById('btn-modificar');

btnModificar.addEventListener('click', async () => {
    // Usar SweetAlert2 para solicitar el ID del usuario
    const { value: idUsuario } = await Swal.fire({
        title: 'Ingresa tu número de ID',
        input: 'text',
        inputLabel: 'ID para modificar tu registro',
        inputPlaceholder: 'Número de ID',
        inputAttributes: {
            'aria-label': 'Por favor, ingresa tu número de ID aquí'
        },
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesitas escribir algo!';
            }
            if (!/^[A-Z]{3}$/.test(value)) { // Asegura que el ID tiene exactamente tres letras mayúsculas
                return 'El ID debe consistir en tres letras mayúsculas.';
            }
        }
    });

    if (idUsuario) {
        try {
            const respuesta = await fetch(`https://sheet.best/api/sheets/9b7a3d95-91f9-45f2-969f-a0a8e73d8df4/tabs/ValeRegistro/search?ID=${idUsuario}`);
            const datos = await respuesta.json();

            if (datos.length > 0) {
                const registro = datos[0]; // Asumiendo que el ID es único y solo devuelve un registro
                llenarFormularioConDatos(registro);
                Swal.fire({
                    title: '¡Registro encontrado!',
                    text: 'El formulario ha sido llenado con los datos del registro.',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No se encontró ningún registro con ese ID.',
                    icon: 'error'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al buscar el registro: ' + error,
                icon: 'error'
            });
            console.error("Hubo un error al buscar el registro: ", error);
        }
    }
});



//Funcion para llevar los datos de excel de vuelta al formulario
function llenarFormularioConDatos(datos) {
    // Asigna los valores basicos
    
    document.getElementById('fecha').value = datos.FECHA || '';
    document.getElementById('nombre').value = datos.NOMBRE || '';
    document.getElementById('boleta').value = datos.BOLETA || '';
    document.getElementById('materia').value = datos.MATERIA || '';
    document.getElementById('profesor').value = datos.PROFESOR || '';


    // Asigna el valor de la Mesa de Trabajo
    document.getElementById('mesa_trabajo').value = datos['MESA DE TRABAJO'] || '';

    // Procesa y asigna los equipos
    const equipos = datos.EQUIPOS ? datos.EQUIPOS.split('\n') : [];
    equipos.forEach(equipo => {
        const [nombre, cantidad] = equipo.split(':').map(e => e.trim());
        const checkbox = document.querySelector(`input[name="herramientas"][value="${nombre}"]`);
        if (checkbox) {
            checkbox.checked = true;
            // Asegúrate de que el input asociado al checkbox se muestre y se asigne el valor correspondiente
            const cantidadInput = document.getElementById(`${checkbox.id}_cantidad`);
            if (cantidadInput) {
                cantidadInput.style.display = 'inline'; // Asegúrate de que el input se muestre correctamente
                cantidadInput.value = cantidad || 1; // Si no hay cantidad especificada, usa 1 como valor predeterminado
                // Simula un evento change para que el campo numérico se muestre, si es necesario
                // Esto es opcional, dependiendo de si necesitas que se dispare alguna lógica adicional en el evento change
                checkbox.dispatchEvent(new Event('change'));
            }
        }
    });




    // Muestra las opciones de puntas y asigna valores si están seleccionadas
    const puntas = datos.PUNTAS ? datos.PUNTAS.split('\n') : [];
    puntas.forEach(punta => {
        const [nombre, cantidad] = punta.split(':').map(e => e.trim());
        const checkbox = document.querySelector(`input[name="herramientas"][value="${nombre}"]`);
        if (checkbox) {
            checkbox.checked = true;
            const cantidadInput = document.getElementById(`${checkbox.id.replace('_check', '')}`);
            if (cantidadInput) {
                cantidadInput.style.display = 'inline';
                cantidadInput.value = cantidad || 1;
            }
        }
    });
    
    
    // Procesa y asigna las herramientas y aditamentos
    const herramientas = datos.HERRAMIENTA ? datos.HERRAMIENTA.split('\n') : [];
    const contenedorHerramientas = document.getElementById('lista-herramientas');
    contenedorHerramientas.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos elementos
    herramientas.forEach(herramienta => {
        const elementoLista = document.createElement('div');
        elementoLista.classList.add('herramienta-item'); // Añadir clase para estilos

        // Crear y agregar el ícono de basura
        const iconoBasura = document.createElement('span');
        iconoBasura.classList.add('material-symbols-outlined');
        iconoBasura.textContent = 'delete';
        iconoBasura.style.cursor = 'pointer';
        iconoBasura.addEventListener('click', eliminarHerramienta);
        elementoLista.appendChild(iconoBasura);

        // Agregar el texto de la herramienta
        const textoHerramienta = document.createTextNode(' ' + herramienta);
        elementoLista.appendChild(textoHerramienta);

        contenedorHerramientas.appendChild(elementoLista);
    });


    // Función para eliminar la herramienta de la lista
    function eliminarHerramienta(event) {
        event.target.parentElement.remove();
    }
    
}




