const express 	= require('express')
const bcrypt 	= require('bcrypt-nodejs')
const db 			= require(__dirname + '/../modules/database')
const bodyParser 	= require('body-parser')
const routerSignUp 	= express.Router()


routerSignUp.use(bodyParser.urlencoded({
	extended: true
}))


routerSignUp.post('/signup', (req, res) =>{
	console.log(req.body)
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