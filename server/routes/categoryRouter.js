const router = require('express').Router();
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

//different types of requests are handled on route /category
router.route('/category')
.get(categoryCtrl.getCategory)
.post(auth,authAdmin,categoryCtrl.createCategory)

//Dynamic route to handle perticular 
router.route('/category/:id')
.delete(auth,authAdmin,categoryCtrl.deleteCategory)
.put(auth,authAdmin,categoryCtrl.updateCategory)

module.exports = router;

