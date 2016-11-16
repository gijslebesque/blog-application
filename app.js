// Including the necessary modules.
const express 		= require('express')
const fs 			= require('fs')
const sequelize 	= require('sequelize')
const bodyParser 	= require('body-parser')
const session 		= require('express-session')
const bcrypt 		= require('bcrypt-nodejs')
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
	body: 	sequelize.TEXT,
})

let Comment = db.define ('comment', {
	comment: sequelize.TEXT,
})

//db structure
User.hasMany(Message)
Message.belongsTo(User)
Message.hasMany(Comment)
Comment.belongsTo(Message)
User.hasMany(Comment)
Comment.belongsTo(User)



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

app.get('/messages', (req, res) =>{
	if (req.session.user == undefined) {
		res.redirect('/?message=' + encodeURIComponent('You are not signed in'))
		return
	}
	Message.findAll({
		include: [ User, Comment ]
	}).then( result => {
		res.render('messages', {messages: result})
	})
	
})

// app.get('/comments', (req, res)=>{
// 	let user =req.session.user
// 	res.render('comments')
// })
//post routes

//register route
app.post('/signup', (req, res) =>{
	console.log(req.body)
	bcrypt.hash(req.body.signup_password, null, null, (err, hash)=>{
		if (err) throw err
			User.create({
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
		if(user == undefined) {
			res.redirect('/?message=' + encodeURIComponent("Account does'nt excist. Please create one first."))
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
// 		if (user !== null && req.body.login_password === user.password) {
// 			req.session.user = user
// 			res.redirect('/profile')
// 		} else {
// 			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
// 		}
// 	},  error =>{

// 	})
// })

app.post('/newMessage', (req, res) =>{
	Message.create({
		title: req.body.title,
		body: req.body.body,
		userId: req.session.user.id
	}).then( ()=> {
		res.redirect('messages')
	})
})

app.post('/comment', (req, res)=>{
	Comment.create({
		comment: req.body.body,
		messageId: req.body.postId,
		userId: req.session.user.id
	}).then((message)=>{
		console.log('comment saved')
		res.send(message)
	})
})


//sync db
db.sync().then(db => {
	console.log('Synced db')

	// User.create({
	// 	firstName: 	"Gijs",
	// 	lastName: 	"Lebesque",
	// 	email: 		"gijs@thefrench.fr",
	// 	password: 	"password"
	// }).then( gijs => {
	// 	gijs.createMessage({
	// 		title: 	"Demo post",
	// 		body: 	"lorem ipsum amit delor",
	// 	}).then( message => {
	// 		message.createComment({
	// 			comment: "DEEZ NUTS, AHA"
	// 		}).then( comment => {
	// 			comment.setUser( gijs )
	// 		} )
	// 	} )
	// } )
	
	app.listen(8000, () => {
		console.log("server running")
	})
})