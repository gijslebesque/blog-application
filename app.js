// Including the necessary modules.
const express 		= require('express')
const fs 			= require('fs')
const sequelize 	= require('sequelize')
const bodyParser 	= require('body-parser')
const app 			= express()


app.use(bodyParser.urlencoded({
	extended: true
}))

// All db information
let db = new sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres'
})

let User = db.define ('users', {
	firstName: 		sequelize.STRING,
	lastName: 	sequelize.STRING,
	email: 	sequelize.STRING,
	password: sequelize.STRING
})

let Language = db.define('language', {
	language: sequelize.STRING,
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
	res.render('home')
})

app.get('/profile', (req, res) => {
	res.render('profile')
})	

//post routes

//register route
app.post('/', (req, res) =>{
	User.create({
			firstName: req.body.singup_firstname,
			lastName: req.body.singup_lastname,
			email: req.body.singup_email,
			password: req.body.singup_password
		}).then(message => {
			console.log('saved message in database')
		}).then( ()=>{
			res.redirect('/profile	')
		})
})

//login route
app.post('/')

//sync db
db.sync({force:true}).then(db => {
	console.log('Synced db')
	app.listen(8000, () => {
		console.log("server running")
	})
})