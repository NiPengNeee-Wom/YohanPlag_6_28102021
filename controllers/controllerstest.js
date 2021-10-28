const Test = require('../models/test');

exports.createTest = (req, res, next) => {
    console.log(req.body);
    delete req.body._id;
    const test = new Test({
    ...req.body
    });
    test.save()
        .then(() => res.status(201).json({ message: test._id}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyTest = (req, res, next) => {
    Test.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteTest = (req, res, next) => {
    Test.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneTest = (req, res, next) => {
    Test.findOne({ _id: req.params.id })
      .then(testbyid => res.status(200).json(testbyid))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllTest = (req, res, next) => {
    console.log('Requête reçue !');
    Test.find()
        .then(tests => res.status(200).json(tests))
        .catch(error => res.status(400).json({ error }));
    console.log('Réponse envoyée avec succès !');
};