<link href="https://gist.githubusercontent.com/jim-clark/6919052ab15de680c120907d223c31b5/raw/9eedb5e3c01352b9ccda7264227f253be56a08b7/slide.css">

---

<img src="https://i.imgur.com/cD5R8OG.png" width="600px;display:inline-block;margin:auto">

<br>

## Mongoose<br>Referencing Related Data
<p>adapted from the original lesson designed by Jim Clark</p>

---
## Learning Objectives
<br>

<p>Students Will Be Able To:</p>

- Use Referencing to Implement 1:M & M:M Data Relationships
- Explain the Difference Between 1:M & M:M Relationships
- "Populate" Referenced Documents 

---
## Roadmap
<br>

1. Setup
1. Review the Starter Code
1. Use a Node REPL session to perform CRUD using Mongoose Models
1. A New Data Resource: _Performers_
1. Create the `Performer` Model
1. Referencing _Performers_ in the _Movie_ Model
1. Creating _Performers_
1. Associating Movies and Performers

---
#### Setup
<br>

- `cd` to `starter-code/mongoose-movies` folder within this lesson's folder in the class repo.

- Install the node modules:

	```
	$ npm install
	```
	
- Open the **`mongoose-movies`** folder in your code editor.

- Use `nodemon` to start the server.

- Browse to `localhost:4000`

---
#### Review the Starter Code
<br>

- Note: The **movies/show.ejs** view shows how you can use EJS to calculate an _average rating_ for a movie.

---
#### Perform CRUD Using<br>Mongoose Models in a Node REPL
<br>

- Perform CRUD operations in Terminal using a Node REPL session is something that you'll likely need to do when developing an app, particularly when you make a change in your models.

- Start by opening a terminal session and make sure that you are in the **mongoose-movies** folder.

---
#### Perform CRUD Using<br>Mongoose Models in a Node REPL
<br>

- Start a Node REPL:

	```sh
	$ node
	> 
	```

- Connect to the MongoDB database:

	```sh
	> require('./config/database')
	{}
	> Connected to MongoDB at localhost:27017
	// Press enter to return to the prompt
	```

---
#### Perform CRUD Using<br>Mongoose Models in a Node REPL
<br>

- Anything that can be done with a Model in the app, can be done in the REPL including all CRUD operations.

- Load the `Movie` Model:

	```sh
	> const M = require('./models/movie')
	```
	We're being concise by using a variable named "M" vs. "Movie"

- **Important:** If you make any changes to the Model, you'll have exit Node and start again.

---
#### Perform CRUD Using<br>Mongoose Models in a Node REPL<br>

- Log all _movie_ docs:

	```sh
	> M.find({}, (e, movies) => {
	... console.log(movies)
	... })
	```
	The `find` method returns a **Query** object that is first logged, followed by the _movie_ docs. Press enter to return to the prompt.

---
#### Additional Resource for Performing CRUD Using<br>Mongoose Models in a Node REPL
<br>

- For future reference, here's a gist that documents how to do what we just did:<br>[Perform CRUD Using Mongoose Models in a Node REPL](https://gist.github.com/jim-clark/57b646abbb6c0ce09f9fa948eab6febc)

---
#### A New Data Resource: _Performers_
<br>

- We are going to implement the following data relationship:<br><br>**_A Movie has many Performers; A Performer has many Movies_**<br><br>**`Movie >--< Performer`** (Many-To-Many)

- But unlike Reviews (One-To-Many), multiple Movies can reference the same Performer creating a Many-To-Many relationship.  Here's a simplified example...

---

<img src="https://i.imgur.com/hzoRC2y.png" width="70%">

---

#### And Mongoose Movies ERD...

---

<img src="https://i.imgur.com/CVTFHMJ.png" width="80%">

---
#### 💪 Practice Exercise (5 minutes)
<br>

- A new data resource requires new modules, etc.

- Create the following for the new **Performers** resource:
	- Model (empty module)
	- Router (module exporting a router object)
	- Controller (empty module)

- Require and mount the new router in **server.js** to the path of `/`.

---
#### Create the _Performer_ Model
<br>

- _Performers_ will be stored in their own collection so that their `_id` (ObjectId) can be referenced by numerous movies.

- As you know, models map to collections in Mongoose...

---
#### Create the _Performer_ Model

- We'll review the schema for the `Performer` Model as we type it:

	```js
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	
	const performerSchema = new Schema({
	  name: {type: String, required: true, unique: true},
	  born: Date
	}, {
	  timestamps: true
	});
	
	module.exports = mongoose.model('Performer', performerSchema);
	```

---
#### Referencing _Performers_ in the _Movie_ Model
<br>

- With the `Performer` Model created, we can now add the `cast` property in `Movie`:

	```js
	reviews: [reviewSchema],
	// don't forget to add a comma above
	cast: [{type: Schema.Types.ObjectId, ref: 'Performer'}]
	```

- The property type of `ObjectId` **is always** used to implement **referencing**.

- The `ref: 'Performer'` is optional, but allows us to use the magical Mongoose method - `populate`. 

---
#### Contrasting 1:M and M:M Relationships
<br>

- The key difference between a `1:M` and a `M:M` relationship:
	- In a `1:M` relationship, each of the **many** (child) documents belongs to only **one** (parent) document. Each time we want add a new relationship - **the child document must be created**.
	- In a `M:M` relationship, **existing** documents are referenced and the same document can be referenced over and over. New documents are created only if it's the first of its kind. 

- What this means for **mongoose-movies** is that we only want to create a certain _performer_ once (when they don't exist).

---
#### Many:Many CRUD
<br>

- So, before a many-to-many relationship can be created between two documents (often called an **association**), those two documents must first exist.

- This requires that the app first provide the functionality to create each of the two resources independently of each other.

- **mongoose-movies** can already create _movies_, but now it needs the capability to create _performers_...

---
#### _AAU, I want to create a new performer if they don't already exist_
<br>

- Here's the flow we've now followed several times when adding functionality to the app:

	- 1) Identify the "proper" Route (Method + Path)
	
	- 2) Define the route on the server and map it to the proper controller action (`index`, `show`, `new`, `create`, etc.).
	
	- 3) Code and export the controller action.
	
	- 4) `res.render` a view in the case of a GET request, or `res.redirect` if data was changed.

---
#### Creating _Performers_ - Step 1
<br>

- Creating a performer will require two request/response cycles:  One for the `new` action and one for the `create` action...

- **💪 YOU DO: Reply in Slack with the proper routes (Method & Path) for**:
	- Displaying a page with a form for entering a _performer_
	- Creating a new _performer_ when the form is submitted

---
#### Creating _Performers_ - Step 2
<br>

- Clicking the **ADD PERFORMER** link is going to send a `GET /performers/new` request - now we need a route to map that HTTP request to code (controller action) in **routes/performers.js**:

	```js
	const express = require('express');
	const router = express.Router();
	const performersCtrl = require('../controllers/performers');
	
	router.get('/performers/new', performersCtrl.new);
	
	module.exports = router;
	```

- As usual, the server won't be happy until we create and export that `new` action...

---
#### Creating _Performers_ - Step 3
<br>

- We want to try to prevent the users from creating more than one document for a given performer, so we will display a list of existing performers (in a dropdown) and beg our users not to add a performer unless they've verified that the performer does not already exist in the list.

- The controller action of course will need to provide an array of the exiting performers to be rendered in the dropdown...

- Inside of **controllers/performers.js** we go:

	```js
	const Performer = require('../models/performer');
	
	const newPerformer = (req, res) => {
	  Performer.find({}, function(err, performers) {
	    res.render('performers/new', {
	      title: 'Add Performer',
	      performers
	    });
	  })
	}
	
	module.exports = {
	  new: newPerformer
	};
	```

---
#### Creating _Performers_ - Step 4

| Route | Method |
|:--:|:--:|
| "/performers" | "POST" |

- Now for the second request/response cycle

- We need to listen to the route for creating a new performer.

- **💪 YOU DO: Define the route for the create action**

---
#### Creating _Performers_

- In **controllers/performers.js**:

	```js
	const create = (req, res) => {
    // Hack to "fix" date formatting to prevent possible day off by 1
    // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
	  const  s = req.body.born;
	  req.body.born = 
	    `${s.substr(5,2)}-${s.substr(8,2)}-${s.substr(0,4)}`;
	  Performer.create(req.body, function(err, performer) {
	    res.redirect('/performers/new');
	  });
	})
	
	module.exports = {
	  new: newPerformer,
	  create
	};
	```

---
#### Associating Movies and Performers
<br>

- Now that we've added the functionality to create _performers_, we're ready to add the functionality to associate them with _movies_.

- But first, a quick refactor...

---
#### _AAU, after adding a movie, I want to see its details page_
<br>

- This user story can be accomplished with a quick refactor in the `moviesCtrl.create` action in **controllers/movies/js**:

	```js
	movie.save(function(err) {
	  if (err) return res.redirect('/movies/new');
	  // res.redirect('/movies');
	  res.redirect(`/movies/${movie._id}`);
	});
	```

- Don't forget to replace the single-quotes with back-ticks!

- User story done! Now for some fun!

---
#### _AAU, when viewing a movie's detail page,<br>I want to see a list of the current cast and add a new performer to the list_

- Let's ponder what it's going to take to implement this user story:
	- In **movies/show.ejs**, iterate over the movie's cast and use EJS to render them.
	- Hold it! Because we are using referencing, there are `ObjectId`s in a movie's `cast` array - not subdocs. Oh wait, this is what the magical `populate` method is for!
	- Using a form with a dropdown, we can send a request to associate a performer and movie. We will need the list of performers to build the dropdown, but only the performers not already in the cast!

- Let's get started!

---
#### Replacing _ObjectIds_ with the Actual Docs
<br>

- Let's refactor the `moviesCtrl.show` action so that it will pass the movie with the _performer_ documents in its `cast` array instead of `ObjectIds`:

	```js
	const show = (req, res) => {
	  Movie.findById(req.params.id)
	  .populate('cast').exec(function(err, movie) {
	    res.render('movies/show', { title: 'Movie Detail', movie });
	  });
	}
	```

- `populate`, the unicorn of Mongoose...

---
#### Replacing _ObjectIds_ with the Actual Docs
<br>

- We can chain the `populate` method after any query.

- When we "build" queries like this, we need to call the `exec` method to actually run it (passing in the callback to it).

---
#### Passing the _Performers_
<br>

- While we're in `moviesCtrl.show`, let's see how we can query for just the _performers_ that are not in the _movie's_ `cast` array.  

- First, we're going to need to access the `Performer` model, so require it at the top:

	```js
	const Movie = require('../models/movie');
	// require the Performer model
	const Performer = require('../models/performer');
	```
	
- Now we're ready to refactor the `show` action... 

---
#### Passing the _Performers_

- We'll review as we refactor the code:

	```js
	
	const show = (req, res) => {
	  Movie.findById(req.params.id)
	  .populate('cast').exec(function(err, movie) {
	    // Performer.find({}).where('_id').nin(movie.cast)
	    Performer.find(
         {_id: {$nin: movie.cast}},
         function(err, performers) {
           console.log(performers);
           res.render('movies/show', {
             title: 'Movie Detail', movie, performers
           });
         }
       );
	  });
	}
	```
	The log will show we are retrieving the _performers_ - a good sign at this point. 

---
#### Need a Route for the _Add to Cast_ Form Post
<br>

- The route is RESTful, but we have to use a non-RESTful name for the controller action because we're creating an association between a movie and a performer...

- In **routes/performers.js**

	```js
	router.post('/movies/:id/performers', performersCtrl.addToCast);
	```
	`addToCast` - not a bad name, but you can use a different one if you want to

---
#### The _addToCast_ Controller Action

- Let's write that `addToCast` action in **controllers/performers.js**:

	```js
	const Performer = require('../models/performer');
	// add the Movie model
	const Movie = require('../models/movie');
	
	const addToCast = (req, res) => {
	  Movie.findById(req.params.id, function(err, movie) {
	    movie.cast.push(req.body.performerId);
	    movie.save(function(err) {
	      res.redirect(`/movies/${movie._id}`);
	    });
	  });
	}
	
	module.exports = {
	  new: newPerformer,
	  create,
	  addToCast
	};
	```

#### We Did It!

---
## References
<br>

- [MongooseJS Docs - Populate](https://mongoosejs.com/docs/populate.html)

- [MongooseJS Docs - Queries](https://mongoosejs.com/docs/queries.html)
