/*function dicTar(){
	//DEFINIENDO OBJETO
	var dicCodTarea = {};
}*/

function loadData(){
	var elementos = $("p[name='data']");
	for(var i = 0; i<elementos.length; i++){
		var idElemento = $(elementos[i]).attr("id");
		var codEntregable = idElemento.substring(idElemento.length - 6);
		var typeData = idElemento.substring(0,idElemento.length - 6);
		console.log(typeData);
		//DERIVANDO EL CODIGO DEL ITEM, TEMA Y TAREA CORRESPONDIENTE
		var codItem = codEntregable.substring(0,2);
		var codTema = codEntregable.substring(2,4);
		var codTarea = codEntregable.substring(4,6);
		//CREANDO REFERENCIA SOBRE LA BASE DE DATOS
		var ruta = "I"+codItem+"/Te"+ codTema+"/Ta"+codTarea+"/"+typeData;
		//SINCRONIZANDO ELEMENTO CON LA BASE DE DATOS
		return firebase.database().ref(ruta).once('value').then(function(snapshot) {
			$("#"+idElemento).text(snapshot.val());
		});
	}
}
