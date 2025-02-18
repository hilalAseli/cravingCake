const PriceFormater = (price) => {
  return Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(price);
};
export default PriceFormater;
