const orderCollection  = require('../../models/orders_schema');
const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema');

module.exports.getSalesReport = async (req, res)=>{
  try{
        const orders = await orderCollection
        .find()
        .populate({path:'userId', model:'userCollection'})
        .sort({createdAt: -1});

        const count = await orderCollection.countDocuments({});
        res.render('sales-report', {
          orders,
          count,
        });
  }catch(error){
    console.error(error);
  }
}

module.exports.filterSalesReport = async (req, res)=>{
try{
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  let orders = [];
  if (startDate && endDate) {
    orders = await orderCollection.find({
    orderDate: {$gte: startDate, $lte: `${endDate}T23:59:59.999Z`}
    }).populate({path:'userId', model:'userCollection'})
    .sort({createdAt: -1});
  }
  const count = orders.length;
  res.render('sales-report', {
    orders,
    count,
  });

}catch(error){
    console.error(error);
  }
}


