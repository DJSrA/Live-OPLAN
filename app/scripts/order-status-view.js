var OrderStatus = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-status-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderStatus')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is a list item from the order list view. it is still static information, but holds all relations that order had when it was made. if
// the user clicks on the customer, it should take them to the customer's info, probably just as a modal. even if they edit the customer info,
// it should not change the order. the information on the order should be static. in the case
// they made a mistake and need to send a new invoice or something, it should be marked as void, but not deleted.

// currently the user should be able to click on an invoice item (item instance) and be shown that information, either in a modal or just as
// an expansion on the page, particularly to see if a backorder is marked as filled in the system. if a backorder is filled, it should not
// update the invoice. the invoice is a past document, and should hold the assocations to the models it was made from for navigation/update
// reasons, but all information displayed on the page should have been saved the day the invoice was sent.