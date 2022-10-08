import { faker } from '@faker-js/faker';
faker.locale="es";

export const randomData = fakerData();

function fakerData () {
    const listado = [];
    for (let i = 0; i < 5; i++) {
		const product = {
			id: i +1,
            title: faker.commerce.productName(),
			price: faker.commerce.price(0, 5000, 0, '$'),
			ruta: `${faker.image.imageUrl()}?${i}`
		}
		listado.push(product);
	}
    /* console.log(listado); */
    return listado;
}