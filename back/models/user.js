//appel des plugins pour le bon fonctionnement du middleware
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//modèle de l'objet utilisateur qui sera implanter dans la base de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//verification du caractère unique de l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);