module.exports = ->
	class Card extends Backbone.Model
		initialize: ({@title, @description, @img})->

