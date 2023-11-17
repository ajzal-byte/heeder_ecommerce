const userCollection = require('../../models/user_schema');
const nodemailer = require('nodemailer');
// const transporter = require('../emailConfig');


module.exports.getUserLogin = async (req, res)=>{
  try{
    if(req.session.user){
      res.render('user_index')
    }else{
      res.render('user_login');
    }
  }catch (error) {
    console.error(error);
  }
};

module.exports.postUserLogin = async (req, res)=>{
  try{
    const data = await userCollection.findOne({ email: req.body.email });
    if(data){
      // if(
        // req.body.email === data.email &&
        // req.body.password === data.password
      // ){
        res.render(user_index);
      // }else{

      // }
    }
  }catch(error){
    console.error(error);
  }
}


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
      username : username,
      email : email, 
      password : password, 
      phoneNumber : phoneNumber,
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
          user: 'ajzalaju10@gmail.com',
          pass: 'kvak sttz odwj sokc',
        },
      });

        // Compose and send an email
        const mailOptions = {
          from: 'ajzalaju10@gmail.com',
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







