module.exports = (viewDeps) ->

	{Marionette} = viewDeps
	CardView = require( './CardView.coffee')( viewDeps )
	require( './CardCollectionView.scss')

	class CardCollectionView extends Marionette.CollectionView
		className: 'card-collection-view'
		childView: CardView