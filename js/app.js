// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from "bbfire"
import CutiesView from "./cutiesView.js"
import FavesView from "./favesView.js"

//No need to import the Header because its imported through the CutiesView and FavesView


// var url = "http://congress.api.sunlightfoundation.com/legislators/"
// var apiKey = "325ade0da4514bb29ff036144a8bc016"
//legislators?apikey=[your_api_key]

function app() {

//--------------------------//
// Collection and Models    //
//--------------------------//

	var FaveCutiesCollection = Backbone.Firebase.Collection.extend({ //This is the url that firebase will sync with each time a new cutie is favorited
		url: 'https://congressionalcuties.firebaseio.com/favecuties'
	})

	var CutieModel = Backbone.Model.extend({
		defaults: {
			'fave': false //This will affect the heart (for favorites)
		}
	})

	var CongressionalCollection = Backbone.Collection.extend ({

		url: "http://congress.api.sunlightfoundation.com/legislators/",
		apiKey: "325ade0da4514bb29ff036144a8bc016",

		parse: function(rawData){
			console.log(rawData)
			return rawData.results
		},

		model: CutieModel

	})

//--------------------------//
//         Router           //
//--------------------------//

    var CongressionalRouter = Backbone.Router.extend ({

		routes: {
			"favorites": "handleFaves",
			"*default": "handleCuties"
		},

		handleCuties: function() {
			var cc = new CongressionalCollection()
			var fc = new FaveCutiesCollection()
			cc.fetch ({
				data: {
					"apikey": cc.apiKey
				}
			}).then(function(){
				(DOM.render(<CutiesView cutieType="all" congressColl={cc} faveColl={fc}/>, document.querySelector('.container')))
			})
		},

		handleFaves: function() {
				
			DOM.render(<CutiesView cutieType="fave" congressColl={new FaveCutiesCollection}/>, document.querySelector('.container'))
		},

		initialize: function() {
			Backbone.history.start()
		}

	})

//------------------------------------//
//  Views - located in other js files //
//------------------------------------//

    var cr = new CongressionalRouter()
    
}

app()




