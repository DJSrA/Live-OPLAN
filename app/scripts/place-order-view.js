var PlaceOrder = Parse.View.extend ({

	events: {
		'click .customer-state' : 'getCustomer',
		'click .states-bread' : 'showStates',
		'click .customers-bread' : 'showCustomers',
		'click .merchant' : 'showCustomer',
		'click .accept-merchant' : 'acceptMerchant',
		'click .cancel-merchant' : 'showStates',
	},

	template: _.template($('.place-order-view').text()),
	customersTemplate: _.template($('.customer-by-state-view').text()),
	customerTemplate: _.template($('.customer-order-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('PlaceOrder')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());
		this.showStates();

	},

	showStates: function() {
		$('.select-customer').html('<span>states</span>');

		var states = [
			'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
			'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
			'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
			'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
			'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
			'DC'
		];

		states.forEach(function(state){
			$('.select-customer').append('<div class="customer-state">' + state + '</div>');
		})
	},

	getCustomer: function(e) {
		var that = this;
		var state = e.currentTarget.innerHTML;
		this.merchants = [];

		var query = new Parse.Query('customer');
		query.equalTo('State', state)
		query.find({
			success: function(results){
				results.forEach(function(result){
					that.merchants.push(result)
				})
				// console.log(merchants);
				that.showCustomers();
			},
			error: function(error){

			}
		})
	},

	showCustomers: function() {
		var that = this;
		$('.select-customer').html('<span><span class="states-bread">states</span> <i class="fa fa-arrow-right"></i> customers</span>');
		this.merchants.forEach(function(merchant,index){
			$('.select-customer').append(that.customersTemplate({merchant: merchant, index: index}));
		});
	},

	showCustomer: function(location) {
		$('.select-customer').html('<span><span class="states-bread">states</span> <i class="fa fa-arrow-right"></i> <span class="customers-bread">customers</span> <i class="fa fa-arrow-right"></i> '+ location.currentTarget.innerHTML + '</span>');
		var index = location.currentTarget.id;
		this.merchant = this.merchants[index];
		$('.select-customer').append(this.customerTemplate({merchant : this.merchant}));
	},

	acceptMerchant: function() {
		console.log(this.merchant)
	}


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