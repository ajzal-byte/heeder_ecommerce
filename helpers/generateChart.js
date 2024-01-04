const {
  filterOrdersByYear,
  filterOrdersByMonth,
  filterOrdersByWeek
} = require('./filterOrder');

const generateChart = (totalSales)=>{
  const yearlySales = {};
  const monthlySales = {};
  const weeklySales = {};

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentWeek = new Date().getDate(); 

  for (let i = 4; i >= 0; i--) {
    const filteredSalesByYear = filterOrdersByYear(totalSales, currentYear - i);
    const filteredSalesByMonth = filterOrdersByMonth(
      totalSales,
      currentYear - i,
      currentMonth - i
    );
    const filteredSalesByWeek = filterOrdersByWeek(
      totalSales,
      currentYear - i,
      currentMonth - i,
      currentWeek - i
    )
    yearlySales[currentYear - i] = filteredSalesByYear.length;
    monthlySales[monthNames[currentMonth - i]] = filteredSalesByMonth.length;
    weeklySales[currentWeek - i] = filteredSalesByWeek.length;
  }
  return {yearlySales, monthlySales, weeklySales};
};

module.exports = {generateChart}