var CustomerList = Parse.View.extend ({

	events: {

	},

	template: _.template($('.customer-list-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('CustomerList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// This is a list of existing/previous customers. There needs to be an input feild to add new customers. the customers will be objects on 
// the server made by the shop to be used when placing an order. each customer needs to have knowledge of its existing orders, but 
// on creation should have an empty array for that, not an undefined feild. 

// the customers should be sortable/searchable and editable. it would be nice (non priority) if the customer could hold multiple values for
// it's inputs, such as different shipping addresses, payment options, whatever. I mention this so that any feilds that the customer may need to
// have more than one of down the line are made as either an array of objects or arrays

// the user should be able to select a customer and view past orders, with any orders containing unfilled backorders listed first. I'm not sure
// how this could be done easily, since the order/invoice will not be updated once a backorder is filled assuming they already paid for the
// item, they will just be issued a new shipment invoice, which I dont think we are actually dealing with
