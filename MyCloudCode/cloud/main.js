
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.beforeSave("itemInstance", function(request, response) {
	if(request.object.get('itemInstanceCode') === 0) {

		var query = new Parse.Query('backOrder');
		query.equalTo('itemType', request.object.get('UPC'));
		query.find({
			success: function(items){
				if(items.length > 0) {
					items.forEach(function(item){
						item.set('item', request.object);
						request.object.set('itemInstanceCode', 1);
					})
				}
			},
			error: function(error){	
				console.log(error);
			}
		}).then(function(){
	    	response.success();
		})
	}else{
		response.success();
	}
 
});
