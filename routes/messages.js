
const express = require ('express')
const db 			= require(__dirname + '/../modules/database')
const bodyParser 	= require('body-parser')
const routerMessages = express.Router()


routerMessages.use(bodyParser.urlencoded({
	extended: true
}))


routerMessages.get('/messages', (req, res) =>{
	if (req.session.user == undefined) {
		res.redirect('/?message=' + encodeURIComponent('You are not signed in'))
		return
	}
	db.Message.findAll({
		include: [ db.User, db.Comment ]
	}).then( result => {
		res.render('messages', {messages: result})
	})
	
})


routerMessages.post('/newMessage', (req, res) =>{
	db.Message.create({
		title: req.body.title,
		body: req.body.body,
		userId: req.session.user.id
	}).then( ()=> {
		res.redirect('messages')
	})
})

routerMessages.post('/comment', (req, res)=>{
	console.log(req.body)
	db.Comment.create({
		comment: req.body.body,
		messageId: req.body.postId,
		userId: req.session.user.id
	}).then((message)=>{
		console.log('comment saved')
		res.send(message)
	})
})


module.exports = routerMessages