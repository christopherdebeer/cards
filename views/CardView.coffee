module.extends ( { Marionette, _ } ) ->
	Card = require( '../models/Card.coffee')

	class CardView extends Marionette.ItemView
		template: _.template """
			<p>Card View</p>
		"""
		initialize: ->


