const orderCollection  = require('../../models/orders_schema');
const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema');


module.exports.getOrders = async (req, res)=>{
try{
  let perPage = 5;
  let page = req.query.page || 1;
      const orders = await orderCollection
      .find()
      .populate({path:'userId', model:'userCollection'})
      .sort({createdAt: -1})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec()

      const count = await orderCollection.countDocuments({});

      res.render('orders-page', {
        orders,
        current: page,
        pages: Math.ceil(count / perPage),
      });
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
  const order = await orderCollection.findById(orderId);
    if (order) {
      for (const product of order.products) {
        await productCollection.updateOne(
          { _id: product.productId },
          {$inc: {stock: product.quantity}}
        );
      }
    }
    if(order.paymentMethod == "Online Payment"){
      const user = await userCollection.findOne({_id: order.userId});
      if(user){
        if(user.wallet){
          await userCollection.updateOne(
          {_id: order.userId},
          {$inc: { wallet: order.totalAmount }});
        }else{
          await userCollection.updateOne(
          {_id: order.userId},
          {$set: { wallet: order.totalAmount }});
        }
      }
    }
  await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Cancelled', paymentStatus: 'Failed'});
  res.redirect(`/admin/view-order/${orderId}`)
}catch(error){
  console.error(error);
}
}

module.exports.deliverOrder = async (req, res)=>{
try{
  const orderId = req.params.orderId;
  await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Delivered', paymentStatus: 'Success', deliveryDate: Date.now()});
  res.redirect(`/admin/view-order/${orderId}`)
}catch(error){
  console.error(error);
}
}