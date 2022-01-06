const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);

    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => {
    Recipe.insertMany(data)
      .then(recipesFromDb =>  {
        recipesFromDb.forEach(recipe => console.log(` --> recipe: ${recipe.title}`));

        modifyOneRecipe();

        deleteRecipe();

        setTimeout(() => {
          closeDatabase();
        }, 1000);
      })

      
      .catch(error => console.error('An error occured while creating a recipe: ', error));
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

// Update the Rigatoni recipe's duratiton

async function modifyOneRecipe() {
  try {
    const query = {duration: 220};
    const found = await Recipe.findOneAndUpdate(query, {duration : 100}, {new: true});
    console.log('Successfuly updated the recipe: ', found.title, '--> New duration: ',found.duration);
  } catch (err) {
    console.error(err);
  }
}

async function deleteRecipe() {
  const query = {title: 'Carrot Cake'};
  await Recipe.deleteOne(query)
    .then(dbRes => {
      console.log('Recipe victim of its success! No longer available.', dbRes);
    })
    .catch(error => console.log(error));
}

async function closeDatabase() {
  await mongoose.connection.close(() => console.log('CRUD operations completed, connexion closed.'));
}




