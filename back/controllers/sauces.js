const Sauce = require('../models/sauce');
const fs = require('fs');
const { Console } = require('console');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    userLiked: ['lol'],
    userDisliked: []
  });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({ error: error });
      }
    );
  };

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      res.status(404).json({
        error: new Error('No such sauce!')
      });
    }
    if (sauce.userId !== req.auth.userId) {
      res.status(403).json({
        error: new Error('Unauthorized request!')
      });
    }
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body};
    if(sauce.imageUrl!==sauceObject.imageUrl){
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlinkSync(`images/${filename}`);
    }
    Sauce.updateOne({_id: req.params.id},  { ...sauceObject, _id: req.params.id })
    .then(() => {
        res.status(201).json({
          message: 'Sauce updated successfully!'
        });
      })
      .catch((error) => {res.status(400).json({error: error});
      });
    })
    .catch(error => res.status(500).json({ error }));
  };
  

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      if (!sauce) {
        res.status(404).json({
          error: new Error('No such sauce!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({
          error: new Error('Unauthorized request!')
        });
      }
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
  })
    .catch(error => res.status(500).json({ error }));
  
};

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
exports.likeSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {
    if (!sauce) {
      res.status(404).json({
        error: new Error('No such sauce!')
      });
    }
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
    if(req.body.like === 1){
      sauce.likes++;
      sauce.usersLiked.push(req.body.userId);
    }
    if(req.body.like === -1){
      sauce.dislikes++;
      sauce.usersDisliked.push(req.body.userId);
    }
    console.log(sauce)
    Sauce.updateOne({_id: req.params.id}, sauce)
    .then(() => {
      res.status(201).json({
        message: 'Likes updated'
      });
    })
    .catch((error) => {res.status(401).json({ error: error });
    });
  })
  .catch((error) => {console.log(error),res.status(400).json({ error: error });
  })

};