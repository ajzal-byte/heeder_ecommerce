const userCollection = require('../../models/user_schema');
const bcrypt = require('bcrypt');


const getUserLogin = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    if(userSession){
      res.redirect('/')
    }else{
      res.render('user_login', {userSession});
    }
  }catch (error) {
    next(error);
  }
};


const postUserLogin = async (req, res, next)=>{
  try{
    const email = req.query.email;
    const password = req.query.password;
    const data = await userCollection.findOne({ email});
    if(!data){
    res.status(200).json({ error: "This email is not registered" });
    }else if(data){
      const passwordMatch = await bcrypt.compare(password, data.password)
      if(data.status == 'Inactive'){
        res.status(200).json({ error: "This user is blocked" });
      }else if(!passwordMatch){
        res.status(200).json({ error: "Incorrect Password" });
      }else{
        req.session.user = {
        email: email,
        username: data.username 
      };
      res.status(200).json({ success: true });
      }
    }
  }catch(error){
    next(error);
  }
};



const getUserLogout = async (req, res, next)=>{
  try{
    req.session.user = null;
  res.redirect('/login')
  }catch (error) {
    next(error);
  }
};


module.exports = {
  getUserLogin,
  postUserLogin,
  getUserLogout
}