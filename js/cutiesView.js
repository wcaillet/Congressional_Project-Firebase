import React, {Component} from 'react'
import Header from './header.js'

// Go to this link to see which Cuties we favorited: https://congressionalcuties.firebaseio.com/favecuties.json

var CutiesView = React.createClass({

	componentDidMount: function() { //Event listener - 
		var self = this 
		this.props.congressColl.on('sync', function() {self.forceUpdate()})
	},

	render: function(){
		//console.log(this.props.congressColl.models) //an array of objects
		return(
			<div className="cutiesView">
				<Header/>
				<p>Now viewing {this.props.cutieType} cuties</p> 
				<CutiesList cutiesColl={this.props.congressColl.models} faveColl={this.props.faveColl} />	
			</div> //We add {this.props.cutieType} to our p tag to specify our type of cuties - either all or fave (which is in the Router!)
		)
	}
})

var CutiesList = React.createClass({

	_makeCutieComponent: function(model, i){ //This function will access each of the cutie objects, so we can turn it into a React component
		return <Cutie updater={this._updater} cutieData={model} faveColl={this.props.faveColl} key={i}/>

	},

	_updater: function() { // needs to live on the most closely nested parent of the things that depend on state
		this.setState({
			cutiesColl: this.state.cutiesColl
		})
	},

	getInitialState: function() { // Built-in function that returns an object, which is the initial state
		return {
			cutiesColl: this.props.cutiesColl
		}
	},

	render: function(){
		return(
			<div className='cutiesList'>
				{this.state.cutiesColl.map(this._makeCutieComponent)} 
			</div> //this.props.cutiesColl is an array. We use the .map method to go thru each element of the array and runs the _makeCutieComponent function on them and returns the element that will replace the original element. Transforms one array into another array. Could also accomplish this with a for loop.
		)
	}

})

var Cutie = React.createClass({

	_addToFave: function(){ //This is an event handler 
		this.props.cutieData.set({fave: true})  
		this.props.faveColl.add(this.props.cutieData.attributes) //Firebase doesn't like passing in models, so we pass in attributes
		this.props.updater() //We pass the updater to this function, so when the heart button is clicked, the updater will be run at the same time to re-render the cutiesList
	},

	render: function(){

		var faveButton = {}
		if(this.props.cutieData.get('fave') === true) { //We add this if statement to change the color of the heart once it is clicked
			faveButton.backgroundColor = "red"
			faveButton.color = "white"
		}

		return(
			<div className='cutie'>
				<p>{this.props.cutieData.get('first_name')} {this.props.cutieData.get('last_name')} <button style={faveButton} onClick={this._addToFave}>{'\u2661'}</button></p>
			</div>
		)
	}
})

export default CutiesView
