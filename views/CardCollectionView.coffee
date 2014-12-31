module.exports = (viewDeps) ->

	{Marionette} = viewDeps
	CardView = require( './CardView.coffee')( viewDeps )
	require( './CardCollectionView.scss')

	class CardCollectionView extends Marionette.CollectionView
		className: 'card-collection-view'
		childView: CardView
		childEvents:
			'selected': '_selectedChild'

		_selectedChild: (view, selected) =>
			@children.each (view) -> view.deselect()
			if selected
				view.deselect()
			else
				view.select()