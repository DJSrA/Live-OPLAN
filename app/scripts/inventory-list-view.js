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
		'click span.item-type' 				: 'itemTypeDetail',
		'change .manufacturers' 			: 'activeManufacturer',
		'click .full-inventory' 			: 'showFullInventory',
		'click .full-backorders' 			: 'showBackorderList',
		'click .search-all-inventory' : 'getAllItemTypes',
	},

	template: _.template($('.inventory-list-view').text()),
	listItemTemplate: _.template($('.inventory-list-item-view').text()),
	listItemDetailTemplate: _.template($('.inventory-list-detail-view').text()),
	titleTemplate: _.template($('.page-title').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$("html, body").scrollTop(0);
			var thisLocation = window.location.hash.substring(1).toString();
			_.each($('.nav-link'), function(e){if(e.id == thisLocation){$(e).css('color','#ffffff')}else{$(e).css('color', '#9d9d9d')}});
			$('.app-container').html(this.el);
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		$('.put-title-here').html(this.titleTemplate());
		$('.page-title').text('INVENTORY');
		var Manufacturers = [];
		var query = new Parse.Query('itemType');
		query.limit(1500);
		query.find(function(manufacturers){
			manufacturers.forEach(function(manufacturer){
				var newManufacturer = '';
				newManufacturer = manufacturer.attributes.Manufacturer;
				Manufacturers.push(newManufacturer);
			})
			var uniqueManufacturers = [];
			$.each(Manufacturers, function(i, el){
			    if($.inArray(el, uniqueManufacturers) === -1) uniqueManufacturers.push(el);
			});
			uniqueManufacturers.forEach(function(manufacturer){
				$('.manufacturers').append("<option class='manufacturer col-md-2 btn-default btn' name='" + manufacturer + "'>" + manufacturer + "</option");
			})
		})
	},

	listIt: function(){
		var options = {
		  valueNames: [ 'product-id', 'item-type', 'item-description', 'all-inventory-number', 'backorder-number' ]
		};
			
		var contactList = new List('inventory-search', options);
	},

	getAllItemTypes: function(){
		var that = this;
		var query = new Parse.Query('itemType');
		query.limit(1500);
		query.find(function(itemTypes){
			itemTypes.forEach(function(e){
				$('.list').append(that.listItemTemplate({ itemType: e}))
			});
		}).then(function(e){
					that.listIt();
		})
	},

	itemTypeDetail: function (location) {
		var that = this;
		$('.inventory-list-detail-bound').html('');

		var query = new Parse.Query('itemType');
		query.equalTo('typeName', location.currentTarget.innerHTML);
		query.first({
			success: function(itemType) {
				var query = new Parse.Query('itemInstance');
				query.equalTo('itemType', itemType);
				query.equalTo('itemInstanceCode', undefined)
				query.each(function(item){
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
		$('.center-number').text($('.manufacturers option:selected').text());
		$('.list').html('');

		var chosenManufacturer = $('.manufacturers option:selected').text();
		var that = this;
		var listManufacturers = [];
		var thisManufacturersItems = [];
		if(chosenManufacturer === 'Select Manufacturer'){
			$('.center-number').text('');
			this.getAllItemTypes();
			this.listIt()
		}
		var query = new Parse.Query('itemType');
		query.limit(1000)
		query.find(function(itemTypes){
			itemTypes.forEach(function(e){
				var thisItem = [];
				if (e.attributes.Manufacturer == chosenManufacturer){
					$('.list').append(that.listItemTemplate({ itemType: e}))
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
			})
			for(i = 0; i < thisManufacturersItems.length; i++){
			  _.each(thisManufacturersItems[i], function(){
			  	ItemsList.push(thisManufacturersItems[i]);
			  });
			};
		}).then(function(e){
					that.listIt();
		})
	},

	showFullInventory: function() {
		router.navigate('inventory/fullstock', {trigger:true});
	},	

	showBackorderList: function() {
		router.navigate('inventory/backorders', {trigger:true});
	},

});

var FullStockList = Parse.View.extend({

	events: {
		'click .delete-item' : 'deleteItem',
	},

	template: _.template($('.full-stock-list-template').text()),
	instanceTemplate: _.template($('.stock-list-instance-template').text()),

	initialize: function(e) {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getItems();
	},

	getItems: function() {
		var that = this;
		var query = new Parse.Query('itemInstance');
		query.equalTo('itemInstanceCode', 0);

		query.each(function(item){
			$('.inventory-list-bound').append(that.instanceTemplate({ item: item.attributes, model: item}));
		})
	},

	deleteItem: function(e) {

		var objId = $(e.currentTarget).attr('id');

		var query = new Parse.Query('itemInstance');
		query.equalTo('objectId', $(e.currentTarget).attr('id') );
		query.first({
			success: function(obj) {
				obj.destroy({
					success:function(e){
						$('.' + objId).remove();
					},
					error:function(error){
						console.log(error)
					}
				})
			},
			error: function(error) {
				console.log(error)
			}
 		})
	},


})

var FullBackorderList = Parse.View.extend({

	events: {
		'click .delete-item' : 'deleteItem',
	},

	template: _.template($('.full-backorder-list-template').text()),
	instanceTemplate: _.template($('.backorder-list-instance-template').text()),

	initialize: function(e) {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getItems();
	},

	getItems: function() {
		var that = this;
		var query = new Parse.Query('backOrder');
		query.each(function(item){
			$('.backorder-list-bound').append(that.instanceTemplate({ item: item.attributes, model: item}));
		})
	},

	deleteItem: function(e) {

		var objId = $(e.currentTarget).attr('id');

		var query = new Parse.Query('itemInstance');
		query.equalTo('objectId', $(e.currentTarget).attr('id') );
		query.include('order');
		query.first({
			success: function(obj) {
				obj.destroy({
					success:function(e){
						$('.' + objId).remove();
					},
					error:function(error){
						console.log(error)
					}
				})
			},
			error: function(error) {
				console.log(error)
			}
 		})
	},

})

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