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
  
  // NEW: Parse AI response with price range (e.g., "12000000-15000000 PKR")
  export const parseRangeFromAI = (aiResponse) => {
    if (!aiResponse || typeof aiResponse !== 'string') {
      return { min: null, max: null, error: 'Invalid AI response' };
    }
  
    // Remove PKR and any extra whitespace
    const cleanResponse = aiResponse.replace(/PKR|pkr/gi, '').trim();
    
    // Check if it's a range (contains dash)
    if (cleanResponse.includes('-')) {
      const parts = cleanResponse.split('-');
      if (parts.length === 2) {
        const min = parseCurrency(parts[0].trim());
        const max = parseCurrency(parts[1].trim());
        
        if (!isNaN(min) && !isNaN(max) && min <= max) {
          return { min, max, error: null };
        }
      }
      return { min: null, max: null, error: 'Invalid range format' };
    } else {
      // Single price - set both min and max to same value
      const price = parseCurrency(cleanResponse);
      if (!isNaN(price)) {
        return { min: price, max: price, error: null };
      }
      return { min: null, max: null, error: 'Invalid price format' };
    }
  };
  
  // NEW: Format number to crores (e.g., 12000000 -> "1.2 crore")
  export const formatToCrores = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "";
    
    const numericValue = Number(value);
    
    if (numericValue >= 10000000) { // 1 crore = 10,000,000
      const crores = numericValue / 10000000;
      if (crores >= 1) {
        return `${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)} crore${crores !== 1 ? 's' : ''}`;
      }
    }
    
    if (numericValue >= 100000) { // 1 lakh = 100,000
      const lakhs = numericValue / 100000;
      return `${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} lakh${lakhs !== 1 ? 's' : ''}`;
    }
    
    // For smaller amounts, use regular formatting
    return numericValue.toLocaleString('en-PK');
  };
  
  // NEW: Format price range (e.g., "1.2 crore to 1.5 crore")
  export const formatPriceRange = (minPrice, maxPrice) => {
    if (!minPrice && !maxPrice) return "Price not specified";
    
    const min = Number(minPrice);
    const max = Number(maxPrice);
    
    if (isNaN(min) && isNaN(max)) return "Invalid price range";
    
    if (isNaN(min)) return `Up to ${formatToCrores(max)}`;
    if (isNaN(max)) return `From ${formatToCrores(min)}`;
    
    if (min === max) {
      return formatToCrores(min);
    }
    
    return `${formatToCrores(min)} to ${formatToCrores(max)}`;
  };
  
  // NEW: Format for display with both PKR and crore
  export const formatPriceWithCrore = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "";
    
    const pkrFormat = formatCurrency(value);
    const croreFormat = formatToCrores(value);
    
    if (Number(value) >= 1000000) { // Show crore format for large amounts
      return `${pkrFormat} (${croreFormat})`;
    }
    
    return pkrFormat;
  };
  
  export const formatPercentage = (amt) => {
    return amt.toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 0,
    });
  };
  
  export const formatDate = (epoch) =>
    new Date(epoch).toLocaleDateString("en-PK");