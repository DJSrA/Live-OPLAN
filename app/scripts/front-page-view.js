var FrontPage = Parse.View.extend ({

	events: {

	},

	template: _.template($('.dashboard-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('front page')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// for now this should just be an alan arms logo and some buttons to take the user to the other pages
