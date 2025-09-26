SmartLife.AgentOfficeSales = function (params) {
    //"use strict";
    var formSearchDetailsInstance;
    var params_url = "reports/getUnitSales?";
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
                    viewModel.analysis_store(result.MicroUnitsTotals);
                    viewModel.life_analysis_store(result.lifeUnitsTotals);
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
            items: [{
                itemType: 'group',
                caption: 'Search',
                colCount: 4,
                items: [
                    {
                        label: {
                            text: "FROM"
                        },
                        editorType: "dxDateBox",
                        dataField: "date_from",
                        validationRules: [{
                            type: "required",
                            message: "FROM is required"
                        }]
                    }, {
                        label: {
                            text: "TO"
                        },
                        editorType: "dxDateBox",
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
                                    params_url = "reports/getUnitSales?agent_no=" + SmartLife.agent_no +
                                        "&date_from=" + viewModel.formatDate(data['date_from']) +
                                        "&date_to=" + viewModel.formatDate(data['date_to']);
                                    viewModel.get_analysis();
                                }
                            }
                        }
                    }
                ],
            }],

        },

        analysis_store: ko.observableArray(),
        analysis_columns: [
            {
                allowEditing: false,
                dataField: 'team_name',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'team',
                //dataType: 'date',
                visible: true,
                groupIndex: 0,
            },
            {
                allowEditing: false,
                dataField: 'product_name',
                visible: true,
            },
            {
                allowEditing: false,
                dataField: 'PlanDesc',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'total_sold',
                visible: true
            }
        ],
        life_analysis_store: ko.observableArray(),
        life_analysis_columns: [
            {
                allowEditing: false,
                dataField: 'team_name',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'team',
                visible: true,
                groupIndex: 0
            },
            {
                allowEditing: false,
                dataField: 'product_name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'PlanDesc',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'total_sold',
                visible: true
            }
        ],

    };

    return viewModel;
};