const router = require('express').Router();
const { getAllUsers, addUser, getUserById, updateUser, deleteUser, getUser, signin, signup, confirmEmail,updatePassword } = require('./controller/user.controller');
const userValidation = require('./userValidaton');
const handleValidation = require('../../middleware/validation');

router.route('/allUsers').get(getAllUsers);
router.route('/addUser').post(userValidation[(0,1,2,3,4)], handleValidation(),addUser); 
router.route('/signin').post(signin);
router.route('/getUser').get(getUser);
router.route('/:id').get(getUserById).patch(updateUser);
router.route('/delete/:id').delete(deleteUser);
router.route("/updatePassword").post(updatePassword);

router.route('/signup').post(signup);
router.get("/confirmAccount/:token", confirmEmail);  

module.exports = router;