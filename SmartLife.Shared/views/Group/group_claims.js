SmartLife.group_claims = function (params) {
    "use strict";

    var is_micro = 0;
    if (SmartLife.login_type == 3) {
        //pos 
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1;
        }
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

        vs_add_claim: ko.observable(true),


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

            /*if (SmartLife.login_type == 1) {
                viewModel.vs_add_claim(true);
            } else {
                viewModel.vs_add_claim(false);
            }*/

            console.log(SmartLife.ClaimType);
            viewModel.get_user_claims();
        },

        get_user_claims: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings checklists"
            });
            get_form.DBget("claims/getGroupClaims?scheme_no=" + SmartLife.scheme_no).done(function (result) {
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

        /*
         Scheme,
claim_no,
claim_type,
branch_id,
Approved,
IsCancelled
         */

        claim_columns: [
            {
                dataField: 'id',
                visible: false
            }, {
                dataField: 'reason',
                visible: false
            }, {

                dataField: 'SchemeName',//SmartLife.ClientPolicies
                visible: false,
            }, {
                dataField: 'MemberId',
                visible: false
            },
            {
                dataField: 'Names',
                visible: false
            }, {

                dataField: 'member_no',
                visible: false,
            }, {
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
            }, {
                dataField: 'ClaimName',//SmartLife.ClaimType
                visible: true,
            },
            {
                allowEditing: false,
                dataField: 'total_proceeds',
                caption: 'Total Proceeds',
                visible: false,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            },
            {
                allowEditing: false,
                dataField: 'total_deductions',
                caption: 'Total Deductions',
                visible: false,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            },
            {
                allowEditing: false,
                dataField: 'net_payment',
                caption: 'Net Payment',
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
                dataField: 'Approved',
                caption: 'Approved',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                dataField: 'IsCancelled',
                caption: 'Cancelled',
                dataType: 'boolean',
                visible: false,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                dataField: 'created_by',
                caption: 'Requested By',
                visible: false
            }, {
                dataField: 'notification_date',
                dataType: 'date',
                visible: true
            }, {
                dataField: 'branch_name',
                caption: 'Branch',
                visible: false
            }
        ],

        claim_click: function (e) {
            var data = [{ policy_no: e.itemData.policy_no, claim_type: e.itemData.claim_type, notification_date: e.itemData.notification_date, tot_proceeds: e.itemData.tot_proceeds, net_pay: e.itemData.net_pay, reason: e.itemData.reason, amount_applied: e.itemData.amount_applied }];
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },

        add_claim: function () {

            var data = { member_no: '', telephone: '', Names: SmartLife.scheme_no, SchemeID: SmartLife.scheme_name };
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        }

    };

    return viewModel;
};