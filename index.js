import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iot'
});

connection.connect(err => {
    if(err){
        console.error('Algo salio mal', err)
    } else{
        console.log('Succesful connection to MySQL')
    }
});

app.use(cors())
app.use(express.json())

app.listen(8082,() => {
    console.log('Servidor en el puerto: ')
});

app.get('/sensores', (req, res) => {
    const query = 'SELECT * FROM sensores;'
    connection.query(query,(err, results) => {
        if(err){
            res.status(500).send('Something went wrong internally: ' + err)
        } else {
            res.json(results)
        }
    })
});

app.get('/sensores/dist', (req, res) => {
    const {inicia, termina} = req.body
    const values = [inicia, termina]
    console.log(values)
    const query = 'SELECT * FROM sensores WHERE lectura_sensor > ? AND lectura_sensor < ?;'

    connection.query(query, values,(err, results) => {
        if(err){
            res.status(500).send('Something went wrong internally: ' + err)
        } else {
            res.json(results)
        }
    })
});

app.get('/sensores/:id', (req, res) => {
    const id = req.params.id
    const query = 'SELECT * FROM sensores WHERE idSensor = ?;'
    connection.query(query, id,(err, results) => {
        if(err){
            res.status(500).send('Something went wrong internally: ' + err)
        } else {
            res.json(results)
        }
    })
});

app.post('/sensores', (req, res) => {
    console.log('Intentando')
    const {tipo, lectura, led} = req.body
    const query = 'INSERT INTO sensores (tipo_sensor, lectura_sensor, led) VALUES (?, ?, ?);'
    const values = [tipo, lectura, led]
    connection.query(query,values,(err, results) => {
        if(err){
            res.status(500).send('Something went wrong internally: ' + err)
            console.log(err)
        } else {
            res.json(results)
        }
    })
});

app.delete('/sensores/:id', (req, res) => {
    console.log('Deleteando ', req.params.id)
    const id = req.params.id
    const query = 'DELETE FROM sensores WHERE idSensor = ?'
    const values = [id]
    connection.query(query,values,(err, results) => {
        if(err){
            res.status(500).send('Something went wrong internally: ' + err)
        } else {
            res.json(results)
        }
    })
});

