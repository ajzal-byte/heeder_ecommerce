const orderCollection  = require('../../models/orders_schema');
const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema');

module.exports.getSalesReport = async (req, res)=>{
  try{
  let totalRevenue = 0;
  const orders = await orderCollection
  .find()
  .populate({path:'userId', model:'userCollection'})
  .sort({createdAt: -1});

  const successOrders = orders.filter(order => order.paymentStatus === 'Success');
  const count = successOrders.length;
  totalRevenue = successOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  res.render('sales-report', {
    orders,
    count,
    totalRevenue: totalRevenue.toFixed(2),
  });
  }catch(error){
    console.error(error);
  }
}

module.exports.filterSalesReport = async (req, res)=>{
try{
  const { startDate, endDate } = req.query;
  let totalRevenue = 0;
  let orders = [];
  if (startDate && endDate) {
    orders = await orderCollection.find({
      orderDate: {
        $gte: new Date(`${startDate}T00:00:00.000`),
        $lte: new Date(`${endDate}T23:59:59.999`)
      }
      
    }).populate({path:'userId', model:'userCollection'})
    .sort({createdAt: -1});
  }
  const successOrders = orders.filter(order => order.paymentStatus === 'Success');
  const count = successOrders.length;
  totalRevenue = successOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  res.render('sales-report', {
    orders,
    count,
    totalRevenue: totalRevenue.toFixed(2),
  });

}catch(error){
    console.error(error);
  }
}


