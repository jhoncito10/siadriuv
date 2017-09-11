$(document).ready(function(){
	/*crearLinks();*/

	// Initialize Firebase
	
	//------------------------
	//loadData();
	//------------------------

	//VARIABLES GENERALES
	var vectorFechaInicio = '';
	var vectorFechaFin = '';
	var diaJulianoInicio = '';
	var diaJulianoFin = '';

	//CONTENEDOR DE CADA UNA DE LAS TAREAS
	var contenedor = $("div[name=item]");

	/* ------------------------------------------------------ */
	/* ------------------------------------------------------ */
	//EVENTO DEL BOTON PARA SUBIR ARCHIVO
	contenedor.find("a[name=btnUpFile]").click(function(){
		var codTarea = $(this).closest('div[name=item]').attr("id");
		//CREANDO UN INPUT
		var input = $("<input>");
		input.attr({
			"type":"file",
			"name":"upFile"
		});
		//ADICIONANDO EL INPUT AL DOM
		$(this).parent().append(input);
		//EVENTO PARA CUANDO EL INPUT CAMBIA
		$("input[name='upFile']").change(function(e){
			var archivo = $(this).val();
			//------------------------------------------------------
			//obtener el archivo. la siguiente linea de codigo nos arroja un
			//objeto con las cacrateristicas del archivo cargado, tales como:
			//nombre, fecha de modificacion, etc. todo esto se almacena en una
			//variable llamada "file".
			var file = e.target.files[0];
			console.log(codTarea);
			//creamos una referencia de almacenamiento en firebase
			var storageRef = firebase.storage().ref("mis_archivos/file"+codTarea);
			//subimos el archivo
			var task = storageRef.put(file);
			//------------------------------------------------------
			return archivo
		});
		//EJECUTANDO EL INPUT TYPE FILE
		input.click();
	});

	//EVENTO PARA LOS BOTONES DE FECHA (INICIO O FIN)
	contenedor.find("a[name=btnCalendario]").click(function(){
		var codTarea = $(this).closest('div[name=item]').attr("id");
		//IDENTIFICANDO SI ES UN BOTON DE FEHCA INICIAL O FINAL
		var caract = $(this).attr("id");
		//OBTENIENDO EL ELEMENTO PARE DEL BOTON PRESIONADO
		var padre = $(this).parent();
		//IDENTIFICANDO LA POSICION DEL BOTON
		var posBtn = $(this).position();
		//CREANDO EL DIV DEL CALENDARIO
		var divCalendario = $("<div></div>");
		divCalendario.attr({
			"id":"calendario",
			"name":"calendario"
		});
		//ASIGNANDO LA POSICON DEL DIV
		divCalendario.css("top",$(this).position().top+"px");
		divCalendario.css("left",$(this).position().left+"px");
		//ADICIONANDO UN EVENTO MOUSELEAVE PARA QUE EL DIV SE DESAPAREZCA UNA VEZ SE HAYA HECHO CLICK SOBRE EL
		divCalendario.mouseleave(function(){
			$(this).remove();
		});
		//INSERTANDO EL DIV DENTRO DEL ELEMENTO PADRE
		padre.append(divCalendario);
		//CONVIRTIENDO EL DIV EN UN DATAPICKER
		divCalendario.datepicker({
	      	showOn: "button",
	      	dateFormat: "dd-mm-yy",
	      	onSelect:function(e){
	      		//ESCRIBIENDO EL VALOR DE LA FECHA EN LA PANTALLA
	      		$("div#"+codTarea).find("p#r"+caract).html(e);
	      		//var fechaInicio = new Date(e);
	      		//ADICIONANDO EL VALOR DE LA FECHA A LA VARIABLE (INICIO-FIN) CORRESPONDIENTE
				if (caract == 'fechaInicio'){
					//ESCRIBIENDO LA FECHA (INICIO) EN LA BASE DE DATOS
					saveDate(codTarea, caract, e);
					//CONVIRTIENDO LA FEHCA STRING EN UN VECTOR
					vectorFechaInicio = e.split("-");
      				//CALCULANDO NUMERO DE DIA JULIANO
					diaJulianoInicio = diaJuliano(vectorFechaInicio[0],vectorFechaInicio[1],vectorFechaInicio[2]);
				}else if (caract == 'fechaFin'){
      				//ESCRIBIENDO LA FECHA (FIN) EN LA BASE DE DATOS
      				saveDate(codTarea, caract, e);
      				//CONVIRTIENDO LA FEHCA STRING EN UN VECTOR
      				vectorFechaFin = e.split("-");
      				//CALCULANDO NUMERO DE DIA JULIANO
	      			diaJulianoFin = diaJuliano(vectorFechaFin[0],vectorFechaFin[1],vectorFechaFin[2]);
				}
				//EVALUANDO SI LAS VARIABLES (INICIO-FIN) HAN SIDO DEFINIDAS
	      		if (diaJulianoFin != '' && diaJulianoInicio != ''){
	      			var dias = diaJulianoFin - diaJulianoInicio
	      			$("div#"+codTarea).find("p#rDurDiasH").html(dias);
	      			//$("#rDurDiasH"+codTarea).html(dias);
	      			//ESCRIBIENDO DATOS EN LA BASE DE DATOS
	      			saveDate(codTarea, "DurDiasH", dias);
	      		}
	      		//REMOVER EL CALENDARIO UNA VEZ SE HAYA SELECCIONADO ALGUNA FECHA
	      		$(this).remove();
	      	}
    	}).show();
	});

	/* ------------------------------------------------------ */
	/* ------------------------------------------------------ */

	//EVENTO DEL BOTON PARA MOSTRAR INFORMACION ADICIONAL DE CADA TAREA EN UNA VENTANA EMERGENTE (VERSION 2)
	$('#myModal').on('show.bs.modal', function (event) {
		//IDENTIFICANDO EL ID DEL BOTON PULSADO
		var button = $(event.relatedTarget);
		//SELECCIONANDO LA VENTANA MODAL
		var modal = $(this);
		//IDENTIFICANDO EL CODIGO DE LA TAREA
		//var id = button.attr("id");
		var codTarea = button.closest('div[name=item]').attr("id");
		//var codTarea = id.substring(4);
		textAux = helpText()[codTarea];
		modal.find('.modal-body p').html(textAux);
	});

	//VENTANA MODAL DE OBSERVACIONES (EVENTO CUANDO APARECE)
	var idTareaObserv = '';
	$('#modalObserv').on('show.bs.modal', function (event) {
		//IDENTIFICANDO EL BOTON PULSADO
		var button = $(event.relatedTarget);
		//IDENTIFICANDO EL CODIGO DE LA TAREA
		var codTarea = button.closest('div[name=item]').attr("id");
		idTareaObserv = codTarea;
		//ELEMENTO P ASOCIADO A ESTA VENTANA MODAL
		var observ = $("div#"+codTarea).find("#rObs");
		//SELECCIONANDO LA VENTANA MODAL
		var modal = $(this);
		//MOSTRANDO MENSAJE DE OBSERVACION GUARDADO CON ANTERIORIDAD
		if (observ.text() != "..."){
			modal.find('.modal-body textarea').val(observ.text());
		} else {
			modal.find('.modal-body textarea').val("");
		}
	});

	//VENTANA MODAL DE OBSERVACIONES (EVENTO CUANDO SE OCULTA)
	$("#guardarYSalir").click(function(){
		$('#modalObserv').on('hide.bs.modal', function (event) {
			//ELEMENTO P ASOCIADO A ESTA VENTANA MODAL
			var observ = $("div#"+idTareaObserv).find("#rObs");
			//SELECCIONANDO LA VENTANA MODAL
			var modal = $(this);
			var textoObserv = modal.find('.modal-body textarea').val();
			//CONDICION PARA EVALUAR SI EL USUARIO ESCRIBIO O NO UNA OBSERVACION
			if (textoObserv.length > 0){
				observ.text(textoObserv);
			} else {
				observ.text("...");
			}
		});
	});

	//VENTANA MODAL PARA EL TEST (EVENTO CUANDO APARECE)
	var idTareaTest = '';
	var idPregunta = ''
	var timeinit;
	$('#modalTest').on('show.bs.modal', function (event) {
		//IDENTIFICANDO EL BOTON PULSADO
		var button = $(event.relatedTarget);
		//IDENTIFICANDO EL CODIGO DE LA TAREA
		var codTarea = button.closest('div[name=item]').attr("id");
		idTareaTest = codTarea;
		//SELECCIONANDO PREGUNTA ALEATORIAMENTE
		idPregunta = codTarea + "-" + Math.round(Math.random()*(numQuestions()[codTarea]-1)+1);
		//ESCRIBIENDO TAREA EN PANTALLA MODAL
		$("#pregunta").html(Questions()[idPregunta]);
		//ESCRIBIENDO RESPUESTAS FALSAS
		var listaAleatoria = arrayAleatorio();
		//ITERANSO SOBRE CADA UNA DE LAS OPCIONES (RADIO BUTTON) DISPONIBLES
		for (var i=0; i<listaAleatoria.length; i++){
			//SELECCIONANDO EL RADIO BUTON
			//var idopcion = $("#opcion"+(i+1));
			//QUITANDO CUALQUIER SELECTOR QUE HAYA SOBRE EL RADIO BUTTON
			//idopcion.attr('checked', false);
			//SELECCIONANDO UN ID DE RESPUESTA ALETORIAMENTE
			var idRespuesta = parseInt(listaAleatoria[i])-1;
			//SELECCIONANDO UNA RESPUESTA ALEATORIAMENTE
			var respuesta = Options()[idPregunta][idRespuesta];
			//MOSTRANDO LA RESPUESTA EN PANTALLA
			$('label[for=opcion'+(i+1)+']').html(respuesta);
		}
		//INICIANDO CONTEO REGRESIVO
		var tiempo = 25;
		timeinit = setInterval(function(){
			var elementoBar = $("#progressBarTest")
			var relacion = (tiempo)*100/25;
			tiempo = tiempo-0.25;
			//MODIFICANDO VISUALMENTE LA BARRA DE TIEMPO
			elementoBar.css("width",relacion+"%");
		 	if (tiempo % 1 == 0) {
				elementoBar.html(tiempo);
			}
			if (tiempo == 0){
				elementoBar.css("width","0%");
				clearInterval(timeinit);
				//CERRANDO LA VENTAN MODAL
				$("#modalTest").modal('hide');
			}
		}, 250);
	});

	//VENTANA MODAL PARA EL TEST (EVENTO CUANDO SE OCULTA)
	$('#modalTest').on('hide.bs.modal', function (event) {
		//FINALIZANDO EVENTO DE TIEMPO
		clearInterval(timeinit);
		//SUMANDO INTENTO REALIZADO
		var nIntentos =  $("div#"+idTareaTest).find("p#rTest");
		console.log(nIntentos.html());
		//MOSTRANSO NUMERO DE INTENTOS EN PANTALLA
		nIntentos.html(parseInt(nIntentos.html())+1);
	});

	//EVENTO DEL BOTON "enviarYSalir" PARA CUANDO EL USUARIO RESPONDE EL TEST
	$("#enviarYSalir").click(function(){
		////FINALIZANDO EVENTO DE TIEMPO
		clearInterval(timeinit);
		//IDENTIFICANDO LA OPCION SELECCIONADA
		var optionSelect = $('input[name=optionsRadios]:checked', '#test').val();
		//IDENTIFICANDO LA RESPUESTA ASOCIADA A LA OPCION SELECCIONADA
		var respuesta = $('label[for=opcion'+optionSelect+']').html();
		//VALIDANDO LA RESPUESTA
		if (respuesta == correctAnswers()[idPregunta]){
			//NOTIFICANDO AL USUARIO DEL RESULTADOD DEL TEST (APROBADO)
			$("div#"+idTareaTest).find("#rEst").html("Aprobado");
			//MARCANDO TAREA COMO APROBADA
			$("div#"+idTareaTest).find("i").removeClass("glyphicon-minus-sign");
			$("div#"+idTareaTest).find("i").removeClass("tareaPorRealizar");
			$("div#"+idTareaTest).find("i").addClass("tareaPorRealizar");

			//$("#rEst"+idTareaTest).html("Aprobado");
		} else{
			//NOTIFICANDO AL USUARIO DEL RESULTADOD DEL TEST (NO APROBADO)
			$("div#"+idTareaTest).find("#rEst").html("No aprobado");
			//$("#rEst"+idTareaTest).html("No aprobado");
		}
	});
});
