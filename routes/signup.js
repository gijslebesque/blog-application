
const express 		= require('express')
const bcrypt 		= require('bcrypt-nodejs')
const db 			= require(__dirname + '/../modules/database')
const bodyParser 	= require('body-parser')
const routerSignUp 	= express.Router()


routerSignUp.use(bodyParser.urlencoded({
	extended: true
}))


routerSignUp.post('/signup', (req, res) =>{
	
		if(req.body.signup_firstname == undefined){
			res.redirect('/?message=' + encodeURIComponent('Provide your name'))
			return
		}

		if(req.body.signup_lastname == undefined){
			res.redirect('/?message=' + encodeURIComponent('Provide your last name'))
			return
		}
		
		if(req.body.signup_password == undefined) {
			res.redirect('/?message=' + encodeURIComponent('Provide a password'))
			return
		}
		if(req.body.signup_password !== req.body.signup_confirmPassword) {
			res.redirect('/?message=' + encodeURIComponent('The passwords you provided differ'))
			return
		}

	bcrypt.hash(req.body.signup_password, null, null, (err, hash)=>{

		if (err) throw err
			db.User.create({
				firstName: 	req.body.signup_firstname,
				lastName: 	req.body.signup_lastname,
				email: 		req.body.signup_email,
				password: 	hash
			}).then( user =>{
				req.session.user = user
				res.redirect('/profile')
			})
	})
})

module.exports = routerSignUp