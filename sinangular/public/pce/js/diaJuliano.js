function diaJuliano(day,moth,yeard){
	//CONVIRTIENDO DATOS A NUMERO
	var day = Number(day);
	var moth = Number(moth);
	var yeard = Number(yeard);
	//LISTA DE DIAS JULIANOS
	listJulianDays = [1988,1992,1996,2000,2004,2008,2012,2016];
    
    var pos = listJulianDays.indexOf(yeard);

    //VERIFICA SI EL YEARD ES VICIESTO
    if (pos != -1){
    	var dia_mes = [0,31,29,31,30,31,30,31,31,30,31,30,31];
    	var dia_mes_acumulado = [0,31,60,91,121,152,182,213,244,274,305,335,366];
    	var dia_juliano = day + dia_mes_acumulado[moth-1];
    } else{//CONDICION PARA LOS YEARD NO VICIESTOS
    	dia_mes = [0,31,28,31,30,31,30,31,31,30,31,30,31];
    	dia_mes_acumulado= [0,31,59,90,120,151,181,212,243,273,304,334,365];
    	dia_juliano = day + dia_mes_acumulado[moth-1];
    }
    //VALOR DE RETORNO
    return dia_juliano;
}