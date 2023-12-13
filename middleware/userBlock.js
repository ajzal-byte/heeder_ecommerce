const userCollection = require("../models/user_schema");

module.exports.ifBlocked = async (req, res, next)=>{
  const userSession = req.session.user;
  if(userSession){
    const userData = await userCollection.findOne({email: userSession.email});
  if(userData.status == "Inactive"){
    req.session.user = null;
    return res.redirect('/login');
  }
}
next();
}