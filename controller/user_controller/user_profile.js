const userCollection = require("../../models/user_schema")

module.exports.getProfile = async (req, res)=>{
  const userSession = req.session.user;
  const userDetails = await userCollection.findOne({email: userSession.email});
  res.render('user_account', {userDetails, userSession});
}