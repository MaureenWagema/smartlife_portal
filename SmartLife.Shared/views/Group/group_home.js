SmartLife.group_home = function (params) {
    "use strict";
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });

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


        LoadPanelShown: ko.observable(false),


        get_agent_sales: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching agent sales"
            });
            get_life.DBget("reports/getAgentProducts?agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.record_id);
                    $("#pie").dxPieChart('instance').option("dataSource", result.Products);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        formatNumberWithCommas: function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        get_analysis: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching analysis"
            });
            get_life.DBget("reports/getSchemeTotMembers?scheme_no=" + SmartLife.scheme_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.lblAllMembers(viewModel.formatNumberWithCommas(result.lblAllMembers));
                    //LblClassName, LblTotalClaims, LblPolicyNo, DateFrom
                    viewModel.LblClassName(result.class);
                    viewModel.LblTotalClaims(result.TotalClaims);
                    viewModel.LblPolicyNo(result.PolicyNo);
                    viewModel.DateFrom(result.DateFrom);
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
            viewModel.get_analysis();
        },

        lblAllMembers: ko.observable(0),
        lblPendingProposals: ko.observable(0),
        lblActiveClients: ko.observable(0),

        //LblClassName, LblTotalClaims, LblPolicyNo, DateFrom
        LblClassName: ko.observable(''),
        LblTotalClaims: ko.observable(''),
        LblPolicyNo: ko.observable(''),
        DateFrom: ko.observable(''),


        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {

            });
        },

        notifications_Store: ko.observableArray([{ date_added: '19/05/2022', title: 'Quartely Statements', content: 'I trust you are well, Q1 statements sent today', stage_name: 'Delivered' },
        { date_added: '01/06/2022', title: 'GLICO Q1 Updates', content: 'If you missed yesterdays Webinar, you can catch up with the conversation.', stage_name: 'Delivered' }]),

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
        piechartOptions: {
            size: {
                width: 500
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
            title: monthName + " Sales So Far ",
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
        }

    };

    return viewModel;
};