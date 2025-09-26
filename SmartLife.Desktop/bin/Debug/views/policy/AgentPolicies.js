SmartLife.AgentPolicies = function (params) {
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
            viewModel.get_agent_policies();
        },

        get_agent_policies: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get agents policies"
            });
            let url = "policy/getPolicyDetails?search_entry=" + SmartLife.agent_no + "&criteria=5";
            if (SmartLife.channel == 5) url = "policy/getMicroPolicyDetails?search_entry=" + SmartLife.agent_no + "&criteria=5";
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.policies_Store(result.PolicyDetails);
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
        policies_Store: ko.observableArray(),
        policies_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'email',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'mobile',
                visible: true,
            },
            {
                allowEditing: false,
                dataField: 'modal_prem',
                caption: 'Premium',
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
                caption: 'plan',
                dataField: 'plan_code',
                lookup: {
                    dataSource: SmartLife.planinfo, valueExpr: 'plan_id', displayExpr: 'description'
                },
                visible: true//
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'status_code',
                lookup: {
                    dataSource: SmartLife.Statuses, valueExpr: 'status_code', displayExpr: 'description'
                },
                visible: true,
            },
            {
                allowEditing: false,
                caption: 'pay_mode',
                dataField: 'pay_mode',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'maturity_date',
                dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'term_of_policy',
                caption: 'Term',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'last_premium_date',
                dataType: 'date',
                visible: true
            },
            {//employee_no
                allowEditing: false,
                dataField: 'employee_no',
                caption: 'Staff No',
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