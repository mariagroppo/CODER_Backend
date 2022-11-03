const randomNumbers = () => {
    let quantity = process.env.CANTIDAD_RANDOM;
    
    /* quantity es la cantidad de numeros emitidos */
    if (!quantity){
        quantity = 100000000;
    }
    // Inicializo el array de numeros
    let array = [];
    for (let i = 0; i <= 1000; i++) {
        array[i] = 0;
    }
    /* i es la posición y el número, el valor es la cantidad de veces que se repite */
    
    // Random de numeros
    for (let i = 0; i < quantity; i++) {
        let number = Math.floor((Math.random() * 1000 + 1));
        array[number]++;
    }
    let data = [];
    for (let index = 0; index < array.length; index++) {
        if (array[index] !== 0) {
            console.log("número " + index + " se repitio " + array[index] + " veces.")
            let a = { numero: index, valor: array[index]};
            data.push(a);
        }        
    }
    console.log(data)
    return (data);
}

const arrayRandomNumbers = randomNumbers();
process.send(arrayRandomNumbers);
