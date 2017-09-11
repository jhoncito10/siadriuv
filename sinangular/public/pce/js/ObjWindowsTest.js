function Questions(){
	var ObjQuestions = {};
	//----------------------
	//PREGUNTA 020101
	//----------------------
	ObjQuestions["020101-1"] = "¿Cuantas patas tiene una araña?";
	ObjQuestions["020101-2"] = "¿Cuantas vidas tiene un gato?";
	ObjQuestions["020101-3"] = "¿Cuantos años tiene la Universidad del valle?";
	//----------------------

	//----------------------
	//PREGUNTA 030101
	//----------------------
	ObjQuestions["030101-1"] = "¿Que es un archivo de gestión";
	ObjQuestions["030101-2"] = "¿Que es un archivo central";
	ObjQuestions["030101-3"] = "¿Que es un archivo historico?";
	ObjQuestions["030101-4"] = "¿Que es un expediente?";
	ObjQuestions["030101-5"] = "¿Que es un folio?";
	ObjQuestions["030101-6"] = "¿Cuantos folios debe albergar una carpeta o expediente?";
	ObjQuestions["030101-7"] = "¿Para que es utilizado el cuadro de codificación?";
	ObjQuestions["030101-8"] ="¿Se debe aplicar TRD a la documentación disponible a partir de que año?";

	//VALOR DE RETORNO
	return ObjQuestions;
}

function Options(){
	var ObjOptions = {};
	//----------------------
	//PREGUNTA 020101
	//----------------------
	ObjOptions["020101-1"] = ["2","6","10","8"];
	ObjOptions["020101-2"] = ["18","3","1","9"];
	ObjOptions["020101-3"] = ["70","69","75","65"];
	//----------------------

	//----------------------
	//PREGUNTA 030101
	//----------------------
	ObjOptions["030101-1"] = ["Cuadrada","Redonda","Triangular","Octagonal"];
	ObjOptions["030101-2"] = ["2","4","5","6"];
	ObjOptions["030101-3"] = ["2","4","5","6"];
	ObjOptions["030101-4"] = ["Documentación correspondiente a un asunto o negocio","Registro historico de diferentes acontecimientos","Certificación firmada de una transaccion","Comprobante de una transferencia de servicios"];
	ObjOptions["030101-5"] = ["2","4","5","6"];
	ObjOptions["030101-6"] = ["2","4","5","6"];
	ObjOptions["030101-7"] = ["2","4","5","6"];
	ObjOptions["030101-8"] = ["2","4","5","6"];
	//----------------------

	//VALOR DE RETORNO
	return ObjOptions;
}

function correctAnswers(){
	var ObjCorrectAnswers = {};
	//----------------------
	//PREGUNTA 020101
	//----------------------
	ObjCorrectAnswers["020101-1"] = "8";
	ObjCorrectAnswers["020101-2"] = "9";
	ObjCorrectAnswers["020101-3"] = "70";
	//----------------------

	//----------------------
	//PREGUNTA 030101
	//----------------------
	ObjCorrectAnswers["030101-1"] = "Redonda";
	ObjCorrectAnswers["030101-2"] = "6";
	ObjCorrectAnswers["030101-3"] = "6";
	ObjCorrectAnswers["030101-4"] = "Documentación correspondiente a un asunto o negocio";
	ObjCorrectAnswers["030101-5"] = "6";
	ObjCorrectAnswers["030101-6"] = "6";
	ObjCorrectAnswers["030101-7"] = "6";
	ObjCorrectAnswers["030101-8"] = "6";
	//----------------------

	//VALOR DE RETORNO
	return ObjCorrectAnswers;
}

function numQuestions(){
	var ObjNumQuestions = {};
	ObjNumQuestions["020101"] = 3;
	ObjNumQuestions["030101"] = 8;
	//VALOR DE RETORNO
	return ObjNumQuestions;
}

function arrayAleatorio(){
	//NUMERO DE OPCIONES DISPONIBLES PARA EL TEST
	var myArray = ['1','2','3','4'];
    var i,j,k;
    for (i = myArray.length; i; i--) {
        j = Math.floor(Math.random() * i);
        k = myArray[i - 1];
        myArray[i - 1] = myArray[j];
        myArray[j] = k;
    }
	//VALOR DE RETORNO
	return myArray;
}
