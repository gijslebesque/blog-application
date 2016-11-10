// Including the necessary modules.
const express 		= require('express')
const fs 			= require('fs')
const sequelize 	= require('sequelize')
const bodyParser 	= require('body-parser')
const session 		= require('express-session')
const app 			= express()

app.use(session({
    secret: 'oh wow very secret much security',
    resave: true,
    saveUninitialized: false
}))


app.use(bodyParser.urlencoded({
	extended: true
}))

// All db information
let db = new sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres'
})

let User = db.define ('user', {
	firstName: 	sequelize.STRING,
	lastName: 	sequelize.STRING,
	email: 		{type: sequelize.STRING, unique: true},
	password: 	sequelize.STRING
})

let Message = db.define ('message', {
	title: 	sequelize.STRING,
	body: 	sequelize.STRING,
})
//db structure
// User.hasMany(Language)
// Language.belongsToMany(User)


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

app.get('/profile',  (req, res) =>{
	let user = req.session.user
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."))	
	} else {
		res.render('profile', {
			user: user
		})
		console.log(user)
	}
})

app.get('/messages', (req, res) =>{

})
//post routes

//register route
app.post('/signup', (req, res) =>{
	User.create({
		firstName: 	req.body.signup_firstname,
		lastName: 	req.body.signup_lastname,
		email: 		req.body.signup_email,
		password: 	req.body.signup_password
	}).then( user =>{
		req.session.user = user
		res.redirect('/profile')
	})
})

//login route
app.post('/login', (req,res)=>{
	if(req.body.login_email.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your email address."))
		return
	}

	if(req.body.login_password.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your password."))
		return
	}

	User.findOne({
		where: {
			email: req.body.login_email
		}
	}).then( user => {
		if (user !== null && req.body.login_password === user.password) {
			req.session.user = user
			res.redirect('/profile')
		} else {
			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
		}
	},  error =>{
		res.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
	})
})

app.post('/newMessage')



// app.post('/login', (req, res)=>{
// 	User.findOne({
// 		where: {
// 			email: req.body.login_email,
// 			password: req.body.password
// 		}
// 	}).then( users => {
// 		console.log(users)
// 		// if(user. == req.body.login_email) {

// 		// }
// 	})
// })

//sync db
db.sync({force:true}).then(db => {
	console.log('Synced db')
	app.listen(8000, () => {
		console.log("server running")
	})
})