const userCollection = require("../../models/user_schema");
const addressCollection = require('../../models/address_schema')
const cartCollection = require('../../models/cart_schema');

const getAddAddress = async (req, res, next)=>{
try{
  const source = req.query.source;
  const userSession = req.session.user;
  let cartLength;
  let user;
  if(userSession){
    user = await userCollection.findOne({email: userSession.email})
    cartLength = await cartCollection.findOne({userId: user._id});
    if (cartLength && cartLength.products) {
      // Check if the cart and its products for the user exists
      cartLength = cartLength.products.length;
    }
  }
  res.render('add-address', {userSession, user, source, cartLength})
}catch(error){
  next(error);
}
}

const postAddAddress = async (req, res, next)=>{
try{
  const source = req.query.source;
  const {name, addressType, city, landMark, state, pincode, phone, altPhone} = req.body;
  const userSession = req.session.user;
  const user = await userCollection.findOne({email: userSession.email});
  const userAddress= await addressCollection.findOne({userId: user._id});
  if(userAddress){
    userAddress.address.push({name, addressType, city, landMark, state, pincode, phone, altPhone});
    await userAddress.save()
  }else{
    await addressCollection.create({
      userId: user._id,
      address:[{name, addressType, city, landMark, state, pincode, phone, altPhone}]
    });
    // res.status(200).json({message: "Address added"});
  }
  if(source){
    return res.redirect('/profile')
  }
  res.redirect('/checkout')

}catch(error){
  next(error);
}
}

const getEditAddress = async (req, res, next)=>{
try{
  const userSession = req.session.user;
  let cartLength;
  if(userSession){
    const user = await userCollection.findOne({email: userSession.email})
    cartLength = await cartCollection.findOne({userId: user._id});
    if (cartLength && cartLength.products) {
      // Check if the cart and its products for the user exists
      cartLength = cartLength.products.length;
    }
  }
  const user = await userCollection.findOne({email: userSession.email});
  const addressId = req.query.addressId;
  const objectId = req.query.objectId;
  const userAddress = await addressCollection.findOne({userId: user._id, "address._id": addressId}, { "address.$": 1 });
  if (userAddress && userAddress.address){
    res.render('edit-address', {userSession, userAddress, cartLength, user})
  }else {
    console.log('Address not found');
  }
}catch(error){
  next(error);
}
}


const postEditAddress = async (req, res, next)=>{
  try{
    const {name, addressType, city, landMark, state, pincode, phone, altPhone} = req.body;
    const userSession = req.session.user;
    const addressId = req.query.addressId;
    const user = await userCollection.findOne({email: userSession.email});
    const userAddress = await addressCollection.findOneAndUpdate(
  { "address._id": addressId },
  {
    $set: {
      "address.$.addressType": addressType,
      "address.$.name": name,
      "address.$.city": city,
      "address.$.landMark": landMark,
      "address.$.state": state,
      "address.$.pincode": pincode,
      "address.$.phone": phone,
      "address.$.altPhone": altPhone,
    },
  }
);

    res.redirect('/profile')
  
  }catch(error){
    next(error);
  }
}

const deleteAddress = async (req, res, next)=>{
try{
  const userSession = req.session.user;
  const addressId = req.query.addressId;
  const user = await userCollection.findOne({email: userSession.email});
  const userAddress = await addressCollection.updateOne({userId: user._id},
  {$pull:{ address:{
    _id: addressId
  }
  }});
  res.redirect('/profile');
}catch(error){
  next(error);
}
}

module.exports = {
  getAddAddress,
  postAddAddress,
  getEditAddress,
  postEditAddress,
  deleteAddress
}