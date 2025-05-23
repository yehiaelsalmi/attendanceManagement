const router = require('express').Router();
const {getAllWorkDays ,checkIn, checkOut, getWorkHistory} = require('./controller/workday.controller');

router.route("/allWorkDays").get(getAllWorkDays);
router.route("/checkIn").post(checkIn);
router.route("/checkOut").post(checkOut);
router.route("/getWorkHistory").get(getWorkHistory);


module.exports = router;