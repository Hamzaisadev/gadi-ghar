export const formatCurrency = (value) => {
    if (isNaN(value)) return "";
  
    const numericValue = Number(value); // Ensure the value is a number
    const options = {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2, // No decimal if whole number
      maximumFractionDigits: 2, // Maximum of 2 decimal places
    };
  
    return new Intl.NumberFormat("en-PK", options).format(numericValue);
  };
  export const parseCurrency = (value) => {
    // Remove commas and convert to number
    const numericValue = value.replace(/,/g, ""); // Remove commas
    return Number(numericValue); // Convert to number
  };
  
  export const formatPercentage = (amt) => {
    return amt.toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 0,
    });
  };
  
  export const formatDate = (epoch) =>
    new Date(epoch).toLocaleDateString("en-PK");