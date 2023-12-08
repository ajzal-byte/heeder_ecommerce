const addressCollection = require("../../models/address_schema");
const userCollection = require("../../models/user_schema")

module.exports.getProfile = async (req, res)=>{
  const userSession = req.session.user;
  const userDetails = await userCollection.findOne({email: userSession.email});
  const userAddress = await addressCollection.findOne({userId: userDetails._id});
  res.render('user_account', {userDetails, userSession, userAddress});
}

module.exports.editProfile = async (req, res)=>{
  
}
