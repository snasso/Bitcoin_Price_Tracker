const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const axios         = require('axios');


// MARK: boilerplate express setup
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
});

app.listen(8080, () => {
    console.log('Listening on Port 8080');
});


app.get('/:startDate/:endDate', (req,res) => {
    let startDate   = req.params.startDate;
    let endDate     = req.params.endDate;

    let url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`;
    axios.get(url)
        .then(response => {
            let data = response.data.bpi;

            res.send(data);
        });
});