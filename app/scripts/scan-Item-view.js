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
		$('.app-container').html(this.el);
		var fakeScan = [];
		this.render();
		var totalScanned = 0;
	  // this.autoFillScan();
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
		var totalScanned = $('.scanned-item-total').text()
		if(e.keyCode == 13){
		   console.log($('.this-upc').val() + ', ' + $('.this-serial-number').val());
		   this.autoFill();
		   console.log(this.autoFill());
		   this.createNewItemInstance();
		   totalScanned = parseInt(totalScanned) + 1;
			 $('.scanned-item-total').text(totalScanned);
		   // this.showScannedItem();
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
		// this.isEnter();
		// this.autoFill();
		// this.autoFillScan();
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
		this.showScannedItem();
	},

	autoFill: function(UPC, SerialNumber) {
		var that = this;
		var scannedItemArray = []
		scannedItemArray.push($('.this-upc').val());
		scannedItemArray.push($('.this-serial-number').val())
	  // var itemUPC = [817272010404, 471280075002, 123456789012];
	  // var SerialNO = ['SKR556-0239', 'TI 00114', 'QP 12345'];

	  // function r (list) { return list[_.random(list.length-1)] }
	  // scannedItemArray.push(r(itemUPC));
	  // scannedItemArray.push(r(SerialNO));
	  return scannedItemArray;
	},

	showScannedItem: function () {
		console.log('SHOW SCANNED')
			var checkItem = [];
			this.autoFill().forEach(function(e){
			  var that = this;
			  var scannedItem = e;
			  var scannedAndParsed = parseInt(e);
			  var query = new Parse.Query('itemType');
			  var UPCchecklist = [];
			  console.log(UPCchecklist + ' UPC checklist')
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
			  	console.log(UPCchecklist);
			  	console.log(scannedItem);
			    UPCchecklist.forEach(function(e){
			    	console.log(scannedItem);
			      if(e == scannedItem){
			      	console.log(e);
			        var query = new Parse.Query('itemType');
			        query.find(function(itemTypes){
			          itemTypes.forEach(function(b){
			            if(b.attributes.UPC === e){

			              // Setting new itemInstance attributes to matching itemType attributes
			              checkItem.push({
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
			                itemType: 						b,
			                typeName:             (b.attributes.typeName === undefined ? '' : b.attributes.typeName),
			                SerialNumber: 				$('.this-serial-number').val(),
			              })

			              console.log(checkItem)     ;
										// itemInstance.save();
										console.log(checkItem[0].Model);
										$('.display-scanned-item').append('<ul class="col-md-8"><li class="col-md-3"><label>Model:</label></li><li class="col-md-9">' + checkItem[0].Model + '</li><li class="col-md-3"><label>Caliber:</label></li><li class="col-md-9">' + checkItem[0].Caliber + '</li><li class="col-md-3"><label>Retail Price:</label></li><li class="col-md-9">$' + checkItem[0].RetailPrice + '</li></ul>');
			            }
			          })
			        })
			      }
			      }

			    )
			  } 

			  })
			})
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

	    if(isNaN(scannedAndParsed) === true){
	    	console.log(scannedItem);
	    	var query = new Parse.Query('itemInstance');
	    	query.find(function(itemInstances){
	    		itemInstances.forEach(function(b){
	    			if(b.attributes.SerialNumber === scannedItem) {
	    				console.log('this is a match');
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
		        query.find(function(itemTypes){
		          itemTypes.forEach(function(b){
		            if(b.attributes.UPC === e){
			          	console.log(b.attributes.UPC);
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
		                itemType: 						b,
		                typeName:             (b.attributes.typeName === undefined ? '' : b.attributes.typeName),
		                serialNumber: 				newSerialNumber,
		              })
									console.log($('.this-serial-number').text());
								  console.log(itemInstance)
								  $('.scanned-item-list').append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + itemInstance.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + itemInstance.attributes.serialNumber + '</div>');
									// console.log(itemInstance);
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
		$('.new-item-submit').attr('disabled', 'disabled');
		var that = this;
		this.stopScanning();
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
		   		Manufacturer: 				$('.manufacturer').val(),
		   		Description: 					$('.description').val(),
		   	  Caliber:              $('.caliber').val(),
		   	  Model:                $('.model').val(),
		   	  Cost:                 parseInt($('.cost').val()),
		   	  DealerPrice:          parseInt($('.dealer-price').val()),
		   	  MSRP:         				parseInt($('.msrp').val()),
		   	  UPC:                  parseInt($('.upc').val()),
		   	})

				// var ItemInstance = Parse.Object.extend("itemInstance");
				// var itemInstance = new ItemInstance();

				// itemInstance.set({
				// 	Caliber:              $('.caliber').val(),
				// 	Cost:                 parseInt($('.cost').val()),
				// 	DealerDiscountPrice:  parseInt($('.dealer-discount-price').val()),
				// 	DealerPrice:          parseInt($('.dealer-price').val()),
				// 	Model:                $('.model').val(),
				// 	ProductID:            parseInt($('.product-id').val()),
				// 	RetailPrice:          parseInt($('.retail-price').val()),
				// 	UPC:                  parseInt($('.upc').val()),
				// 	ManufacturerID:       $('.manufacturer-id').val(),
				//   SerialNumber: 				$('.serial-number').val(),
				// })

				itemType.save();
				// itemInstance.save();


				// console.log(itemInstance);  
				console.log(itemType);
		   }
		  // itemType: 						this.itemPointer,
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