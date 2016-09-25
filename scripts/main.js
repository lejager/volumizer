var React = require('react');
var ReactDOM = require('react-dom');
var h = require('./helper');

var units = [
'pound (lb)',
'ounce (oz)',
'pint (U.S.) (pt)',
'pint (British) (pt)',
'fluid ounce (U.S.) (fl oz)',
'fluid ounce (British) (fl oz)',
'cup',
'tablespoon',
'dessert spoon',
'teaspoon'
];

// Add Recipe
// Add ingredients with measurement
// Volumize those ingredients

// var App = React.createClass({
// 	getDefaultState: function() {
// 		return {
// 			recipes: {}
// 			}
// 	},

// 	addRecipe : function(recipe) {
//     var timestamp = (new Date()).getTime();
//     // update the state object
//     this.state.recipes['recipe-' + this.recipe.title] = recipe;
//     // set the state
//     this.setState({ recipes : this.state.recipes });
//   },

// 	render: function() {
// 		var appStyle = {
//         backgroundImage: 'url(' + this.props.src + ')',
//         backgroundColor: 'rgba(0,0,0,.7)',
//         backgroundSize: 'cover',
//         position: 'absolute',
//         top: 0,
//         bottom: 0,
//         right: 0,
//         left: 0
//       };

// 		return (
// 			<div>
// 				<Recipe />
// 				<button onClick={this.addRecipe}>Add Recipe</button>
// 			</div>
// 		);
// 	}
// });

// var Recipe = React.createClass({
// 	render: function() {
// 		return (
// 			<Ingredient />
// 			);
// 	}
// });

// var AddRecipeForm = React.createClass({
//   createRecipe : function(event) {
//     // 1. Stop the form from submitting
//     event.preventDefault();
//     // 2. Take the data from the form and create an object
//     var fish = {
//       title : this.refs.title.value,
//       price : this.refs.price.value,
//       status : this.refs.status.value,
//       desc : this.refs.desc.value,
//       image : this.refs.image.value
//     }

//     // 3. Add the fish to the App State
//     this.props.addFish(fish);
//     this.refs.fishForm.reset();
//   },
//   render : function() {
//     return (
//       <form onSubmit={this.createRecipe}>
// 			<input type="text" ref="recipeTitle" placeholder="Recipe Name"/>
// 			<Ingredients recipeName={this.refs.recipeTitle.value} />
// 			<button type="submit">Save Recipe</button>
// 		</form>
//     )
//   }
// });

var Ingredients = React.createClass({
  getInitialState : function() {
    return {
      ingredients : {},
      servingsCurrent : 1,
      servingsFinal : 0
    }
  }, 
  
  addIngredient : function(ingredient) { 
		var timestamp = (new Date()).getTime();
    // update the state object
    this.state.ingredients['ingredient-' + timestamp] = ingredient;
    // set the state
    this.setState({ ingredients : this.state.ingredients });
  },
  
  renderIngredient : function(key){
    return <Ingredient key={key} index={key} details={this.state.ingredients[key]} />
  },

  addServings : function(servings) {
  	// update the state object
  	this.state.servingsFinal = servings.servingsFinal;
  	this.state.servingsCurrent = servings.servingsCurrent;
  	
  	// set state
  	this.setState({
  		servingsCurrent : this.state.servingsCurrent,
  		servingsFinal : this.state.servingsFinal
  	});

  	Object.keys(this.state.ingredients).map(this.calculateServings);

  	this.state.servingsCurrent = this.state.servingsFinal;
  	this.setState({ servingsCurrent : this.state.servingsCurrent});
  },

  calculateServings : function(key) {
  	var quantity = this.state.ingredients[key].quantity;
  	var unit = this.state.ingredients[key].unit;
  	var i = this.state.servingsCurrent;
  	var f = this.state.servingsFinal;

  	quantity = quantity / i;
  	quantity = quantity * f;

  	// Normalize serving sizes
  	// switch(unit) {
   //  	case 'teaspoon':
   //  		if (quantity >= 3) {
   //  			quantity = quantity/3;
   //  			if (quantity % 3 ) {
   //  				var remainder = quantity % 3;
   //  				console.log('remainder', remainder);
   //  			}
   //  			unit = 'tablespoon';
   //  		}
   //  	break;

   //  	case 'tablespoon':
   //      if (quantity >= 4) {
   //      	quantity = quantity / 16;
   //      	if (quantity % 3 ) {
   //  				var remainder = quantity % 16;
   //  				console.log('remainder', remainder);
   //  			}
   //      	unit = 'cup';
   //      }
  	// }

  	this.state.ingredients[key].quantity = h.round(quantity);
  	this.state.ingredients[key].unit = unit;
  	

  	this.setState({ ingredients : this.state.ingredients });
  },

  render : function() {
    return (
    	<div className="ingredients">
    		<div className="col-md-8">
    			<h1>Add ingredients here and then...</h1>
    	    	<table className="ingredient-list">
    	    	<tbody>
    	        	{Object.keys(this.state.ingredients).map(this.renderIngredient)}
    	    	</tbody>
    	    	</table>
    	    	<AddIngredientForm addIngredient={this.addIngredient} />
    	    </div>
    	    <div className="col-md-4 volumize">
    	    	<CalculateServings addServings={this.addServings} servingsCurrent={this.state.servingsCurrent} />
    	    </div>
      </div>
    )
  }
});

var Ingredient = React.createClass({
  render : function() {
    var details = this.props.details;
    return (
      <tr className="ingredient">
        <td className="ingredient-name">
          {details.name}
        </td>
          <td className="quantity">{details.quantity}</td>
        <td>{details.unit}</td>
      </tr>
    )
  }
});

var AddIngredientForm = React.createClass({
  createIngredient : function(event) {
    // 1. Stop the form from submitting
    event.preventDefault();
    // 2. Take the data from the form and create an object
    var ingredient = {
      name : this.refs.name.value,
      quantity : this.refs.quantity.value,
      unit : this.refs.unit.value,
    }

    // 3. Add the ingredient to the App State
    this.props.addIngredient(ingredient);
    this.refs.ingredientForm.reset();
  },
  render : function() {
    return (
       <form className="ingredient-edit" ref="ingredientForm" onSubmit={this.createIngredient}>
			<input type="text" ref="name" placeholder="Ingredient Name" />
			<input type="number" ref="quantity" placeholder="1" step="any" />
			<select ref="unit" placeholder="unit">
				<option>cup</option>
				<option>dessert spoon</option>
				<option>fluid ounce (British) (fl oz)</option>
				<option>fluid ounce (U.S.) (fl oz)</option>
				<option>ounce (oz)</option>
				<option>pint (British) (pt)</option>
				<option>pint (U.S.) (pt)</option>
				<option>pound (lb)</option>
				<option>tablespoon</option>
				<option>teaspoon</option>
			</select>
			<button type="submit">Add Ingredient</button>
		</form>
    )
  }
});

var CalculateServings = React.createClass({
	handleEvent : function(event) {
    // 1. Stop the form from submitting
    event.preventDefault();
    // 2. Take the data from the form and create an object
    var servings = {
      servingsFinal : this.refs.servingsFinal.value,
      servingsCurrent : this.refs.servingsCurrent.value,
    }

    // 3. Add the ingredient to the App State
    this.props.addServings(servings);
    this.refs.servingsFinal.value = '';
  },

	render: function() {
		return (
			<div className="volumizer">
				<h3>Volumize that S*@t</h3>
				<form ref="volumizer" onSubmit={this.handleEvent}>
					<label>Current Serving Size</label>
  	  		<input type="number" ref="servingsCurrent" value={this.props.servingsCurrent} />
  	  		<label>Final Serving Size</label>
  	  		<input type="number" ref="servingsFinal" placeholder="Number of servings" />
  	  		<button type="submit">Volumize!</button>
  	  	</form>
  	  </div>
		)
	}
});

ReactDOM.render (
	<Ingredients />,
	document.querySelector('#main')
	);