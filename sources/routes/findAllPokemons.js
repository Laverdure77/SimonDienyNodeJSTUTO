const { Pokemon } = require('../db/sequelize');
const { Op } = require('sequelize');
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => { // auth middleware authentification passed as a parameter of the route
    
    const limit = parseInt(req.query.limit) || 5; // always convert data from req.query because sequelize send it as a string
    
    if(req.query.name) { // query parameters
      const name = req.query.name;

      if(name.length < 2) {
        const message = 'Minimum 2 caractères pour la recherche';
        return res.status(400).json({message});
      }
      return Pokemon.findAndCountAll({ 
        where: {
            name: {
              [Op.like]: `%${name}%`,
            }
          },
          limit: limit,
          order: ['name']
        })
        .then( ({count, rows}) => {
          const message = `Il y a ${count} pokemons qui correnspondent au terme recherché ${name}`;
          res.json({ message, data: rows});
        })
    } else {
      Pokemon.findAll({
        order: ['name'],
        limit: limit
      })
        .then(pokemons => {
          const message = 'La liste des pokémons a bien été récupérée.'
          res.json({ message, data: pokemons })
        })
        .catch(err => {
          const message = 'la liste n\'a pas pu etre récupérée, réessayez dans quelques instants';
          res.status(500).json({ message, data: err});
        })
    }
  })
}

// code 200 is already managed by express