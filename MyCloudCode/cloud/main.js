
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.beforeSave("itemInstance", function(request, response) {
	if(request.object.get('itemInstanceCode') === 0) {

		var query = new Parse.Query('backOrder');
		query.equalTo('itemType', request.object.get('UPC'));
		query.first({
			success: function(item){
				if(item.length > 0) {
						item.set('item', request.object);
						// console.log(item);
						item.save();

						request.object.set('itemInstanceCode', 1);
						request.object.set('backOrder', item);
						response.success()
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

Parse.Cloud.define("saveBackorderPointer", function(request, response) {
  var query = new Parse.Query("Review");
  query.equalTo("movie", request.params.movie);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("stars");
      }
      response.success(sum / results.length);
    },
    error: function() {
      response.error("movie lookup failed");
    }
  });
});
