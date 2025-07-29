export const serializeCarData = (car, wishlisted = false) => {
    return {
        ...car,
        price: car.price ? parseFloat(car.price.toString()) : 0,
        minPrice: car.minPrice ? parseFloat(car.minPrice.toString()) : 0,
        maxPrice: car.maxPrice ? parseFloat(car.maxPrice.toString()) : 0,
        createdAt: car.createdAt ?. toISOString(),
        updatedAt: car.updatedAt ?. toISOString(),
        wishlisted: wishlisted
    };
};
