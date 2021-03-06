module.exports = ( { Marionette, _ } ) ->
	Card = require( '../models/Card.coffee')
	require( './CardView.scss' )

	class CardView extends Marionette.ItemView
		className: => "card #{ @model.get('color') } #{ @model.get('set') } #{ @model.get('type') }"
		attributes:
			draggable: true
		template: _.template """
			<div class="rating">
				<% for (r in stats.cost) { %>
					<div class="resource">
						<% for (var i=0; i < Math.floor( stats.cost[r][1] );i++) { %>
							<span class="fa fa-<%- stats.cost[r][0] %>"></span>
						<% } %>
						<% if (Math.floor( stats.cost[r][1] % 2 * 10 ) >= 5) { %>
							<span class="fa fa-<%- stats.cost[r][0] %>-half-o"></span>
						<% } %>
					</div>
				<% } %>
			</div>
			<h1 class="title"><%= title %></h1>
			<div class="image">
				<img src="<%= img_uri %>" alt="<%= title %>">
			</div>
			<div class="tags">
				<div class="primary">
					<% if (set === 'magnet') { %>
						<a href="magnet:?xt=urn:btih:<%= data_hash %>&dn=<%= title %><% for (tr in data_trackers) { %>&tr=<%= encodeURIComponent( data_trackers[tr] ) %><% } %>" title="<%= set %>">
							<i class="fa fa-<%= set %>"></i>
						</a>
					<% } else { %>
						<i class="fa fa-<%= set %>"></i>
					<% } %>
				</div>
				<div class="secondary"><%= type %></div>
				<% for (tag in tags) { %>
					<div class="tag"><%- tags[tag] %></div>
				<% } %>
			</div>
			<div class="description"><%= description %></div>

			
			<div class="rating-set">
				<% if (stats.userscore) { %>
					<div class="rating over-above" title="Userscore: <%= stats.userscore %>"><%= stats.userscore %></div>
				<% } %>
				<% if (stats.metascore) { %>
					<div class="rating over-above" title="Metascore: <%= stats.metascore %>"><%= stats.metascore %></div>
				<% } %>
			</div>
			

			<div class="foot">
				<span class="footnote"><%= footnote %></span>
				<span class="hash">#: <%= data_hash %></span>
			</div>
		"""
		
		events: 
			'dragstart': '_handleDragStart'
			'dragend': '_handleDragEnd'
			'dragenter': '_handleDragEnter'
			'dragover': '_handleDragOver'
			'dragleave': '_handleDragLeave'
			'click': '_handleClick'
		
		initialize: ->

		deselect: ->
			@$el.removeClass( 'dropping' )
			@$el.removeClass( 'selected' )

		select: ->
			@$el.removeClass( 'dropping' )
			@$el.addClass( 'selected' ) 

		_handleClick: (e) =>
			@$el.removeClass( 'dropping' )
			@trigger( 'selected', @$el.hasClass( 'selected') )

		_handleDragLeave: =>
			@$el.removeClass( 'dropping' )

		_handleDragOver: (e) =>
			@$el.addClass( 'dropping' )
			e.preventDefault()
			false

		_handleDragEnter: =>
			@$el.addClass( 'dropping' )

		_handleDragEnd: =>
			@$el.removeClass( 'dragging' )
			@stopListening( @$el, 'mousemove', @_handleDragMove )

		_handleDragStart: (ev) =>
			console.log ev
			style = window.getComputedStyle(ev.target, null)
			ev.originalEvent.dataTransfer.setData( "text/plain",
			(parseInt(style.getPropertyValue("left"),10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - ev.clientY))
			@$el.addClass( 'dragging' )
			console.log 'start drag'
		_handleDragMove: (ev) =>
			console.log arguments
			@$el.css
				left: ev.clientX
				top: ev.clientY



