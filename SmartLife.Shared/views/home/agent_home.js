SmartLife.agent_home = function (params) {
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

    var vs_sector_agents = false;
    var vs_agent_recruitedby = true;
    var vs_office_agents = false;
    var vs_il_position = true;
    var vs_micro_position = false;
    if (SmartLife.channel == 5) {
        vs_micro_position = true;
        vs_il_position = false;
    }

    var lbl_direct_header = SmartLife.agent_office + " AGENTS";
    if (SmartLife.agent_position_id == "4" || SmartLife.agent_position_id == "6") {
        lbl_direct_header = "DIRECT AGENTS";
        vs_office_agents = true;
    }
    if (SmartLife.agent_position_id == "7" || SmartLife.agent_position_id == "8") {
        vs_office_agents = false;
        vs_agent_recruitedby = false;
        vs_sector_agents = true;
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

        vs_office_agents: ko.observable(vs_office_agents),
        vs_agent_recruitedby: ko.observable(vs_agent_recruitedby),
        lbl_agent_recruitedby: ko.observable("Agents You Have Recruited"),
        lbl_direct_header: ko.observable(lbl_direct_header),
        agent_name: ko.observable(SmartLife.agent_name),
        office_position: ko.observable(SmartLife.agent_position + ", " + SmartLife.agent_office),


        get_agent_sales: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching agent sales"
            });
            get_life.DBget("reports/getAgentProducts?agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.record_id);
                    //$("#pie").dxPieChart('instance').option("dataSource", result.Products);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        get_analysis: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching analysis"
            });
            get_life.DBget("reports/getAgentTotals?agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.lblActivePolicies(result.ActivePolicies);
                    viewModel.lblPendingProposals(result.PendingProposals);
                    viewModel.lblActiveClients(result.ActiveClients);
                    viewModel.recruited_store(result.RecruitedAgents);
                    viewModel.direct_agent_store(result.DirectAgents);
                    viewModel.sector_agent_store(result.DirectAgents);
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
            viewModel.get_agent_sales();
            viewModel.get_analysis();
        },

        lblActivePolicies: ko.observable(0),
        lblPendingProposals: ko.observable(0),
        lblActiveClients: ko.observable(0),


        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {

            });
        },

        //////recruited & direct//// office_name
        recruited_store: ko.observableArray(),
        recruited_menu_items: [
            {
                dataField: 'id',
                visible: false
            }, {
                dataField: 'office_name',
                caption: 'Office',
                visible: true,
                groupIndex: 0,
            }, {
                dataField: 'name',
                width: '150',
                visible: true,
            }, {
                dataField: 'AgentNoCode',
                visible: true,

            }, {
                dataField: 'status_name',
                caption: 'Status',
                visible: true,
                groupIndex: 1,
            }, {
                dataField: 'il_position',
                visible: vs_il_position,
            }, {
                dataField: 'micro_position',
                visible: vs_micro_position,
            }, {
                dataField: 'appointed_on',
                visible: true,
                dataType:'date'
            }
        ],
        direct_agent_store: ko.observableArray(),
        direct_menu_items: [
            {
                dataField: 'id',
                visible: false
            },
            /*{
                dataField: 'Region',
                caption: 'Region',
                visible: true,
                groupIndex: 0,
            },
            {
                dataField: 'Branch',
                caption: 'Branch',
                visible: true,
                groupIndex: 1,
            },*/ 
            {
                dataField: 'office_name',
                caption: 'Office',
                visible: true,
                groupIndex: 0,
            }, {
                dataField: 'name',
                width: '150',
                visible: true,
            }, {
                dataField: 'AgentNoCode',
                visible: true,
                
            }, {
                dataField: 'status_name',
                caption: 'Status',
                visible: true,
                groupIndex: 1,
            }, {
                dataField: 'il_position',
                visible: vs_il_position,
            }, {
                dataField: 'micro_position',
                visible: vs_micro_position,
            }, {
                dataField: 'appointed_on',
                visible: true,
                dataType: 'date'
            }
        ],
        ////end of recruited & direct//

        ///////////////sector agent /////////
        vs_sector_agents: ko.observable(vs_sector_agents),
        sector_agent_store: ko.observableArray(),
        sector_menu_items: [
            {
                dataField: 'id',
                visible: false
            }, {
                dataField: 'Sector',
                caption: 'Sector',
                visible: false,
                //groupIndex: 0,
            }, {
                dataField: 'Sector',
                caption: 'Sector',
                visible: true,
                groupIndex: 0,
            }, {
                dataField: 'Branch',
                caption: 'Branch',
                visible: true,
                groupIndex: 1,
            }, {
                dataField: 'office_name',
                caption: 'Office',
                visible: true,
                groupIndex: 2,
            }, {
                dataField: 'name',
                width: '150',
                visible: true,
            }, {
                dataField: 'AgentNoCode',
                visible: true,

            }, {
                dataField: 'status_name',
                caption: 'Status',
                visible: true,
                groupIndex: 3,
            }, {
                dataField: 'il_position',
                visible: vs_il_position,
            }, {
                dataField: 'micro_position',
                visible: vs_micro_position,
            }, {
                dataField: 'appointed_on',
                visible: true,
                dataType: 'date'
            }
        ],
        ///////////end of sector agent///////

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
            title: monthName+ " Sales So Far ",
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