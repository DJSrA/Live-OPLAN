var PlaceOrder = Parse.View.extend ({

	events: {

	},

	template: _.template($('.place-order-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('PlaceOrder')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this should prompt them to select a customer from the customer list, or make a new customer in a modal. when they select a customer, they
// should be able to change the input (address, billing, phone number, etc) feilds after a button click, but this should not by default
// update the customer model. we can add the option later, but for now it should just be treated as an array of strings we are displaying on the
// page, and lose reference to the model. the reason being if they just need to send it to a new address or something this one time, and also 
// the invoice (object) needs to save this information as text to itself in case the customer is later deleted or updated.

// once a customer has been selected, item types and quantities should be selected. "special" will be an option, but for now it should just be
// treated the same, as it will be worked out later. 

// once item types and quantities are chosen form-3's will be generated and filled out for the existing items, and will be generated for the backorder
// items although be incomplete. these will be displayed on a different page, but made here.