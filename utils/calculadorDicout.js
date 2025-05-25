export function calculateTotalWithDiscount(cartItems) {
  const today = new Date().getDay(); // 0: domingo ... 6: sábado

  const dayCategoryMap = {
    5: "teclados",    // Viernes
    6: "monitores",   // Sábado
    0: "cpus",        // Domingo
    1: "accesorios"   // Lunes
  };

  const categoryIds = {
    teclados: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    monitores: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    cpus: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    accesorios: [35, 36, 37, 38, 39, 40, 41, 42,43]
  };

  const todayCategory = dayCategoryMap[today];
  const idsConDescuento = categoryIds[todayCategory] || [];

  return cartItems.map(item => {
    const tieneDescuento = idsConDescuento.includes(item.id);
    const precioFinal = tieneDescuento ? item.price * 0.9 : item.price;
    return {
      ...item,
      price: parseFloat(precioFinal.toFixed(2)),
    };
  });
}
