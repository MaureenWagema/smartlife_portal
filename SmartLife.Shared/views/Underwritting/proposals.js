SmartLife.proposals = function (params) {
    "use strict";
    var formSearchDetailsInstance;
    var params_url = "policy/getProposalDetails?criteria=6";

    

    var viewModel = {
        //  Put the binding properties here
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
        viewShown: function () {
            viewModel.get_analysis();
        },

        /////////////search entry//////////
        refresh_list: function () {
            viewModel.viewShown();
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
                //formSearchDetailsInstance
                //formSearchDetailsInstance.updateData("period_year", currentDate.getFullYear());
                //formSearchDetailsInstance.updateData("Period_month", currentDate.getMonth());
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'Search',
                colCount: 4,
                items: [
                    {
                        label: {
                            text: "Source"
                        },
                        editorType: "dxLookup",
                        dataField: "SourceType",
                        editorOptions: {
                            searchEnabled: false,
                            showCancelButton: false,
                            closeOnOutsideClick: true,
                            dataSource: [{ id: 1, name: 'Individual Life' }, { id: 2, name: 'Micro' }],
                            displayExpr: 'name',
                            valueExpr: 'id',
                            value: 1
                        },
                    },
                    {
                        label: {
                            text: "FROM"
                        },
                        editorType: "dxDateBox",
                        dataField: "date_from",
                        editorOptions: {
                            value: Date()
                        },
                        validationRules: [{
                            type: "required",
                            message: "FROM is required"
                        }]
                    }, {
                        label: {
                            text: "TO"
                        },
                        editorType: "dxDateBox",
                        editorOptions: {
                            value: Date()
                        },
                        dataField: "date_to",
                        validationRules: [{
                            type: "required",
                            message: "TO is required"
                        }]
                    },
                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "left",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "Search",
                            horizontalAlignment: "left",
                            verticalAlignment: "bottom",
                            icon: "search",
                            type: "danger",
                            onClick: function (args) {
                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {
                                    //save
                                    let data = formSearchDetailsInstance.option("formData");
                                    //data['criteria'];data['search_entry'] 
                                    if (data['SourceType'] == 2) {
                                        params_url = "policy/getMicroPolicyDetails?criteria=6" +
                                            "&date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                            "&date_to=" + viewModel.formatDate(new Date(data['date_to']));
                                    } else {
                                        params_url = "policy/getProposalDetails?criteria=6" +
                                            "&date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                            "&date_to=" + viewModel.formatDate(new Date(data['date_to']));
                                    }
                                    
                                    viewModel.get_analysis();
                                }
                            }
                        }
                    }
                ],
            }],

        },
        ///////////end of search entry/////
        get_analysis: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get all the proposals"
            });
            //"commissions.php?transactions=1&agent_no=
            get_form.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.analysis_store(result.PolicyDetails);
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

        analysis_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        //policy_no, ReceiptNoOLD, received, BasicPay, OverrideComm, OverrideRate
        analysis_columns: [
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
                dataField: 'TotalPremium',
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
                dataField: 'proposal_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: false
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
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'employee_no',
                caption: 'Staff No',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'agent_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'agent_name',
                visible: false
            }
        ],
    };

    return viewModel;
};