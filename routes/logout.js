
const express 	= require('express')
const session 		= require(__dirname + '/../modules/session')
const routerLogout 	= express.Router()

routerLogout.get('/logout', function (req, res) {
    req.session.destroy(function(error) {
        if(error) {
            throw error;
        }
        res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
    })
})

module.exports = routerLogout