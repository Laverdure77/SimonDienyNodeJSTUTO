const { Pokemon } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError} = require('../db/sequelize');
const auth = require('../auth/auth')

module.exports = (app) => {
  app.put('/api/pokemons/:id', auth,  (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Pokemon.findByPk(id) // return to transmit the error in th catch block a the end, promise chaining.
      .then(pokemon => {
        if(pokemon === null) {
          const message = 'Le pokemon demandé n\'existe pas. Réessayez avec un autre identifiant';
          return res.status(404).json({message});
        }
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
      
    })
    .catch(err => {
      if(err instanceof ValidationError) {
        return res.status(400).json({message: err.message, data: err})
      }
      if(err instanceof UniqueConstraintError) { // catch the error from constraint unique name accepted
        return res.status(400).json({message: err.message, data: err})
      }
      const message = 'le pokemon n\'a pas pu etre modifié, réessayez dans quelques instants';
      res.status(500).json({ message, data: err});
    })
  })
}