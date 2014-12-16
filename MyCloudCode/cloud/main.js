
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.job("hello", function(request, status) {
  var query = new Parse.Query('itemType');
  query.find({
  	success: function(things){
  		things.forEach(function(thing){
  			thing.set('totals', [0,0]);
  			return thing.save();
  		})
  	},
  	error: function(error){

  	}
  }).then(function(){
  	status.success();
  })

});


Parse.Cloud.afterSave("itemInstance", function(request) {

	var itemCount = 0;
	var query = new Parse.Query('itemInstance');
	query.equalTo('itemInstanceCode', 0)
	query.equalTo('UPC', request.object.get('UPC'));
	query.find({
		success: function(items){
			items.forEach(function(item){
				itemCount += 1;	
			})

			
		},
		error: function(error){

		}
	}).then(function(){
		var query = new Parse.Query('itemType');
			query.equalTo('UPC', request.object.get('UPC'));
			query.first({
				success: function(item){

					var tmp = [itemCount, 0];
					if(item.attributes.totals !== undefined && item.attributes.totals[1] !== undefined){
						tmp[1] = item.attributes.totals[1];
					}
					item.set('totals', tmp);
					item.save();
				},
				error: function(error){

				}
			})
	})

	if(request.object.get('itemInstanceCode') === 0) {

		var query = new Parse.Query('backOrder');
		query.equalTo('itemType', request.object.get('UPC'));
		query.equalTo('item', undefined);
		query.first({
			success: function(item){
				
				if(item) {
					console.log(item.length);
					console.log(request.object)
					item.set('item', request.object);
					item.save();

					request.object.set('itemInstanceCode', 1);
					request.object.set('backOrder', item)
					request.object.save();
				}
			},
			error: function(error){	
				console.log(error);
			}
		}).then(function(){
	    	// response.success();
		})
	}else{
		// response.success();
	}

 
});

Parse.Cloud.afterSave("backOrder", function(request) {

	var itemCount = 0;
	var query = new Parse.Query('backOrder');
	// query.equalTo('itemInstanceCode', 0)
	query.equalTo('itemType', request.object.get('itemType'));
	query.find({
		success: function(items){
			items.forEach(function(item){
				itemCount += 1;	
			})

			
		},
		error: function(error){

		}
	}).then(function(){
		var query = new Parse.Query('itemType');
			query.equalTo('UPC', request.object.get('itemType'));
			query.first({
				success: function(item){

					var tmp = [0, itemCount];
					if(item.attributes.totals !== undefined && item.attributes.totals[0] !== undefined){
						tmp[0] = item.attributes.totals[0];
					}
					item.set('totals', tmp);
					item.save();
				},
				error: function(error){

				}
			})
	})

});
