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
		'click .new-item-submit' : 'checkInput',
	},

	template: _.template($('.scan-item-view').text()),

	initialize: function() {
		// $('.app-container').html('');
		$('.app-container').html(this.el);
		// console.log('scanItem')
		this.render();
	},

	render: function() {
		// $(this.el).html('');
		$(this.el).html(this.template());
	},

	checkInput: function() {
		if($('.itemType').val() && $('.itemName').val() && $('.itemNumber').val()){
			this.checkItemType()
		}else {
			alert('please fill in all feilds')
		}
	},

	checkItemType: function(){
		var that = this;

		var query = new Parse.Query('itemType');
		query.equalTo('typeName', ($('.itemType').val()).toLowerCase())
		query.find(function(items){
			if(items.length>0){
				that.itemPointer = items[0];
			} else {
				console.log('no match');
				var ItemType = Parse.Object.extend("itemType"); 
				var itemType = new ItemType();

				itemType.set('typeName', ($('.itemType').val()).toLowerCase());
				itemType.save();
				that.itemPointer = itemType;
			}

		}).then(function(){
			that.newItemSubmit();
		})
	},
	newItemSubmit: function() {
		var that = this;
		var ItemInstance = Parse.Object.extend("itemInstance");
		var itemInstance = new ItemInstance();

		itemInstance.set('itemName', ($('.itemName').val()).toLowerCase() );
		itemInstance.set('serialNumber', ($('.itemNumber').val()).toLowerCase() );
		itemInstance.set('itemType', this.itemPointer );

		itemInstance.save().then(function(){
			that.render();
		});


		console.log($('.itemType').val())
		console.log($('.itemName').val())
		console.log($('.itemNumber').val())


	}


});

// this is very dependant on getting a working scanner. for now, it needs to be an input feild where we can manually add new item instances 
// to the server. when an item instance is added, it should check to see if it can fill a backorder, be assigned to it's item type, and then
// after it has been saved check to see if it can fill a backorder. if it fails to fill a backorder both times, it SHOULD NOT get an item 
// instance code, and just be saved to the server, and the physical item should go in regular inventory.

// concerning item types, all items should automatically be assigned to an item type. we need to come up with a way to associate the information
// we get from a bar code to the item types on the server. the easiest way i think is to require an existing item of that type to be already
// scanned in in order to make a new item type. 

// all items that do not have an existing item type should be marked as non-defined. when a new item type is made based on a non-defined item,
// it should take all other like items marked as non-defined and change them to that item type, however this should be done in the inventory View
// or cloud code and not here