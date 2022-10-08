/* Desafio N01 */
/* Declaración de clase Usuario */
class Usuario {
    /* Atributos */
    constructor (nombre, apellido) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.mascotas = [];
        this.libros=[];
    }
    
    /* Retorna nombre completo del usuario */
    getFullName() {
        let fullName = this.nombre + " " + this.apellido;
        return fullName;
    }

    /* Retorna la cantidad de mascotas que tiene el usuario */
    countMascotas(){
        let totalMascotas=this.mascotas.length;
        if (totalMascotas===1) {
            console.log(this.nombre, ' tiene ', totalMascotas, ' mascota.');
        } else {
            console.log(this.nombre, ' tiene ', totalMascotas, ' mascotas.');
        }
    }

    /* Recibe un nombre de mascota y lo agrega al array de mascotas */
    addMascota(animal){
        let listaDeMacotas=this.mascotas;
        listaDeMacotas.push(animal);
        console.log('Las mascotas de ', this.nombre, ' son ', listaDeMacotas);
        this.countMascotas();
    }
    
    /* Recibe un nombre y autor y agrega el objeto al array de libros */
    addBook (nombreLibro, autorLibro) {
        let listaDeLibros=this.libros;
        listaDeLibros.push([nombreLibro, autorLibro]);
        console.log('Listado de libros: ', listaDeLibros);
        this.getBookNames();
    }

    /* Retorna un array con solo los nombres de los libros */
    getBookNames(){
        let arrayDeLibros=[];
        this.libros.forEach(i => {
            arrayDeLibros.push(i[0]);
            console.log('Array de nombres de libros: ', arrayDeLibros);
        });
    }
}

/* Creacion de objeto e invocacion de métodos */
const usuario1 = new Usuario ('Tiago', 'Groppo');
console.log('Nombre completo: ', usuario1.getFullName());
usuario1.addMascota('Gato');
usuario1.addMascota('Perro');
usuario1.addMascota('Pajaro');
usuario1.addBook('La Oruga Glotona', 'Eric Carl');
usuario1.addBook('Elmer, el elefante de colores', 'David McKee');
usuario1.addBook('Olivia', 'Ian Falconer');