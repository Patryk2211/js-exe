const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const movieRoutes = require('./api/routes/movies');
const postRoutes = require('./api/routes/posts');

mongoose.connect('mongodb://film-service:WblkBk3D@rest-film-service-shard-00-00-i3hdj.mongodb.net:27017,rest-film-service-shard-00-01-i3hdj.mongodb.net:27017,rest-film-service-shard-00-02-i3hdj.mongodb.net:27017/test?ssl=true&replicaSet=REST-film-service-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Acces-Control-Allow-Headers', 
	'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/movies', movieRoutes);
app.use('/posts', postRoutes);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;