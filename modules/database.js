const sequelize 	= require('sequelize')
// All db information

const db = {

}

db.connect = new sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres'
})

db.User = db.connect.define ('user', {
	firstName: 	sequelize.STRING,
	lastName: 	sequelize.STRING,
	email: 		{type: sequelize.STRING, unique: true},
	password: 	sequelize.STRING
})

db.Message = db.connect.define ('message', {
	title: 	sequelize.STRING,
	body: 	sequelize.TEXT,
})

db.Comment = db.connect.define ('comment', {
	comment: sequelize.TEXT,
})

//db structure
db.User.hasMany(db.Message)
db.Message.belongsTo(db.User)
db.Message.hasMany(db.Comment)
db.Comment.belongsTo(db.Message)
db.User.hasMany(db.Comment)
db.Comment.belongsTo(db.User)

db.connect.sync({force:true}).then(db => {
	console.log('Synced db')


	// db.User.create({
	// 	firstName: 	"Gijs",
	// 	lastName: 	"Lebesque",
	// 	email: 		"gijs@gmail.com",
	// 	password: 	"ww"
	// }).then( gijs => {
	// 	gijs.createMessage({
	// 		title: 	"Demo post",
	// 		body: 	"lorem ipsum amit delor",
	// 	}).then( message => {
	// 		message.createdb.Comment({
	// 			comment: "DEEZ NUTS, AHA"
	// 		}).then( comment => {
	// 			comment.setUser( gijs )
	// 		} )
	// 	} )
	// } )
})
module.exports = db