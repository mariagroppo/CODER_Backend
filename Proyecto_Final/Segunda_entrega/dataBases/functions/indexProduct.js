
import fs from 'fs';

export function idMaxCalculation() {
    let listado = JSON.parse(fs.readFileSync('../Segunda_entrega/dataBases/data/listProducts.txt', 'utf-8'));
    let idMax=0;
        
    for (let index = 0; index < listado.length; index++) {
        const number = listado[index].id;
        if (number > idMax) {
            idMax=number;
            }
    }
    let newId = idMax + 1;
    return newId;
}