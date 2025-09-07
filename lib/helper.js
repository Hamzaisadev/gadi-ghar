export const serializeCarData = (car, wishlisted = false) => {
    if (!car) return null;
    
    return {
        ...car,
        // Convert Decimal objects to numbers
        price: car.price ? parseFloat(car.price.toString()) : null,
        minPrice: car.minPrice ? parseFloat(car.minPrice.toString()) : null,
        maxPrice: car.maxPrice ? parseFloat(car.maxPrice.toString()) : null,
        mileage: car.mileage ? parseFloat(car.mileage.toString()) : null,
        // Convert dates to ISO strings
        createdAt: car.createdAt?.toISOString(),
        updatedAt: car.updatedAt?.toISOString(),
        // Handle wishlist status
        isWishlisted: wishlisted,
        wishlisted: wishlisted,
        // Ensure dealership data is serialized if present
        dealership: car.dealership ? {
            ...car.dealership,
            createdAt: car.dealership.createdAt?.toISOString(),
            updatedAt: car.dealership.updatedAt?.toISOString()
        } : null
    };
};
