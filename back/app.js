//appel des plugins et code pour le bon fonctionnement de l'application 
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config();

//connection avec mongoDB
mongoose.connect(`mongodb+srv://Piiquante:${process.env.DB_PASSWORD}@greygoosecluster.pvngc.mongodb.net/GreyGooseCluster?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//stokage des images téléchargé dans le dossier /images
app.use('/images', express.static(path.join(__dirname, 'images')));

//appel des routes pour l'authentification et les produits
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;