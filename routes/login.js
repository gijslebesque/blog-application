const express 	= require('express')
const bcrypt 	= require('bcrypt-nodejs')
const db 			= require(__dirname + '/../modules/database')
const bodyParser 	= require('body-parser')
const routerLogin 	= express.Router()
const session 		= require(__dirname + '/../modules/session')

routerLogin.use(bodyParser.urlencoded({
	extended: true
}))


//login route
routerLogin.post('/login', (req,res)=>{
	if(req.body.login_email.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your email address."))
		return
	}

	if(req.body.login_password.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your password."))
		return
	}

	db.User.findOne({
		where: {
			email: req.body.login_email
		}
	}).then( user => {
		if(user == undefined) {
			res.redirect('/?message=' + encodeURIComponent("Account doesn't excist. Please create one first."))
		}
		bcrypt.compare(req.body.login_password, user.password, (err) =>{
			if (err) {
				res.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
			}
			else {
				req.session.user = user
				res.redirect('/profile')
			}

		})
	})
})

module.exports = routerLogin