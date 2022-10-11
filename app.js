const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./sources/db/sequelize.js');

const app = express();
const port = 3000;

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(bodyParser.json())

sequelize.initDb();

require('./sources/routes/findAllPokemons')(app); // pas dbesoin de varaible intermédiaire.
require('./sources/routes/findPokemonByPk')(app);
require('./sources/routes/createPokemon')(app);
require('./sources/routes/updatePokemon')(app);
require('./sources/routes/deletePokemon')(app);
require('./sources/routes/login')(app);


// ERROR 404 for all routes declared, if user tries to access an non existing route
app.use(({res}) => {
    const message = 'impossible de trover la ressource demandée, essayez une autre URL.';
    res.status(404).json(message);
})

app.listen(port, () => console.log(`Notre app Node est démarrée sur : http://localhost:${port}`));