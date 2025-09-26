SmartLife.quote_group_list = function (params) {
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
        get_quotes: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings agents"
            });
            get_form.DBget("group/getGroupQuotations").done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.quotation_Store(result.Quotes);
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

            viewModel.get_quotes();

        },
        add_quote: function () {
            //life_endorsement
            viewModel.navigateForward("quote_group_form", "");
        },
        quotation_Store: ko.observableArray(),
        //ProductCode, ClientName, QuotationDate, TotalMembers, AverageAge, TotalSalary, ContactNumber, BrokerID, StatusDescription
        quotation_columns: [
            {
                dataField: 'ID',
                visible: false
            }, {
                dataField: 'ProductCode',
                visible: true,
                lookup: {
                    dataSource: SmartLife.GLPlan, valueExpr: 'class_code', displayExpr: 'Description'
                },
            }, {
                dataField: 'ClientName',
                visible: true,
            }, {
                dataField: 'TotalMembers',
                visible: true,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value;//.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'BrokerID',
                visible: true,
                lookup: {
                    dataSource: SmartLife.Brokers, valueExpr: 'id', displayExpr: 'name'
                },
            }, {
                dataField: 'StatusDescription',
                visible: true,
            }, {
                dataField: 'QuotationDate',
                visible: true,
                dataType: 'date'
            }
        ],

        open_loan: function (e) {
            var data = [{ rcd_id: e.data.ID }];
            //console.log(data);
            viewModel.navigateForward("quote_group_form", JSON.stringify(data));
        }


    };

    return viewModel;
};