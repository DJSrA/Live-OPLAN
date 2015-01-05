Parse.initialize("rzGw28XmRP4nCA4ZFkF0nVSwuqDNgwNuTcdSVqMY", "xRwB3cRqAak4nX00VjIvwkbaZ912C0y34gYJ7hMQ");



var AttachForm3 = Parse.View.extend({
        events: {},
        template: _.template($(".attach-form3-view").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template())
        }
    }),
    BackorderList = Parse.View.extend({
        events: {},
        template: _.template($(".backorder-list-view").text()),
        backorderItemTemplate: _.template($(".backorder-list-item").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template()), this.getBackorderItems()
        },
        getBackorderItems: function() {
            var a = this;
            $(".backorder-list-item-bound").html("");
            var b = new Parse.Query("backOrder");
            b.include("itemType"), b.include("order"), b.each(function(b) {
                $(".backorder-list-item-bound").append(a.backorderItemTemplate({
                    backorder: b.attributes,
                    itemType: b.attributes.itemType.attributes,
                    order: b.attributes.order
                }))
            })
        }
    }),
    CustomerList = Parse.View.extend({
        events: {
            "click .create-customer": "createCustomerContainer",
            "click .new-customer-submit": "addCustomer",
            "click .cancel-customer": "cancelCustomerCreation",
            "keydown .search": "listIt",
            "click .reset-search": "resetSearch",
            "click .edit-customer": "editCustomerModal",
            "click #close-modal": "closeModal",
            "click .save-customer-changes": "saveCustomerChanges"
        },
        template: _.template($(".customer-list-view").text()),
        customerListTemplate: _.template($(".customer-list-item").text()),
        customerModalTemplate: _.template($(".customer-modal-template").text()),
        initialize: function() {
            null === Parse.User.current() == !0 ? (window.location.href = "#", router.swap(new FrontPage)) : ($(".app-container").html(this.el), this.phoneValidate(), this.render())
        },
        render: function() {
            $(this.el).html(""), $(this.el).append(this.template()), this.phoneValidate(), this.emailValidate(), this.getCustomers()
        },
        listIt: function() {
            {
                var a = {
                    valueNames: ["company-name", "company-owner", "company-phone", "company-email", "FFL", "address", "city", "state", "zip"]
                };
                new List("contacts", a)
            }
        },
        closeModal: function() {
            console.log("closing modal"), $("body").css("overflow", "visible"), $(".modal-div").html("")
        },
        resetSearch: function() {
            $(".list").html(""), $(".search").val(""), $(".search").focus(), this.getCustomers()
        },
        phoneValidate: function() {
            function a(a, b) {
                $(a).keyup(function() {
                    $.isNumeric($(this).val()) ? ($(".phone-number-input").css("background", "white"), $(this).val().length >= b && $(this).next("input").focus()) : $(this).css("background", $(this).val().length ? "rgba(255, 0, 0, 0.35)" : "white")
                })
            }
            _.each($(".phone-number-input"), function(b, c) {
                a(b, [3, 3, 4][c])
            }), _.each($(".zip-input"), function(b, c) {
                a(b, [5][c])
            }), _.each($(".edit-phone-number-input"), function(b, c) {
                a(b, [3, 3, 4][c])
            }), _.each($(".edit-zip-input"), function(b, c) {
                a(b, [5][c])
            }), addDashes = function(a) {
                var b = /(\D+)/g,
                    c = "",
                    d = "",
                    e = "";
                a.value = a.value.replace(b, ""), c = a.value.substr(0, 3), d = a.value.substr(3, 3), e = a.value.substr(6, 4), a.value = c + "-" + d + "-" + e
            }
        },
        emailValidate: function() {
            function a(a) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(a)
            }
            $(".email-input").keyup(function() {
                $(this).css("background", a($(this).val()) ? "white" : "rgba(255, 0, 0, 0.35)"), $(this).val() < 1 && $(this).css("background", "white")
            })
        },
        createCustomerContainer: function() {
            console.log("open it"), $(".create-customer").attr("disabled", "disabled"), $(".hidden-customer-creation").css("display", "block")
        },
        cancelCustomerCreation: function() {
            $(".create-customer-input").val(""), $(".create-customer").attr("disabled", !1), $(".hidden-customer-creation").css("display", "none")
        },
        addCustomer: function() {
            var a = this,
                b = Parse.Object.extend("customer"),
                c = new b;
            return "" === $(".company-input").val() ? (console.log("empty"), $(".create-customer-input").val(""), $(".company-input").focus(), "") : (c.set({
                Company: $(".company-input").val(),
                FirstName: $(".first-name-input").val(),
                LastName: $(".last-name-input").val(),
                Phone: parseInt($(".phone-number-input").val()),
                email: $(".email-input").val(),
                FFL: $(".ffl-input").val(),
                Address1: $(".address-input").val(),
                City: $(".city-input").val(),
                Zip: parseInt($(".zip-input").val()),
                State: $(".state-input").val()
            }).save(), console.log(c), a.getCustomers(), a.cancelCustomerCreation(), void 0)
        },
        getCustomers: function() {
            var a = this;
            $(".customer-list").html(""), this.query = new Parse.Query("customer"), this.query.each(function(b) {
                $("tbody.list").append(a.customerListTemplate({
                    customer: b.attributes,
                    model: b
                }))
            })
        },
        editCustomerModal: function() {
            var a = this,
                b = $(event.target).attr("name");
            console.log(b);
            var c = new Parse.Query("customer");
            c.limit(1500), c.equalTo("Company", b), c.first({
                success: function(b) {
                    $("body").css("overflow", "hidden"), $(".modal-div").append(a.customerModalTemplate({
                        customer: b.attributes,
                        model: b
                    })), $(".state-input").selectedIndex = b.attributes.State
                },
                error: function(a) {
                    console.log("Error: " + a.code + " " + a.message)
                }
            })
        },
        saveCustomerChanges: function() {
            function a(a, b) {
                $(a).keyup(function() {
                    $.isNumeric($(this).val()) ? ($(".phone-number-input").css("background", "white"), $(this).val().length >= b && $(this).next("input").focus()) : $(this).css("background", $(this).val().length ? "rgba(255, 0, 0, 0.35)" : "white")
                })
            }
            $(".edit-phone-number-input"),
                function(b, c) {
                    a(b, [3, 3, 4][c])
                }, $(".edit-zip-input"),
                function(b, c) {
                    a(b, [5][c])
                };
            var b = this,
                c = $(event.target).attr("name"),
                d = new Parse.Query("customer");
            d.limit(1500), d.equalTo("Company", c), d.first({
                success: function(a) {
                    var c = a.attributes;
                    a.set({
                        Company: 0 != $(".company-input").val().length ? $(".company-input").val() : c.Company,
                        FirstName: 0 != $(".first-name-input").val().length ? $(".first-name-input").val() : c.FirstName,
                        LastName: 0 != $(".last-name-input").val().length ? $(".last-name-input").val() : c.LastName,
                        Phone: 0 != $(".edit-phone-number-input").val().length ? parseInt($(".edit-phone-number-input").val()) : c.Phone,
                        email: 0 != $(".email-input").val().length ? $(".email-input").val() : c.email,
                        FFL: 0 != $(".ffl-input").val().length ? $(".ffl-input").val() : c.FFL,
                        Address1: 0 != $(".first-name-input").val().length ? $(".first-name-input").val() : c.Address1,
                        City: 0 != $(".city-input").val().length ? $(".city-input").val() : c.City,
                        Zip: 0 != $(".edit-zip-input").val().length ? parseInt($(".edit-zip-input").val()) : c.Zip,
                        State: 0 != $(".state-input").val().length ? $(".state-input").val() : c.State
                    }).save(), console.log(a.attributes), b.closeModal(), b.getCustomers()
                },
                error: function(a) {
                    console.log("Error: " + a.code + " " + a.message)
                }
            })
        }
    }),
    FrontPage = Parse.View.extend({
        events: {
            "click .submit-sign-in": "signIn"
        },
        template: _.template($(".dashboard-view").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template())
        },
        signIn: function() {
            var a = $(".username-input").val(),
                b = $(".password-input").val();
            Parse.User.logIn(a, b, {
                success: function() {
                    console.log("logged in")
                },
                error: function() {
                    $(".username-input").val(""), $(".password-input").val(""), $(".username-input").focus(), alert("Incorrect. Please try again")
                }
            })
        }
    }),
    InventoryList = Parse.View.extend({
        events: {
            "click span.item-type": "itemTypeDetail",
            "click .manufacturer": "activeManufacturer"
        },
        template: _.template($(".inventory-list-view").text()),
        listItemTemplate: _.template($(".inventory-list-item-view").text()),
        listItemDetailTemplate: _.template($(".inventory-list-detail-view").text()),
        initialize: function() {
            null === Parse.User.current() == !0 ? (window.location.href = "#", router.swap(new FrontPage)) : ($(".app-container").html(this.el), this.render())
        },
        render: function() {
            $(this.el).append(this.template()), this.getItemTypes()
        },
        getItemTypes: function() {},
        itemTypeDetail: function(a) {
            var b = this;
            $(".inventory-list-detail-bound").html("");
            var c = new Parse.Query("itemType");
            c.equalTo("typeName", a.currentTarget.innerHTML), c.first({
                success: function(a) {
                    var c = new Parse.Query("itemInstance");
                    c.equalTo("itemType", a), c.equalTo("itemInstanceCode", void 0), c.each(function(a) {
                        $(".inventory-list-detail-bound").append(b.listItemDetailTemplate({
                            item: a.attributes
                        }))
                    })
                },
                error: function(a) {
                    console.log(a)
                }
            })
        },
        newItemView: function(a) {
            new InventoryItemView({
                el: $(".inventory-list-item-bound"),
                model: a
            })
        },
        activeManufacturer: function(a) {
            $(".manufacturer").removeClass("active"), $(event.target).addClass("active"), $(".center-number").text(""), $(".center-number").text($(event.target).text()), $(".inventory-list-item-bound").html("");
            var b = a.currentTarget.attributes.name.value,
                c = this,
                d = [],
                e = new Parse.Query("itemType");
            e.limit(1e3), e.find(function(a) {
                a.forEach(function(a) {
                    return a.attributes.Manufacturer == b && ($(".inventory-list-item-bound").append(c.listItemTemplate({
                        itemType: a
                    })), d.push(a)), d
                });
                var e = [];
                console.log(d);
                var f = new Parse.Query("itemInstance");
                for (f.limit(1e3), f.find(function(a) {
                        var b = [];
                        return a.forEach(function(a) {
                            b.push(a.attributes.UPC)
                        }), console.log(b), b
                    }), i = 0; i < d.length; i++) _.each(d[i], function() {
                    e.push(d[i])
                })
            })
        }
    }),
    OrderInvoice = Parse.View.extend({
        events: {},
        template: _.template($(".order-invoice-view").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template())
        }
    }),
    OrderList = Parse.View.extend({
        events: {
            "click .order-instance": "orderDetail"
        },
        template: _.template($(".order-list-view").text()),
        orderInstanceTemplate: _.template($(".order-list-item-view").text()),
        orderDetailTemplate: _.template($(".order-detail-view").text()),
        initialize: function() {
            null === Parse.User.current() == !0 ? (window.location.href = "#", router.swap(new FrontPage)) : $(".app-container").html(this.el)
        },
        render: function() {
            $(this.el).append(this.template()), this.getOrders()
        },
        getOrders: function() {
            var a = this;
            $(".order-list-item-bound").html("");
            var b = new Parse.Query("order");
            b.include("customer"), b.each(function(b) {
                $(".order-list-item-bound").append(a.orderInstanceTemplate({
                    order: b,
                    customer: b.attributes.customer
                }))
            })
        },
        orderDetail: function(a) {
            var b = this;
            $(".order-detail-bound").html("");
            var c = new Parse.Query("order");
            c.include("customer"), c.equalTo("objectId", a.currentTarget.id), c.first(function(a) {
                console.log(a);
                var c = new Parse.Query("itemInstance");
                c.include("itemType"), c.equalTo("order", a), c.each(function(a) {
                    $(".order-detail-bound").append(b.orderDetailTemplate({
                        item: a,
                        itemType: a.attributes.itemType
                    }))
                })
            })
        }
    }),
    OrderPartial = Parse.View.extend({
        events: {},
        template: _.template($(".order-partial-view").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template())
        }
    }),
    OrderStatus = Parse.View.extend({
        events: {},
        template: _.template($(".order-status-view").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template())
        }
    }),
    PlaceOrder = Parse.View.extend({
        events: {
            "click .customer-state": "getCustomer",
            "click .states-bread": "showStates",
            "click .customers-bread": "showCustomers",
            "click .merchant": "showCustomer",
            "click .accept-merchant": "acceptMerchant",
            "click .cancel-merchant": "showStates",
            "click .confirm-order-button": "swapConfirmView"
        },
        template: _.template($(".place-order-view").text()),
        customersTemplate: _.template($(".customer-by-state-view").text()),
        customerTemplate: _.template($(".customer-order-view").text()),
        shoppingCart: {
            customer: {},
            cart: []
        },
        initialize: function() {
            null === Parse.User.current() == !0 ? (window.location.href = "#", router.swap(new FrontPage)) : ($(".app-container").html(this.el), this.render())
        },
        render: function() {
            $(this.el).append(this.template()), this.showStates()
        },
        showStates: function() {
            $(".select-customer").html("");
            var a = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"];
            $(".order-directions").text("Choose state location of customer"), a.forEach(function(a) {
                $(".select-customer").append('<button class="customer-state btn btn-default">' + a + "</button>")
            })
        },
        getCustomer: function(a) {
            var b = this,
                c = a.currentTarget.innerHTML;
            this.merchants = [];
            var d = new Parse.Query("customer");
            d.equalTo("State", c), d.find({
                success: function(a) {
                    a.forEach(function(a) {
                        b.merchants.push(a)
                    }), b.showCustomers()
                },
                error: function() {}
            })
        },
        showCustomers: function() {
            var a = this;
            $(".select-customer").html('<div class="crumbs"><span class="states-bread">states</span> > customers</div>'), $(".order-directions").text("Select the customer to create order"), this.merchants.forEach(function(b, c) {
                $(".select-customer").append(a.customersTemplate({
                    merchant: b,
                    index: c
                }))
            })
        },
        showCustomer: function(a) {
            $(".order-directions").text("Please confirm customer selection"), $(".select-customer").html('<div class="crumbs"><span class="states-bread">states</span> > <span class="customers-bread">customers</span> > ' + a.currentTarget.innerHTML + "</div>");
            var b = a.currentTarget.id;
            this.shoppingCart.customer = this.merchants[b], $(".select-customer").append(this.customerTemplate({
                merchant: this.shoppingCart.customer
            }))
        },
        acceptMerchant: function() {
            $(".order-directions").text("Please select manufacturer and item types for order"), this.inventoryList = new OrderInventoryList
        },
        swapConfirmView: function() {
            router.swap(new ConfirmOrderView({
                customer: this.shoppingCart.customer,
                items: this.shoppingCart.cart
            }))
        }
    }),
    OrderInventoryList = Parse.View.extend({
        events: {
            "click span.item-type": "itemTypeDetail",
            "click .manufacturer": "activeManufacturer",
            "click button.order-item": "addItemOrder"
        },
        template: _.template($(".order-inventory-list-view").text()),
        listItemTemplate: _.template($(".order-inventory-list-item-view").text()),
        listItemDetailTemplate: _.template($(".order-inventory-list-detail-view").text()),
        shoppingCartTemplate: _.template($(".order-shopping-cart-view").text()),
        initialize: function() {
            $(".app-merchant-bound").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template())
        },
        itemTypeDetail: function(a) {
            var b = this;
            $(".inventory-list-detail-bound").html("");
            var c = new Parse.Query("itemType");
            c.equalTo("typeName", a.currentTarget.innerHTML), c.first({
                success: function(a) {
                    var c = new Parse.Query("itemInstance");
                    c.equalTo("itemType", a), c.equalTo("itemInstanceCode", void 0), c.each(function(a) {
                        $(".inventory-list-detail-bound").append(b.listItemDetailTemplate({
                            item: a.attributes
                        }))
                    })
                },
                error: function(a) {
                    console.log(a)
                }
            })
        },
        activeManufacturer: function(a) {
            $(".manufacturer").removeClass("active"), $(event.target).addClass("active"), $(".center-number").text(""), $(".center-number").text($(event.target).text()), $(".inventory-list-item-bound").html("");
            var b = a.currentTarget.attributes.name.value,
                c = this,
                d = new Parse.Query("itemType");
            d.limit(1e3), d.equalTo("Manufacturer", b), d.find(function(a) {
                a.forEach(function(a) {
                    a.attributes.Manufacturer == b && $(".inventory-list-item-bound").append(c.listItemTemplate({
                        itemType: a
                    }))
                })
            })
        },
        addItemOrder: function(a) {
            var b = this,
                c = !1,
                d = a.currentTarget.parentElement.parentElement.children[1].innerHTML;
            if (router.currentView.shoppingCart.cart.forEach(function(d) {
                    d[0] == a.currentTarget.getAttribute("value") && (c = !0, d[1] += 1, b.renderCart())
                }), 0 == c) {
                var e = [a.currentTarget.getAttribute("value"), 1, d];
                router.currentView.shoppingCart.cart.push(e), b.renderCart()
            }
        },
        renderCart: function() {
            $(".shopping-cart-bound").html("");
            var a = this;
            router.currentView.shoppingCart.cart.forEach(function(b) {
                $(".shopping-cart-bound").append(a.shoppingCartTemplate({
                    item: b
                }))
            }), $(".shopping-cart-bound").append('<button role="button" class="btn confirm-order-button" data-toggle="modal">Check Out</button>')
        }
    }),
    ScanItem = Parse.View.extend({
        events: {
            "click .new-item-submit": "createNewItemInstance",
            "click .add-item": "manualAddItem",
            "click .add-new-item": "addNewItemFields",
            "click .cancel-new-item-creation": "cancelCreation",
            "click .start-scanning": "startScanning",
            "click .stop-scanning": "stopScanning",
            "keypress .this-upc": "firstScan",
            "keypress .this-serial-number": "secondScan"
        },
        template: _.template($(".scan-item-view").text()),
        manualItemCreationTemplate: _.template($(".manual-item-creation-template").text()),
        initialize: function() {
            if (null === Parse.User.current() == !0) window.location.href = "#", router.swap(new FrontPage);
            else {
                $(".app-container").html(this.el);
                this.render()
            }
        },
        render: function() {
            $(this.el).html(this.template())
        },
        firstScan: function(a) {
            13 == a.keyCode ? (console.log($(".this-upc").val()), $(".this-serial-number").focus()) : console.log("it's not ENTER!")
        },
        secondScan: function(a) {
            13 == a.keyCode ? (console.log($(".this-upc").val() + ", " + $(".this-serial-number").val()), this.autoFill(), console.log(this.autoFill()), this.createNewItemInstance(), $(".this-upc").val(""), $(".this-serial-number").val(""), $(".this-upc").focus()) : console.log("it's not ENTER!")
        },
        startScanning: function() {
            $(".this-upc").attr("disabled", !1), $(".this-serial-number").attr("disabled", !1), $(".this-upc").focus(), $(".start-scanning").addClass("stop-scanning"), $(".start-scanning").text("STOP SCANNING"), $(".stop-scanning").removeClass("start-scanning")
        },
        stopScanning: function() {
            $(".this-upc").attr("disabled", !0), $(".this-serial-number").attr("disabled", !0), $(".stop-scanning").addClass("start-scanning"), $(".stop-scanning").text("START SCANNING"), $(".start-scanning").removeClass("stop-scanning")
        },
        checkInput: function() {
            $(".itemType").val() && $(".itemName").val() && $(".itemNumber").val() ? this.checkItemType() : alert("please fill in all feilds")
        },
        autoFillScan: function() {
            this.autoFill();
            var a = this.autoFill();
            $(".this-serial-number").val(a.splice(1)), $(".this-upc").val(a.splice(0))
        },
        autoFill: function() {
            var a = [];
            return a.push($(".this-upc").val()), a.push($(".this-serial-number").val()), a
        },
        checkItemType: function() {
            var a = this;
            this.autoFill().forEach(function(b) {
                var c = b,
                    d = parseInt(b);
                if (isNaN(d) === !1) var e = c;
                var f = new Parse.Query("itemType");
                f.equalTo("UPC", e), f.find(function(b) {
                    b.length > 0 ? a.itemPointer = b[0] : (console.log("no match"), a.itemPointer = itemType)
                }).then(function() {
                    a.newItemSubmit()
                })
            })
        },
        newItemSubmit: function() {
            var a = this;
            a.createNewItemInstance().then(function() {
                a.render
            })
        },
        manualAddItem: function() {
            $(".add-item").attr("disabled", "disabled"), $(".new-item-submit").attr("disabled", "disabled");
            var a = this;
            this.stopScanning(), $(".add-here").append(a.manualItemCreationTemplate({})), console.log("added it")
        },
        createNewItemInstance: function() {
            var a = Parse.Object.extend("itemInstance"),
                b = new a;
            this.autoFill().forEach(function(a) {
                var c = a,
                    d = parseInt(a),
                    e = new Parse.Query("itemType"),
                    f = [],
                    g = $(".this-serial-number").val(),
                    h = $(".scanned-item-total").text();
                e.limit(1e3), e.find(function(a) {
                    a.forEach(function(a) {
                        a.attributes.UPC && f.push(a.attributes.UPC)
                    }), SerialNumber = function() {
                        this.autoFill().forEach(function(a) {
                            var b = a,
                                c = parseInt(a);
                            return isNaN(c) ? (console.log(b), b) : void 0
                        })
                    };
                    if (isNaN(d) === !0) {
                        console.log(c);
                        var e = new Parse.Query("itemInstance");
                        e.equalTo("serialNumber", c), e.find(function(a) {
                            return a.length > 0 ? (console.log(a), $(".stop-scanning").click(), "") : void 0
                        })
                    } else f.forEach(function(a) {
                        if (console.log(c), a == c) {
                            var d = new Parse.Query("itemType");
                            d.limit(1e3), d.find(function(c) {
                                c.forEach(function(c) {
                                    c.attributes.UPC == a && (b.set({
                                        Caliber: c.attributes.Caliber,
                                        Cost: c.attributes.Cost,
                                        DealerPrice: c.attributes.DealerPrice,
                                        MSRP: c.attributes.MSRP,
                                        Description: c.attributes.Description,
                                        Model: c.attributes.Model,
                                        UPC: c.attributes.UPC,
                                        itemType: c,
                                        serialNumber: g,
                                        itemInstanceCode: 0
                                    }), console.log(b), $(".scanned-item-list").append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + b.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + b.attributes.serialNumber + "</div>"), h = parseInt(h) + 1, $(".scanned-item-total").text(h))
                                })
                            })
                        }
                    })
                })
            })
        },
        addNewItemFields: function() {
            var a = $(".new-item-form").find("input").filter(function() {
                return "" === this.value
            });
            if (a.length) alert("please fill in all fields.");
            else {
                var b = Parse.Object.extend("itemType"),
                    c = new b;
                c.set({
                    Manufacturer: $(".manufacturer").val(),
                    Description: $(".description").val(),
                    Caliber: $(".caliber").val(),
                    Model: $(".model").val(),
                    Cost: "$" + $(".cost").val(),
                    DealerPrice: "$" + $(".dealer-price").val(),
                    MSRP: "$" + $(".msrp").val(),
                    UPC: $(".upc").val()
                }), c.save(), $(".scanned-item-list").append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + c.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + c.attributes.UPC + "</div>"), console.log(c), $(".new-item-form").children("input").val(""), $(".new-item-form").children("textarea").val(""), $(".manufacturer").focus()
            }
        },
        cancelCreation: function() {
            $(".add-item").attr("disabled", !1), $(".new-item-submit").attr("disabled", !1), $(".add-here").html(""), console.log("pudding")
        }
    }),
    ShelfList = Parse.View.extend({
        events: {},
        template: _.template($(".shelf-list-view").text()),
        shelfItemTemplate: _.template($(".shelf-list-item").text()),
        initialize: function() {
            null === Parse.User.current() == !0 ? (window.location.href = "#", router.swap(new FrontPage)) : ($(".app-container").html(this.el), this.render())
        },
        render: function() {
            $(this.el).append(this.template()), this.getShelfItems()
        },
        getShelfItems: function() {
            var a = this;
            $(".shelf-item-list-bound").html("");
            var b = new Parse.Query("itemInstance");
            b.equalTo("itemInstanceCode", 0), b.each(function(b) {
                $(".shelf-item-list-bound").append(a.shelfItemTemplate({
                    item: b.attributes
                }))
            })
        }
    }),
    ConfirmOrderView = Parse.View.extend({
        events: {
            "click .update-total": "updatePage",
            "click .confirm-list": "confirmCart"
        },
        template: _.template($(".confirm-order-view").text()),
        itemInstanceTemplate: _.template($(".confirm-order-item-instance-view").text()),
        itemTotalTemplate: _.template($(".update-order-total-view").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            var a = {
                Company: this.options.customer.attributes.Company ? this.options.customer.attributes.Company : "",
                FirstName: this.options.customer.attributes.FirstName ? this.options.customer.attributes.FirstName : "",
                LastName: this.options.customer.attributes.LastName ? this.options.customer.attributes.LastName : "",
                Address1: this.options.customer.attributes.Address1 ? this.options.customer.attributes.Address1 : "",
                City: this.options.customer.attributes.City ? this.options.customer.attributes.City : "",
                State: this.options.customer.attributes.State ? this.options.customer.attributes.State : "",
                Zip: this.options.customer.attributes.Zip ? this.options.customer.attributes.Zip : "",
                email: this.options.customer.attributes.email ? this.options.customer.attributes.email : "",
                Phone: this.options.customer.attributes.Phone ? this.options.customer.attributes.Phone : ""
            };
            $(this.el).append(this.template({
                customer: a
            })), this.getCart()
        },
        renderCart: function(a) {
            var b = this;
            $(".item-instance-bound").html(""), a.forEach(function(a) {
                $(".item-instance-bound").append(b.itemInstanceTemplate({
                    item: a
                }))
            })
        },
        getCart: function() {
            var a = this;
            this.cart = [];
            var b = new Promise(function(b) {
                a.cart = [], a.options.items.forEach(function(c, d, e) {
                    var f = new Parse.Query("itemType");
                    f.equalTo("objectId", c[0]), f.find({
                        success: function(b) {
                            b[0].attributes.quan = c[1], b[0].attributes.id = b[0].id, a.cart.push(b[0].attributes)
                        },
                        error: function(a) {
                            console.log(a)
                        }
                    }).then(function() {
                        d + 1 === e.length && b(a.cart)
                    })
                })
            });
            b.then(function() {
                a.renderCart(a.cart), a.showItemSum(a.sumItemCost())
            })
        },
        sumItemCost: function() {
            var a = 0;
            for (i = 0; i < $(".total-item-cost").length; i += 1)
                if (a += parseInt($(".total-item-cost")[i].innerHTML), i === $(".total-item-cost").length - 1) return a
        },
        showItemSum: function(a) {
            $(".cart-total").html(this.itemTotalTemplate({
                sum: a
            }))
        },
        updatePage: function() {
            var a = [];
            $(".cart-item-instance").each(function(b, c) {
                a.push([c.getAttribute("id"), c.value])
            }), this.updateCart(a)
        },
        updateCart: function(a) {
            var b = this,
                c = new Promise(function(c) {
                    b.cart = [], a.forEach(function(a, d, e) {
                        var f = new Parse.Query("itemType");
                        f.equalTo("objectId", a[0]), f.find({
                            success: function(c) {
                                c[0].attributes.quan = a[1], c[0].attributes.id = c[0].id, b.cart.push(c[0].attributes)
                            },
                            error: function(a) {
                                console.log(a)
                            }
                        }).then(function() {
                            d + 1 === e.length && c(b.cart)
                        })
                    })
                });
            c.then(function() {
                b.renderCart(b.cart), b.showItemSum(b.sumItemCost())
            })
        },
        confirmCart: function() {
            confirm("yo dawg are you sure?") ? ($(".item-list-bound").html(""), $(".item-total-bound").html(""), new FinalOrder(this.cart)) : alert("A wise decision!")
        }
    }),
    FinalOrder = Parse.View.extend({
        events: {},
        template: _.template($(".final-order-instance-view").text()),
        checkoutCart: [],
        initialize: function() {
            $(".item-list-bound").html(this.el), this.getCustomer(), this.render(), this.getItems()
        },
        createOrder: function(a) {
            console.log();
            var b = Parse.Object.extend("order");
            this.order = new b, this.order.set("customer", a), this.order.save(), console.log(this.order)
        },
        getCustomer: function() {
            var a = this,
                b = new Parse.Query("customer");
            b.equalTo("objectId", router.currentView.options.customer.id), b.first({
                success: function(b) {
                    a.customer = b, a.createOrder(b), console.log(b)
                },
                error: function(a) {
                    console.log(a)
                }
            })
        },
        render: function() {
            $(this.el).append(this.template())
        },
        getItems: function() {
            var a = this;
            router.currentView.cart.forEach(function(b) {
                var c = b.quan,
                    d = new Parse.Query("itemInstance");
                d.include("itemType"), d.equalTo("UPC", b.UPC), d.equalTo("itemInstanceCode", 0), d.find({
                    success: function(b) {
                        console.log(b), b.forEach(function(b) {
                            c > 0 && (console.log("id " + b.id), b.set("itemInstanceCode", 2), b.set("order", a.order), b.save(), c -= 1)
                        })
                    },
                    error: function(a) {
                        console.log(a)
                    }
                }).then(function() {
                    if (c > 0)
                        for (var d = c; d > 0; d -= 1) a.makeBackorder(b.UPC)
                }).then(function() {
                    console.log(a.checkoutCart), setTimeout(function() {
                        router.navigate("#order/" + a.order.id, {
                            trigger: !0,
                            replace: !0
                        })
                    }, 500)
                })
            })
        },
        grabInstance: function(a) {
            console.log("grabbed an " + a.attributes.UPC), console.log("id " + a.id), a.set("itemInstanceCode", 2), a.set("order", this.order), a.save(), this.checkoutCart.push([a, 0])
        },
        makeBackorder: function(a) {
            console.log("backorder for " + a);
            var b = Parse.Object.extend("backOrder"),
                c = new b;
            c.set("itemType", a), c.set("order", this.order), c.save(), this.checkoutCart.push([c, 1])
        }
    }),
    OrderInstanceView = Parse.View.extend({
        events: {
            "click .print-sales": "printSales",
            "click .print-invoice": "printInvoice"
        },
        template: _.template($(".final-order-instance-view").text()),
        customerTemplate: _.template($(".customer-info-order-template").text()),
        itemInstanceTemplate: _.template($(".customer-info-order-items-template").text()),
        backorderInstanceTemplate: _.template($(".customer-info-backorder-template").text()),
        totalTemplate: _.template($(".sales-order-template-total").text()),
        initialize: function() {
            $(".app-container").html(this.el), this.render()
        },
        render: function() {
            $(this.el).append(this.template()), this.getOrder()
        },
        getOrder: function() {
            var a = this,
                b = new Parse.Query("order");
            b.equalTo("objectId", this.options), b.include("customer"), b.first({
                success: function(b) {
                    a.order = b, a.showCustomer()
                },
                error: function() {}
            }).then(function() {
                a.getItems()
            })
        },
        showCustomer: function() {
            var a = this.order.attributes.customer;
            $(".customer-info").append(this.customerTemplate({
                customer: a,
                order: this.order
            }))
        },
        getItems: function() {
            var a = this,
                b = new Parse.Query("itemInstance");
            b.equalTo("order", this.order), b.include("itemType"), b.find({
                success: function(b) {
                    b.length > 0 ? b.forEach(function(b) {
                        a.showItem(b)
                    }) : $(".ship-head").html("")
                },
                error: function() {}
            }).then(function() {
                a.getBackOrders()
            })
        },
        getBackOrders: function() {
            var a = this,
                b = new Parse.Query("backOrder");
            b.equalTo("order", this.order), b.find({
                success: function(b) {
                    b.length > 0 ? b.forEach(function(b) {
                        var c = new Parse.Query("itemType");
                        c.equalTo("UPC", b.attributes.itemType), c.first({
                            success: function(c) {
                                a.showBackOrder(b, c)
                            },
                            error: function() {}
                        })
                    }) : $(".backorder-head").html("")
                },
                error: function() {}
            }).then(function() {
                a.getTotal()
            })
        },
        showBackOrder: function(a, b) {
            $(".backorder-items").append(this.backorderInstanceTemplate({
                backorder: a,
                type: b
            }))
        },
        showItem: function(a) {
            $(".in-stock-items").append(this.itemInstanceTemplate({
                item: a,
                type: a.attributes.itemType
            }))
        },
        getTotal: function() {
            var a = this,
                b = 0;
            setTimeout(function() {
                $(".item-price").each(function() {
                    var a = parseInt(this.innerHTML.replace(/\s+/g, "").substr(1));
                    b += a
                }), a.showTotal(b)
            }, 800)
        },
        showTotal: function(a) {
            $(".backorder-items").append(this.totalTemplate({
                total: a
            }))
        },
        printSales: function() {
            window.print()
        },
        printInvoice: function() {
            window.print()
        }
    }),
    AppRouter = Parse.Router.extend({
        routes: {
            "": "frontPage",
            scan: "scanItem",
            inventory: "inventoryList",
            shelf: "shelfList",
            backorder: "backorderList",
            orders: "orderList",
            order: "placeOrder",
            "order/:id": "finalOrder",
            customers: "customerList"
        },
        initialize: function() {
            this.navOptions = null, this.currentView = null
        },
        frontPage: function() {
            this.swap(new FrontPage)
        },
        scanItem: function() {
            this.swap(new ScanItem)
        },
        inventoryList: function() {
            this.swap(new InventoryList)
        },
        shelfList: function() {
            this.swap(new ShelfList)
        },
        backorderList: function() {
            this.swap(new BackorderList)
        },
        orderList: function() {
            this.swap(new OrderList)
        },
        orderStatus: function(a) {
            this.swap(new OrderStatus({
                orderID: a
            }))
        },
        placeOrder: function() {
            this.swap(new PlaceOrder)
        },
        orderItems: function(a) {
            this.swap(new OrderItemsView({
                shopID: a
            }))
        },
        attachForm3: function(a) {
            this.swap(new AttachForm3({
                orderID: a
            }))
        },
        orderInvoice: function(a) {
            this.swap(new OrderInvoice({
                orderID: a
            }))
        },
        orderPartial: function(a) {
            this.swap(new OrderPartial({
                orderID: a
            }))
        },
        customerList: function() {
            this.swap(new CustomerList)
        },
        finalOrder: function(a) {
            this.swap(new OrderInstanceView(a))
        },
        swap: function(a) {
            this.currentView && this.currentView.remove(), this.currentView = a
        }
    });
var router = new AppRouter;
Parse.history.start()