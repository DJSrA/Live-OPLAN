
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.afterSave("itemInstance", function(request) {

	var itemCount = 0;
	var query = new Parse.Query('itemInstance');
	query.equalTo('UPC', request.object.get('UPC'));
	query.count({
		success: function(count){
			itemCount = count;
			var query = new Parse.Query('itemType');
			query.equalTo('UPC', request.object.get('UPC'));
			query.first({
				success: function(item){
					console.log(item)
					console.log(count)
					var tmp = [itemCount, 0];
					if(item.attributes.totals !== undefined && item.attributes.totals[1] !== undefined){
						tmp[1] = item.attributes.totals[1];
					}
					item.set('totals', tmp);
					item.save;
				},
				error: function(error){

				}
			})
		},
		error: function(error){

		}
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
