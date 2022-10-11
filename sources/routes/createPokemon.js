const { Pokemon } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
  app.post('/api/pokemons', auth,  (req, res) => {
    Pokemon.create(req.body)
      .then(pokemon => {
        const message = `Le pokémon ${req.body.name} a bien été crée.`
        res.json({ message, data: pokemon })
      })
      .catch(err => {
        if(err instanceof ValidationError) {
          return res.status(400).json({message: err.message, data: err})
        } // if error is due to user input, otherwise server error 500
        if(err instanceof UniqueConstraintError) {
          return res.status(400).json({message: err.message, data: err})
        }
        const message = 'le pokemon n\'a pas pu etre ajouté, réessayez dans quelques instants';
        res.status(500).json({ message, data: err});
      })
  })
}