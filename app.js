
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello World!</h1>
    <p> cambio! </p>
    <P> esto funciono </p>
  `);
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});

app.get('/search', (req, res) => {
    const terms = req.query.termino || 'no especificado';
    const category = req.query.categoria || 'todas';

    res.send(`
        <h2>Resultado de busqueda</h2>
        <p> término: ${terms} </p>
        <p> categoria: ${category} </p>
     `)
});

app.post('/form', (req, res) => {
    const name = req.body.nombre || 'anonimo';
    const email = req.body.email || 'no especificado';

    res.json({
        message: 'datos recibidos',
        data: {
           name,
           email
        }
    })
});

app.post('/api/data', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }

    res.status(201).json({
        message: 'Datos recibidos',
        data
    })
});

//punto de entrada para consultar users
app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
       if(err) {
        return res.status(500).json({ error: 'Error reading users file' });
       }
       const users = JSON.parse(data);
       res.json(users);
    })
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(500).json({ error: 'Error reading users file' });
        }
        const users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar usuario' });
            }
            res.status(201).json(newUser);
        });
    });
});
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

