var express = require('express');
var app = express();

app.use(express.static('build'));
app.set('views', './build');

app.get('/hello', (req, res) => {
	res.send("hello from express server /hello route");
});

app.get('*', (req, res) => {
	res.sendFile(`${process.cwd()}/build/index.html`);
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`App listening on port ${port}!`);
})