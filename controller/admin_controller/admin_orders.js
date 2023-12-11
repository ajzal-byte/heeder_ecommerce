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
try{
  if(req.session.admin){
    const orderId = req.params.orderId;
  const orderDetails = await orderCollection.findOne({_id: orderId}).populate({path: 'products.productId', model: 'Product'});
  res.render('edit-order', {orderDetails});
  }else{
    res.redirect('/admin')
  }
}catch(error){
  console.error(error);
}
}

module.exports.dispatchOrder = async (req, res)=>{
try{
  const orderId = req.params.orderId;
  console.log(orderId);
  await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Shipped'});
  res.redirect(`/admin/view-order/${orderId}`)
}catch(error){
  console.error(error);
}
}

module.exports.cancelOrder = async (req, res)=>{
try{
  const orderId = req.params.orderId;
  await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Cancelled'});
  res.redirect(`/admin/view-order/${orderId}`)
}catch(error){
  console.error(error);
}
}

module.exports.deliverOrder = async (req, res)=>{
try{
  const orderId = req.params.orderId;
  await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Delivered'});
  res.redirect(`/admin/view-order/${orderId}`)
}catch(error){
  console.error(error);
}
}