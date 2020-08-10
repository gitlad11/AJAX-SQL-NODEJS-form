const express = require('express')
const path = require('path')
const fs = require('fs')
const handlebars = require('express-handlebars')
const hbs = require('hbs')
const mysql = require('mysql')
const myconnection = require('express-myconnection')

var config = require('./config.json')
//global values
var app = express()
var PORT = 3001 
var HOST = config.HOST
var DB_HOST = config.DB_HOST
var DB_PORT = config.DB_USER
var DB_USER = config.DB_USER

//databases
		//////////////////////////////
		
				//////////////////////////////
var connection = mysql.createConnection({
  host     : `${DB_HOST}`,
  user     : `${DB_USER}`,
  password : 'n7JpWZSsOY',
  database : `${DB_USER}`,
  port 	   : `${DB_PORT}`,
});
connection.connect(function(err){
	if(err) throw err
	console.log(`Connected to database`)	
})
//шаблонизатор
app.engine('hbs' , handlebars({
	defaultLayout: 'index.hbs',
	layoutDir : 'views/layouts',
	extname : 'hbs'
}))
app.set("view engine", "hbs")
app.set('views' , path.join(__dirname, 'views'))
hbs.registerPartials(__dirname + '/views/partials')

//middleware
//pool for constant connection to database
//app.use(myconnection(mysql, {
	//host : HOST,
	//user : DB_USER,
	//password : 'n7JpWZSsOY',
	//port : DB_PORT,
	//database : DB_USER
//}, 'pool'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//router
app.get("/", (req ,res) =>{	
			res.render('layouts/index.hbs')
		})
app.get("/users", (req, res) =>{
	connection.query("select * from Profiles", function(error, result, fields){
		if(error) throw error;
		//console.log(fields)
		//console.log(result)
		res.send(JSON.stringify(result))
	})
})
app.post("/search", (req, res) =>{
	if(req.body){
		console.log(req.body)
		var search = req.body.search
		var query = `select * from Profiles where ?`
		connection.query(query [search], (error, data) =>{
			if(error){
				console.log(error.message)
			} else {
				res.send(data)
			}
		})
	}
})

app.post("/signup" , (req, res) =>{
	if(req.body){
		console.log(req.body)
			var name = req.body.name;
			var IIN = req.body.IIN;
			var adress = req.body.adress;
			var phoneNumber = req.body.phoneNumber;
			var date = req.body.date;
			var query = `insert into Profiles ( user_name, IIN, adress, number, date)
			 			 //values (?, ?, ?, ?, ?)`; 			 
			connection.query(query, [name, IIN, adress, phoneNumber, date], 
				(error, data) =>{
					if(error){
						console.log(error.message)
					} else {
						res.send(data)
					}
			})
		}
})

app.listen(PORT, console.log(`APP on port : ${PORT}`));



			/////////////////////////////////////////////////////////
//req.getConnection(function (err, connection){
		//connection.query("select * from Profiles", function(err, rows, fields){
			//if(err){
				//return res.status(400).send({message: err})
			//}
			//else {
				//res.jsonp(rows);
			//}
		//})
