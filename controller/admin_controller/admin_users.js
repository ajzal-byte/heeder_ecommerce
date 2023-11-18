const userCollection = require('../../models/user_schema');

module.exports.getUsers = async (req, res)=>{
  try{
    if(req.session.admin){
      const users = await userCollection.find();
      res.render('users_list', {users});
    }else{
      res.redirect('/admin');
    }
  }catch(error){
    console.error(error)
  }
}

module.exports.blockUser = async (req, res)=>{
  try{
    const user_id = req.params.user_id;
    await userCollection.findByIdAndUpdate(user_id, {status: 'Inactive'});
    const users = await userCollection.find()
    res.render('users_list', {users});
  }catch (error) {
    console.error(error);
  }
}

module.exports.unblockUser = async (req, res)=>{
  try{
    const user_id = req.params.user_id;
    await userCollection.findByIdAndUpdate(user_id, {status: 'Active'});
    const users = await userCollection.find()
    res.render('users_list', {users});
  }catch (error) {
    console.error(error);
  }
}


