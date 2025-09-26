SmartLife.claim_enquiries = function (params) {
    var formSearchClaimsDetailsInstance;
    var is_micro = 0;
    if (SmartLife.login_type == 3) {
        //pos 
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1;
        }
    }
    //agents...
    if (SmartLife.login_type == 2) {
        if (SmartLife.channel == 5) {//micro
            is_micro = 1;
        }
        if (SmartLife.channel == 3) {//inv life plan.microassurance == 0 && plan.isBancAssurance == 1 &&
            var is_micro = 0;
        }
        if (SmartLife.channel == 4) {//bancassurance,   plan.plan_id == "45" || plan.plan_id == "9"
            var is_micro = 0;
        }
        if (SmartLife.channel == 1) {//bank
            var is_micro = 0;
        }
    }

    var vs_search_dates = true;
    if (SmartLife.login_type == 1) {
        vs_search_dates = false;
    }

    //save fn



    //retreive fn

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

        vs_add_claim: ko.observable(false),


        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        formatDate: function (input) {
            if (input === undefined || input === '') {
                return "";
            } else {
                var yr = input.getFullYear();
                var temp_month = input.getMonth() + 1;
                var month = temp_month < 10 ? '0' + temp_month : temp_month;
                var temp_day = input.getDate();
                var day = temp_day < 10 ? '0' + temp_day : temp_day;
                var inputs = yr + '-' + month + '-' + day;
                //var inputs = day + '/' + month + '/' + yr;
                return inputs;
            }
        },
        viewShown: function () {

            if (SmartLife.login_type == 1) {
                viewModel.vs_add_claim(true);
                console.log(SmartLife.ClaimType);
                viewModel.get_user_claims();
            } else {
                viewModel.vs_add_claim(false);
            }


        },

        get_user_claims: function () {
            viewModel.LoadPanelShown(true);
            let data = formSearchClaimsDetailsInstance.option("formData");
            var get_form = new DB({
                name: "get existings checklists"
            });
            get_form.DBget("claims/getClientClaims?client_no=" + SmartLife.clientno + "&is_micro=" + is_micro +
                "&date_from=" + viewModel.formatDate(new Date(data["date_from"])) + "&date_to=" + viewModel.formatDate(new Date(data["date_to"]))).done(function (result) {
                    viewModel.LoadPanelShown(false);
                    if (result.success == true) {
                        viewModel.claim_Store(result.Claims);
                    } else {
                        viewModel.show_test(result.msg, 'error');
                    }
                }).fail(function () {
                    viewModel.LoadPanelShown(false);
                    //alert_dialog("Server not accessible. Check internet connectivity");
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });
        },

        get_claimsHistory: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get claims History"
            });
            var is_micro = 0;
            if (SmartLife.pos_type == 2) is_micro = 1;
            get_form.DBget("claims/getHistoryClaims?policy_no=" + policy_no + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.claimHistory_Store(result.Claims);
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        dxFormSearchDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSearchDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'SmartLife Search',
                colCount: 4,
                items: [
                    {
                        label: {
                            text: "Type"
                        },
                        visible: false,
                        editorType: "dxLookup",
                        dataField: "type",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            searchEnabled: false,
                            showClearButton: true,
                            clearButtonText: 'Clear',
                            dataSource: [{ id: 1, description: 'Policy' }, { id: 2, description: 'Proposal' }],
                            displayExpr: 'description',
                            valueExpr: 'id',
                            value: 1,
                            /*onValueChanged: function (e) {
                                if (e.value == 2) {
                                    DevExpress.ui.dialog.alert("Proposal Enquiry still in production");
                                }
                            }*/
                        },
                        validationRules: [{
                            type: "required",
                            message: "Type is required"
                        }]
                    },
                    {
                        label: {
                            text: "Search Criteria"
                        },
                        editorType: "dxLookup",
                        dataField: "criteria",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            searchEnabled: false,
                            showClearButton: true,
                            clearButtonText: 'Clear',
                            dataSource: [{ id: 1, description: 'Policy Number' }, { id: 2, description: 'Staff Number' }],
                            displayExpr: 'description',
                            valueExpr: 'id'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Search Criteria is required"
                        }]
                    }, {
                        label: {
                            text: "Search Entry"
                        },
                        editorType: "dxTextBox",
                        dataField: "search_entry",
                        validationRules: [{
                            type: "required",
                            message: "Search Entry is required"
                        }]
                    },
                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "Search",
                            horizontalAlignment: "center",
                            verticalAlignment: "bottom",
                            icon: "search",
                            type: "danger",
                            /*elementAttr: {
                                class: "buttonPrimary"
                            },*/
                            onClick: function (args) {

                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {

                                    //save
                                    ///post data form as it is
                                    viewModel.LoadPanelShown(true);
                                    let get_life = new DB({
                                        name: "fetching claims"
                                    });
                                    let data = formSearchDetailsInstance.option("formData");
                                    type = data['type'];
                                    let url = "claims/getHistoryClaims?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                    

                                    get_life.DBget(url).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //console.log(result.record_id);
                                            viewModel.claim_Store(result.Claims);
                                        } else {
                                            viewModel.show_test(result.msg, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                                }

                            }
                        }
                    }],
            }],

        },



        LoadPanelShown: ko.observable(false),
        claim_Store: ko.observableArray(),
        onrowPrepared: function (e) {
            if (e.data != undefined) {
                if (e.data.IsCancelled == "1")
                    e.rowElement.css('background', '#ff4000');//red
            }
        },
        claim_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'reason',
                visible: false
            }, {
                dataField: 'claim_type',//SmartLife.ClaimType
                visible: true,
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
                groupIndex: 0,
            }, {

                dataField: 'policy_no',//SmartLife.ClientPolicies 
                visible: true,
                width: '150'
            }, {
                dataField: 'ClaimStatus',
                caption: 'Status'
            }, {
                allowEditing: false,
                dataField: 'IsCancelled',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'processed',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
            }, {

                dataField: 'tot_cash_value',
                visible: false
            }, {

                dataField: 'amount_available',
                visible: false
            }, {

                dataField: 'AmountAppliedFor',
                visible: false
            }, {
                dataField: 'total_proceeds',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                dataField: 'total_deductions',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                dataField: 'net_payment',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                dataField: 'pay_due_date',
                dataType: 'date',
                cellDisplayFormat: 'dd/MM/yyyy',
                visible: true
            }, {

                dataField: 'created_on',
                caption: 'Received On',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }/*, {

                dataField: 'status',
                caption: 'Status',
                visible: false
            }*/, {//

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }/*, {//

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }*/, {//

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {
                dataField: 'statuscode',
                caption: 'Current Status',
                visible: false
            }, {
                dataField: 'Cancel_narration',
                caption: 'Reason',
                visible: true
            }, {
                dataField: 'NarrationForRefunds',
                visible: true
            }, {
                dataField: 'payment_method',
                visible: true
            }, {
                dataField: 'cheque_no',
                visible: true
            }, {
                dataField: 'Bank',
                visible: false
            }, {
                dataField: 'bank_name',
                visible: true
            }, {
                dataField: 'bank_branch_name',
                visible: true
            }, {
                dataField: 'BankAccount',
                visible: true
            }, {
                dataField: 'MobileNumber',
                visible: true
            }, {
                dataField: 'TelcoCompany',
                visible: true
            }, {
                caption: 'ACTION',
                visible: false,
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
                                        "name": "View",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    }
                                ]
                            }
                        ],
                        hideSubmenuOnMouseLeave: false,
                        displayExpr: "name",
                        icon: "icon",
                        onItemClick: function (data) {
                            var item = data.itemData;
                            console.log(item.id);
                            var dta = options.data;

                            if (item.id == 1) {
                                //view
                                var data = [{ id: dta.id, policy_no: dta.policy_no, claim_type: dta.claim_type, notification_date: dta.request_date, tot_proceeds: dta.tot_cash_value, net_pay: dta.amount_available, reason: dta.reason, amount_applied: dta.amount_applied, status_code: dta.status_code }];
                                viewModel.navigateForward("request_claim_form", JSON.stringify(data));
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],

        claim_click: function (e) {
            var data = [{ policy_no: e.itemData.policy_no, claim_type: e.itemData.claim_type, notification_date: e.itemData.notification_date, tot_proceeds: e.itemData.tot_proceeds, net_pay: e.itemData.net_pay, reason: e.itemData.reason, amount_applied: e.itemData.amount_applied }];
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },

        add_claim: function () {
            viewModel.navigateForward("request_claim_form", "0");
        }

    };

    return viewModel;
};