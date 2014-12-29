$ = require('jquery')
_ = require('underscore')
Backbone = require('backbone')
Marionette = require('backbone.marionette')

viewDeps =
	$: $
	_: _
	Backbone: Backbone
	Marionette: Marionette


CardView = require( './views/CardView.coffee')( viewDeps )



$ -> new CardView( el: $( '#app' ) )