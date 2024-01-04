const filterOrdersByYear = (orders, year)=>{
  return orders.filter(
    order => new Date(order.deliveryDate).getFullYear() === year
  );
}

const filterOrdersByMonth = (orders, year, month)=>{
  return orders.filter(order=>{
    const deliveryDate = new Date(order.deliveryDate);
    return deliveryDate.getFullYear() === year && deliveryDate.getMonth() === month
  });
}

const filterOrdersByWeek = (orders, year, month, week) =>{
  return orders.filter(order=>{
    const deliveryDate = new Date(order.deliveryDate);
    return deliveryDate.getFullYear() === year && 
    deliveryDate.getMonth() === month && 
    Math.ceil(deliveryDate.getDate()) === week
  });
}

module.exports = {
  filterOrdersByYear,
  filterOrdersByMonth,
  filterOrdersByWeek
}