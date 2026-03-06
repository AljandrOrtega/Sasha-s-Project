const lista = document.getElementById("listaTareas");

// Configuración de conexión
const _supabase = supabase.createClient(
    SUPABASE_URL, 
    SUPABASE_ANON_KEY 
);

// 1. Corregimos la carga inicial: Debe ser una función asíncrona
async function cargarTareas() {
    lista.innerHTML = "Cargando...";

    // Hacemos la petición a la tabla 'Tareas'
    const { data, error } = await _supabase
        .from('Tareas')
        .select('*'); // Traemos todas las columnas

    if (error) {
        console.error("Error al cargar:", error);
        lista.innerHTML = "Error al cargar tareas.";
        return;
    }

    lista.innerHTML = ""; // Limpiamos el mensaje de carga
    
    // Iteramos sobre 'data', que es el array que devuelve Supabase
    data.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = "- " + item.tarea; 
        lista.appendChild(li);
    });
}

// 2. Corregimos la inserción
async function agregarTarea() {
    let input = document.getElementById("tareaInput");
    let texto = input.value.trim();
            
    if (texto !== "") {
        // Insertamos en Supabase
        // NO enviamos el ID para que Postgres lo genere solo (si lo configuraste así)
        const { error } = await _supabase
            .from('Tareas')
            .insert([{ tarea: texto }]); // Supabase espera un array de objetos

        if (error) {
            alert("No se pudo guardar: " + error.message);
            return;
        }

        // Si se guardó en la nube, lo mostramos en la interfaz
        let nuevaTarea = document.createElement("li");
        nuevaTarea.textContent = "- " + texto;
        lista.appendChild(nuevaTarea);

        input.value = "";
    }
}

// Ejecutamos al cargar la página
window.onload = cargarTareas;