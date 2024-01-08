const userCollection = require('../../models/user_schema');

const getUsers = async (req, res)=>{
  try{
      const users = await userCollection.find();
      res.render('users_list', {users});
  }catch(error){
    console.error(error)
  }
}

const blockUser = async (req, res)=>{
  try{
    const user_id = req.params.user_id;
    await userCollection.findByIdAndUpdate(user_id, {status: 'Inactive'});
    // const users = await userCollection.find()
    // res.render('users_list', {users});
    res.redirect('/admin/users')
  }catch (error) {
    console.error(error);
  }
}

const unblockUser = async (req, res)=>{
  try{
    const user_id = req.params.user_id;
    await userCollection.findByIdAndUpdate(user_id, {status: 'Active'});
    // const users = await userCollection.find()
    // res.render('users_list', {users});
    res.redirect('/admin/users')
  }catch (error) {
    console.error(error);
  }
}


module.exports = {
  getUsers,
  blockUser,
  unblockUser
}