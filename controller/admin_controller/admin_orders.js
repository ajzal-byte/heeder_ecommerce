const orderCollection  = require('../../models/orders_schema');


module.exports.getOrders = async (req, res)=>{
try{
    if(req.session.admin){
      const orders = await orderCollection
      .find()
      .populate({path:'userId', model:'userCollection'})
      .populate({path:'products.productId', model:'Product'});
      res.render('orders-page', {orders});
    }else{
      res.redirect('/admin')
    }
}catch(error){
  console.error(error);
}
}

module.exports.viewOrder = async (req, res)=>{

}