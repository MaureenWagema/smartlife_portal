SmartLife.agent_home = function (params) {
    "use strict";
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
        LoadPanelShown: ko.observable(false),
        viewShown: function () {
            viewModel.get_access_roles();
        },

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
            dataSource: [{ code: 'ESB', tot_ref: 3 }, { code: 'GEEP', tot_ref: 5 }, { code: 'GFP', tot_ref: 2 }, { code: 'GLS', tot_ref: 1 }],
            series: [
                {
                    argumentField: "code",
                    valueField: "tot_ref",
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
            title: "EXPORT",
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