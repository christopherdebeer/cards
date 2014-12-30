module.exports = ({@Backbone}) ->
	class Card extends Backbone.Model
		@COLOR =
			BLACK: 'black'
			WHITE: 'white'
			RED: 'red'
			NEUTRAL: 'neutral'
		@RESOURCE =
			STARS: 'star'
			NOTHING: 'circle-o'
		@SET =
			CUSTOM: 'paint-brush'
			MAGNET: 'magnet'
			TECH: 'plug'
		@TYPE =
			MOVIE: 'Movie'
			TV_SERIES: 'TV Series'
			PROTOCOL: 'Protocol'

		initialize: ->

