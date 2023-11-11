// const adminCollection = require('.../models/adminCollection');
const adminCollection = require("../../models/admin_schema")
// const user_schema = require('.../models/user_schema');

module.exports.getAdminRoute = async(req, res)=>{
  if(req.session.admin){
    res.render('admin_index')
  }else{
    res.render('admin_signin');
  }
};


//checking entered deatils and database deatils of admin
module.exports.postAdminRoute = async (req, res) => {
  const data = await adminCollection.findOne({ email: req.body.email });
  // const users = await userCollection.find({});
  if (data) {
      if (
      req.body.email === data.email &&
      req.body.password !== data.password
    ) {
      res.render('admin_signin', {password : true});
    } else {
      if (
        req.body.email === data.email &&
        req.body.password === data.password
      ) {
        req.session.admin = req.body.email;
        // console.log(req.session.admin);
        res.render("admin_index");
      }
    }
  } else {
    res.render('admin_signin', {email: true});
  }
};

module.exports.getAdminLogout = async(req, res)=>{
  req.session.destroy()
  res.render('admin_signin', {logout : true});
}

module.exports.getAdminDashboard = async(req, res)=>{
  // res.render('admin_index')
  if(req.session.admin){
    res.render('admin_index');
  }else{
    res.redirect('/admin')
  }
  }
