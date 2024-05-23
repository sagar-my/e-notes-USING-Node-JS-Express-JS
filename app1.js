const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

	let data = {
		name: 'Akashdeep',
		hobbies: ['playing football', 'playing chess', 'cycling']
	}

	res.render('home', { data: data });
});

const server = app.listen(4000, function () {
	console.log('listening to port 4000')
});
