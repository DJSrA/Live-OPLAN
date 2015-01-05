var FrontPage = Parse.View.extend ({

events: {
'click .submit-sign-in' : 'signIn',
'keydown .password-input' : 'signIn',
},

template: _.template($('.dashboard-view').text()),

initialize: function() {
$('.app-container').html(this.el);
// console.log('front page')
this.render();
},

render: function() {
$(this.el).append(this.template());

},

signIn: function(e){
var key = e.which
if(key == 13) {
var username = $('.username-input').val();
var password = $('.password-input').val();

var that = this;

// This is just a basic parse login function
Parse.User.logIn(username, password, {
  success: function(user){
  console.log('logged in');
  router.swap(new ScanItem())
  },
  error: function(user, error){
  $('.username-input').val('');
  $('.password-input').val('');
  $('.username-input').focus();
    alert("Incorrect. Please try again");
  }
});
}
},

// enterSignIn: function(e){
// var key = e.which
// if(key == 13) {
// console.log('enter');
// var username = $('.username-input').val();
// var password = $('.password-input').val();

// var that = this;

// // This is just a basic parse login function
// Parse.User.logIn(username, password, {
//   success: function(user){
//   console.log('logged in');
//   window.location.href = window.location.origin + '#scan'
//   router.swap( new ScanItem() );
//   },
//   error: function(user, error){
//   $('.username-input').val('');
//   $('.password-input').val('');
//   $('.username-input').focus();
//     alert("Incorrect. Please try again");
//   }
// });
// }
// }


});

// for now this should just be an alan arms logo and some buttons to take the user to the other pages