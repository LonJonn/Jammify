const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../static')))

const mongodb_conn_module = require('./mongodbConnModule');	//import the mongodb connection function
mongodb_conn_module.connect();	//connect to mongo database

var Post = require("../models/post");	//get the Post model schema (so it knows how to structure its db entry)

app.get('/posts', (req, res) => {	//get posts from API on 8081
	Post.find({}, 'title description', function (error, posts) {	//find all posts documents, get said tables, callback
		if (error) { console.error(error); }
		res.send({
			posts: posts	//send back to client the posts in an array as JSON
		})
	}).sort({ _id: -1 })	//sort posts by most recent
})

app.post('/add_post', (req, res) => {
	var title = req.body.title;
	var description = req.body.description;
	var new_post = new Post({	//use model to create new document for db
		title: title,
		description: description
	})

	new_post.save(function (error) {	//save document to db
		if (error) {
			res.status(404).send(error)
		} else {
			res.send({
				success: true	//return to client successful (for eg. page refresh)
			})
		}
	})
})

app.put('/posts/:id', (req, res) => {	//update reqeust
	Post.findById(req.params.id, 'title description', function (error, post) {	//find post by id (using params in url), get the title and description, pass found post to callback
		if (error) { console.error(error); }

		post.title = req.body.title	//update post from client side info
		post.description = req.body.description
		post.save(function (error) {	//mongoose save
			if (error) {
				res.status(404).send(error)
			} else {
				res.send({
					success: true	//return to client successful (for eg. page refresh)
				})
			}
		})
	})
})

app.delete('/posts/:id', (req, res) => {
	Post.remove({	//find post with id from params in url and delete it
		_id: req.params.id
	}, function (error) {
		if (error) {
			res.status(404).send(error)
		} else {
			res.send({
				success: true	//return to client successful (for eg. page refresh)
			})
		}
	})
})

app.get('/post/:id', (req, res) => {	//get individual post from server by searching id
	Post.findById(req.params.id, 'title description', function (error, post) {
		if (error) {
			res.status(404).send(error)
		} else {
			res.send(post)	//return found post to client
		}
	})
})

app.listen(process.env.PORT || 8081)
