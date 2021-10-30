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
    if (like === 1){
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
    else if (like === 0){
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                testNoMore = sauce; 
                for (let i = 0; i<testNoMore.usersLiked.length; i++){
                    if(testNoMore.usersLiked[i] === req.body.userId){
                        testNoMore.usersLiked.splice(i, 1);
                        testNoMore.likes--;
                        Sauce.updateOne({ _id: req.params.id }, { likes: testNoMore.likes, usersLiked: testNoMore.usersLiked,  _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Tu ne like plus ce produit !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                }
                for (let j = 0; j<testNoMore.usersDisliked.length; j++){
                    if(testNoMore.usersDisliked[j] === req.body.userId){
                        testNoMore.usersDisliked.splice(j, 1);
                        testNoMore.dislikes--;
                        Sauce.updateOne({ _id: req.params.id }, { dislikes: testNoMore.dislikes, usersDisliked: testNoMore.usersDisliked, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Tu ne dislike plus ce produit !'}))
                            .catch(error => res.status(400).json({ error }));
                    };
                };
            })
            .catch(error => res.status(500).json({ error }));
    }
    else if (like === -1){
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let testDislike = sauce;
                testDislike.dislikes++;
                testDislike.usersDisliked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, { dislikes: testDislike.dislikes, usersDisliked: testDislike.usersDisliked, _id: req.params.id })
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