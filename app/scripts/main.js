Parse.initialize("rzGw28XmRP4nCA4ZFkF0nVSwuqDNgwNuTcdSVqMY", "xRwB3cRqAak4nX00VjIvwkbaZ912C0y34gYJ7hMQ");

// router is globally available, and router.currentView will give you access to anything in the view you are coding inside of
// never make anything inside of a view fully global, or attached to the window. if you make more views (which would make sense
// for how many lists of things there are) try to always access the main view through the router.currentView, so then you can also
// do router.currentView.whateverViewYourListIsCalled. if you make function that is super reusable, just put it here in main.
// I know I'm harping on this too much, I'm just really weird about global stuff.
var router = new AppRouter();

Parse.history.start();


// want a global autofill function for testing scanning
