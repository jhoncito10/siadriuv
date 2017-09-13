
Array.prototype.unique = function (a) { // funcion para eliminar los valores duplicados en un array
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});
var autocompletedbcorreos = firebase.database(); // referencia inicial de la DB firebase
var array_correos = [],
    optionsAutoCompleteCorreos = {};// declara arreglo en el cual se alojaran el listado de nombres de laboratorio 
autocompletedbcorreos.ref("usuarios")
    .orderByChild('email')
    .once("value")
    .then(function (usuarios) {// se ejecuta al terminar la consulta nombres
        var children = usuarios.numChildren(),
                i = 0;
        usuarios.forEach(function (usuario) {// agrega cada valor al arreglo
            array_correos.push(usuario.val().email);
        });
        return (array_correos.unique());// elimina los duplicados

    }).then(function (array) {
        optionsAutoCompleteCorreos = {// objeto de configuracion de autocompletar

            data: array,
            list: {
                match: {
                    enabled: true
                },
                maxNumberOfElements: 6,

                showAnimation: {
                    type: "slide",
                    time: 300
                },
                hideAnimation: {
                    type: "slide",
                    time: 300
                }
            },

            theme: "",
            state: true

        };

    });