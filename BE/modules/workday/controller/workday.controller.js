const workdayModel = require("../../../DB/models/workday.model");
const userModel = require("../../../DB/models/user.model");

const getAllWorkDays = async (req, res) => {
    try{
        const workdays = await workdayModel.find();
        if(workdays.length == 0){
            res.status(404).json({status:"fail", message:"No workdays found"});
        }else{
            res.status(200).json({status:"success", data:workdays});
        }
    }catch(error){
        return res.status(404).json({status:"fail", message:error.message});
    }
};

const checkIn = async (req, res) => {
    try {
        const {email, checkInTime} = req.body;
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.status(404).json({status:"fail", message:"User not found"});
        }

        // Check if user already has an open workday
        const openWorkday = await workdayModel.findOne({userId: user._id, checkOutTime: null});
        if(openWorkday) {
            return res.status(400).json({status:"fail", message:"You already have an open workday"});
        }

        // Create new workday
        const workday = new workdayModel({
            checkInTime: new Date(checkInTime),
            userId: user._id,
            workHours: 0,
            balance: 0
        });

        const savedWorkDay = await workday.save();
        res.status(200).json({status:"success", data:savedWorkDay});
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({status:"fail", message: error.message});
    }
};

const checkOut = async (req, res) => {
    try {
        const {email, checkOutTime} = req.body;
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.status(404).json({status:"fail", message:"User not found"});
        }

        const workday = await workdayModel.findOne({userId: user._id, checkOutTime: null});
        if(!workday){
            return res.status(404).json({status:"fail", message:"No active workday found"});
        }

        // Convert times to Date objects
        const checkOutDate = new Date(checkOutTime);
        const checkInDate = new Date(workday.checkInTime);

        // Calculate work hours (in hours)
        const timeDiff = checkOutDate - checkInDate;
        const workHours = parseFloat((timeDiff / (1000 * 60 * 60)).toFixed(2));

        // Calculate balance
        const balance = parseFloat((workHours * (user.hourPrice || 0)).toFixed(2));

        // Update workday
        workday.checkOutTime = checkOutDate;
        workday.workHours = workHours;
        workday.balance = balance;

        const savedWorkDay = await workday.save();
        res.status(200).json({status:"success", data:savedWorkDay});
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({status:"fail", message: error.message});
    }
};

const getWorkHistory = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({status:"fail", message:"Email is required"});
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({status:"fail", message:"User not found"});
        }

        const monthToRetrieve = parseInt(req.query.month, 10) || 0;
        let workdays = [];
        
        if(monthToRetrieve === 0){
            workdays = await workdayModel.find({userId: user._id}).sort({checkInTime: -1});
        } else {
            workdays = await workdayModel.aggregate([
                {
                    $match: {
                        userId: user._id,
                        $expr: { $eq: [{ $month: '$checkInTime' }, monthToRetrieve] },
                    },
                },
                { $sort: { checkInTime: -1 } }
            ]);
        }

        if(workdays.length === 0){
            return res.status(200).json({status:"success", data: [], message:"No workdays found"});
        }

        let monthBalance = 0;
        workdays.forEach(workday => {
            monthBalance += workday.balance || 0;
        });

        res.status(200).json({
            status:"success",
            balance: monthBalance,
            data: workdays
        });
    } catch(error){
        console.error('Work history error:', error);
        res.status(500).json({status:"fail", message: error.message});
    }
};

module.exports = {getAllWorkDays ,checkIn, checkOut, getWorkHistory};