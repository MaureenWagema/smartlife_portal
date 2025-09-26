SmartLife.sales = function (params) {
    "use strict";
    var formSearchDetailsInstance;
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });
    var params_url = "reports/getSalesTotalsRange";


    function plan_changed(e) {
        if (e.value == "M") {
            alert("hide");
            viewModel.dxFormOptions.items[0].editorOptions.visible(false);
        } else {
            alert("show");
            viewModel.dxFormOptions.items[0].editorOptions.visible(true);
        }

    }

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
        LoadPanelShown: ko.observable(false),
        refresh_list: function () {
            viewModel.viewShown();
        },
        viewShown: function () {
            viewModel.get_access_roles();
            let data = formSearchDetailsInstance.option("formData");


            $('#SubmittedCases').click(function () {
                if (data['date_from'] != undefined && data['date_to'] != null && data['date_to'] != '') {
                    viewModel.navigateForward("sales_grid_summary", JSON.stringify({
                        'date_from': viewModel.formatDate(new Date(data['date_from'])),
                        'date_to': viewModel.formatDate(new Date(data['date_to'])),
                        'data_type': "1"
                    }));
                } else {
                    DevExpress.ui.dialog.alert("Search for data first");
                }
            });

            $('#InceptedCases').click(function () {
                if (data['date_from'] != undefined && data['date_to'] != null && data['date_to'] != '') {
                    let data = formSearchDetailsInstance.option("formData");
                    viewModel.navigateForward("sales_grid_summary", JSON.stringify({
                        'date_from': viewModel.formatDate(new Date(data['date_from'])),
                        'date_to': viewModel.formatDate(new Date(data['date_to'])),
                        'data_type': "2"
                    }));
                } else {
                    DevExpress.ui.dialog.alert("Search for data first");
                }
            });

            $('#MicroSubmittedCases').click(function () {
                if (data['date_from'] != undefined && data['date_to'] != null && data['date_to'] != '') {
                    let data = formSearchDetailsInstance.option("formData");
                    viewModel.navigateForward("sales_grid_summary", JSON.stringify({
                        'date_from': viewModel.formatDate(new Date(data['date_from'])),
                        'date_to': viewModel.formatDate(new Date(data['date_to'])),
                        'data_type': "3"
                    }));
                } else {
                    DevExpress.ui.dialog.alert("Search for data first");
                }
            });

            $('#MicroInceptedCases').click(function () {
                if (data['date_from'] != undefined && data['date_to'] != null && data['date_to'] != '') {
                    let data = formSearchDetailsInstance.option("formData");
                    viewModel.navigateForward("sales_grid_summary", JSON.stringify({
                        'date_from': viewModel.formatDate(new Date(data['date_from'])),
                        'date_to': viewModel.formatDate(new Date(data['date_to'])),
                        'data_type': "4"
                    }));
                } else {
                    DevExpress.ui.dialog.alert("Search for data first");
                }
            });





            //viewModel.get_access_roles();
            //get agents month sales
            //viewModel.get_agent_sales();
            //viewModel.get_product_totals();
            //viewModel.get_totals();
        },

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
            });//params_url
            get_life.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.ILSubmittedCases(result.ILSubmittedCases);
                    viewModel.ILInceptedCases(result.ILInceptedCases);
                    viewModel.MicroSubmittedCases(result.MicroSubmittedCases);
                    viewModel.MicroInceptedCases(result.MicroInceptedCases);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        /*get_totals: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching the totals"
            });
            get_life.DBget("reports/getMainDashboardTotals").done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.lblActiveILPolicies(result.ActiveILPolicies);
                    viewModel.lblActiveMicroPolicies(result.ActiveMicroPolicies);
                    viewModel.lblActiveGroupSchemes(result.ActiveGroupPolicies);
                    viewModel.lblActiveAgents(result.ActiveAgents);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },*/



        ILSubmittedCases: ko.observable(0),
        ILInceptedCases: ko.observable(0),
        MicroSubmittedCases: ko.observable(0),
        MicroInceptedCases: ko.observable(0),

        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {

            });
        },

        notifications_Store: ko.observableArray([{ date_added: '19/05/2022', title: 'Quartely Statements', content: 'I trust you are well, Q1 statements sent today', stage_name: 'Delivered' },
        { date_added: '01/06/2022', title: 'GLICO Q1 Updates', content: 'If you missed yesterdays Webinar, you can catch up with the conversation.', stage_name: 'Delivered' }]),

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
                        editOptions: {
                            displayFormat: 'dd/MM/yyyy'
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
                        editOptions: {
                            displayFormat: 'dd/MM/yyyy'
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
                                    params_url = "reports/getSalesTotalsRange?date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                        "&date_to=" + viewModel.formatDate(new Date(data['date_to'])) + "&is_cso=1";
                                    viewModel.get_totals();
                                }
                            }
                        }
                    }
                ],
            }],

        },
        ///////////end of search entry/////

        alerts_store: ko.observableArray([]),
        alerts_columns: [
            {
                dataField: 'usr_id',
                width: 'auto',
                visible: false
            },
            {
                dataField: 'type',
                caption: 'Type',
                width: 'auto',
                visible: true
            },
            {
                dataField: 'amount',
                width: 'auto',
                visible: true
            },
            {
                dataField: 'expiry',
                caption: 'Duration',
                width: 'auto'
            }
        ],



        dxFormOptions: {
            colCount: 2,
            items: [{
                dataField: "ID",
                editorOptions: {
                    visible: ko.observable(true)
                }
            }, {
                label: {
                    text: "Gender"
                },
                editorType: "dxLookup",
                dataField: "gender_code",
                editorOptions: {
                    value: '',
                    dataSource: SmartLife.Genderinfo,
                    displayExpr: 'Desc',
                    valueExpr: 'Code',
                    onValueChanged: plan_changed,
                },
                validationRules: [{
                    type: "required",
                    message: "Gender is required"
                }]
            }
            ]
        },


        dashboard_data: ko.observableArray([{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1 }]),
        chartOptions: {
            dataSource: [{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1 }],
            series: {
                argumentField: "code",
                valueField: "tot_ref",
                name: "Reports",
                type: "bar",
                color: '#ffaa66'
            }
        },


        barchartOptions: {
            dataSource: [],
            series: {
                argumentField: "PlanDesc",
                valueField: "total",
                name: "Products",
                type: "bar",
                color: '#ffaa66'
            }
        },

        piechartOptions: {
            size: {
                height: 500
            },
            palette: "bright",
            dataSource: [],//[{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1 }],
            series: [
                {
                    argumentField: "PlanDesc",
                    valueField: "total",
                    label: {
                        visible: true,
                        connector: {
                            visible: true,
                            width: 1
                        },
                        indent: 30,
                        format: {
                            type: "fixedPoint"
                        },
                        customizeText: function (arg) {
                            return arg.valueText;
                        }
                    }
                }
            ],
            title: " Micro & Life Product Breakdown ",
            "export": {
                enabled: true
            },
            onPointClick: function (e) {
                var point = e.target;

                toggleVisibility(point);
            },
            onLegendClick: function (e) {
                var arg = e.target;

                toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
            }
        },
        toggleVisibility: function (item) {
            item.isVisible() ? item.hide() : item.show();
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
        //source_type
        analysis_columns: [
            {
                allowEditing: false,
                dataField: 'source_type',
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
                dataType: 'number',
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