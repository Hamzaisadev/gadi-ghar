export const formatPriceToLakhsCrores = (value) => {
  if (isNaN(value) || value === null || value === undefined) return "";
  const num = Number(value);
  if (num >= 10000000) {
    // Crores
    return (num / 10000000).toFixed(2).replace(/\.00$/, "") + " crore";
  } else if (num >= 100000) {
    // Lakhs
    return (num / 100000).toFixed(2).replace(/\.00$/, "") + " lakh";
  } else {
    return num.toString();
  }
};

export const parseLakhsCroresToNumber = (value) => {
  if (!value) return 0;
  const lower = value.toLowerCase().trim();
  if (lower.includes("crore")) {
    return parseFloat(lower.replace(/[^0-9.]/g, "")) * 10000000;
  } else if (lower.includes("lakh")) {
    return parseFloat(lower.replace(/[^0-9.]/g, "")) * 100000;
  } else {
    return parseFloat(lower.replace(/[^0-9.]/g, ""));
  }
};
