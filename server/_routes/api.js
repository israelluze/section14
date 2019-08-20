var express = require("express");
var router = express.Router();
var PersonController = require('../_controllers/PersonController');
var ProductController = require('../_controllers/ProductController');
var AuthController = require('../_controllers/AuthController');

router.use(AuthController.check_token); // faz com que se não ocorrer o next pare a execução dos demais middlewares

router.get('/people',PersonController.all);
router.get('/products', ProductController.all);

module.exports = router;