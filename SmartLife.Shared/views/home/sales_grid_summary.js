SmartLife.sales_grid_summary = function (params) {
    var get_data = JSON.parse(params.item);
    var date_from;
    if (get_data['date_from'] != undefined) date_from = get_data['date_from'];
    var date_to;
    if (get_data['date_to'] != undefined) date_to = get_data['date_to'];
    var data_type;
    if (get_data['data_type'] != undefined) data_type = get_data['data_type'];

    var formSearchDetailsInstance;
    var params_url = "reports/getSalesGridRange";
    var lblCommissionPayble = "Complete Sales: ";
    var completeAmount = 0;

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
        go_back: function () {
            SmartLife.app.back();
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
        formatSummary: function (value) {
            const formattedValue = value.toFixed(2);
            return Number(formattedValue).toLocaleString();
        },
        reformatDate: function (dateStr) {
            // Split the input date string by the '-' character
            let [year, month, day] = dateStr.split('-');

            // Return the date in the desired format
            return `${day}/${month}/${year}`;
        },
        LoadPanelShown: ko.observable(false),
        vs_credit_life: ko.observable(false),
        lblheader: ko.observable(""),
        lblsubheader: ko.observable("Individual Life"),
        complete_total: ko.observable(lblCommissionPayble + completeAmount),
        get_analysis: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get the all sales analysis"
            });
            //"commissions.php?transactions=1&agent_no=
            get_form.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    if (data_type == "1") {
                        viewModel.vs_credit_life(true);
                        viewModel.lblsubheader("Individual Life");
                        viewModel.lblheader("INDIVIDUAL LIFE SUBMITTED CASES SALES BETWEEN: " +
                            viewModel.reformatDate(date_from) + " AND " + viewModel.reformatDate(date_to));
                        viewModel.analysis_store(result.ILSubmittedCases);
                        viewModel.cl_analysis_store(result.CLILSubmittedCases);
                    }
                    if (data_type == "2") {
                        viewModel.vs_credit_life(true);
                        viewModel.lblsubheader("Individual Life");
                        viewModel.lblheader("INDIVIDUAL LIFE INCEPTED CASES SALES BETWEEN: " +
                            viewModel.reformatDate(date_from) + " AND " + viewModel.reformatDate(date_to));
                        viewModel.analysis_store(result.ILInceptedCases);
                        viewModel.cl_analysis_store(result.CLILInceptedCases);
                    }
                    if (data_type == "3") {
                        viewModel.lblsubheader("Micro Insurance");
                        viewModel.lblheader("MICRO SUBMITTED CASES SALES BETWEEN: " +
                            viewModel.reformatDate(date_from) + " AND " + viewModel.reformatDate(date_to));
                        viewModel.analysis_store(result.MicroSubmittedCases);
                    }
                    if (data_type == "4") {
                        viewModel.lblsubheader("Micro Insurance");
                        viewModel.lblheader("MICRO INCEPTED CASES SALES BETWEEN: " +
                            viewModel.reformatDate(date_from) + " AND " + viewModel.reformatDate(date_to));
                        viewModel.analysis_store(result.MicroInceptedCases);
                    }
                    //completeAmount = result.Totals[0].totals;
                    //viewModel.complete_total(lblCommissionPayble + completeAmount);
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
            //TODO
            //params_url = "agents/getAgentCommission?agent_no=" + SmartLife.agent_no +
            //"&period_year=" + result.AgentPeriod.period_year + "&Period_month=" + result.AgentPeriod.Period_month
            //viewModel.get_analysis();
            params_url = "reports/getSalesGridRange?&date_from=" + date_from + "&date_to=" + date_to;
            viewModel.get_analysis();
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
            items: [

                {
                    itemType: 'group',
                    caption: 'Search',
                    colCount: 4,
                    items: [
                        /*{
                            label: {
                                text: "Source"
                            },
                            editorType: "dxLookup",
                            dataField: "SourceType",
                            editorOptions: {
                                searchEnabled: false,
                                showCancelButton: false,
                                closeOnOutsideClick: true,
                                dataSource: [{ id: 1, name: 'Individual Life' }, { id: 2, name: 'Micro' }, { id: 3, name: 'Group' }],
                                displayExpr: 'name',
                                valueExpr: 'id',
                                value: 1
                            },
                        },*/
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
                                message: "Date FROM is required"
                            }]
                        }, {
                            label: {
                                text: "TO"
                            },
                            editorType: "dxDateBox",
                            dataField: "date_to",
                            editorOptions: {
                                value: Date()
                            },
                            validationRules: [{
                                type: "required",
                                message: "Date TO is required"
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
                                        params_url = "reports/getAllSales?n=1&agent_no=" + SmartLife.agent_no +
                                            "&date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                            "&date_to=" + viewModel.formatDate(new Date(data['date_to']));
                                        viewModel.get_analysis();
                                    }
                                }
                            }
                        }
                    ],
                }],

        },

        analysis_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        //policy_no, ReceiptNoOLD, received, BasicPay, OverrideComm, OverrideRate
        analysis_columns: [
            {
                allowEditing: false,
                dataField: 'source_type',
                visible: false,
                //groupIndex: 0,
            }, {
                allowEditing: false,
                dataField: 'currency',
                lookup: {
                    dataSource: SmartLife.Currency, valueExpr: 'currency_code', displayExpr: 'description'
                },
                visible: true,
                groupIndex: 0,
            },
            {
                allowEditing: false,
                dataField: 'description',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'PlanDesc',
                //dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'plan_code',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'total',
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
                dataField: 'TotalPremium',
                caption: 'Monthly Expected Premium',
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
                dataField: 'YearlyTotalPremium',
                caption: 'Yearly Expected Premium',
                visible: true,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }
        ],

        ////////credit life grid.....
        cl_analysis_store: ko.observableArray(),
        cl_analysis_columns: [
            {
                allowEditing: false,
                dataField: 'source_type',
                visible: false,
                //groupIndex: 0,
            },
            {
                allowEditing: false,
                dataField: 'currency',
                lookup: {
                    dataSource: SmartLife.Currency, valueExpr: 'currency_code', displayExpr: 'description'
                },
                visible: true,
                groupIndex: 0,
            },
            {
                allowEditing: false,
                dataField: 'description',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'PlanDesc',
                //dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'plan_code',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'total',
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
                dataField: 'TotalPremium',
                caption: 'Monthly Expected Premium',
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
                dataField: 'YearlyTotalPremium',
                caption: 'Yearly Expected Premium',
                visible: true,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }
        ],
    };

    return viewModel;
};