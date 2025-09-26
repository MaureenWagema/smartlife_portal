SmartLife.request_claim_list = function (params) {
    "use strict";

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
            } else {
                viewModel.vs_add_claim(false);
            }

            console.log(SmartLife.ClaimType);
            viewModel.get_user_claims();
        },

        get_user_claims: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings checklists"
            });
            get_form.DBget("claims/getClientClaims?client_no=" + SmartLife.clientno).done(function (result) {
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

        LoadPanelShown: ko.observable(false),
        claim_Store: ko.observableArray(),
        claim_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'reason',
                visible: false
            }, {

                dataField: 'policy_no',//SmartLife.ClientPolicies
                visible: true,
                width: '150'
            }, {
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
            }, {
                dataField: 'claim_type',//SmartLife.ClaimType
                visible: true,
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
            }, {

                dataField: 'tot_cash_value',
                visible: false
            }, {

                dataField: 'amount_available',
                visible: false
            }, {

                dataField: 'AmountAppliedFor',
                visible: false
            }, {//statuscode

                dataField: 'RequestDate',
                caption: 'Request Date',
                dataType: 'datetime',
                visible: true
            }/*, {

                dataField: 'status',
                caption: 'Status',
                visible: false
            }*/, {//

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }, {//

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }, {//

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {//

                dataField: 'statuscode',
                caption: 'Current Status',
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
                                var data = [{ id: dta.id, policy_no: dta.policy_no, claim_type: dta.claim_type, notification_date: dta.request_date, tot_proceeds: dta.tot_cash_value, net_pay: dta.amount_available, reason: dta.reason, amount_applied: dta.amount_applied }];
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