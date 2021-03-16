var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/new', checkAuth, function(req, res, next){
    res.render('index', { title: 'Member Test'});
});
function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}
module.exports = router;