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

	},

	template: _.template($('.inventory-list-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('InventoryList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template({model: "inventoryList"}))
	},


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




