const addressCollection = require("../../models/address_schema");
const userCollection = require("../../models/user_schema")

module.exports.getProfile = async (req, res)=>{
  const userSession = req.session.user;
  const userDetails = await userCollection.findOne({email: userSession.email});
  const userAddress = await addressCollection.findOne({userId: userDetails._id});
  res.render('user_account', {userDetails, userSession, userAddress});
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
const user = userCollection.findOne({email: userSession.email});
const currentPassword = req.body.currentPassword;
const newPassword = req.body.newPassword;
const passwordMatch = await bcrypt.compare(currentPassword, user.password);
if(!passwordMatch){
  return res.status(200).json({error:"Incorrect Current Password"})
}
}catch(error){
  console.error(error);
}
}