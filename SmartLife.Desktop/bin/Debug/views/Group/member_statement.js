SmartLife.member_statement = function (params) {
    "use strict";

    //save fn

    //retreive fn
    var member_no;
    var get_data = JSON.parse(params.item);
    console.log(get_data);
    if (get_data['member_no'] != undefined) {
        member_no = get_data['member_no'];
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
            viewModel.get_member_statements();
        },

        get_member_statements: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get member statements"
            });
            let url = "group/getMemberStatement?member_no=" + member_no;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.statements_Store(result.MemberStatement);
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
        statements_Store: ko.observableArray(),
        //FundYear, PrevCashvalue, InvestAmt, IntAmt, AmtWithdrawn, TotalPension
        statements_columns: [
            {
                dataField: 'FundYear',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'PrevCashvalue',
                visible: true,
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
                dataField: 'InvestAmt',
                visible: true,
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
                dataField: 'IntAmt',
                visible: true,
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
                dataField: 'AmtWithdrawn',
                visible: true,
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
                dataField: 'TotalPension',
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
                                        "name": "Request Claim",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    },
                                    {
                                        "id": 2,
                                        "name": "Statement",
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
                                var data = { member_no: dta.member_no, telephone: dta.telephone, Names: dta.Names, SchemeID: dta.SchemeID };
                                viewModel.navigateForward("request_claim_form", JSON.stringify(data));
                            }

                            if (item.id == 2) {
                                //view
                                var data = { member_no: dta.member_no, telephone: dta.telephone, Names: dta.Names, SchemeID: dta.SchemeID };
                                viewModel.navigateForward("member_statement", JSON.stringify(data));
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

        add_member: function () {
            viewModel.navigateForward("add_member", "0");
        }

    };

    return viewModel;
};