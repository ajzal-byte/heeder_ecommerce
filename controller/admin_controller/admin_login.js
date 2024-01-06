const { generateChart } = require("../../helpers/generateChart");
const adminCollection = require("../../models/admin_schema");
const orderCollection = require('../../models/orders_schema');
const userCollection = require('../../models/user_schema');
const porductCollection  = require('../../models/products_schema'); 
const categoryCollection  = require('../../models/category_schema'); 
const brandCollection  = require('../../models/brand_schema'); 


// const user_schema = require('.../models/user_schema');

module.exports.getAdminRoute = async(req, res)=>{
  try{
    if(req.session.admin){
      return res.redirect('/admin/dashboard');
    }else{
      res.render('admin_signin');
    }
  }catch (error) {
    console.error(error);
  }
};


//checking entered deatils and database deatils of admin
module.exports.postAdminRoute = async (req, res) => {
  try{
    const data = await adminCollection.findOne({ email: req.body.email });
    if(!data) {
      res.render('admin_signin', {email: true});
    }
    if (data) {
        if (
        req.body.email === data.email &&
        req.body.password !== data.password
      ) {
        res.render('admin_signin', {password : true});
      } else if (
          req.body.email === data.email &&
          req.body.password === data.password
        ) {
          req.session.admin = req.body.email;
          res.redirect('/admin/dashboard')
        }
      
    } 
  }catch (error) {
    console.error(error);
  }
};

module.exports.getAdminLogout = async(req, res)=>{
  try{
  req.session.admin = null;
  res.redirect('/admin/login');
  }catch (error) {
    console.error(error);
  }
}

module.exports.getAdminDashboard = async(req, res)=>{
  try{
    let revenue = 0
    const products = await porductCollection.find();
    const category = await categoryCollection.find();
    const brands = await brandCollection.find();
    const newMembers = await userCollection.find().limit(3);
    const totalSales = await orderCollection.find({orderStatus: "Delivered"});
    totalSales.forEach(sales=>{
      revenue += sales.totalAmount;
    })
    const orders = await orderCollection
      .find()
      .populate({path:'userId', model:'userCollection'})
      .sort({createdAt: -1}).limit(5);
    const {yearlySales, monthlySales, weeklySales} = generateChart(totalSales)
    res.render('admin_index', {
    yearlySales,
    monthlySales,
    weeklySales,
    newMembers,
    orderCount: totalSales.length,
    productsCount: products.length,
    categoryCount: category.length,
    brandsCount: brands.length,
    revenue,
    orders
  });
  }catch (error) {
    console.error(error);
  }
}
