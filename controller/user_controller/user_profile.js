const addressCollection = require("../../models/address_schema");
const orderCollection = require("../../models/orders_schema");
const userCollection = require("../../models/user_schema");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.getProfile = async (req, res)=>{
  const userSession = req.session.user;
  const userDetails = await userCollection.findOne({email: userSession.email});
  const userAddress = await addressCollection.findOne({userId: userDetails._id});
  const userOrders = await orderCollection.find({userId: userDetails._id});
  res.render('user_account', {userDetails, userSession, userAddress, userOrders});
}

module.exports.editProfile = async (req, res)=>{
try{
  const userSession = req.session.user;
  const username = req.body.username;
  const phoneNumber = req.body.phoneNumber;
  console.log(username);
  console.log(phoneNumber);
  await userCollection.updateOne({email: userSession.email},
    {$set:{
      username,
      phoneNumber
    }
    });
    res.redirect('/profile')
}catch(error){
  console.error(error);
}
}

module.exports.changePassword = async (req, res)=>{
try{
const userSession = req.session.user;
const user = await userCollection.findOne({email: userSession.email});
const currentPassword = req.body.currentPassword;
const newPassword = req.body.newPassword;
const passwordMatch = await bcrypt.compare(currentPassword, user.password);
if(!passwordMatch){
  return res.status(200).json({error:"Current Password is Incorrect"})
}else{
  const newPasswordMatch = await bcrypt.compare(newPassword, user.password);
  if(newPasswordMatch){
  return res.status(200).json({error:"You cannot use the old password"})
  }else{
    bcrypt.hash(newPassword, saltRounds, async(err, hash)=>{
      if(err){
        console.error('Error hashing password:', err);
          return;
      }
      await userCollection.updateOne({email: userSession.email},
        {$set:{
          password: hash
        }
        });
        return res.status(200).json({success:true})
      });
  }
}
}catch(error){
  console.error(error);
}
}


module.exports.viewOrders = async (req, res)=>{
  const orderId = req.query.orderId;
  const userSession = req.session.user;
  // const userDetails = await userCollection.findOne({email: userSession.email});
  const orderDetails = await orderCollection.findOne({_id: orderId})
  .populate({path: 'products.productId', model: 'Product'});
  res.render('view-order', {userSession, orderDetails});
}