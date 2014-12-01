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
		'click .new-item-submit' : 'createNewItemInstance',
		'click .add-item'				 : 'manualAddItem',
		'click .add-new-item'    : 'addNewItemFields',
		'click .cancel-new-item-creation' : 'cancelCreation',
	},

	template: _.template($('.scan-item-view').text()),
	manualItemCreationTemplate: _.template($('.manual-item-creation-template').text()),

	initialize: function() {
		$('.app-container').html(this.el);
	  this.autoFillScan();
		this.render();
	},

	render: function() {
		$(this.el).html(this.template());
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
		$('.app-container').prepend('<div class="form-group"><label>Serial Number</label><div id="item-info-block" style="display: block;width: 150px;height: 34px;padding: 6px 12px;font-size: 14px;line-height: 1.42857143;color: #555;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);">' + UPCserial.splice(1) + '</div></div><span id="helpBlock" class="help-block">Scanned item serial number</span>')
		$('.app-container').prepend('<div class="form-group"><label>Item UPC</label><div id="item-info-block" style="display: block;width: 150px;height: 34px;padding: 6px 12px;font-size: 14px;line-height: 1.42857143;color: #555;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);">' + UPCserial.splice(0) + '</div></div><span id="helpBlock" class="help-block">Scanned item UPC</span>')
	},

	autoFill: function(UPC, SerialNumber) {
		var that = this;
		var scannedItemArray = []

	  var itemUPC = [817272010404, 471280075002];
	  var SerialNO = ['SKR556-0239', 'TI 00114'];

	  function r (list) { return list[_.random(list.length-1)] }
	  scannedItemArray.push(r(itemUPC));
	  scannedItemArray.push(r(SerialNO));
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
					// var ItemType = Parse.Object.extend("itemType"); 
					// var itemType = new ItemType();

					// itemType.set('UPC', ($('.itemType').val()).toLowerCase());
					// itemType.save();
					that.itemPointer = itemType;
				}

			}).then(function(){
				that.newItemSubmit();
			})
		});







		// var that = this;

		// this.autoFill().forEach(function(e){
		// 	var scannedItem = e;
		// 	var parsedScannedItem = parseInt(e);
		// 	if(isNaN(parsedScannedItem) === false) {
		// 		var itemUPC = scannedItem;
		// 	} 
		// 	var query = new Parse.Query('itemType');
		// 	// query.equalTo('typeName', ($('.itemType').val()).toLowerCase())
		// 	query.find(function(items){
		// 		console.log(items);
		// 			if(items.length>0){
		// 				that.itemPointer = items[0];
		// 			} else {
		// 				console.log('no match');
		// 				var ItemType = Parse.Object.extend("itemType"); 
		// 				var itemType = new ItemType();

		// 				itemType.set('typeName', ($('.itemType').val()).toLowerCase());
		// 				itemType.save();
		// 				that.itemPointer = itemType;
		// 			}

		// 		})
		// 	})
			
		// })
	},
	newItemSubmit: function() {
		var that = this;
		that.createNewItemInstance().then(function(){
			that.render;
		});
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
		  var newSerialNumber = '';

		  query.find(function(itemTypes){
		    itemTypes.forEach(function(b){
		      if(b.attributes.UPC){
		        UPCchecklist.push(b.attributes.UPC)
		      }
		    });

	    var SerialNumber = function () {
		    this.autoFill().forEach(function(e){
					 var scannedItem = e; 
					 var parsedScannedItem = parseInt(e); 
					 if(isNaN(parsedScannedItem)){ return scannedItem} 
				})
	    }


		  if(isNaN(scannedAndParsed) === false) {
		  	console.log(scannedAndParsed)
		    UPCchecklist.forEach(function(e){
		      if(e === scannedItem){
		        var query = new Parse.Query('itemType');
		        query.find(function(itemTypes){
		          itemTypes.forEach(function(b){
		            if(b.attributes.UPC === e){

		              // Setting new itemInstance attributes to matching itemType attributes
		              itemInstance.set({
		                Caliber:              b.attributes.Caliber,
		                CategoryID:           b.attributes.CategoryID,
		                Comments:             b.attributes.Comments,
		                Cost:                 b.attributes.Cost,
		                DealerDiscountPrice:  b.attributes.DealerDiscountPrice,
		                DealerPrice:          b.attributes.DealerPrice,
		                Description:          b.attributes.Description,
		                ManufacturerID:       b.attributes.ManufacturerID,
		                MfgPartnumber:        b.attributes.MfgPartnumber,
		                Model:                b.attributes.Model,
		                ProductID:            b.attributes.ProductID,
		                RetailPrice:          b.attributes.RetailPrice,
		                Serialized:           b.attributes.Serialized,
		                UPC:                  b.attributes.UPC,
		                itemType: 						this.itemPointer,
		                typeName:             (b.attributes.typeName === undefined ? '' : b.attributes.typeName),
		                SerialNumber: 				this.SerialNumber
		              }).save()       
									// itemInstance.save();
		            }
		          })
		        })
		      }
		    })
		  } 

		  })
		})
	},

	manualAddItem: function () {
		$('.add-item').attr('disabled', 'disabled');
		var that = this;
		$('.add-here').append(that.manualItemCreationTemplate({}))
		console.log('added it');
	},

	addNewItemFields: function () {
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
		   	  Caliber:              $('.caliber').val(),
		   	  Cost:                 parseInt($('.cost').val()),
		   	  DealerDiscountPrice:  parseInt($('.dealer-discount-price').val()),
		   	  DealerPrice:          parseInt($('.dealer-price').val()),
		   	  Model:                $('.model').val(),
		   	  ProductID:            parseInt($('.product-id').val()),
		   	  RetailPrice:          parseInt($('.retail-price').val()),
		   	  UPC:                  parseInt($('.upc').val()),
		   	  ManufacturerID:       $('.manufacturer-id').val(),
		   	})

				var ItemInstance = Parse.Object.extend("itemInstance");
				var itemInstance = new ItemInstance();
				itemInstance.set({
					Caliber:              $('.caliber').val(),
					Cost:                 parseInt($('.cost').val()),
					DealerDiscountPrice:  parseInt($('.dealer-discount-price').val()),
					DealerPrice:          parseInt($('.dealer-price').val()),
					Model:                $('.model').val(),
					ProductID:            parseInt($('.product-id').val()),
					RetailPrice:          parseInt($('.retail-price').val()),
					UPC:                  parseInt($('.upc').val()),
					ManufacturerID:       $('.manufacturer-id').val(),
				  SerialNumber: 				$('.serial-number').val(),
				})

				itemType.save();
				itemInstance.save();


				console.log(itemInstance);  
				console.log(itemType);
		   }
		  // Serialized:           $('.caliber').val(),
		  // MfgPartnumber:        $('.caliber').val(),
		  // Description:          $('.caliber').val(),
		  // CategoryID:           $('.caliber').val(),
		  // Comments:             $('.caliber').val(),
		  // itemType: 						this.itemPointer,
	},

	cancelCreation: function () {
		$('.add-item').attr('disabled', false);
		$('.add-here').html('');
		console.log('pudding');
	}


});








// var ScanItem = Parse.View.extend ({

// 	events: {
// 		'click .new-item-submit' : 'checkInput',
// 	},

// 	template: _.template($('.scan-item-view').text()),

// 	initialize: function() {
// 		$('.app-container').html(this.el);
// 		this.render();
// 	},

// 	render: function() {
// 		$(this.el).html(this.template());
// 	},

// 	checkInput: function() {
// 		if($('.itemType').val() && $('.itemName').val() && $('.itemNumber').val()){
// 			this.checkItemType()
// 		}else {
// 			alert('please fill in all feilds')
// 		}
// 	},

// 	checkItemType: function(){
// 		var that = this;

// 		var query = new Parse.Query('itemType');
// 		query.equalTo('typeName', ($('.itemType').val()).toLowerCase())
// 		query.find(function(items){
// 			if(items.length>0){
// 				that.itemPointer = items[0];
// 			} else {
// 				console.log('no match');
// 				var ItemType = Parse.Object.extend("itemType"); 
// 				var itemType = new ItemType();

// 				itemType.set('typeName', ($('.itemType').val()).toLowerCase());
// 				itemType.save();
// 				that.itemPointer = itemType;
// 			}

// 		}).then(function(){
// 			that.newItemSubmit();
// 		})
// 	},
// 	newItemSubmit: function() {
// 		var that = this;
// 		var ItemInstance = Parse.Object.extend("itemInstance");
// 		var itemInstance = new ItemInstance();

// 		itemInstance.set('itemName', ($('.itemName').val()).toLowerCase() );
// 		itemInstance.set('serialNumber', ($('.itemNumber').val()).toLowerCase() );
// 		itemInstance.set('itemType', this.itemPointer );

// 		itemInstance.save().then(function(){
// 			that.render();
// 		});


// 		console.log($('.itemType').val())
// 		console.log($('.itemName').val())
// 		console.log($('.itemNumber').val())


// 	}


// });














// this is very dependant on getting a working scanner. for now, it needs to be an input field where we can manually add new item instances 
// to the server. when an item instance is added, it should check to see if it can fill a backorder, be assigned to it's item type, and then
// after it has been saved check to see if it can fill a backorder. if it fails to fill a backorder both times, it SHOULD NOT get an item 
// instance code, and just be saved to the server, and the physical item should go in regular inventory.

// concerning item types, all items should automatically be assigned to an item type. we need to come up with a way to associate the information
// we get from a bar code to the item types on the server. the easiest way i think is to require an existing item of that type to be already
// scanned in in order to make a new item type. 

// all items that do not have an existing item type should be marked as non-defined. when a new item type is made based on a non-defined item,
// it should take all other like items marked as non-defined and change them to that item type, however this should be done in the inventory View
// or cloud code and not here