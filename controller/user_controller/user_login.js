const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema')
const cartCollection = require('../../models/cart_schema')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10; // The number of salt rounds determines the computational cost (higher is slower but more secure)
// const { v4: uuidv4 } = require('uuid');
// const transporter = require('../emailConfig');

module.exports.getHomePage = async(req, res, next)=>{
try{
  const products = await productCollection.find().populate({path:'category', model:'Categories'})
  .sort({updatedAt: -1}).limit(6);
  const userSession = req.session.user;
  let cartLength;
  let user;
  if(userSession){
      user = await userCollection.findOne({email: userSession.email})
      cartLength = await cartCollection.findOne({userId: user._id});
      if (cartLength && cartLength.products) {
        // Check if the cart and its products for the user exists
        cartLength = cartLength.products.length;
      }
  }
  console.log(user);
  res.render('user_index', {products, userSession, cartLength, user});
}catch(error){
  next(error);
}
};


module.exports.getUserLogin = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const products = await productCollection.find()
    if(userSession){
      res.redirect('/')
    }else{
      res.render('user_login', {userSession});
    }
  }catch (error) {
    next(error);
  }
};


module.exports.postUserLogin = async (req, res, next)=>{
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



module.exports.getUserLogout = async (req, res, next)=>{
  try{
    req.session.user = null;
  res.redirect('/login')
  }catch (error) {
    next(error);
  }
};


module.exports.getUserSignup = async (req, res, next)=>{
  try{
    res.render('user_signup')
  }catch (error) {
    next(error)
  }
};


module.exports.postUserSignup = async (req, res, next)=>{
  try{
    const {username, email, password, phoneNumber} = req.body;
    bcrypt.hash(password, saltRounds, async(err, hash)=>{
      if(err){
        console.error('Error hashing password:', err);
        return;
      }
      await userCollection.create({
        username,
        email,
        password: hash,
        phoneNumber,
        status: 'Active'
    }).then((data)=>{
      if(data){
        res.redirect('/login');
      }
    });
    });
    
  }catch(error){  
    next(error);
  }
};


//otp generator function
let generatedOTP = null;
const generateOTP = () => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};


module.exports.getSendOtp = async (req, res, next)=>{
  try{
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
      setTimeout(() => {
        generatedOTP = null; 
      }, 30000);

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
    next(error);
  }
};

//verify OTP

module.exports.verifyOTP = async (req, res, next)=>{
  try{
    let userEnteredOTP = req.query.otpInput;
    if(userEnteredOTP === generatedOTP){
      res.status(200).json({message: "OTP Verification Successfull"});
    }else if(generatedOTP == null) {
      res.status(200).json({error: "OTP Expired"});
    }else{
      res.status(200).json({error: "Incorrect OTP"});
    }
  }catch(error){
    next(error);
  }
};


//single product page
module.exports.getProductDetails = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const product_id = req.params.product_id;
    const product_details = await productCollection.findOne({_id : product_id}).populate({path:'category', model:'Categories'}).populate({path:'brand', model: 'brandCollection'})
    let cartLength;
    let user;
    if(userSession){
      user = await userCollection.findOne({email: userSession.email})
      cartLength = await cartCollection.findOne({userId: user._id});
      if (cartLength && cartLength.products) {
        // Check if the cart and its products for the user exists
        cartLength = cartLength.products.length;
      }
    }
    res.render('product_view', {product_details, userSession, cartLength, user});
  }catch(error){
    next(error);
  }
};

// view forgot password page
module.exports.getforgotPassword = async (req, res, next)=>{
  try{
    res.render('forgot_password');
  }catch(error){
    next(error);
  }
};


// send otp for forgot password
module.exports.getforgotSendOtp = async (req, res, next)=>{
  try{
    const ifExist = await userCollection.findOne({email: req.query.email});
    if(!ifExist){
      res.status(200).json({error: "This email is not registered"});
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
    

  }catch(error){
    next(error);
  }
};

// verify otp for forgot password
module.exports.forgotVerifyOtp = async (req, res, next)=>{
  try{
    let userEnteredOTP = req.query.otpInput;
    if(Number(userEnteredOTP) == Number(generatedOTP)){
      return res.status(200).json({message: "OTP Verification Successfull"});
    }else{
      return res.status(400).json({message: "Incorrect OTP"});
    }
  }catch(error){
    next(error);
  }
};

// changing the forgotten password
module.exports.forgotChangePassword = async (req, res, next)=>{
  try{
      const email = req.query.email;
      const newPassword = req.query.password;
      const user = await userCollection.findOne({email});
      const passwordMatch = await bcrypt.compare(newPassword, user.password)
     if(passwordMatch){
       return res.status(200).json({same:true})
     }else{
      bcrypt.hash(newPassword, saltRounds, async(err, hash)=>{  
        if(err){
          console.error('Error hashing password:', err);
          return;
        }
        await userCollection.updateOne({email}, {$set:{password: hash}})
        .then((data)=>{
          if(data){
            return res.status(200).json({same: false});
          }
        });
      });
    }
  }catch(error){
    next(error);
  }
};
