const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/users')
const pokemons = require('../../mock-pokemon.js')
const bcrypt = require('bcrypt')
  
const sequelize = new Sequelize('pokedex', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
  
const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

  
const initDb = async () => {
  const _ = await sequelize.sync({ force: true })
  console.log('INIT DB')
  pokemons.map(pokemon => {
    Pokemon.create({
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types
    }).then(pokemon_1 => console.log(pokemon_1.toJSON()))
  })
  bcrypt.hash('test', 10)
    .then(hash => {
      User.create({
        username: 'test',
        password: hash
      })
    })
  // .then(user => console.log(user.toJSON()))
  console.log('La base de donnée a bien été initialisée !')
}
  
module.exports = { 
  initDb, Pokemon, User
}