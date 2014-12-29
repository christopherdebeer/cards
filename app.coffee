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



CardCollectionView = require( './views/CardCollectionView.coffee')( viewDeps )


$ ->
	require( './views/AppView.scss' )
	region = new Marionette.Region( el: $('#app')[0] )
	view = new CardCollectionView( collection: new Backbone.Collection( [{}, {}] ) )
	region.show( view )
