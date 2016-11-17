
const express = require ('express')
const db 			= require(__dirname + '/../modules/database')
const routerProfile = express.Router()

routerProfile.get('/profile',  (req, res) =>{
	let user = req.session.user
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."))	
	} else {
		db.Message.findOne({
			where:{ userId: user.id},
			include: [db.Comment]
			}).then(result =>{
				console.log(result)
				res.render('profile', {
				messages: [result],
				user: user
				})
			})
		}
})

module.exports = routerProfile