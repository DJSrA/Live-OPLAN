
var AttachForm3 = Parse.View.extend ({

	events: {

	},

	template: _.template($('.attach-form3-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('AttachForm3')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this basically just shows the form-3's that are attached to a certain order. they can be edited, but all items should have one if they have
// ordered. im a little fuzzy on exactly what is needed, so for now this page should just show a bunch of form threes.
//						ITEM INSTANCE CODE
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
// ///////// undefined 	: not assigned, currently for sale	
// ///////// 0 			: currently on the shelf, already sold, waiting for paperwork 
// ///////// 1			: currently attached to a backorder waiting to be processed
// ///////// 2			: sold/shipped/unavailable
// ///////// 3			: special, not currently used, but essetially this exists
// /////////			  for reserving items, removing items from a backorder but
// /////////			  needing to keep it from being attached to another backorder,
// /////////			  or basically any time it is not sold but not currently open
// /////////			  for regular sale
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
var BackorderList = Parse.View.extend ({

	events: {

	},

	template: _.template($('.backorder-list-view').text()),
	backorderItemTemplate: _.template($('.backorder-list-item').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('BackorderList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());
		this.getBackorderItems();
	},

	getBackorderItems: function() {
		var that = this;
		$('.backorder-list-item-bound').html('');

		var query = new Parse.Query('backOrder');
		query.include('itemType');
		query.include('order');
		query.each(function(item){
			$('.backorder-list-item-bound').append(that.backorderItemTemplate({ backorder: item.attributes, itemType: item.attributes.itemType.attributes, order: item.attributes.order }))
		})
	},


});

// this is formost a list of items that have been invoiced/sold but were not in stock at the time of the sale
// essentially, it is a list of item types (not instances) that have been bought, so there needs to be knowledge
// of the particular order/invoice, the particular form-3, and it should check the items in inventory for an item
// instance that matches the item type. this should also happen in the scanning process, but it will be reduntantly
// done in this view.

// if a match of item instance is found, it should automatically be associated to the relevant backorder via pointer
// as to keep it from being sold, it should complete the associated form-3, and it should notify the shop/update the page.

// the page should be a searchable list of all backorders, that is by default color coded and ordered as the filled backorders
// first, and the unfilled backorders by oldest (smallest, in javascript) date second.

// the list by default should have a color code to show filled status, it should have a date, the name of the item, the name of the 
// customer, and either expand or have a modal to display the form-3/invoice/shipment of partial invoice/or any other relevant
// information we have. 

// non priorities, but should be built for the possibility later, are:

// 	to be able to remove an item from a backorder so that it can attached to another order at the shop's 
// 	discretion. this is a nice to have fringe case. 

// 	a feild for the expected delivery date

// 	the ability to place an order for the item(s), but seriously this is barely on the radar, i just want it 
// 	in the comments to note it as something to look into after this is complete




var CustomerList = Parse.View.extend ({

	events: {
		'click .create-customer'		 : 'createCustomerContainer',
		'click .new-customer-submit' : 'addCustomer',
		'click .cancel-customer'		 : 'cancelCustomerCreation',
		'keydown .search'		: 'listIt',
		'click .reset-search' : 'resetSearch',
		'click .edit-customer' : 'editCustomerModal',
		'click #close-modal'		: 'closeModal',
		'click .save-customer-changes' : 'saveCustomerChanges',
	},

	template: _.template($('.customer-list-view').text()),
	customerListTemplate: _.template($('.customer-list-item').text()),
	customerModalTemplate: _.template($('.customer-modal-template').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			this.phoneValidate();
			this.render();
		}
	},

	render: function() {
		$(this.el).html('');
		$(this.el).append(this.template());
		this.phoneValidate();	
		this.emailValidate();
		this.getCustomers();
	},

	listIt: function(){
		var options = {
		  valueNames: [ 'company-name', 'company-owner', 'company-phone', 'company-email', 'FFL', 'address', 'city', 'state', 'zip' ]
		};

			// Init list
			
		var contactList = new List('contacts', options);
		// var options = {};
	},


	closeModal: function() {
		console.log('closing modal');
		$('body').css('overflow', 'visible');
		$('.modal-div').html('');
	},

	resetSearch: function () {
		$('.list').html('');
		$('.search').val('');
		$('.search').focus();
		this.getCustomers();
	},

	phoneValidate: function () {
	  function phone (input, n) {
	      $(input).keyup(function() {
	          // val is numeric
	          if ($.isNumeric($(this).val())) {
	              $('.phone-number-input').css('background', 'white');
	              if ($(this).val().length >= n) $(this).next('input').focus();
	          // val is not numeric
	          } else {
	              // characters exist in input
	              $(this).css('background', $(this).val().length ? 'rgba(255, 0, 0, 0.35)' : 'white');
	          }
	      });
	  };
	  _.each($('.phone-number-input'), function (input, i) {
	      // make click event for each input
	      phone(input, [3,3,4][i]);
	  });

	  _.each($('.zip-input'), function(input, i) {
	  		phone(input, [5][i]);
	  })

	  // new function 
	  addDashes = function addDashes(f) {
	      var r = /(\D+)/g,
	          areacode = '',
	          middle3 = '',
	          last4 = '';
	      f.value = f.value.replace(r, '');
	      areacode = f.value.substr(0, 3);
	      middle3 = f.value.substr(3, 3);
	      last4 = f.value.substr(6, 4);
	      f.value = areacode + '-' + middle3 + '-' + last4;
	  }
	},

	emailValidate: function () {
	  function evaluate (val) { return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val); }
	  $('.email-input').keyup(function() {
	    $(this).css('background', evaluate($(this).val()) ? 'white' : 'rgba(255, 0, 0, 0.35)');
	    if($(this).val() < 1){
	    	$(this).css('background', 'white');
	    }
	  })
	},

	// checkCustomer: function() {
	// 	var that = this;
	// 	this.query.each(function(customer){
	// 		if(customer.attributes.name == $('.customer-name').val() && customer.attributes.city == $('.customer-city').val() && customer.attributes.state == $('.customer-state').val() && customer.attributes.streetAddress == $('.customer-address').val()){
	// 			alert('this customer already exists');
	// 		}else {
	// 			that.addCustomer();
	// 		}
	// 	})
	// },

	createCustomerContainer: function (){
		console.log('open it');
		$('.create-customer').attr('disabled', 'disabled');
		$('.hidden-customer-creation').css('display', 'block');
	},

	cancelCustomerCreation: function (){
		$('.create-customer-input').val('');
		$('.create-customer').attr('disabled', false);
		$('.hidden-customer-creation').css('display', 'none');
	},

	addCustomer: function() {
		var that = this;

		var Customer = Parse.Object.extend('customer');
		var customer = new Customer();
		// _.each($('.create-customer-input'), function(e){
			if($('.company-input').val() === '') {
				console.log('empty');
				$('.create-customer-input').val('')
				$('.company-input').focus();
				return '';
			} else {
				customer.set({
					Company: $('.company-input').val(),
					FirstName: $('.first-name-input').val(),
					LastName: $('.last-name-input').val(),
					Phone: parseInt($('.phone-number-input').val()),
					email: $('.email-input').val(),
					FFL: $('.ffl-input').val(),
					Address1: $('.address-input').val(),
					City: $('.city-input').val(),
					Zip: parseInt($('.zip-input').val()),
					State: $('.state-input').val()
				}).save()	
				console.log(customer);
				that.getCustomers();
				that.cancelCustomerCreation();
			}
		// })
	},

	getCustomers: function() {
		var that = this;
		$('.customer-list').html('');
		this.query = new Parse.Query('customer');
		this.query.each(function(customer){
			$('tbody.list').append(that.customerListTemplate({ customer: customer.attributes, model: customer }));
		})
		// that.readyCustomers();
	},

	editCustomerModal: function(e){
		var that = this;
		var CustomerName = $(event.target).attr('name');
		console.log(CustomerName);
		var customerQuery = new Parse.Query('customer');
		customerQuery.limit(1500);
		customerQuery.equalTo('Company', CustomerName);
		customerQuery.first({
			success: function(customer){
				$('body').css('overflow', 'hidden');
				$('.modal-div').append(that.customerModalTemplate({customer: customer.attributes, model: customer }));
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		})
	},

	saveCustomerChanges: function(e){
		var that = this;
		var CustomerName = $(event.target).attr('name');
		var customerQuery = new Parse.Query('customer');
		customerQuery.limit(1500);
		customerQuery.equalTo('Company', CustomerName);
		customerQuery.first({
			success: function(customer){
				var thisCompany = customer.attributes;
				// console.log(customer.attributes.Company)
				customer.set({
					Company: 		($('.company-input').val().length != 0 ? $('.company-input').val() : thisCompany.Company),
					FirstName: 	($('.first-name-input').val().length != 0 ? $('.first-name-input').val() : thisCompany.FirstName),
					LastName: 	($('.last-name-input').val().length != 0 ? $('.last-name-input').val() : thisCompany.LastName),
					Phone: 			($('.phone-number-input').val().length != 0 ? parseInt($('.phone-number-input').val()) : thisCompany.Phone),
					email: 			($('.email-input').val().length != 0 ? $('.email-input').val() : thisCompany.email),
					FFL: 				($('.ffl-input').val().length != 0 ? $('.ffl-input').val() : thisCompany.FFL),
					Address1: 	($('.first-name-input').val().length != 0 ? $('.first-name-input').val() : thisCompany.Address1),
					City: 			($('.city-input').val().length != 0 ? $('.city-input').val() : thisCompany.City),
					Zip: 				($('.zip-input').val().length != 0 ? parseInt($('.zip-input').val()) : thisCompany.Zip),
					State: 			($('.state-input').val().length != 0 ? $('.state-input').val() : thisCompany.State)
				}).save()

				console.log(customer.attributes);
				that.closeModal()
				that.getCustomers();
			},
			error: function(error) {	
				console.log("Error: " + error.code + " " + error.message);
			}
		})
	}


 //  readyCustomers:function() {
 //  	console.log('makin lists');
 //  	var options = {
	// 	  valueNames: [ 'username', 'address' ],
	// 	};
	// 	console.log(options);
	// 	var userList = new List('list', options);
	// },


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

var FrontPage = Parse.View.extend ({

	events: {
		'click .submit-sign-in' : 'signIn',
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

	signIn: function(){
		var username = $('.username-input').val();
		var password = $('.password-input').val();

		var that = this;

		// This is just a basic parse login function
		Parse.User.logIn(username, password, {
		  success: function(user){
		  	console.log('logged in');
		  },
		  error: function(user, error){
		  	$('.username-input').val('');
		  	$('.password-input').val('');
		  	$('.username-input').focus();
		    alert("Incorrect. Please try again");
		  }
		});
	}


});

// for now this should just be an alan arms logo and some buttons to take the user to the other pages

//						ITEM INSTANCE CODE
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
// ///////// undefined 	: not assigned, currently for sale	
// ///////// 0 			: currently on the shelf, already sold, waiting for paperwork 
// ///////// 1			: currently attached to a backorder waiting to be processed
// ///////// 2			: sold/shipped/unavailable
// ///////// 3			: special, not currently used, but essetially this exists
// /////////			  for reserving items, removing items from a backorder but
// /////////			  needing to keep it from being attached to another backorder,
// /////////			  or basically any time it is not sold but not currently open
// /////////			  for regular sale
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////


var InventoryList = Parse.View.extend ({

	events: {
		'click span.item-type' : 'itemTypeDetail',
		'click .manufacturer' : 'activeManufacturer',
	},

	template: _.template($('.inventory-list-view').text()),
	listItemTemplate: _.template($('.inventory-list-item-view').text()),
	listItemDetailTemplate: _.template($('.inventory-list-detail-view').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('InventoryList')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getItemTypes();
	},

	getItemTypes: function() {
	},

	itemTypeDetail: function (location) {
		var that = this;
		$('.inventory-list-detail-bound').html('');

		var query = new Parse.Query('itemType');
		query.equalTo('typeName', location.currentTarget.innerHTML);
		query.first({
			success: function(itemType) {
				// console.log(itemType)
				var query = new Parse.Query('itemInstance');
				query.equalTo('itemType', itemType);
				query.equalTo('itemInstanceCode', undefined)
				query.each(function(item){
					// console.log(item.attributes)
					$('.inventory-list-detail-bound').append(that.listItemDetailTemplate({ item: item.attributes }))
				})
				
			},
			error: function(error) {
				console.log(error)
			}
		})



	},

	newItemView: function(e){
		new InventoryItemView({
		  el: $('.inventory-list-item-bound'),
		  model: e,
		});
	},
	activeManufacturer: function(e){
		$('.manufacturer').removeClass('active');
		$(event.target).addClass('active');
		$('.center-number').text('');
		$('.center-number').text($(event.target).text());
		$('.inventory-list-item-bound').html('');

		var chosenManufacturer = e.currentTarget.attributes.name.value;
		var that = this;
		var listManufacturers = [];
		var thisManufacturersItems = [];
		
		var query = new Parse.Query('itemType');
		query.limit(1000)
		query.find(function(itemTypes){
			itemTypes.forEach(function(e){
				var thisItem = [];
				if (e.attributes.Manufacturer == chosenManufacturer){
					// var newItemView = new InventoryItemView({itemType: e});
					$('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: e}))
					thisManufacturersItems.push(e);
				}
				return thisManufacturersItems
			});
			var ItemsList = []
			console.log(thisManufacturersItems);
			var queryInstances = new Parse.Query('itemInstance');
			queryInstances.limit(1000);
			queryInstances.find(function(itemInstances){
				var UPCList = [];
				itemInstances.forEach(function(item){
					UPCList.push(item.attributes.UPC);
					
				})
			console.log(UPCList);
				return UPCList
				// console.log(itemInstances.attributes.UPC);
			})
			for(i = 0; i < thisManufacturersItems.length; i++){
			  _.each(thisManufacturersItems[i], function(){
			  	// console.log(thisManufacturersItems);
			  	// console.log(thisManufacturersItems[i].attributes.UPC);
			  	ItemsList.push(thisManufacturersItems[i]);
			    // $('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: thisManufacturersItems[i]}))
			  });
				// setTimeout(console.log(ItemsList), 1500);
		  	// return ItemsList;
			};
		})
		// // this.setAppropriateHeight();
	},


	// setAppropriateHeight: function () {
	// 	$('li').forEach(function(){
	// 		console.log($(this).height);
	// 	})
		// $('.try').css('height', $(this).parent().height());
		// var children = []; 
		// var outerContainer = $('.inventory-list-item-bound');
		// console.log(outerContainer);
		// console.log(this.$el);
		// $('.inventory-list-item-bound').children().forEach(function(child){
		// 	children.push(child);
		// 	console.log(children);
		// 	return children
		// })
		// // _.each($('.inventory-list-item-bound').children(), function(child){ 
		// // 	children.push(child);
		// // 	return children
		// // }); 
		// // console.log(children)
		// _.each(children, function(child){
		// 	$(child).children().css('height', $(child).height())
		// });
	// },


});

// this is a list of all items that are not attached to a backorder or a shelf item, so all items with no item instance code.
// these are all items instances that have been scanned in and not sold. there should be a list of all item types that have item
// instances attached to them, including a non-defined item type, which is what is given to all items that do not have defined item
// types. an item instance must be assigned an item type other than non-defined before it can be sold. 

// new item types should be able to be created, deleted and edited. when this happens, items should be automatically moved from non-defined
// to the new item type if they match. otherwise some association with the info from the manufacturers needs to be created so that items will
// automatically be put into their appropriate types when scanned in. 

// particular item instances should be able to be created, deleted and edited, however this should be indirect to do, and require multiple
// checks and button clicks, as it should never happen by accident.

// there is going to be a "special" item type, which is going to be dealt with entirely seperately from the rest of the items, and it going to 
// be pulled into the order forms differently as well. it should only be dealt with after all essentials are completed.
// the point of the special item class is to group items that are unique in some way. this could be a one off item that will never be sold again,
// or it could an existing item that they want to sell for a different price, but only want to apply that price to that particular item. this 
// could also be accomplished on the invoice, but this is a better way of tracking it. there are also other uses for the "special" item type,
// but it is not a priority, just something that will likely need to be made. it will never take items automatically when scanned in.




			// THIS IS HERE IN CASE I NEED SOMETHING OLD -------------

			// itemTypes.forEach(function(itemType){
			// 	var query = new Parse.Query('itemInstance');
			// 	// query.equalTo('itemInstanceCode', undefined)
			// 	query.equalTo('Manufacturer', chosenManufacturer);
			// 	// $(itemType.attributes.ProductID).forEach(function(e){
			// 	// 	var thisProductId = 0;
			// 	// 	thisProductId = e;
			// 	// 	ProductIdLength.push(thisProductId);
			// 	// })
			// console.log(query)
			// // console.log(itemNumber)
			// 	query.find({
			// 		success:function(count){
			// 				itemNumber = itemNumber + 1;
			// 				// $('.product-id').text(itemNumber);
			// 			// for(i = 0; i < ProductIdLength.length; i ++){
			// 				$('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: itemType, count: count}))
			// 				// console.log(i);
			// 				// console.log(itemNumber);
			// 				// console.log(count)

			// 				// i++	
			// 			// }
			// 		},
			// 		error:function(error){
			// 			console.log(error);
			// 		}
			// 	})

var OrderInvoice = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-invoice-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderInvoice')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is where the invoice is shown. it pulls information from the order, and displays everything as text. once it is submitted it can't be
// altered, but it can be voided and resubmitted. but both should still exist.
var OrderList = Parse.View.extend ({

	events: {
		'click .order-instance'	: 'orderDetail',
	},

	template: _.template($('.order-list-view').text()),
	orderInstanceTemplate: _.template($('.order-list-item-view').text()),
	orderDetailTemplate: _.template($('.order-detail-view').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('OrderList')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getOrders();
	},

	getOrders: function() {
		var that = this;

		$('.order-list-item-bound').html('');
		var query = new Parse.Query('order');
		query.include('customer');
		query.each(function(order){
			$('.order-list-item-bound').append(that.orderInstanceTemplate({ order: order, customer: order.attributes.customer }))
		})
	},

	orderDetail: function(location) {
		var that = this;
		// console.log(location.currentTarget.id)
		$('.order-detail-bound').html('');
		var query = new Parse.Query('order');
		query.include('customer');
		query.equalTo('objectId', location.currentTarget.id);
		query.first(function(order){
			console.log(order)
			var query = new Parse.Query('itemInstance');
			query.include('itemType');
			query.equalTo('order', order);
			query.each(function(item){
				$('.order-detail-bound').append(that.orderDetailTemplate({ item: item, itemType: item.attributes.itemType }))
			})
		})

	}


});

// this is a list of all past orders/invoices. the list should be sortable, and each item should be attached to its items, customer, form-3, and 
// any other relevant data. 

// eventually we should write cloud code that moves shipped items, forms, and orders to a seperate data class so that we dont query through items
// that are already gone. currently they should keep all associations and information.

// I dont think anything on this list should be editable from here, if at all. please discuss with me if you think of a situation where it may be
// needed. this list also includes partial invoices, but as far as the invoice is concerned it is final and has been sent. if they send a new
// invoice when a backorder is filled and shipped and want to do it through here, cool. but currently all this information is static as I understand
// it.
var OrderPartial = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-partial-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderPartial')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is for invoices that have backorders on them. I think all backorders must be paid for even if they dont have them yet, so for now 
// i think that's how it should work, but build it with the understanding that may change. it otherwise works exactly the same as the invoice,
// it just looks different because it needs to display if items are put on the shelf or on backorder.
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

// this is for incomplete orders. it may get dropped, but it depends on when the orders are saved to the server
var PlaceOrder = Parse.View.extend ({

	events: {
		'click .customer-state' : 'getCustomer',
		'click .states-bread' : 'showStates',
		'click .customers-bread' : 'showCustomers',
		'click .merchant' : 'showCustomer',
		'click .accept-merchant' : 'acceptMerchant',
		'click .cancel-merchant' : 'showStates',
		'click .confirm-order-button' : 'swapConfirmView',
		// 'click .remove-item' : 'removeItemOrder'
	},

	template: _.template($('.place-order-view').text()),
	customersTemplate: _.template($('.customer-by-state-view').text()),
	customerTemplate: _.template($('.customer-order-view').text()),

	shoppingCart: {
		customer: {},
		cart: []
	},

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('PlaceOrder')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.showStates();

	},

	showStates: function() {
		$('.select-customer').html('');

		var states = [
			'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
			'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
			'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
			'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
			'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
			'DC'
		];

		states.forEach(function(state){
			$('.select-customer').append('<button class="customer-state btn btn-default">' + state + '</button>');
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
		this.shoppingCart.customer = this.merchants[index];
		$('.select-customer').append(this.customerTemplate({merchant : this.shoppingCart.customer}));
	},

	acceptMerchant: function() {
		this.inventoryList = new OrderInventoryList();
		// console.log(this.shoppingCart)
	},

	swapConfirmView: function() {
		router.swap( new ConfirmOrderView({ customer: this.shoppingCart.customer, items: this.shoppingCart.cart }) );
	},

	// removeItemOrder: function(e) {
	// 	var that = this;
	// 	var tog = false

	// 	this.shoppingCart.cart.forEach(function(item, index, array){
	// 		if(item[0] == e.currentTarget.getAttribute('value')){
	// 			item[1] -= 1;
	// 			if(item[1] <= 0){
	// 				array.splice(that.shoppingCart.cart[index], 1);
	// 				that.shoppingCart.cart = array;
	// 				that.inventoryList.renderCart()
	// 			}else {
	// 				that.inventoryList.renderCart()
					
	// 			}
	// 			// console.log(router.currentView.shoppingCart.cart)
	// 		}
	// 	})		
	// },


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


//						ITEM INSTANCE CODE
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
// ///////// undefined 	: not assigned, currently for sale	
// ///////// 0 			: currently on the shelf, already sold, waiting for paperwork 
// ///////// 1			: currently attached to a backorder waiting to be processed
// ///////// 2			: sold/shipped/unavailable
// ///////// 3			: special, not currently used, but essetially this exists
// /////////			  for reserving items, removing items from a backorder but
// /////////			  needing to keep it from being attached to another backorder,
// /////////			  or basically any time it is not sold but not currently open
// /////////			  for regular sale
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////


var OrderInventoryList = Parse.View.extend ({

	events: {
		'click span.item-type' : 'itemTypeDetail',
		'click .manufacturer' : 'activeManufacturer',
		'click button.order-item' : 'addItemOrder',
	},

	template: _.template($('.order-inventory-list-view').text()),
	listItemTemplate: _.template($('.order-inventory-list-item-view').text()),
	listItemDetailTemplate: _.template($('.order-inventory-list-detail-view').text()),
	shoppingCartTemplate: _.template($('.order-shopping-cart-view').text()),

	initialize: function() {
		$('.app-merchant-bound').html(this.el);
		// console.log('InventoryList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());
	},

	itemTypeDetail: function (location) {
		var that = this;
		$('.inventory-list-detail-bound').html('');

		var query = new Parse.Query('itemType');
		query.equalTo('typeName', location.currentTarget.innerHTML);
		query.first({
			success: function(itemType) {
				// console.log(itemType)
				var query = new Parse.Query('itemInstance');
				query.equalTo('itemType', itemType);
				query.equalTo('itemInstanceCode', undefined)
				query.each(function(item){
					// console.log(item.attributes)
					$('.inventory-list-detail-bound').append(that.listItemDetailTemplate({ item: item.attributes }))
				})
				
			},
			error: function(error) {
				console.log(error)
			}
		})



	},

	activeManufacturer: function(e){
		$('.manufacturer').removeClass('active');
		$(event.target).addClass('active');
		$('.center-number').text('');
		$('.center-number').text($(event.target).text());
		$('.inventory-list-item-bound').html('');
		var chosenManufacturer = e.currentTarget.attributes.name.value;
		var that = this;
		// var itemNumber = 0;
		var listManufacturers = [];
		// var thisModel = 0;
		var query = new Parse.Query('itemType');
		query.limit(1000)
		query.equalTo('Manufacturer', chosenManufacturer)
		query.find(function(itemTypes){

			itemTypes.forEach(function(e){
				if (e.attributes.Manufacturer == chosenManufacturer){
					$('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: e}))
				}
			})

		})
	},


	addItemOrder: function(e){
		var that = this;
		var tog = false

		var itemName = e.currentTarget.parentElement.parentElement.children[1].innerHTML;

		router.currentView.shoppingCart.cart.forEach(function(item){
			if(item[0] == e.currentTarget.getAttribute('value')){
				tog = true;
				item[1] += 1;
				// console.log(router.currentView.shoppingCart.cart)
				that.renderCart()
			}
		})
		if(tog == false){
			var cartItem = [ e.currentTarget.getAttribute('value'), 1, itemName];
			router.currentView.shoppingCart.cart.push(cartItem);
			// console.log(router.currentView.shoppingCart.cart)
			that.renderCart()				
		}
			
	},

	renderCart: function(){
		$('.shopping-cart-bound').html('');
		var that = this;

		router.currentView.shoppingCart.cart.forEach(function(item){
			// if(item[3] == undefined){
			// 	var query = new Parse.Query('itemType');
			// 	query.
			// }
			$('.shopping-cart-bound').append(that.shoppingCartTemplate({ item: item}));
			// console.log(item)
		})
		$('.shopping-cart-bound').append('<button role="button" class="btn confirm-order-button" data-toggle="modal">Check Out</button>');

	}


});
//						ITEM INSTANCE CODE
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
// ///////// undefined 	: not assigned, currently for sale	
// ///////// 0 			: currently on the shelf, already sold, waiting for paperwork 
// ///////// 1			: currently attached to a backorder waiting to be processed
// ///////// 2			: sold/shipped/unavailable
// ///////// 3			: special, not currently used, but essetially this exists
// /////////			  for reserving items, removing items from a backorder but
// /////////			  needing to keep it from being attached to another backorder,
// /////////			  or basically any time it is not sold but not currently open
// /////////			  for regular sale
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
var ScanItem = Parse.View.extend ({

	events: {
		'click .new-item-submit' 						: 'createNewItemInstance',
		'click .add-item'				 						: 'manualAddItem',
		'click .add-new-item'    						: 'addNewItemFields',
		'click .cancel-new-item-creation' 	: 'cancelCreation',
		'click .start-scanning'  						: 'startScanning',
		'click .stop-scanning'   						: 'stopScanning',
		'keypress .this-upc'								: 'firstScan',
		'keypress .this-serial-number'			: 'secondScan',
	},

	template: _.template($('.scan-item-view').text()),
	manualItemCreationTemplate: _.template($('.manual-item-creation-template').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			var fakeScan = [];
			this.render();
			var totalScanned = 0;
		}
	},

	render: function() {
		$(this.el).html(this.template());
	},

	firstScan: function(e){
		if(e.keyCode == 13){
		   console.log($('.this-upc').val());
		   $('.this-serial-number').focus();
		} else {
			console.log("it's not ENTER!");
		}
	},

	secondScan: function(e){
		if(e.keyCode == 13){
		   console.log($('.this-upc').val() + ', ' + $('.this-serial-number').val());
		   this.autoFill();
		   console.log(this.autoFill());
		   this.createNewItemInstance();
		   $('.this-upc').val('');
		   $('.this-serial-number').val('');
		   $('.this-upc').focus();
		} else {
			console.log("it's not ENTER!");
		}
	},

	startScanning: function () {
		$('.this-upc').attr('disabled', false);
		$('.this-serial-number').attr('disabled', false);
		$('.this-upc').focus();
		$('.start-scanning').addClass('stop-scanning');
		$('.start-scanning').text('STOP SCANNING');
		$('.stop-scanning').removeClass('start-scanning')
	},

	stopScanning: function () {
		$('.this-upc').attr('disabled', true);
		$('.this-serial-number').attr('disabled', true);
		$('.stop-scanning').addClass('start-scanning');
		$('.stop-scanning').text('START SCANNING');
		$('.start-scanning').removeClass('stop-scanning')
	},

	checkInput: function() {
		if($('.itemType').val() && $('.itemName').val() && $('.itemNumber').val()){
			this.checkItemType()
		}else {
			alert('please fill in all feilds')
		}
	},

	autoFillScan: function() {
		this.autoFill();
		var UPCserial = this.autoFill();
		$('.this-serial-number').val(UPCserial.splice(1));
		$('.this-upc').val(UPCserial.splice(0));
		// this.showScannedItem();
	},

	autoFill: function(UPC, SerialNumber) {
		var that = this;
		var scannedItemArray = []
		scannedItemArray.push($('.this-upc').val());
		scannedItemArray.push($('.this-serial-number').val())
	  return scannedItemArray;
	},

	checkItemType: function(){
		var that = this;


		this.autoFill().forEach(function(e){
			var scannedItem = e;
			var parsedScannedItem = parseInt(e);
			if(isNaN(parsedScannedItem) === false) {
				var itemUPC = scannedItem;
			} 
			var query = new Parse.Query('itemType');
			query.equalTo('UPC', itemUPC)
			query.find(function(items){
				if(items.length>0){
					that.itemPointer = items[0];
				} else {
					console.log('no match');
					that.itemPointer = itemType;
				}

			}).then(function(){
				that.newItemSubmit();
			})
		});

	},
	newItemSubmit: function() {
		var that = this;
		that.createNewItemInstance().then(function(){
			that.render;
		});
	},

	manualAddItem: function () {
		$('.add-item').attr('disabled', 'disabled');
		$('.new-item-submit').attr('disabled', 'disabled');
		var that = this;
		this.stopScanning();
		$('.add-here').append(that.manualItemCreationTemplate({}))
		console.log('added it');
	},

	createNewItemInstance: function () {
		var ItemInstance = Parse.Object.extend("itemInstance");
		var itemInstance = new ItemInstance();

		this.autoFill().forEach(function(e){
		  var that = this;
		  var scannedItem = e;
		  var scannedAndParsed = parseInt(e);
		  var query = new Parse.Query('itemType');
		  var UPCchecklist = [];
		  var newSerialNumber = $('.this-serial-number').val();
		  var totalScanned = $('.scanned-item-total').text();
		  var matchedSerialNumber = 0;
		  query.limit(1000);
		  query.find(function(itemTypes){
		    itemTypes.forEach(function(b){
		      if(b.attributes.UPC){
		        UPCchecklist.push(b.attributes.UPC)
		      }
		    });

	    SerialNumber = function () {
		    this.autoFill().forEach(function(e){
					 var scannedItem = e; 
					 var parsedScannedItem = parseInt(e); 
					 if(isNaN(parsedScannedItem)){ return scannedItem} 
				})
	    }

	    if(isNaN(scannedAndParsed) === true){
	    	var query = new Parse.Query('itemInstance');
	    	query.find(function(itemInstances){
	    		itemInstances.forEach(function(b){
	    			if(b.attributes.SerialNumber === scannedItem) {
	    				$('.start-scanning').click();
	    			} else {
	    				console.log('This is new');
	    			}
	    		})
	    	})
	    }


		  if(isNaN(scannedAndParsed) === false) {
		    UPCchecklist.forEach(function(e){
		      if(e == scannedItem){
		        var query = new Parse.Query('itemType');
		        query.limit(1000);
		        query.find(function(itemTypes){
		          itemTypes.forEach(function(b){
		            if(b.attributes.UPC == e){
		              // Setting new itemInstance attributes to matching itemType attributes
		              itemInstance.set({
		                Caliber:              b.attributes.Caliber,
		                Cost:                 b.attributes.Cost,
		                DealerPrice:          b.attributes.DealerPrice,
		                MSRP:          				b.attributes.MSRP,
		                Description:          b.attributes.Description,
		                Model:                b.attributes.Model,
		                UPC:                  b.attributes.UPC,
		                itemType: 						b,
		                serialNumber: 				newSerialNumber,
		                itemInstanceCode: 		0,
		              }).save();
								  console.log(itemInstance)
								  $('.scanned-item-list').append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + itemInstance.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + itemInstance.attributes.serialNumber + '</div>');
									// itemInstance.save();
								  totalScanned = parseInt(totalScanned) + 1;
									$('.scanned-item-total').text(totalScanned);
		            }
		          })
		        })
		      }
		    })
		  } 
		  })
		})
	},


	addNewItemFields: function () {
		// var totalScanned = $('.scanned-item-total').text()
		var empty = $('.new-item-form').find("input").filter(function() {
		       return this.value === "";
		   });
		   if(empty.length) {
		   	alert('please fill in all fields.');
		       //At least one input is empty
		   } else {
		   	var ItemType = Parse.Object.extend("itemType");
		   	var itemType = new ItemType();
		   	itemType.set({
		   		Manufacturer: 				$('.manufacturer').val(),
		   		Description: 					$('.description').val(),
		   	  Caliber:              $('.caliber').val(),
		   	  Model:                $('.model').val(),
		   	  Cost:                 ("$" + $('.cost').val()),
		   	  DealerPrice:          ("$" + $('.dealer-price').val()),
		   	  MSRP:         				("$" + $('.msrp').val()),
		   	  UPC:                  $('.upc').val(),
		   	})

				itemType.save();

				$('.scanned-item-list').append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + itemType.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + itemType.attributes.UPC + '</div>');

				console.log(itemType);
				$('.new-item-form').children('input').val('');
				$('.new-item-form').children('textarea').val('');
				$('.manufacturer').focus();
		   }
	},

	cancelCreation: function () {
		$('.add-item').attr('disabled', false);
		$('.new-item-submit').attr('disabled', false);
		$('.add-here').html('');
		console.log('pudding');
	},


});



// When an item instance is added, it should check to see if it can fill a backorder, be assigned to it's item type, and then
// after it has been saved check to see if it can fill a backorder. if it fails to fill a backorder both times, it SHOULD NOT get an item 
// instance code, and just be saved to the server, and the physical item should go in regular inventory.

// concerning item types, all items should automatically be assigned to an item type. we need to come up with a way to associate the information
// we get from a bar code to the item types on the server. the easiest way i think is to require an existing item of that type to be already
// scanned in in order to make a new item type. 

// all items that do not have an existing item type should be marked as non-defined. when a new item type is made based on a non-defined item,
// it should take all other like items marked as non-defined and change them to that item type, however this should be done in the inventory View
// or cloud code and not here
//						ITEM INSTANCE CODE
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
// ///////// undefined 	: not assigned, currently for sale	
// ///////// 0 			: currently on the shelf, already sold, waiting for paperwork 
// ///////// 1			: currently attached to a backorder waiting to be processed
// ///////// 2			: sold/shipped/unavailable
// ///////// 3			: special, not currently used, but essetially this exists
// /////////			  for reserving items, removing items from a backorder but
// /////////			  needing to keep it from being attached to another backorder,
// /////////			  or basically any time it is not sold but not currently open
// /////////			  for regular sale
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////

var ShelfList = Parse.View.extend ({

	events: {

	},

	template: _.template($('.shelf-list-view').text()),
	shelfItemTemplate: _.template($('.shelf-list-item').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('ShelfList')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getShelfItems();
	},

	getShelfItems: function () {
		var that = this;
		$('.shelf-item-list-bound').html('');

		var query = new Parse.Query('itemInstance');
		query.equalTo('itemInstanceCode', 0)
		query.each(function(item){
			$('.shelf-item-list-bound').append(that.shelfItemTemplate({ item: item.attributes }))
		})
	}


});

// these are all items that have been sold/invoiced but are still in the store sitting on a shelf waiting for paperwork to be returned/recieved.
// they need to have knowledge of the date they were set as a shelf item, and they need to have a date/reminder for when that paperwork should be
// back. if they go past that date (either 45 days or 90 days for now) they should be marked as urgent (red, at the top of the list, and push 
// 	a notification somewhere). once an item is shipped it should not be marked as a shelf item, but should still have a pointer to its shelf
// 	information object on the server. this needs to be discussed, actually.

var ConfirmOrderView = Parse.View.extend ({

	events: {
		'click .update-total' : 'updatePage',
		'click .confirm-list' : 'confirmCart',
	},

	template: _.template($('.confirm-order-view').text()),
	itemInstanceTemplate: _.template($('.confirm-order-item-instance-view').text()),
	itemTotalTemplate: _.template($('.update-order-total-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('PlaceOrder')
		this.render();
		// console.log(this.options)
	},

	render: function() {
		// console.log(this.options.customer)
		var customer = {
			Company: (this.options.customer.attributes.Company ? this.options.customer.attributes.Company : ''),
			FirstName: (this.options.customer.attributes.FirstName ? this.options.customer.attributes.FirstName : ''),
			LastName: (this.options.customer.attributes.LastName ? this.options.customer.attributes.LastName : ''),
			Address1: (this.options.customer.attributes.Address1 ? this.options.customer.attributes.Address1 : ''),
			City: (this.options.customer.attributes.City ? this.options.customer.attributes.City : ''),
			State: (this.options.customer.attributes.State ? this.options.customer.attributes.State : ''),
			Zip: (this.options.customer.attributes.Zip ? this.options.customer.attributes.Zip : ''),
			email: (this.options.customer.attributes.email ? this.options.customer.attributes.email : ''),
			Phone: (this.options.customer.attributes.Phone ? this.options.customer.attributes.Phone : ''),
		}
		$(this.el).append(this.template({customer : customer}));
		this.getCart();

	},

	renderCart: function(cart){
		var that = this;
		$('.item-instance-bound').html('');
		// console.log(cart)
		cart.forEach(function(item){
			$('.item-instance-bound').append(that.itemInstanceTemplate({item: item}));
			// console.log(item)
		})
	},

	getCart: function(){
		var that = this;
		this.cart = [];

			var fetch = new Promise (

				function(resolve, reject){
				that.cart = [];
				that.options.items.forEach(function(item, index, array){

					var query = new Parse.Query('itemType');
					query.equalTo('objectId', item[0]);
					query.find({
						success: function(model) {
							model[0].attributes.quan = item[1];
							model[0].attributes.id = model[0].id;

							that.cart.push(model[0].attributes);
							// console.log(model[0].attributes)

						},
						error: function(error) {
							console.log(error);
						}
					}).then(function(){
						// console.log(index + 1 + ' ' + array.length)
						if(index + 1 === array.length){
							resolve(that.cart);
						}
						
					})
				})
			});
		

		fetch.then(function () {
			// console.log(that.cart)
			that.renderCart(that.cart);
			that.showItemSum(that.sumItemCost());
		});

	},

	sumItemCost: function () {
		var total = 0;

		for(i = 0; i < $('.total-item-cost').length; i+=1){
			total += parseInt($('.total-item-cost')[i].innerHTML);
			if(i === $('.total-item-cost').length - 1){
				return total;
			}
		};
	},

	showItemSum: function (sum) {
		$('.cart-total').html(this.itemTotalTemplate({sum: sum}));
	},

	updatePage: function() {
		var newCartTotals = [];

		$('.cart-item-instance').each(function(a,b,c){
			newCartTotals.push([b.getAttribute('id'), b.value])
		})
			this.updateCart(newCartTotals);
		
	},

	updateCart: function(newCart){
		var that = this;

			var fetch = new Promise (

				function(resolve, reject){
				that.cart = [];
				newCart.forEach(function(item, index, array){

					var query = new Parse.Query('itemType');
					query.equalTo('objectId', item[0]);
					query.find({
						success: function(model) {
							model[0].attributes.quan = item[1];
							model[0].attributes.id = model[0].id;

							that.cart.push(model[0].attributes);

						},
						error: function(error) {
							console.log(error);
						}
					}).then(function(){
						// console.log(index + 1 + ' ' + array.length)
						if(index + 1 === array.length){
							resolve(that.cart);
						}
						
					})
				})
			});
		

		fetch.then(function () {
			// console.log(that.cart)
			that.renderCart(that.cart);
			that.showItemSum(that.sumItemCost());
		});

	},

	confirmCart: function() {
		if(confirm('yo dawg are you sure?')){
			$('.item-list-bound').html('');
			$('.item-total-bound').html('');
			new FinalOrder(this.cart);
		}else {
			alert('A wise decision!')
		}

	}

});

var FinalOrder = Parse.View.extend ({

	events: {

	},

	template: _.template($('.final-order-instance-view').text()),

	checkoutCart: [],

	initialize: function() {
		$('.item-list-bound').html(this.el);
		// console.log('OrderStatus')
		this.getCustomer();
		
		this.render();
		this.getItems();
		// console.log(this.order)
	},

	createOrder: function(customer) {
		var that = this;
		// Alternatively, you can use the typical Backbone syntax.
		console.log()
		var Order = Parse.Object.extend('order');
		this.order = new Order();
		this.order.set('customer', customer);
		// this.order.set('backorders', []);
		// this.order.set('items', []);
		this.order.save();

		console.log(this.order);

	},

	getCustomer: function() {
		var that = this;

		var query = new Parse.Query('customer');
		query.equalTo('objectId', router.currentView.options.customer.id);
		query.first({
			success: function(result) {
				that.customer = result;
				that.createOrder(result);
				console.log(result)
			},
			error: function(error){
				console.log(error)
			}
		})

	},

	render: function() {
		// $('nav').toggle();
		$(this.el).append(this.template());

	},

	getItems: function() {
		var that = this;

		router.currentView.cart.forEach(function(item){
			var needed = item.quan;
			


				// console.log(item.Model);
				var query = new Parse.Query('itemInstance');
				query.include('itemType');
				query.equalTo('UPC', item.UPC);
				query.equalTo('itemInstanceCode', 0);
				query.find({
					success: function(results){
						console.log(results);
						results.forEach(function(result){
							if(needed > 0){
								console.log('id ' + result.id);
								result.set('itemInstanceCode', 2);
								result.set('order', that.order)
								result.save();
								needed -= 1;
							}
						})
					},
					error: function(error){
						console.log(error)
					}
				}).then(function(){
					if(needed > 0){
						for (var i = needed; i > 0; i-= 1) {
							that.makeBackorder(item.UPC);
						};
					}
				}).then(function(){
					console.log(that.checkoutCart)
					setTimeout(function(){
						router.navigate('#order/' + that.order.id, {trigger: true, replace: true})
					},500)
				})

		})
	},

	grabInstance: function(item){
		console.log('grabbed an ' + item.attributes.UPC)
		console.log('id ' + item.id);
		item.set('itemInstanceCode', 2);
		item.set('order', this.order)
		item.save();
		this.checkoutCart.push([item, 0]);

	},

	makeBackorder: function(itemType){
		console.log('backorder for ' + itemType);
		var BackOrder = Parse.Object.extend('backOrder');
		var backOrder = new BackOrder();
		backOrder.set('itemType', itemType);
		backOrder.set('order', this.order);
		backOrder.save();
		this.checkoutCart.push([backOrder, 1]);

	}


});

var OrderInstanceView = Parse.View.extend ({

	events: {
		'click .print-sales' : 'printSales',
		'click .print-invoice' : 'printInvoice',
	},

	template: _.template($('.final-order-instance-view').text()),
	customerTemplate: _.template($('.customer-info-order-template').text()),
	itemInstanceTemplate: _.template($('.customer-info-order-items-template').text()),
	backorderInstanceTemplate: _.template($('.customer-info-backorder-template').text()),
	totalTemplate: _.template($('.sales-order-template-total').text()),


	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('front page')
		this.render();
		// $('.alan-arms-pos').hide();
	},

	render: function() {
		$(this.el).append(this.template());
		this.getOrder();

	},

	getOrder: function() {
		var that = this;

		var query = new Parse.Query('order');
		query.equalTo('objectId', this.options);
		query.include('customer');
		query.first({
			success: function(order){
				that.order = order;
				that.showCustomer();
			},
			error: function(error){

			}
		}).then(function(){
			that.getItems();
			
		})
	},

	showCustomer: function() {
		var customer = this.order.attributes.customer;
		$('.customer-info').append(this.customerTemplate({customer: customer, order: this.order }));
	},

	getItems: function() {
		var that = this;

		var query = new Parse.Query('itemInstance');
		query.equalTo('order', this.order);
		query.include('itemType');
		query.find({
			success: function(items){
				if(items.length > 0 ){

				items.forEach(function(item){
					that.showItem(item);	
				})
			} else {
				$('.ship-head').html('');
			}

			},
			error: function(error){

			}
		}).then(function(){
			that.getBackOrders();
		})
	},

	getBackOrders: function() {
		var that = this;

		var query = new Parse.Query('backOrder');
		query.equalTo('order', this.order);
		query.find({
			success: function(items){
				if(items.length > 0 ){

				items.forEach(function(item){
					var typeQuery = new Parse.Query('itemType');
					typeQuery.equalTo('UPC', item.attributes.itemType);
					typeQuery.first({
						success: function(type) {
							that.showBackOrder(item, type);
						},
						error: function(error){
							
						}
					})
				})
			}else{
				$('.backorder-head').html('');
			}

			},
			error: function(error){

			}
		}).then(function(){
			that.getTotal();
		})
	},

	showBackOrder: function(backorder, type){
		$('.backorder-items').append(this.backorderInstanceTemplate({backorder: backorder, type: type}));	
	},

	showItem: function(item) {
		$('.in-stock-items').append(this.itemInstanceTemplate({item: item, type: item.attributes.itemType}));
	},

	getTotal: function() {
	var that = this;

	var costTotal = 0;
		setTimeout(function(){
		$('.item-price').each(function(index, price){
			var cost = (parseInt(this.innerHTML.replace(/\s+/g, '').substr(1)));
			costTotal += cost;
		})
		that.showTotal(costTotal);
			
		},800)
	},

	showTotal: function(costTotal) {
		$('.backorder-items').append(this.totalTemplate({total: costTotal}));
	},

	printSales: function() {
		window.print()
	},	

	printInvoice: function() {
		window.print()
	},



});
var AppRouter = Parse.Router.extend({
	
	routes: {
		''					: 'frontPage',
		'scan'				: 'scanItem',
		'inventory' 		: 'inventoryList',
		'shelf' 			: 'shelfList',
		'backorder' 		: 'backorderList',
		'orders' 			: 'orderList',
		'order'				: 'placeOrder',
		'order/:id'			: 'finalOrder',

		'customers'			: 'customerList',


	},

	initialize: function(){
		// this is for the swap function to work, and presumably for later when a navbar exists, there will be a navswap function
		this.navOptions = null;
		this.currentView = null;
	},

	frontPage: function() {
		this.swap( new FrontPage() );
	},

	scanItem: function() {
		this.swap( new ScanItem() );
	},

	inventoryList: function() {
		this.swap( new InventoryList() );
	},

	shelfList: function() {
		this.swap( new ShelfList() );
	},

	backorderList: function() {
		this.swap( new BackorderList() );
	},

	orderList: function() {
		this.swap( new OrderList() );
	},

	orderStatus: function(id) {
		this.swap( new OrderStatus({"orderID": id}) );
	},

	placeOrder: function() {
		this.swap( new PlaceOrder() );
	},	

	orderItems: function(id) {
		this.swap( new OrderItemsView({"shopID": id}) );
	},

	attachForm3: function(id) {
		this.swap( new AttachForm3({"orderID": id}) );
	},

	orderInvoice: function(id) {
		this.swap( new OrderInvoice({"orderID": id}) );
	},

	orderPartial: function(id) {
		this.swap( new OrderPartial({"orderID": id}) );
	},

	customerList: function() {
		this.swap( new CustomerList() );
	},	

	finalOrder: function(id) {
		this.swap( new OrderInstanceView(id) );
	},


	swap: function (view) {
		// this replaces the current app-view with the new view, and gets rid of the old one and stops it from listening for events and stuff
		if (this.currentView) {this.currentView.remove()};
		this.currentView = view;
	},



});
Parse.initialize("rzGw28XmRP4nCA4ZFkF0nVSwuqDNgwNuTcdSVqMY", "xRwB3cRqAak4nX00VjIvwkbaZ912C0y34gYJ7hMQ");

// router is globally available, and router.currentView will give you access to anything in the view you are coding inside of
// never make anything inside of a view fully global, or attached to the window. if you make more views (which would make sense
// for how many lists of things there are) try to always access the main view through the router.currentView, so then you can also
// do router.currentView.whateverViewYourListIsCalled. if you make function that is super reusable, just put it here in main.
// I know I'm harping on this too much, I'm just really weird about global stuff.
var router = new AppRouter();

Parse.history.start();


// want a global autofill function for testing scanning
