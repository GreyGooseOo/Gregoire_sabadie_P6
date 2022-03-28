//appel du plugin et du code pour le bon fonctionnement du controlleur
const Sauce = require('../models/sauce');
const fs = require('fs');

//fonction permettant de créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    userDisliked: []
  });
  sauce.save().then(() => {
      res.status(201).json({message: 'Post saved successfully!'});
    })
    .catch((error) => {
    res.status(400).json({error: error});
    });
};

//fonction permettant d'obtenir les information d'une sauce dans l'API
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
  };

//fonction permettant de modifié une sauce si l'utilisateur est le créateur de la sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    if (!sauce) {
      res.status(404).json({error: new Error('No such sauce!')});
    }
    //vérification du bon utilisateur
    if (sauce.userId !== req.auth.userId) {
      res.status(403).json({error: new Error('Unauthorized request!')});
    }
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    //suppression de l'ancienne image dans le dossier "images" si changement de photo
    if(sauce.imageUrl!==sauceObject.imageUrl){
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlinkSync(`images/${filename}`);
    }
    Sauce.updateOne({_id: req.params.id},  { ...sauceObject, _id: req.params.id })
    .then(() => {
        res.status(201).json({message: 'Sauce updated successfully!'});
      })
      .catch((error) => {
        res.status(400).json({error: error});
      });
    })
    .catch(error => {
      res.status(500).json({ error })
    });
  };

//fonction permettant de supprimer une sauce si l'utilisateur est le créateur de la sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    if (!sauce) {
      res.status(404).json({error: new Error('No such sauce!')});
    }
    //vérification du bon utilisateur
    if (sauce.userId !== req.auth.userId) {
      res.status(403).json({error: new Error('Unauthorized request!')});
    }
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //suppression de l'image du dossier "images"
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => {
            res.status(400).json({ error })
          });
      });
    })
    .catch(error => {
      res.status(500).json({ error })
    });
  })
    .catch(error => {
      res.status(500).json({ error })
  });
};

//fonction permettant d'obtenir un tableau contenant les information des différentes sauces de l'API
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

//fonction permettant la gestion des likes/dislikes d'une sauce
exports.likeSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {
    if (!sauce) {
      res.status(404).json({error: new Error('No such sauce!')});
    }
    //remise à zéro du like
    if(req.body.like === 0){
      if(sauce.usersDisliked.indexOf(req.body.userId)!==-1){
        sauce.dislikes--;
        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId),1);
      }
      if(sauce.usersLiked.indexOf(req.body.userId)!==-1){
        sauce.likes--;
        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);
      }
    }
    //ajout d'un like
    if(req.body.like === 1){
      sauce.likes++;
      sauce.usersLiked.push(req.body.userId);
    }
    //ajout d'un dislike
    if(req.body.like === -1){
      sauce.dislikes++;
      sauce.usersDisliked.push(req.body.userId);
    }
    Sauce.updateOne({_id: req.params.id}, sauce)
    .then(() => {
      res.status(201).json({message: 'Likes updated'});
    })
    .catch((error) => {
      res.status(401).json({ error: error });
    });
  })
  .catch((error) => {
    res.status(400).json({ error: error });
  });
};