const orderCollection  = require('../../models/orders_schema');
const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema');

module.exports.getSalesReport = async (req, res)=>{
  try{
        const orders = await orderCollection
        .find()
        .populate({path:'userId', model:'userCollection'})
        .sort({createdAt: -1})

        const count = await orderCollection.countDocuments({});
        res.render('sales-report', {
          orders,
          count,
        });
  }catch(error){
    console.error(error);
  }
}




