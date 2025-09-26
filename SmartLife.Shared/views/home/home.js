SmartLife.home = function (params) {
    "use strict";
    function plan_changed(e) {
        if (e.value == "M") {
            alert("hide");
            viewModel.dxFormOptions.items[0].editorOptions.visible(false);
        } else {
            alert("show");
            viewModel.dxFormOptions.items[0].editorOptions.visible(true);
        }
        
    }


    function getPolicy(type, client_no) {

        var url = SmartLife.url + type + "search_entry=" + client_no + "&criteria=6";
        console.log(url);
        return $.ajax({
            method: "GET",
            url: url,
            //data: {  },
            timeout: 100000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                DevExpress.ui.notify('An Error Occured', error, 2000);
            }
        });

    }

    var Telcos = SmartLife.Telcos.filter(telco => (telco.emp_code == "MTNMOB" || telco.emp_code == "V-CASH"));
    var formPayInstance;

    var is_micro = 0;
    var name = '';
    var pay_mode = '';
    var email = '';
    var policy_no = '';

    var viewModel = {
//  Put the binding properties here
        LoadPanelShown: ko.observable(false),
        viewShown: function () {
            viewModel.get_access_roles();
            //viewModel.get_client_dashboards();
            viewModel.LoadPanelShown(true);
            var type = "policy/getPolicyDetails?";
            getPolicy(type, SmartLife.clientno).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.PolicyDetails);
                    //viewModel.policy_store(result.PolicyDetails);
                    viewModel.lblActivePolicies(result.PolicyDetails.length);
                    viewModel.fetch_policies();
                } else {
                    DevExpress.ui.dialog.alert(result.msg);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                DevExpress.ui.dialog.alert("Server not accessible.Check internet connectivity...");
                });


            
        },

        fetch_policies: function () {
            viewModel.LoadPanelShown(true);
            var type = "policy/getPolicyDetails?";
            getPolicy(type, SmartLife.clientno).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.PolicyDetails);
                    viewModel.policy_store(result.PolicyDetails);
                } else {
                    DevExpress.ui.dialog.alert(result.msg);

                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                DevExpress.ui.dialog.alert("Server not accessible.Check internet connectivity...");
            });
        },

        pop_prompt_payment: ko.observable(false),
        hide_prompt_payment: function () {
            viewModel.pop_prompt_payment(false);
        },
        dxFormPay: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
            onInitialized: function (e) {
                formPayInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                /*{
                    label: {
                        text: "Telco Company"
                    },
                    editorType: "dxLookup",
                    dataField: "telco",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: Telcos,//[{ id: 1, description: 'Airtel' }, { id: 2, description: 'MTN' }, { id: 3, description: 'Vodaphone' }],
                        displayExpr: 'Name',
                        valueExpr: 'UniqueCode'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Telco is required"
                    }]
                },*/
                {
                    label: {
                        text: "Telco Company"
                    },
                    editorType: "dxLookup",
                    dataField: "telco",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Telco is required"
                    }]
                },
                {
                    label: {
                        text: "MOMO Number"
                    },
                    editorType: "dxTextBox",
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
                    dataField: "momo_no",
                    validationRules: [{
                        type: "required",
                        message: "MOMO Number is required"
                    }]
                }, {

                    label: {
                        text: "Premium Amount"
                    },
                    editorType: "dxNumberBox",
                    dataField: "amount",
                    validationRules: [{
                        type: "required",
                        message: "Premium Amount is required"
                    }]
                },
                {
                    dataField: "btnregister",
                    itemType: "button",
                    horizontalAlignment: "center",
                    verticalAlignment: "bottom",
                    buttonOptions: {
                        text: "Pay",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        icon: "money",
                        type: "danger",
                        onClick: function (args) {

                            //tabsInstance.option("selectedIndex", 1);
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //save
                                ///post data form as it is
                                viewModel.LoadPanelShown(true);
                                let get_life = new DB({
                                    name: "Registering MOMO client"
                                });
                                let data = formPayInstance.option("formData");

                                let send_prompt = new DB({
                                    name: "getting applications"
                                });
                                //dta.mobile, dta.TotalPremium, dta.modal_prem, dta.pay_mode, dta.name, dta.email, dta.policy_no
                                send_prompt.DBhubtel("hubtel.php?mobile_no=" + data['momo_no'] + "&modal_prem=" + data['amount'] +
                                    "&paymentinterval=" + pay_mode + "&customerName=" + name + "&email=" + email + "&policyNo=" + policy_no +
                                    "&telco=" + data['telco'] + "&is_micro=" + is_micro)
                                    .done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        console.log(result);
                                        if (result.ResponseCode == "0001") {
                                            viewModel.pop_prompt_payment(false);
                                            DevExpress.ui.dialog.alert('Payment Prompt sent Successfully', '');
                                        } else {
                                            viewModel.show_test(result.Message, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                            }

                        }
                    }
                }
            ],
        },


        policy_store: ko.observableArray([]),

        policy_columns: [
            {
                dataField: 'is_micro',
                visible: false
            },
            {
                visible: true,
                caption: '',
                width: '100',
                allowEditing: false,
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        text: 'PAY',
                        icon: '',
                        type: 'default',
                        onClick: function () {
                            //go to the next screen
                            //var data = { plan_code: options.data.plan_id, rd_form: 0 };
                            //viewModel.navigateForward("embedded_form", JSON.stringify(data));
                            //TODO-Display a popup, that is, mobile_no, email & send Link
                            //plan_code = options.data.plan_id;
                            //viewModel.show_send_link();

                            //Display the pop up pay
                            is_micro = options.data.is_micro;
                            name = options.data.name;
                            pay_mode = options.data.pay_mode;
                            email = options.data.email;
                            policy_no = options.data.policy_no;

                            viewModel.pop_prompt_payment(true);

                            //assign mobile & total_premium
                            formPayInstance.updateData("momo_no", options.data.mobile);
                            formPayInstance.updateData("amount", parseFloat(options.data.TotalPremium).toFixed(2));
                        }
                    }).appendTo(container);
                }
            },
            {

                dataField: 'basic_prem',
                visible: false
            }, {

                dataField: 'modal_prem',
                visible: false
            }, {

                dataField: 'description',
                visible: false
            }, {

                dataField: 'surname',
                visible: false
            }, {

                dataField: 'mobile',
                visible: false
            }, {

                dataField: 'email',
                visible: false
            },
            {
                allowEditing: false,
                caption: 'pay_mode',
                dataField: 'pay_mode',
                visible: false
            }, {

                dataField: 'plan_code',
                visible: false
            }, {

                dataField: 'policy_fee',
                visible: false
            }, {

                dataField: 'agent_no',
                visible: false
            }, {

                dataField: 'policy_no',
                caption: 'Policy Number',
                visible: true
            }, {

                dataField: 'description',
                caption: 'Plan',
                visible: true
            }, {

                dataField: 'TotalPremium',
                visible: true,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                allowEditing: false,
                dataField: 'status_code',
                lookup: {
                    dataSource: SmartLife.Statuses, valueExpr: 'status_code', displayExpr: 'description'
                },
                visible: true,
            },
            {
                allowEditing: false,
                dataField: 'name',
                visible: true
            }
        ],


        lblActivePolicies: ko.observable(0),

        get_client_dashboards: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching client data"
            });
            get_life.DBget("reports/getClientDashboard?client_no=" + SmartLife.clientno).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //viewModel.lblActivePolicies(result.ActivePolicies);

                    

                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {
                
            });
        },


        notifications_Store: ko.observableArray([{ date_added: '19/05/2022', title: 'Quartely Statements', content: 'I trust you are well, Q1 statements sent today', stage_name: 'Delivered' },
        { date_added: '01/06/2022', title: 'GLICO Q1 Updates', content: 'If you missed yesterdays Webinar, you can catch up with the conversation.', stage_name: 'Delivered' }]),

        alerts_store: ko.observableArray([{ usr_id: 1, type: 'Premium', amount: '50', expiry: '3' }, { usr_id: 1, type: 'Loan', amount: '10', expiry: '7' }]),
        alerts_columns: [
            {
                dataField: 'usr_id',
                width: 'auto',
                visible: false
            },
            {
                dataField: 'type',
                caption: 'Type',
                width: 'auto',
                visible: true
            },
            {
                dataField: 'amount',
                width: 'auto',
                visible: true
            },
            {
                dataField: 'expiry',
                caption: 'Due(days)',
                width: 'auto'
            }
        ],
        onrowPrepared: function (e) {
            if (e.data != undefined) {
                if (e.data.expiry == "7")
                    e.rowElement.css('background', '#00ffff');// blue
                else if (e.data.expiry == "3")
                    e.rowElement.css('background', '#ff4000');//red
            }
        },
		

        dxFormOptions: {
            colCount: 2,
            items: [{
                dataField: "ID",
                editorOptions: {
                    visible: ko.observable(true)
                }
            }, {
                    label: {
                        text: "Gender"
                    },
                    editorType: "dxLookup",
                    dataField: "gender_code",
                    editorOptions: {
                        value: '',
                        dataSource: SmartLife.Genderinfo,
                        displayExpr: 'Desc',
                        valueExpr: 'Code',
                        onValueChanged: plan_changed,
                    },
                    validationRules: [{
                        type: "required",
                        message: "Gender is required"
                    }]
                }
            ]
        },


        dashboard_data: ko.observableArray([{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1}]),
        chartOptions: {
            dataSource: [{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1 }],
            series: {
                argumentField: "code",
                valueField: "tot_ref",
                name: "Reports",
                type: "bar",
                color: '#ffaa66'
            }
        },
        piechartOptions: {
            size: {
                width: 500
            },
            palette: "bright",
            dataSource: [{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1 }],
            series: [
                {
                    argumentField: "code",
                    valueField: "tot_ref",
                    label: {
                        visible: true,
                        connector: {
                            visible: true,
                            width: 1
                        },
                        indent: 30,
                        format: {
                            type: "fixedPoint"
                        },
                        customizeText: function (arg) {
                            return arg.valueText;
                        }
                    }
                }
            ],
            title: "EXPORT",
            "export": {
                enabled: true
            },
            onPointClick: function (e) {
                var point = e.target;

                toggleVisibility(point);
            },
            onLegendClick: function (e) {
                var arg = e.target;

                toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
            }
        },
        toggleVisibility: function (item) {
            item.isVisible() ? item.hide() : item.show();
        },
        //[47.27, 65.32, 84.59, 71.86]
        barGaugeOptions: {
            startValue: 0,
            endValue: 100,
            values: [47.27, 65.32, 84.59, 71.86],
            label: {
                indent: 30,
                format: {
                    type: "fixedPoint",
                    precision: 1
                },
                customizeText: function (arg) {
                    return arg.valueText + " %";
                }
            },
            "export": {
                enabled: true
            },
            title: {
                text: "Reports' Ratings",
                font: {
                    size: 28
                }
            }
        },
      

    };

    return viewModel;
};