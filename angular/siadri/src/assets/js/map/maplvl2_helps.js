<<<<<<< HEAD
//Ayuda para completar la informacion del laboratorio


//Numero de celular
$('.modal-body').on('click','#ncelular', function () {
		$(this).popover({ content: "Si tiene un numero de celular al que desee que se comuniquen con usted.", trigger: "fixed"});
		$(this).popover('show');
});


//Cargo
$('.modal-body').on('click','#ncargo71', function () {
		$(this).popover({ content: "Seleccione su cargo de la lista", trigger: "fixed"});
		$(this).popover('show');
});

//Nombre del coordinador
$('.modal-body').on('click','#nnombres', function () {
		$(this).popover({ content: "Escriba el nomrbe del coordinador del laboratorio", trigger: "fixed"});
		$(this).popover('show');
});


//numero de telefono
$('.modal-body').on('click','#ntelefono', function () {
		$(this).popover({ content: "Si tiene numero telefonico fijo por favor escribalo", trigger: "fixed"});
		$(this).popover('show');
});


//Actividad
$('.modal-body').on('click','#nactividad', function () {
		$(this).popover({ content: "Escriba las actividades de su laboratorio (Ej. INVESTIGACION, EXTENSION)", trigger: "fixed"});
		$(this).popover('show');
});

/*
//Areas del conocimiento
$('.modal-body').on('click','.narea_conocimiento', function () {
		$('.narea_conocimiento').popover({ content: "Seleccione  las areas de conicimiento", trigger: "fixed"});
		$('.narea_conocimiento').popover('show');
});*/

//Resolucion
$('.modal-body').on('click','#nresolucion_de_creacion', function () {
		$(this).popover({ content: "No es editable, sera añadido desde el PCE", trigger: "fixed"});
		$(this).popover('show');
});


//Direccion envio
$('.modal-body').on('click','#ndireccion', function () {
		$(this).popover({ content: "Direccion de envio de muestras", trigger: "fixed"});
		$(this).popover('show');
});


//Email Laboratorio
$('.modal-body').on('click','#notroemail', function () {
		$(this).popover({ content: "Correo electronico visible al publico, para solicitudes", trigger: "fixed"});
		$(this).popover('show');
});


//Telefono laboratorio
$('.modal-body').on('click','#ntelefono_lab', function () {
		$(this).popover({ content: "Telefono del laboratorio (Ej. 3212100 Ext. 0001)", trigger: "fixed"});
		$(this).popover('show');
});


//Linea de investigacion
$('.modal-body').on('click','#ngrupoinves', function () {
		$(this).popover({ content: "Especifique sus lineas de investigación", trigger: "fixed"});
		$(this).popover('show');
});


//Nombre de la prueba o ensayo
$('.modal-body').on('click','#nensayo', function () {
		$(this).popover({ content: "Escriba el nombre de la prueba o ensayo, asi aparecera en el buscador", trigger: "fixed"});
		$(this).popover('show');

});


//Descripcion de la prueba o ensayo
$('.modal-body').on('click','#ndescripcion', function () {
		$(this).popover({ content: "Descripcion basica y tecnica de la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});

//Palabras claves de la prueba o ensayo
$('.modal-body').on('click','#npalabras_clave', function () {
		$(this).popover({ content: "Palabras clave para la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});


//Normas que rigen la prueba o ensayo
$('.modal-body').on('click','#nnormas_prueba', function () {
		$(this).popover({ content: "Descripcion delas normas vigentes para la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});

//Costos la prueba o ensayo
$('.modal-body').on('click','#ncosto_prueba', function () {
		$(this).popover({ content: "Escriba el costo para la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});







=======
//Ayuda para completar la informacion del laboratorio


//Numero de celular
$('.modal-body').on('click','#ncelular', function () {
		$(this).popover({ content: "Si tiene un numero de celular al que desee que se comuniquen con usted.", trigger: "fixed"});
		$(this).popover('show');
});


//Cargo
$('.modal-body').on('click','#ncargo71', function () {
		$(this).popover({ content: "Seleccione su cargo de la lista", trigger: "fixed"});
		$(this).popover('show');
});

//Nombre del coordinador
$('.modal-body').on('click','#nnombres', function () {
		$(this).popover({ content: "Escriba el nomrbe del coordinador del laboratorio", trigger: "fixed"});
		$(this).popover('show');
});


//numero de telefono
$('.modal-body').on('click','#ntelefono', function () {
		$(this).popover({ content: "Si tiene numero telefonico fijo por favor escribalo", trigger: "fixed"});
		$(this).popover('show');
});


//Actividad
$('.modal-body').on('click','#nactividad', function () {
		$(this).popover({ content: "Escriba las actividades de su laboratorio (Ej. INVESTIGACION, EXTENSION)", trigger: "fixed"});
		$(this).popover('show');
});

/*
//Areas del conocimiento
$('.modal-body').on('click','.narea_conocimiento', function () {
		$('.narea_conocimiento').popover({ content: "Seleccione  las areas de conicimiento", trigger: "fixed"});
		$('.narea_conocimiento').popover('show');
});*/

//Resolucion
$('.modal-body').on('click','#nresolucion_de_creacion', function () {
		$(this).popover({ content: "No es editable, sera añadido desde el PCE", trigger: "fixed"});
		$(this).popover('show');
});


//Direccion envio
$('.modal-body').on('click','#ndireccion', function () {
		$(this).popover({ content: "Direccion de envio de muestras", trigger: "fixed"});
		$(this).popover('show');
});


//Email Laboratorio
$('.modal-body').on('click','#notroemail', function () {
		$(this).popover({ content: "Correo electronico visible al publico, para solicitudes", trigger: "fixed"});
		$(this).popover('show');
});


//Telefono laboratorio
$('.modal-body').on('click','#ntelefono_lab', function () {
		$(this).popover({ content: "Telefono del laboratorio (Ej. 3212100 Ext. 0001)", trigger: "fixed"});
		$(this).popover('show');
});


//Linea de investigacion
$('.modal-body').on('click','#ngrupoinves', function () {
		$(this).popover({ content: "Especifique sus lineas de investigación", trigger: "fixed"});
		$(this).popover('show');
});


//Nombre de la prueba o ensayo
$('.modal-body').on('click','#nensayo', function () {
		$(this).popover({ content: "Escriba el nombre de la prueba o ensayo, asi aparecera en el buscador", trigger: "fixed"});
		$(this).popover('show');

});


//Descripcion de la prueba o ensayo
$('.modal-body').on('click','#ndescripcion', function () {
		$(this).popover({ content: "Descripcion basica y tecnica de la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});

//Palabras claves de la prueba o ensayo
$('.modal-body').on('click','#npalabras_clave', function () {
		$(this).popover({ content: "Palabras clave para la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});


//Normas que rigen la prueba o ensayo
$('.modal-body').on('click','#nnormas_prueba', function () {
		$(this).popover({ content: "Descripcion delas normas vigentes para la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});

//Costos la prueba o ensayo
$('.modal-body').on('click','#ncosto_prueba', function () {
		$(this).popover({ content: "Escriba el costo para la prueba o ensayo", trigger: "fixed"});
		$(this).popover('show');
});







>>>>>>> 42ca7d2ea14e3cd9df2b6208a68bbe259a0cdc4a
