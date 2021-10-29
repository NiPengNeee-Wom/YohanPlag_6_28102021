const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
    ...thingObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    userDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce crée !" }))
        .catch(error => res.status(400).json({ error }));
};

exports.likeAndDislike = (req, res, next) => {
    const like = parseInt(req.body.like);
    if (like == 1){
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let testlike = sauce; 
                testlike.likes++;
                testlike.usersLiked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, { likes: testlike.likes, usersLiked: testlike.usersLiked, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Tu like ce produit !'}))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
    else if (like == 0){
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let testlike = sauce; 
            for (let i = 0; i<testlike.usersLiked.length; i++){
                if(testlike.usersLiked[i] === req.body.userId){
                    testlike.usersLiked.splice(i, 1);
                    testlike.likes--;
                };
                if(testlike.usersDisliked[i] === req.body.userId){
                    testlike.usersDisliked.splice(i, 1);
                    testlike.likes++;
                };
            };
            Sauce.updateOne({ _id: req.params.id }, { likes: testlike.likes, usersLiked: testlike.usersLiked, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Tu ne like plus ce produit !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
    else if (like == -1){
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let testlike = sauce; 
                testlike.likes--;
                testlike.usersDisliked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, { likes: testlike.likes, usersDisliked: testlike.usersDisliked, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Tu n\'aime pas ce produit !'}))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
};

exports.modifySauce = (req, res, next) => {
    const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(saucebyid => res.status(200).json(saucebyid))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    console.log('Requête reçue !');
    Sauce.find()
        .then(Sauces => res.status(200).json(Sauces))
        .catch(error => res.status(400).json({ error }));
    console.log('Réponse envoyée avec succès !');
};