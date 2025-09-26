SmartLife.products_list = function (params) {
    //"use strict";
    var ProductsList = SmartLife.planinfo;
    //TODO-SmartLife.planinfo
    //1. if POS - display either micro or life 
    //pos_type:0-Admin;1-Individual;2-Micro;3-Group;4-Pension;5-Medical;6-Bancassurance.
    if (SmartLife.login_type == 3) {
        if (SmartLife.pos_type == 2) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "1" && plan.IsForMportal == "1"));
        } else {
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "0" && plan.IsForMportal == "1") || (plan.IsCreditLife == 1 || plan.mortgage == 1 || plan.is_keyman == 1));
        }
    }
        
    //2. If agent - display micro, inv life & bancassurance
    if (SmartLife.login_type == 2) {
        if (SmartLife.channel == 5) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 1));
        }
        if (SmartLife.channel == 3) {//inv life plan.microassurance == 0 && plan.isBancAssurance == 1 &&
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "0" && plan.mortgage == "0" && plan.IsForMportal == "1" && plan.isBancAssurance == "0"));
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
            get_form.DBget("params/getBankPlans?bank_code=NIB").done(function (result) {
                //viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    ProductsList = result.Plans;
                    let prefix = SmartLife.agent_name.split("-")[0];
                    ProductsList.forEach(function (jsonObject) {
                        // Print the name property of each object
                        console.log(jsonObject.description);
                        jsonObject.description = prefix + "-" + jsonObject.description;
                    });
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
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 0 && plan.isBancAssurance == 0 && plan.mortgage == 0 && plan.IsForMportal == "1"));
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
                            if (options.data.plan_id == "45") {
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
    };

    return viewModel;
};