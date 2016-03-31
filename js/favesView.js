import React, {Component} from 'react'
import Header from './header.js'

var FavesView = React.createClass({
		render: function(){
			return(
				<div className="favesView">
					<Header/>
					<p>Now viewing all your favorite cuties</p>
				</div>
			)
		}
})

export default FavesView