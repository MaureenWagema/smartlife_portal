SmartLife.commissions = function (params) {
    //"use strict";

    var viewModel = {
        //  Put the binding properties here
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        //settings for toast...
        // 'custom' | 'error' | 'info' | 'success' | 'warning' 
        toast_msg: ko.observable(''),
        toast_type: ko.observable(''),
        isToastVisible: ko.observable(false),
        show_test: function (msg, type) {
            viewModel.toast_msg(msg);
            viewModel.toast_type(type);
            viewModel.isToastVisible(true);
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
        LoadPanelShown: ko.observable(false),
        get_all_commissions: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get all allocated commissions"
            });
            get_form.DBget("commissions.php?transactions=1&agent_no=" + SmartLife.agent_code).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.status == true) {
                    viewModel.commissions_store(result.Trans);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        viewShown: function () {
            //TODO
            //1. Get Checklist types.
            viewModel.get_all_commissions();
        },

        ///transaction pop up///
        transactionsVisible: ko.observable(false),
        transactions_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        //policy_no, ReceiptNoOLD, received, BasicPay, OverrideComm, OverrideRate
        transactions_columns: [
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'ReceiptNoOLD',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'received',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'BasicPay',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'OverrideComm',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'OverrideRate',
                visible: true
            }
        ],
        ///end of transaction pop up//

        commissions_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        commissions_columns: [
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'payment_date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'agent_noOLD',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'Post_Date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'comm_payable',
                visible: true
            }
            /*{
                allowEditing: false,
                dataField: 'OverrideRate',
                visible: true
            },
            {
                allowEditing: false,
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
                dataField: 'period_year',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'period_month',
                visible: true
            }, {
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
                                        "name": "Transactions",
                                        "icon": "mdi mdi-eye"

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
                                //view a pop up with the transactions for that allocation
                                viewModel.LoadPanelShown(true);
                                var get_form = new DB({
                                    name: "get transactions for commissions"
                                });
                                get_form.DBget("commissions.php?agent_no=" + SmartLife.agent_code).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.status == true) {
                                        viewModel.transactions_store(result.Trans);
                                    } else {
                                        viewModel.show_test(result.msg, 'error');
                                    }
                                }).fail(function () {
                                    viewModel.LoadPanelShown(false);
                                    //alert_dialog("Server not accessible. Check internet connectivity");
                                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                });

                                viewModel.transactionsVisible(true);
                                //viewModel.navigateForward("pay", dta.modal_prem);
                            }
                            
                        }
                    }).appendTo(container);
                }
            }*/
        ]
    };

    return viewModel;
};