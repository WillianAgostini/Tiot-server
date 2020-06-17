const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.create = function(req, res, next) {
  let recipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    start: req.body.start,
    end: req.body.end
  });

  recipe.save(err => {
    if (err) return res.status(400).send(err.message);
    User.findById(req.user.id).exec(function(err, user) {
      user.recipes.push(recipe);
      user.save(err => {
        if (err) return res.status(400).send(err.message);
        res.status(201).json(recipe);
      });
    });
  });
};

exports.delete = function(req, res, next) {
  let recipeId = req.params.id;
  Recipe.findByIdAndRemove(recipeId).exec(function(err, recipe) {
    if (err) res.sendStatus(404);
    User.findById(req.user.id).populate('recipes').exec(function(err, user) {
      if (err) res.sendStatus(404);
      user.recipes = removeById(user.recipes, recipeId);
      user.save(err => {
        if (err) return res.status(400).send(err.message);
        res.json(user).status(204);
      });
    });
  });
};

function removeById(arr, id) {
  return arr.filter(function name(value) {
    if (value._id != id) return value;
  });
}
