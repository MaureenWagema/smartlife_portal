SmartLife.agent_loan_list = function (params) {
    "use strict";

    var viewModel = {
        //  Put the binding properties here
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
        get_loans: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings agents"
            });
            get_form.DBget("agents/getAgentLoans?agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.loan_Store(result.AgentLoans);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        refresh_list: function () {
            viewModel.viewShown();
        },
        viewShown: function () {

            viewModel.get_loans();

        },
        add_loan: function () {
            //life_endorsement
            viewModel.navigateForward("agent_loan", "");
        },
        loan_Store: ko.observableArray(),
        loan_columns: [
            {
                dataField: 'id',
                visible: false
            }, {
                dataField: 'ParaCode',
                visible: true,
                lookup: {
                    dataSource: SmartLife.ParaCode, valueExpr: 'id', displayExpr: 'para_name'
                },
            }, {
                dataField: 'TotalAmount',
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
                dataField: 'CurrentPeriodYear',
                visible: true,
            }, {
                dataField: 'CurrentPeriodMonth',
                visible: true,
            }, {
                dataField: 'RepaymentPeriod',
                visible: true,
            }, {
                dataField: 'RequestDate',
                visible: true,
                dataType: 'date'
            }, {
                dataField: 'Status',
                visible: true,
            }
        ],

        open_loan: function (e) {
            var data = { rcd_id: e.data.id };
            //console.log(data);
            viewModel.navigateForward("agent_loan", JSON.stringify(data));
        }


    };

    return viewModel;
};