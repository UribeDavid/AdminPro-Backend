const express = require('express');

const cors = require('cors');

require('dotenv').config();

const { dbConnection } = require('./database/config');
// Credenciales
// dudb
// xYgA5mOaosxQAJRt
// Crear el servidor de express
const app = express();

app.use( cors() );

// Base de datos
dbConnection();

// Rutas
app.get( '/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo!'
    });
});

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});