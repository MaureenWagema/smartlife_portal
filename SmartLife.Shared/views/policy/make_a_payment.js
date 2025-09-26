SmartLife.make_a_payment = function (params) {

    getPolicy = function (type, client_no) {

        var url = SmartLife.url + type + "search_entry=" + client_no +"&criteria=6";
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

    };

    function alert_dialog(title, msg, mobile, modal_premium, paymode, name, email, policy_no) {
        var myDialog = DevExpress.ui.dialog.custom({
            title: title,
            message: msg,
            buttons: [{
                text: "OK",
                onClick: function (e) {
                    //recurse...
                    //sync_autoload_params();
                    viewModel.send_payment_prompt(mobile, modal_premium, paymode, name, email, policy_no);
                    myDialog.hide();
                }
            }, {
                    text: "CANCEL",
                    onClick: function (e) {
                        myDialog.hide();
                    }
                }]
        });
        myDialog.show();
    }

    var options_arr = [{ id: 1, name: 'Make Payment' }, { id: 2, name: 'Details' }];

    var is_micro = 0;
    var name = '';
    var pay_mode = '';
    var email = '';
    var policy_no = '';

    var viewModel = {
        //  Put the binding properties here
        /*backButtonVisible: ko.observable(false),
        backButtonAction: function (e) {
            //alert("Back");
            SmartLife.app.back();

        },*/
        go_back: function () {
            SmartLife.app.back();
        },
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        
        send_payment_prompt: function (mobile, modal_premium, paymode, name, email, policy_no) {
            viewModel.LoadPanelShown(true);
            let send_prompt = new DB({
                name: "getting applications"
            });
            send_prompt.DBhubtel("hubtel.php?mobile_no=" + mobile + "&modal_prem=" + modal_premium +
                "&paymentinterval=" + paymode + "&customerName=" + name + "&email=" + email + "&policyNo=" + policy_no)
                .done(function (result) {
                    viewModel.LoadPanelShown(false);
                    console.log(result);
                    if (result.ResponseCode == "0001") {
                        DevExpress.ui.dialog.alert('Payment Prompt sent Successfully', '');
                    } else {
                        viewModel.show_test(result.Message, 'error');
                    }
                }).fail(function () {
                    viewModel.LoadPanelShown(false);
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });
        },

        ////////////////make payment prompt///////////////
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
        ///////////////end of payment prompt//////////

        policyDetailsVisible: ko.observable(false),
        backButtonVisible: ko.observable(false),
        PopupRange: ko.observable(false),
        dateFilterDisable: ko.observable(false),
        policy_store: ko.observableArray([]),

        policy_columns: [
            {
                dataField: 'is_micro',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'name',
                visible: false
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
            }, {

                dataField: 'plan',
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
            }/*, {
                allowEditing: false,
                dataField: 'sa',
                caption: 'Sum Assured',
                visible: true
            }*/, {
                caption: 'ACTION',
                width: '120',
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxMenu({
                        width: '100%',
                        dataSource: [

                            {
                                id: 452,
                                name: "",
                                icon: "mdi mdi-dots-vertical mdi-36px",
                                items: [

                                    {
                                        "id": 1,
                                        "name": "Make Payment",
                                        "icon": "mdi mdi-cash",
                                        // visible: false,
                                    },
                                    {
                                        "id": 2,
                                        "name": "Details",
                                        "icon": "mdi mdi-eye"

                                    }
                                ]
                            }],
                        hideSubmenuOnMouseLeave: false,
                        displayExpr: "name",
                        icon: "icon",
                        onItemClick: function (data) {
                            var item = data.itemData;
                            console.log(item.id);

                            var dta = options.data;


                            if (item.id == 1) {
                                //view
                                /*SmartLife.PolicyNo(dta.policy_no);
                                SmartLife.agent_no(dta.agent_no);
                                viewModel.navigateForward("pay", dta.modal_prem);*/
                                //alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.mobile, dta.modal_premium, "MONTHLY", dta.surname, dta.email, dta.policy_no);

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


                            else if (item.id == 2) {
                                //display popup
                                viewModel.polNumber(dta.policy_no);
                                viewModel.polDesc(dta.description);
                                viewModel.polfee(dta.policy_fee);
                                viewModel.polModal(dta.modal_prem);
                                viewModel.polSA(dta.sa);
                                viewModel.last_date(dta.last_date);
                                viewModel.prem_units(dta.prem_units);

                                viewModel.effective_date(dta.effective_date);
                                viewModel.coverperiod(dta.coverperiod);
                                var effective_prem = dta.expected_prem;
                                viewModel.effective_prem(dta.expected_prem);
                                viewModel.received(dta.received);
                                if (effective_prem > dta.received) {
                                    viewModel.missing_prem(effective_prem - dta.received);
                                } else {
                                    viewModel.missing_prem(0);
                                }
                                viewModel.missing_prem(viewModel.effective_prem() - dta.received);

                                viewModel.policyDetailsVisible(true);
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],


        polNumber: ko.observable(''),
        polDesc: ko.observable(''),
        polfee: ko.observable(''),
        polSA: ko.observable(''),
        polModal: ko.observable(''),
        last_date: ko.observable(),
        prem_units: ko.observable(''),
        missing_prem: ko.observable(''),
        effective_prem: ko.observable(''),
        received: ko.observable(''),
        effective_date: ko.observable(),
        coverperiod: ko.observable(),

        LoadPanelShown: ko.observable(false),

        viewShown: function () {

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

        showStatement: function () {
            try {

                //viewModel.PopupRange(false);

                viewModel.navigateForward("PaymentsView", "");

            }
            catch (err) { }

        },

        CancelStatement: function () {
            try {
                viewModel.PopupRange(false);
            } catch (err) {

            }
        },
        hidePolicyDetalis: function () {
            viewModel.policyDetailsVisible(false);
        },

        menu_items: ([{
            text: "Make Payment",
            action: function (e) {
                try {
                    SmartLife.PolicyNo(e.itemData.policy_no);
                    SmartLife.agent_no(e.itemData.agent_no);
                    viewModel.navigateForward("pay", e.itemData.modal_prem);
                } catch (err) {

                }
            }
        }, {
            text: "Details",
            action: function (e) {
                //TODO
                viewModel.polNumber(e.itemData.policy_no);
                viewModel.polDesc(e.itemData.description);
                viewModel.polfee(e.itemData.policy_fee);
                viewModel.polModal(e.itemData.modal_prem);
                viewModel.polSA(e.itemData.sa);
                viewModel.last_date(e.itemData.last_date);
                viewModel.prem_units(e.itemData.prem_units);

                viewModel.effective_date(e.itemData.effective_date);
                viewModel.coverperiod(e.itemData.coverperiod);
                /*Expected premium = months(current - effective_date) * modal_prem * cover_period
                Current_premium
                missing*/
                //missing_prem,effective_prem,received
                //var effective_prem = parseInt(viewModel.get_month(new Date())) - parseInt(viewModel.get_month(new Date(e.itemData.effective_date))) * parseFloat(e.itemData.modal_prem) * parseFloat(e.itemData.coverperiod);
                var effective_prem = e.itemData.expected_prem;
                viewModel.effective_prem(e.itemData.expected_prem);
                viewModel.received(e.itemData.received);
                if (effective_prem > e.itemData.received) {
                    viewModel.missing_prem(effective_prem - e.itemData.received);
                } else {
                    viewModel.missing_prem(0);
                }
                viewModel.missing_prem(viewModel.effective_prem() - e.itemData.received);

                viewModel.policyDetailsVisible(true);

            }
        }]),
        /////handle pop up options here
        pop_options: ko.observable(false),
        options_store: ko.observableArray(options_arr),
        options_columns: [
            {
                allowEditing: false,
                dataField: 'id',
                visible: false
            }, {
                dataField: 'name',
                alignment: 'center',
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        width: 150,
                        text: options.data.name,
                        type: 'success',
                        onClick: function (e) {
                            alert('clicked');
                        }
                    }).appendTo(container);
                }
            }
        ],
        options_click: function () {

        }
        //////end of pop up options


    };
    return viewModel;
};