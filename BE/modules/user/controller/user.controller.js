const userModel = require("../../../DB/models/user.model");
const jwt = require("jsonwebtoken");
const { confirmEmailMessage, sendCredentialsMessage } = require("../../../services/emailMessages");
const { sendEmail } = require("../../../services/emailService");
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length == 0) {
      res.status(404).json({ status: "fail", message: "No users found" });
    } else {
      res.status(200).json({ status: "success", data: users });
    }
  } catch (error) {
    return res.status(404).json({ status: "fail", message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    let { email, name, title, role, hourPrice } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
      res.status(404).json({ status: "fail", message: "User already exists" });
    } else {
      let password = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      let addUser = new userModel({
        email,
        password: hashedPassword,
        name,
        title,
        role,
        hourPrice,
      });
      let savedUser = await addUser.save();
      let message = sendCredentialsMessage(savedUser.name, savedUser.email, password);
      sendEmail(savedUser.email, message, "Welcome On Board!");
      res.status(200).json({ status: "success", data: savedUser });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
    } else {
      res.status(200).json({ status: "success", data: user });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
    } else {
      res
        .status(200)
        .json({ status: "success", message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    // for user to require its info. by token mainly nut know by sending id
    let { id } = req.body;
    let user = await userModel.findById(id);

    if (!user) {
      res
        .status(404)
        .json({ status: "fail", message: "User not found, Invalid ID" });
    } else {
      res.status(200).json({ status: "success", data: user });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password using the model's method
    const isPasswordValid = await user.correctPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      status: 'success',
      data: token
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, title, hourPrice } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        status: "error", 
        message: "Passwords don't match" 
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        status: "error", 
        message: "User already exists" 
      });
    }

    const newUser = new userModel({
      email,
      password,
      name,
      title,
      hourPrice: hourPrice || 15, // Default hourly rate of $15 if not provided
    });

    const savedUser = await newUser.save();
    
    // Generate token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    return res.status(201).json({ 
      status: "success", 
      data: {
        user: savedUser,
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
};

const confirmEmail = async (req, res) => {
  try {
    let token = req.params.token;
    let { email } = jwt.verify(token, process.env.JWTKEY);
    let user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
    }else{
      user.confirmed = true;
      await user.save();
      res.status(200).json({ status: "success", data: user });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try{
    let{email,oldPassword,newPassword}=req.body;
    let user = await userModel.findOne({ email });
    let pass = oldPassword+user._id;
    if(oldPassword == newPassword){
      res.status(404).json({ status: "fail", message: "New password must be different from old password"});
    }
    if(!user || !(await user.correctPassword(pass,user.password))){
      res.status(404).json({ status: "fail", message: "Invalid email or password"});
    }else{
      user.password=newPassword;
      await user.save();
      res.status(200).json({ status: "success", data: user });
    }
  }catch(error){
    res.status(404).json({ status: "fail", message: error.message });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getUser,
  signin,
  signup,
  confirmEmail,
  updatePassword,
};
