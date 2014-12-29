_ = require('underscore')
Backbone = require('backbone')
Backbone.$ = $ = require('jquery')
Marionette = require('backbone.marionette')
Marionette.$ = Backbone.$

viewDeps =
	$: $
	_: _
	Backbone: Backbone
	Marionette: Marionette


CardView = require( './views/CardView.coffee')( viewDeps )



$ ->
	region = new Marionette.Region( el: $('#app')[0] )
	view = new CardView()
	region.show( view )
