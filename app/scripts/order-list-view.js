var OrderList = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-list-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is a list of all past orders/invoices. the list should be sortable, and each item should be attached to its items, customer, form-3, and 
// any other relevant data. 

// eventually we should write cloud code that moves shipped items, forms, and orders to a seperate data class so that we dont query through items
// that are already gone. currently they should keep all associations and information.

// I dont think anything on this list should be editable from here, if at all. please discuss with me if you think of a situation where it may be
// needed. this list also includes partial invoices, but as far as the invoice is concerned it is final and has been sent. if they send a new
// invoice when a backorder is filled and shipped and want to do it through here, cool. but currently all this information is static as I understand
// it.