let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');
const PORT = 3000;

let pool = new pg.Pool({
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'tommygallagher',
    host: 'localhost',
    max: 10
});

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.delete('/api/remove/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    //pool.connect(function(err, db, done) {
    //    if(err) {
    //        return res.status(400).send(err);
    //    }
    //    else {
    //        db.query('DELETE FROM SHEET WHERE id = $1', [id], function(err, result) {
    //            if(err) {
    //                return res.status(400).send(err);
    //            } 
    //            else {
    //                return res.status(200).send({message: 'success in deleting record'});
    //            }
    //        })
    //    }
    //})
});

app.get('/api/sheet', function(req, res) {
    pool.connect(function(err, db, done) {
        if(err) {
            return res.status(400).send(err);
        }
        else {
            db.query('SELECT * FROM SHEET', function(err, table) {
                if(err) {
                    return res.status(400).send(err);
                } 
                else {
                    return res.status(200).send(table.rows);
                }
            })
        }
    })
});

app.post('/api/new-row', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    //var id = request.body.id;
    let values = [name, description, price];
    pool.connect((err, db, done) => {
        if(err){
            return res.status(400).send(err);
        }
        else {
            db.query('INSERT INTO SHEET (name, description, price) VALUES($1, $2, $3)', [...values], (err, table) => {
                if(err) {
                    return res.status(400).send(err);
                } 
                else {
                    console.log('DATA INSERTED');
                    //db.end();
                    res.status(201).send({message: 'Data inserted!'})
                }
            })
        }
    });
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));