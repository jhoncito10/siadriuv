function saveDate(codTarea, typeData, data){
	//-------------------------------------------
	/*
	EL typeData VARIA EN LOS SIGUIENTES VALORES
	*Ent: Boolean. Marca 'True' si ya se ha adjuntado un archivo. De lo contrario sera false.
	*Fi: Texto. Fecha de Inicio.
	*Fn: Texto. Fecha de Finalizacion.
	*DurDiasH: Interger. Dias habiles entre la fecha de inicio (Fi) y fin (Fn).
	*Est: Texto. Varia entre tres valores: Pendiente, En avanvce y Terminado.
	*AvnTar: Integer. Avance de la tarea. Si el estado (Est) es igual a "Terminado" este valor sera mayor de cero.
	*Obs: Texto. Observaciones.
	*/
	//-------------------------------------------
	//ID DEL ITEM, TEMA Y TAREA CORRESPONDIENTE
	var idItem = codTarea.substring(0,2);
	var idTema = codTarea.substring(2,4);
	var idTarea = codTarea.substring(4);
	//ACCEDIENDO A LA BASE DE DATOS
	var databaseService = firebase.database();
	//DERIVANDO LA RUTA EN LA BASE DE DATOS DONDE SE ALMACENARA EL DATO
	var rutaDb = "I"+idItem+"/"+"Te"+idTema+"/"+"Ta"+idTarea+"/"+typeData;
	//ALMACENANDO DATO EN LA BASE DE DATOS
	databaseService.ref(rutaDb).set(data);
}