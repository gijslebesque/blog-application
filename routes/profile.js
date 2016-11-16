

const express = require ('express')
const db 			= require(__dirname + '/../modules/database')
const routerProfile = express.Router()



routerProfile.get('/profile',  (req, res) =>{
	if (req.session.user == undefined) {
		res.redirect('/?message=' + encodeURIComponent('You are not signed in'))
		return
	}
	let user = req.session.user
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."))	
	} else {
		res.render('profile', {
			user: user,
		})
	}
})

module.exports = routerProfile