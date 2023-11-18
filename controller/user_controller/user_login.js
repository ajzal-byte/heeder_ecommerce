const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema')
const nodemailer = require('nodemailer');
// const { v4: uuidv4 } = require('uuid');
// const transporter = require('../emailConfig');


module.exports.getUserLogin = async (req, res)=>{
  try{
    const userSession = req.session.user;
    const products = await productCollection.find()
    if(userSession){
      res.render('user_index', {userSession, products})
    }else{
      res.render('user_login', {userSession});
    }
  }catch (error) {
    console.error(error);
  }
};


module.exports.postUserLogin = async (req, res)=>{
  try{
    const data = await userCollection.findOne({ email: req.body.email });
    if(!data){
      res.status(200).json({error: "This email is not registered"});
    }else if(data){
      if(data.status == 'Inactive'){
        res.status(200).json({error: "This user is blocked"});
      }else if(req.body.password !== data.password){
        res.status(200).json({error: "Incorrect Password"});
      }else{
        if(req.body.email === data.email && req.body.password === data.password){
          req.session.user = req.body.email;
          const userSession = req.session.user;
          const products = await productCollection.find()
          res.render('user_index', {userSession, products})
        }
      }
    }
  }catch(error){
    console.error(error);
  }
}


module.exports.getUserLogout = async (req, res)=>{
  try{
    req.session.destroy()
  res.render('user_login', {logout : true});
  }catch (error) {
    console.error(error);
  }
};


module.exports.getUserSignup = async (req, res)=>{
  try{
    res.render('user_signup')
  }catch (error) {
    console.error(error);
  }
}                                                                                                                                                              


module.exports.postUserSignup = async (req, res)=>{
  try{
    const {username, email, password, phoneNumber, status} = req.body;
    await userCollection.create({
     username,
      email,
      password,
      phoneNumber,
      status : "Active"
    });
    res.redirect('/login')
  }catch(error){
    console.error(error);
  }
};



let generatedOTP = null;
const generateOTP = () => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports.getSendOtp = async (req, res)=>{
  try{
    const phoneNumber = req.query.phoneNumber;
    const ifExist = await userCollection.findOne({
      $or: [
        {email : req.query.email},
        {phoneNumber : req.query.phoneNumber}
      ]
    });
    if(ifExist){
      res.status(200).json({error: "User already exists"})
    }else{
      const email = req.query.email;
      generatedOTP = generateOTP();

      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

        // Compose and send an email
        const mailOptions = {
          from:{
            name : "audiophile",
            address : process.env.EMAIL_USER,
          },
          to: email,
          subject: 'OTP for Account Verification',
          text: `Your OTP is: ${generatedOTP}`,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email has been sent: ' + info.response);
          }
        });

        res.status(200).json({message : "OTP send to email successfully"})
    }
  }catch (error) {
    console.error(error);
  }
}

//verify OTP

module.exports.verifyOTP = async (req, res)=>{
  try{
    userEnteredOTP = req.query.otpInput;
    if(userEnteredOTP === generatedOTP){
      res.status(200).json({message: "OTP Verification Successfull"});
    }else{
      res.status(400).json({error: "Incorrect OTP"});
    }
  }catch(error){
    console.error(error)
  }
};


//single product page

module.exports.getProductDetails = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
    const product_details = await productCollection.findOne({_id : product_id})
    // console.log(product_details);
    res.render('product_view', {product_details});
  }catch(error){
    console.error(error);
  }
}





