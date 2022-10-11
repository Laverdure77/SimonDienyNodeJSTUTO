// models are js object describing one element of a table, sequelize will create a table ( name of element in plural) in the db based on this object
const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik','Fée']
module.exports =  (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
            id: {
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            name: {
                type:DataTypes.STRING,
                allowNull:false,
                unique: {// constraint 
                    msg: 'le nom est deja pris'
                },
                validate: {
                    notEmpty: { msg: 'Le nom du pokemon ne peut pas etre vide.'},
                    notNull: { msg: 'Le nom du pokemon est une propriété requise.'}
                }
            },
            hp: {
                type:DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg:'Utilisez uniquement des nombres entiers pour les points de vie'},
                    notNull: { msg:'Les points de vie sont une propriété requise.'},
                    max: { args : [999], msg:'points points de vie compris entre 0 et 999'},
                    min: { args : [0], msg:'points de vie compris entre 0 et 999'},
                }
            },
            cp: {
                type:DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg:'Utilisez uniquement des nombres entiers pour les points de dégats'},
                    notNull: { msg:'Les points de dégats sont une propriété requise.'},
                    max: { args : [99], msg:'points points de degats compris entre 0 et 99'},
                    min: { args : [0], msg:'points de degats compris entre 0 et 99'},
                }
            },
            picture: {
                type:DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: { msg: ' Utilisez une URL valide svp.'},
                    notNull : { msg: 'L\'image est une propriété requise'}
                }
            },
            types: {
                type:DataTypes.STRING,
                allowNull: false,
                get() {
                    return this.getDataValue('types').split(',')
                },
                set(types) {
                    this.setDataValue('types', types.join())
                },
                validate: { 
                    isTypesValid(value) { // custom validator function isTypesValid, with arg value which is what is stored in db without getter and setter applied
                        if(!value){
                            throw new Error('Un pokemon doit avoir au moins un type.')
                        }
                        if(value.split(',').length > 3) {
                            throw new Error ('Un pokemon ne peut avoir plus de trois types.')
                        }
                        value.split(',').forEach(type => { // have to use the effect of getter hardcoded, because value is pure db data
                            if(!validTypes.includes(type)){
                                throw new Error(`Le type de Pokemon doit etre du type suivant: ${validTypes}`)
                            }
                        })
                    }
                }
            }
        },
        {
            timestamps: true,
            createdAt: 'created',
            updatedAt: false
        }
    )
}
