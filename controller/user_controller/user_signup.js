const userCollection = require('../../models/user_schema');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10; // The number of salt rounds determines the computational cost (higher is slower but more secure)
// const { v4: uuidv4 } = require('uuid');


const getUserSignup = async (req, res, next)=>{
  try{
    res.render('user_signup')
  }catch (error) {
    next(error)
  }
};


const postUserSignup = async (req, res, next)=>{
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
        status: 'Active',
        wallet: 0,
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


const getSendOtp = async (req, res, next)=>{
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
      }, 60000);

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
            name : "heeder.",
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

const verifyOTP = async (req, res, next)=>{
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



// view forgot password page
const getforgotPassword = async (req, res, next)=>{
  try{
    res.render('forgot_password');
  }catch(error){
    next(error);
  }
};


// send otp for forgot password
const getforgotSendOtp = async (req, res, next)=>{
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
          name : "heeder.",
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
const forgotVerifyOtp = async (req, res, next)=>{
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
const forgotChangePassword = async (req, res, next)=>{
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

module.exports = {
  getUserSignup,
  postUserSignup,
  getSendOtp,
  verifyOTP,
  getforgotPassword,
  getforgotSendOtp,
  forgotVerifyOtp,
  forgotChangePassword
}
