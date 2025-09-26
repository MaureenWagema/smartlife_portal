SmartLife.products_list = function (params) {
    //"use strict";
    var ProductsList = SmartLife.planinfo;
    var vs_CreditLife = false;
    var formSendLinkInstance;
    var plan_code;
    //TODO-SmartLife.planinfo
    //1. if POS - display either micro or life 
    //pos_type:0-Admin;1-Individual;2-Micro;3-Group;4-Pension;5-Medical;6-Bancassurance.
    if (SmartLife.login_type == 1) {//client
        ProductsList = SmartLife.planinfo.filter(plan => (plan.IsForMportal == "1"));
    }
    if (SmartLife.login_type == 3) {
        if (SmartLife.pos_type == 2) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "1" && plan.IsForMportal == "1"));
        } else {
            if (SmartLife.IsCreditLifeUser == 1) {
                //credit life
                vs_CreditLife = true;
                ProductsList = SmartLife.planinfo.filter(plan => (plan.mortgage == "1" || plan.IsLoanProtection == "1" || plan.is_keyman == "1" || plan.IsCreditLife == "1"));
            } else {
                //life
                ProductsList = SmartLife.planinfo.filter(plan => (plan.IsForMportal == "1"));
                //ProductsList = SmartLife.planinfo.filter(plan => (plan.IsForMportal == "1" || plan.mortgage == "1" || plan.IsLoanProtection == "1" || plan.is_keyman == "1" || plan.IsCreditLife == "1"));
            }
        }
    }
        
    //2. If agent - display micro, inv life & bancassurance
    if (SmartLife.login_type == 2) {
        if (SmartLife.channel == 5) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 1));
        }
        if (SmartLife.channel == 3) {//inv life plan.microassurance == 0 && plan.isBancAssurance == 1 && is_active
            ProductsList = SmartLife.planinfo.filter(plan => (plan.is_active == "1" && plan.microassurance == "0" && plan.mortgage == "0" && plan.IsForMportal == "1" && plan.isBancAssurance == "0"));
        }
        if (SmartLife.channel == 4) {//bancassurance,   plan.plan_id == "45" || plan.plan_id == "9"
            //console.log(ProductsList);
            //ProductsList = SmartLife.planinfo.filter(plan => ((plan.microassurance == "0" && plan.mortgage == "0" && plan.IsForMportal == "1") || plan.IsCreditLife == 1 || plan.mortgage == 1));
            /*ProductsList = SmartLife.planinfo.filter(plan => (plan.showNIBB == "1"));
            let prefix = SmartLife.agent_name.split("-")[0]; 
            ProductsList.forEach(function (jsonObject) {
                console.log(jsonObject.description);
                jsonObject.description = prefix + "-" + jsonObject.description;
            });*/

            //make db call here
            //viewModel.LoadPanelShown(true);
            ProductsList = [];
            var get_form = new DB({
                name: "get bank policies"
            });
            get_form.DBget("params/getBankPlans?agent_code="+SmartLife.agent_no).done(function (result) {
                //viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    ProductsList = result.Plans;
                    /*let prefix = SmartLife.agent_name.split("-")[0];
                    ProductsList.forEach(function (jsonObject) {
                        // Print the name property of each object
                        console.log(jsonObject.description);
                        jsonObject.description = prefix + "-" + jsonObject.description;
                    });*/
                    viewModel.products_Store(ProductsList);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                //viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        }
        if (SmartLife.channel == 1) {//bank

            //ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 0 && plan.isBancAssurance == 0 && plan.mortgage == 0 && plan.IsForMportal == "1"));
            //Lets create an endpoint to fetch the product for the bank
            ProductsList = [];
            var get_form = new DB({
                name: "get bank policies"
            });
            get_form.DBget("params/getBankProducts?agent_code="+SmartLife.agent_no).done(function (result) {
                //viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    ProductsList = result.Plans;
                    /*let prefix = SmartLife.agent_name.split("-")[0];
                    ProductsList.forEach(function (jsonObject) {
                        // Print the name property of each object
                        console.log(jsonObject.description);
                        jsonObject.description = prefix + "-" + jsonObject.description;
                    });*/
                    viewModel.products_Store(ProductsList);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                //viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        }
    }

    var viewModel = {
        //  Put the binding properties here
        backButtonVisible: ko.observable(false),
        backButtonAction: function (e) {
            SmartLife.app.back();
        },
        // 'custom' | 'error' | 'info' | 'success' | 'warning' 
        toast_msg: ko.observable(''),
        toast_type: ko.observable(''),
        isToastVisible: ko.observable(false),
        show_test: function (msg, type) {
            viewModel.toast_msg(msg);
            viewModel.toast_type(type);
            viewModel.isToastVisible(true);
        },
        LoadPanelShown: ko.observable(false),
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        go_back: function () {
            SmartLife.app.back();
        },
        viewShown: function () {

        },
        products_Store: ko.observableArray(ProductsList),
        products_columns: [
            //columns and add list to Apply --- microassurance,isBancAssurance
            {
                dataField: 'plan_code',
                visible: false
            },
            {
                dataField: 'plan_id',
                visible: false
            },
            {
                dataField: 'microassurance',
                visible: false
            },
            {
                dataField: 'isBancAssurance',
                visible: false
            },
            {
                dataField: 'description',
                caption: 'Description'
            },
            //TODO-add another button for Jane to use to send link to client
            {
                visible: vs_CreditLife,
                caption: '',
                width: '120',
                allowEditing: false,
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        text: 'SEND LINK',
                        type: 'default',
                        onClick: function () {
                            //go to the next screen
                            //var data = { plan_code: options.data.plan_id, rd_form: 0 };
                            //viewModel.navigateForward("embedded_form", JSON.stringify(data));
                            //TODO-Display a popup, that is, mobile_no, email & send Link
                            plan_code = options.data.plan_id;
                            viewModel.show_send_link();
                        }
                    }).appendTo(container);
                }
            },

            {
                caption: '',
                width: '120',
                allowEditing: false,
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        text: 'APPLY',
                        type: 'default',
                        onClick: function () {
                            //go to the next screen
                            var data = { plan_code: options.data.plan_id, rd_form:0 };
                            //for embedded navigate to the embedded form
                            if (options.data.plan_id == "45" || options.data.plan_id == "52") {
                                viewModel.navigateForward("embedded_form", JSON.stringify(data));//embeded
                            } else if (options.data.plan_id == "9") {
                                viewModel.navigateForward("application_form", JSON.stringify(data));
                            } else if (options.data.plan_id == "27") {
                                viewModel.navigateForward("application_form", JSON.stringify(data));
                            } else if (options.data.plan_id == "21") {
                                viewModel.navigateForward("application_form", JSON.stringify(data));
                            } else {
                                viewModel.navigateForward("proposal_form", JSON.stringify(data));//normal
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],


        //////pop up send link////
        pop_hiding_send_link: function () {
            formSendLinkInstance.resetValues();
        },
        pop_send_link: ko.observable(false),
        hide_send_link: function () {
            //do the cumulative additions here.
            viewModel.pop_send_link(false);
        },
        show_send_link: function () {
            let tmp_values = {
                surname: '', other_name: '', mobile: '', email: ''
            };
            $("#dxFormSendLink").dxForm({
                formData: tmp_values
            }).dxForm("instance");
            viewModel.pop_send_link(true);
        },
        dxFormSendLink: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSendLinkInstance = e.component;
                viewModel.LoadPanelShown(false);
            },

            //["dp_relationship", "dp_dob"]
            items: [
                {
                    label: {
                        text: "Surname"
                    },
                    editorType: "dxTextBox",
                    dataField: "surname",
                    validationRules: [{
                        type: "required",
                        message: "Surname is required"
                    }]
                }, {
                    label: {
                        text: "Other Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "other_name",
                    validationRules: [{
                        type: "required",
                        message: "Other Name is required"
                    }]
                }, {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "mobile",
                    editorOptions: {
                        maskRules: {
                            "9": /[0-9]/
                        },
                        onKeyPress: function (e) {
                            var key = String.fromCharCode(e.event.keyCode || e.event.which);
                            var regex = /[0-9]|\./;
                            if (!regex.test(key)) {
                                e.event.preventDefault();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Mobile is required"
                    }]
                }, {
                    label: {
                        text: "Email"
                    },
                    editorType: "dxTextBox",
                    dataField: "email",
                    validationRules: [{
                        type: "required",
                        message: "Email is required"
                    }]
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "CLOSE",
                        horizontalAlignment: "left",
                        icon: "close",
                        type: "normal",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                            viewModel.hide_send_link();
                        }
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "OK",
                        icon: "check",
                        type: "normal",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {

                                //push to send link
                                //1. It saves / updates this data.... embedd the saved ID kwa 
                                //then, sends link via email....
                                viewModel.save_proposal();


                            }
                        }
                    }
                }]
        },

        save_proposal: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the application details"
            });
            let data = formSendLinkInstance.option("formData");
            data['plan_code'] = plan_code;
            data['HasBeenPicked'] = 1;
            data['isWebCompleted'] = 0;
            get_life.DBpost("sync/synProposal", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    viewModel.send_link(result.record_id);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        send_link: function (record_id) {

            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            //let data = { 'record_id': record_id };
            let data = formSendLinkInstance.option("formData");
            data['record_id'] = record_id;
            data['name'] = data['surname'] + " " + data['other_name'];
            get_life.DBpost("email/sendLink", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    DevExpress.ui.dialog.alert("Application Form Successfully Sent", "SENT");
                    viewModel.hide_send_link();
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
            
        }
        //////end of pop up send link//

    };

    return viewModel;
};