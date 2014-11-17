var CustomerList = Parse.View.extend ({

	events: {
		'click .new-customer-submit' : 'addCustomer',
	},

	template: _.template($('.customer-list-view').text()),
	newCustomerTemplate: _.template($('.new-customer-list-item').text()),
	customerListTemplate: _.template($('.customer-list-item').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('CustomerList')
		this.render();
	},

	render: function() {
		$(this.el).html('');
		$(this.el).append(this.template());
		this.drawNewCustomerInput();
		this.getCustomers();
	},

	drawNewCustomerInput: function() {
		$('.add-customer-bound').html('');
		$('.add-customer-bound').append(this.newCustomerTemplate());
	},

	checkCustomer: function() {
		var that = this;
		this.query.each(function(customer){
			if(customer.attributes.name == $('.customer-name').val() && customer.attributes.city == $('.customer-city').val() && customer.attributes.state == $('.customer-state').val() && customer.attributes.streetAddress == $('.customer-address').val()){
				alert('this customer already exists');
			}else {
				that.addCustomer();
			}
		})
	},
	addCustomer: function() {
		var that = this;

		var Customer = Parse.Object.extend('customer');
		var customer = new Customer();
		customer.set('name', $('.customer-name').val());
		customer.set('city', $('.customer-city').val());
		customer.set('state', $('.customer-state').val());
		customer.set('streetAddress', $('.customer-address').val());

		customer.save().then(function(){
			that.drawNewCustomerInput();
			that.getCustomers();
		})
	},

	getCustomers: function() {
		var that = this;
		$('.customer-list').html('');
		this.query = new Parse.Query('customer');
		this.query.each(function(customer){
			$('.customer-list').append(that.customerListTemplate({ customer: customer.attributes }))
		})
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
