module.exports = ( { Marionette, _ } ) ->
	Card = require( '../models/Card.coffee')
	require( './CardView.scss' )

	class CardView extends Marionette.ItemView
		className: 'card'
		template: _.template """
			<div class="rating" title="2.5 Stars">
				<span class="fa fa-star"></span>
				<span class="fa fa-star"></span>
				<span class="fa fa-star-half-o"></span>
			</div>
			<h1 class="title">Lucy</h1>
			<div class="image">
				<img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcShmmE5rWhBmdfRL4XOeqVTJkqaVfh6jw6y3KBk9wfv-J-EUXPJEA" alt="Title Card Image">
			</div>
			<div class="tags">
				<div class="primary">
					<a href="magnet:asdasdasd" title="Magnet">
						<i class="fa fa-magnet"></i>
					</a>
				</div>
				<div class="secondary">Movie</div>
				<div class="tag">Action</div>
				<div class="tag">Sci-Fi</div>
			</div>
			<div class="description">
				<p>A woman, accidentally caught in a dark deal, turns the tables on her captors and transforms into a merciless warrior evolved beyond human logic.</p>
				<p>Starring Scarlet Johansen et al</p>
			</div>

			<div class="rating-set">
				<div class="rating over-above" title="Userscore: 5.9">5.9</div>
				<div class="rating over-above" title="Metascore: 61">61</div>
				<div class="rating over-above" title="Metacritic Ratings"><i class="fa fa-heart"></i> </div>
			</div>

			<div class="foot">
				<span class="artist">Directed by: Luc Besson</span>
				<span class="hash">#: Da2434sDGA4234s3Y£H$66WKDS</span>
			</div>
		"""
		initialize: ->


