SmartLife.policy_admin = function (params) {
    "use strict";
    var params_url = "reports/getPolicyAdminTotals";
    var formSearchDetailsInstance;

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
                        dataField: "date_to",
                        editorOptions: {
                            value: Date()
                        },
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
                                    params_url = "reports/getPolicyAdminTotals?date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                        "&date_to=" + viewModel.formatDate(new Date(data['date_to']));
                                    viewModel.get_totals();
                                }
                            }
                        }
                    }
                ],
            }],

        },
        ///////////end of search entry/////


        LoadPanelShown: ko.observable(false),


        get_product_totals: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching agent sales"
            });
            get_life.DBget("reports/getAllSales").done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.record_id);
                    //$("#pie").dxPieChart('instance').option("dataSource", result.Products);
                    //barchartOptions
                    //$("#bar").dxChart('instance').option("dataSource", result.Products);
                    viewModel.analysis_store(result.Products);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        get_totals: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching the totals"
            });
            get_life.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.lblReceivedILEndorsements(result.lblReceivedILEndorsements);
                    viewModel.lblProcessedILEndorsements(result.lblProcessedILEndorsements);
                    viewModel.lblReceivedMicroEndorsements(result.lblReceivedMicroEndorsements);
                    viewModel.lblProcessedMicroEndorsements(result.lblProcessedMicroEndorsements);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        viewShown: function () {
            viewModel.get_access_roles();
            //get agents month sales
            //viewModel.get_agent_sales();
            //viewModel.get_product_totals();
            viewModel.get_totals();
        },

        lblReceivedILEndorsements: ko.observable(0),
        lblProcessedILEndorsements: ko.observable(0),
        lblReceivedMicroEndorsements: ko.observable(0),
        lblProcessedMicroEndorsements: ko.observable(0),

        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {

            });
        },


        //[47.27, 65.32, 84.59, 71.86]
        barGaugeOptions: {
            startValue: 0,
            endValue: 100,
            values: [47.27, 65.32, 84.59, 71.86],
            label: {
                indent: 30,
                format: {
                    type: "fixedPoint",
                    precision: 1
                },
                customizeText: function (arg) {
                    return arg.valueText + " %";
                }
            },
            "export": {
                enabled: true
            },
            title: {
                text: "Reports' Ratings",
                font: {
                    size: 28
                }
            }
        },



        analysis_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        //policy_no, ReceiptNoOLD, received, BasicPay, OverrideComm, OverrideRate
        analysis_columns: [
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
                dataType: 'number',
                visible: true
            }
        ],

    };

    return viewModel;
};