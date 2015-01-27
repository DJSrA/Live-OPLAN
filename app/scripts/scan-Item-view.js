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
		'click .new-item-submit' 						: 'doesUPCexist',
		'click .add-item'				 						: 'manualAddItem',
		'click .add-new-item'    						: 'addNewItemFields',
		'click .cancel-new-item-creation' 	: 'cancelCreation',
		'click .start-scanning'  						: 'startScanning',
		'click .stop-scanning'   						: 'stopScanning',
		'keypress .this-upc'								: 'firstScan',
		'keypress .this-serial-number'			: 'secondScan',
		'click .btn-delete-item'							: 'deleteItem',
		'click .standard-item-creation, .generic-item-creation' : 'toggleCreationType',
		'click .no-upc'											: 'toggleUPCoff',
		'click .enable-upc'									: 'toggleUPCon',
	},

	template: _.template($('.scan-item-view').text()),
	manualItemCreationTemplate: _.template($('.manual-item-creation-template').text()),
	titleTemplate: _.template($('.page-title').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$("html, body").scrollTop(0);
			var thisLocation = window.location.hash.substring(1).toString();
			_.each($('.nav-link'), function(e){
				if(e.id == thisLocation){
					$(e).css('color','#ffffff')
				} else {
					$(e).css('color', '#9d9d9d')
				}
			});
			$('.app-container').html(this.el);
			var fakeScan = [];
			this.render();
			var totalScanned = 0;
		}
	},

	render: function() {
		$(this.el).html(this.template());
		$('.put-title-here').html(this.titleTemplate());
		$('.page-title').text('SCANNING');
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
		   this.doesUPCexist();
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

	doesUPCexist: function(){
		var ItemInstance = Parse.Object.extend("itemInstance");
		var itemInstance = new ItemInstance();
		var that = this;
		var scannedItemArray = []
		var ourSerialNumber = "";
		var UPC = '';
		scannedItemArray.push($('.this-upc').val());
		scannedItemArray.push($('.this-serial-number').val())
		console.log(scannedItemArray);
		scannedItemArray.forEach(function(e){
			if(isNaN(parseInt(e))){
				ourSerialNumber = e;
			} else {
				UPC = e;
			}
		})
		var OurUPC = UPC;
		console.log(OurUPC)
		var query = new Parse.Query('itemInstance');
		query.limit(1500);
		query.equalTo('serialNumber', ourSerialNumber);
		query.find({
			success:function(number){
				if(number.length === 0){
          itemInstance.set({
            serialNumber: ourSerialNumber,
          })
          console.log(itemInstance);
          this.instance = itemInstance;
          makeIt();
				} else {
					alert("This Serial Number : " + ourSerialNumber + " already exists!");
				}
			}
		})
		var makeIt = function(){
			var query = new Parse.Query('itemType');
			query.limit(1500);
			query.equalTo('UPC', OurUPC);
			query.find({
				success:function(item){
					if(item[0] == undefined){
						that.stopScanning();
						that.manualAddItem();
					} else {
						console.log(item);
	          itemInstance.set({
	            Caliber:              item[0].attributes.Caliber,
	            Cost:                 item[0].attributes.Cost,
	            DealerPrice:          item[0].attributes.DealerPrice,
	            MSRP:          				item[0].attributes.MSRP,
	            Description:          item[0].attributes.Description,
	            Model:                item[0].attributes.Model,
	            UPC:                  item[0].attributes.UPC,
	            itemType: 						item[0],
	            itemInstanceCode: 		0,
	            dateSaved: 						Date(),
	          }).save()
	          $('.scanned-item-list').append('<div class="col-md-6 scanned-item-container"><div class="scanned-item-attribute col-md-4"><p>' + item[0].attributes.Model + '</p></div><div class="scanned-item-attribute col-md-4"><p>' + item[0].attributes.UPC + '</div><div class="scanned-item-attribute col-md-4"><button id="' + item[0].id + '" class="btn btn-warning btn-delete-item">DELETE</button</div>');

	          console.log(itemInstance);
						console.log("successful! : " + item[0].attributes.UPC)
					}
				}
			})
		}

	},

	deleteItem: function(e) {
		console.log('deleting item');
		var objId = $(e.currentTarget).attr('id');

		var query = new Parse.Query('itemInstance');
		query.limit(1500);
		query.equalTo('objectId', $(e.currentTarget).attr('id') );
		console.log($(e.currentTarget).attr('id'));
		query.include('order');
		query.find({
			success: function(obj) {
				console.log(obj);
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

	manualAddItem: function () {
		$('.add-item').attr('disabled', 'disabled');
		$('.new-item-submit').attr('disabled', 'disabled');
		var that = this;
		this.stopScanning();
		$('.add-here').append(that.manualItemCreationTemplate({}))
		$('.new-item-form').css('display', 'block');
		$('.generic-new-item-form').css('display', 'none');
		$('.standard-item-creation').addClass('active');
		$('.no-upc').addClass('btn-info');
		$('.no-upc').removeClass('btn-default');
		console.log('added it');
	},

	toggleCreationType: function(){
		if($(event.target).hasClass('standard-item-creation')){
			this.toggleUPCon();
			$('.generic').val('');
			$('.no-upc').css('display', 'none');
			$('.standard-item-creation').removeClass('btn-default');
			$('.standard-item-creation').addClass('btn-info');
			$('.new-item-form').css('display', 'block');
			$('.generic-new-item-form').css('display', 'none');
			$('.standard-item-creation').addClass('active');
			$('.generic-item-creation').removeClass('active');
			$('.generic-item-creation').addClass('btn-default');
			$('.generic-item-creation').removeClass('btn-info');
		} else if($(event.target).hasClass('generic-item-creation')){
			$('.standard').val('');
			$('.no-upc').css('display', 'block');
			$('.generic-item-creation').removeClass('btn-default');
			$('.generic-item-creation').addClass('btn-info');
			$('.new-item-form').css('display', 'none');
			$('.generic-new-item-form').css('display', 'block');
			$('.standard-item-creation').removeClass('active');
			$('.generic-item-creation').addClass('active');
			$('.standard-item-creation').addClass('btn-default');
			$('.standard-item-creation').removeClass('btn-info');
		}
	},

	toggleUPCoff: function(){
		$('.no-upc').prop('disabled', true);
		$('.no-upc').text('UPC OFF');
		$('.generic-upc').prop('disabled', true);
		$('.enable-upc').css('display', 'block');
	},

	toggleUPCon: function(){
		$('.no-upc').prop('disabled', false);
		$('.no-upc').text('UPC ON');
		$('.generic-upc').prop('disabled', false);
		$('.enable-upc').css('display', 'none');
	},

	addNewItemFields: function () {
		if($('.standard-item-creation').hasClass('active')){
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
		   	  dateSaved: 						Date(),
		   	}).save()
		   	console.log(itemType);
				// itemType.save();

				$('.scanned-item-list').append('<div class="col-md-12 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + itemType.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + itemType.attributes.UPC + '</div>');

				console.log(itemType);
				$('.new-item-form').children('input').val('');
				$('.new-item-form').children('textarea').val('');
				$('.manufacturer').focus();
		   }
		} else if ($('.generic-item-creation').hasClass('active') && $('.no-upc').prop('disabled') === false){
			var empty = $('.generic-new-item-form').find("input").filter(function() {
			       return this.value === "";
			   });
			   if(empty.length) {
			   	alert('please fill in all fields.');
			       //At least one input is empty
			   } else {
	   	var ItemType = Parse.Object.extend("itemType");
	   	var itemType = new ItemType();
	   	itemType.set({
	   		Manufacturer: 				$('.generic-manufacturer').val(),
	   		Description: 					$('.generic-description').val(),
	   	  Caliber:              $('.generic-caliber').val(),
	   	  Model:                $('.generic-model').val(),
	   	  Cost:                 ("$" + $('.generic-cost').val()),
	   	  DealerPrice:          ("$" + $('.generic-dealer-price').val()),
	   	  MSRP:         				("$" + $('.generic-msrp').val()),
	   	  UPC:                  $('.generic-upc').val(),
	   	  dateSaved: 						Date(),
	   	}).save()
	   	console.log(itemType)
	   	var allObjects = [];

	   	for(i = 0; i < parseInt($('.amount').val()); i++){
	   		var ItemInstance = Parse.Object.extend("itemInstance");
	   		var itemInstance = new ItemInstance();
	   		itemInstance.set({
	   				Manufacturer: 				$('.generic-manufacturer').val(),
	   				Description: 					$('.generic-description').val(),
	   			  Caliber:              $('.generic-caliber').val(),
	   			  Model:                $('.generic-model').val(),
	   			  Cost:                 ("$" + $('.generic-cost').val()),
	   			  DealerPrice:          ("$" + $('.generic-dealer-price').val()),
	   			  MSRP:         				("$" + $('.generic-msrp').val()),
	   			  UPC:                  $('.generic-upc').val(),
	   		  itemType: 						itemType,
	   		  itemInstanceCode: 		0,
	   		  dateSaved: 						Date(),
	   		}).save()

	   		allObjects.push(itemInstance);
	   	}
   		var oldTotal = parseInt($('.scanned-item-total').text());
   		var newTotal = oldTotal + allObjects.length;
   		$('.scanned-item-total').text(newTotal.toString());
	   	console.log(itemInstance)
	   	console.log(allObjects);

			$('.scanned-item-list').append('<div class="col-md-12 scanned-item-container"><div class="scanned-item-attribute col-md-4"><p>' + itemInstance.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-4"><p>' + itemInstance.attributes.UPC + '</div><div class="scanned-item-attribute col-md-4">x ' + allObjects.length + '</div>');
		}
	} else if($('.generic-item-creation').hasClass('active') && $('.no-upc').prop('disabled') === true){
		var empty = $('.generic-new-item-form').find("input").filter(function() {
		       return this.value === "";
		   });
		   if(empty.length) {
		   	alert('please fill in all fields.');
		       //At least one input is empty
		   } else {
			   	var ItemType = Parse.Object.extend("itemType");
			   	var itemType = new ItemType();
			   	itemType.set({
			   		Manufacturer: 				$('.generic-manufacturer').val(),
			   		Description: 					$('.generic-description').val(),
			   	  Caliber:              $('.generic-caliber').val(),
			   	  Model:                $('.generic-model').val(),
			   	  Cost:                 ("$" + $('.generic-cost').val()),
			   	  DealerPrice:          ("$" + $('.generic-dealer-price').val()),
			   	  MSRP:         				("$" + $('.generic-msrp').val()),
			   	  UPC:                  "NA",
			   	}).save()
			   	console.log(itemType)
			   	var allObjects = [];

			   	for(i = 0; i < parseInt($('.amount').val()); i++){
			   		var ItemInstance = Parse.Object.extend("itemInstance");
			   		var itemInstance = new ItemInstance();
			   		itemInstance.set({
			   				Manufacturer: 				$('.generic-manufacturer').val(),
			   				Description: 					$('.generic-description').val(),
			   			  Caliber:              $('.generic-caliber').val(),
			   			  Model:                $('.generic-model').val(),
			   			  Cost:                 ("$" + $('.generic-cost').val()),
			   			  DealerPrice:          ("$" + $('.generic-dealer-price').val()),
			   			  MSRP:         				("$" + $('.generic-msrp').val()),
			   			  UPC:                  "NA",
			   		  itemType: 						itemType,
			   		  itemInstanceCode: 		0,
			   		}).save()	

			   		allObjects.push(itemInstance);
			   	}
		   		var oldTotal = parseInt($('.scanned-item-total').text());
		   		var newTotal = oldTotal + allObjects.length;
		   		$('.scanned-item-total').text(newTotal.toString());
			   	console.log(itemInstance)
			   	console.log(allObjects);

					$('.scanned-item-list').append('<div class="col-md-12 scanned-item-container"><div class="scanned-item-attribute col-md-4"><p>' + itemInstance.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-4"><p>' + itemInstance.attributes.UPC + '</div><div class="scanned-item-attribute col-md-4">x ' + allObjects.length + '</div>');
		}
	}

		// var totalScanned = $('.scanned-item-total').text()
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