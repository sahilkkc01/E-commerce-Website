const userCtrl = require('../controllers/userCtrls');
const auth = require('../middleware/auth');


const router = require('express').Router();

router.post('/register',userCtrl.register)
router.post('/login',userCtrl.login)
router.get('/logout',userCtrl.logout)
router.post('/refresh_token',userCtrl.refreshtoken)

//First use auth middleware for authenctication then go to getUser function
router.get('/info',auth,userCtrl.getUser);


module.exports= router;