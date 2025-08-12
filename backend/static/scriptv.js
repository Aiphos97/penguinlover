//Espera a que todo el contenido de la página se cargue primero
document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos los elementos importantes de la página
    const urlInput = document.getElementById('urlVideo');
    const agregarBtn = document.getElementById('btnAgregarVideo');
    const contenedorVideos = document.getElementById('contenedorVideos');

    // Función para cargar los videos guardados cuando abres la página
    const cargarVideosGuardados = () => {
        // Obtenemos los videos del almacenamiento local del navegador. Si no hay, usamos un array vacío.
        const videos = JSON.parse(localStorage.getItem('misVideosFavoritos')) || [];
        videos.forEach(url => agregarVideoDOM(url));
    };

    // Función para agregar un video a la página
    const agregarVideoDOM = (url) => {
        const idVideo = obtenerIdYoutube(url);
        if (!idVideo) return; // Si no es una URL de YouTube válida, no hace nada

        const urlIncrustada = `https://www.youtube.com/embed/${idVideo}`;

        // Creamos los elementos HTML para el video
        const divVideo = document.createElement('div');
        divVideo.className = 'item-video';
        
        const iframe = document.createElement('iframe');
        iframe.src = urlIncrustada;
        iframe.title = "Reproductor de video de YouTube";
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        
        divVideo.appendChild(iframe);
        contenedorVideos.appendChild(divVideo);
    };
    
    // Función para extraer el ID de un video de YouTube desde una URL
    const obtenerIdYoutube = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
       const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Evento que se dispara al hacer clic en el botón "Agregar Video"
    agregarBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url === "") {
            alert("Por favor, ingresa una URL");
            return;
        }

        const idVideo = obtenerIdYoutube(url);
        if (!idVideo) {
            alert("La URL del video de YouTube no es válida.");
            return;
        }

        // Guardamos la URL en el almacenamiento local
        const videosGuardados = JSON.parse(localStorage.getItem('misVideosFavoritos')) || [];
        if (videosGuardados.includes(url)) {
            alert("Este video ya está en tu lista.");
            return;
        }
        
        videosGuardados.push(url);
        localStorage.setItem('misVideosFavoritos', JSON.stringify(videosGuardados));
        
        // Agregamos el video a la página
        agregarVideoDOM(url);

        // Limpiamos el campo de texto
        urlInput.value = "";
    });

    // Cargamos los videos que ya estaban guardados al abrir la página
    cargarVideosGuardados();
});