// Including the necessary modules.
const dotenv = require('dotenv').config()
const express 		= require('express')
const routerSignUp 	= require(__dirname + '/routes/signup')
const routerLogin 	= require(__dirname + '/routes/login')
const routerMessages = require (__dirname + '/routes/messages')
const routerProfile = require (__dirname + '/routes/profile')
const routerLogout	= require(__dirname + '/routes/logout')
const session 		= require('express-session')
const app 			= express()


app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false
}))

//load static files
app.use('/src', express.static(__dirname + '/static'))

//set view engine
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

//set routes

app.get('/', (req, res)=>{
	
	res.render('home', {
		message: req.query.message,
		user: req.session.user
	})
})

app.use('/', routerSignUp)

app.use('/', routerLogin)

app.use('/', routerLogout)

app.use('/', routerProfile)

app.use('/', routerMessages)


	
app.listen(8000, () => {
	console.log("server running")
})