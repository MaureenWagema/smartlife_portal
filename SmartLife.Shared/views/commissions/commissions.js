SmartLife.commissions = function (params) {
    //"use strict";
    var formSearchDetailsInstance;
    var params_url = "agents/getAgentCommission?agent_no=" + SmartLife.agent_no;
    var lblCommissionPayble = "Commission Payable: ";
    var commissionAmount = 0;
    var vs_claw_back = false;

    let PayrollCategory = 1;
    let FinancialAdvisorCategory = 1;
    var is_micro = 0;
    if (SmartLife.channel == 5) {
        is_micro = 1;
        FinancialAdvisorCategory = 2;
    }

    var OfficeAgents = [];
    var vs_office_agents = false;
    if (SmartLife.agent_position_id == "4" || SmartLife.agent_position_id == "8" ||
        SmartLife.agent_position_id == "6" || SmartLife.agent_position_id == "7") {
        
        vs_office_agents = true;
        if (SmartLife.agent_position_id == "8") {
            vs_claw_back = true;
        }
    }



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
        commission_payable: ko.observable(lblCommissionPayble + commissionAmount),
        get_all_commissions: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get all allocated commissions"
            });
            //"commissions.php?transactions=1&agent_no=
            get_form.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.override_commissions_store(result.AgentOverrideCommission);
                    viewModel.commissions_store(result.AgentCommission);
                    if (result.AgentTotals.length > 0) {
                        commissionAmount = result.AgentTotals[0].total_sum;
                    }
                    viewModel.commission_payable(lblCommissionPayble + parseFloat(commissionAmount).toFixed(2));
                    viewModel.payslip_store(result.PaySlip);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        get_params: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get current period"
            });
            //"commissions.php?transactions=1&agent_no=
            get_form.DBget("agents/getAgentPeriod?agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    formSearchDetailsInstance.updateData("period_year", result.AgentPeriod.period_year);
                    //formSearchDetailsInstance.updateData("Period_month", result.AgentPeriod.Period_month);

                    params_url = "agents/getAgentCommission?agent_no=" + SmartLife.agent_no +
                        "&period_year=" + result.AgentPeriod.period_year + "&Period_month=" + result.AgentPeriod.Period_month +
                        "&FinancialAdvisorCategory=" + FinancialAdvisorCategory + "&PayrollCategory=" + PayrollCategory;
                    viewModel.get_all_commissions();
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
            //1. Get from the category the current year and month
            //2. get the comissions for the current year and month

            //viewModel.get_all_commissions();
            viewModel.get_params();

            if (vs_office_agents) {
                formSearchDetailsInstance.itemOption("office_agents", "visible", true);
                viewModel.get_analysis();
            }
        },

        get_analysis: function () {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching analysis"
            });
            get_life.DBget("reports/getAgentTotals?agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //viewModel.lblActivePolicies(result.ActivePolicies);
                    //viewModel.lblPendingProposals(result.PendingProposals);
                    //viewModel.lblActiveClients(result.ActiveClients);
                    //viewModel.recruited_store(result.RecruitedAgents);
                    //viewModel.direct_agent_store(result.DirectAgents);
                    //change the datasource here...
                    vs_office_agents = true;
                    OfficeAgents = result.DirectAgents.filter(agent => (agent.StatusCode == "1"));
                    formSearchDetailsInstance.getEditor("office_agents").option("dataSource", OfficeAgents);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
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
                caption: 'SmartLife Search',
                colCount: 4,
                items: [
                    {
                        colSpan: 4,
                        label: {
                            text: "Agent"
                        },
                        editorType: "dxLookup",
                        visible: vs_office_agents,
                        dataField: "office_agents",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            dataSource: OfficeAgents,
                            displayExpr: 'name',
                            valueExpr: 'AgentNoCode',
                        }
                    },
                    ///put the type of commission - Expected & Accumulated
                    {
                        label: {
                            text: "Type"
                        },
                        editorType: "dxLookup",
                        visible:false,
                        dataField: "CommissionType",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            width: '200',
                            dataSource: [{ id: 1, name: 'Expected Commission' }, { id: 2, name: 'Accumulated Commission' }],
                            displayExpr: 'name',
                            valueExpr: 'id',
                            onValueChanged: function (e) {
                                //viewModel.getPaySourceRawData(e.value);
                                
                                if (e.value == 1) {
                                    //TODO - hide the entire search
                                    formSearchDetailsInstance.itemOption("SmartLife Search.PayrollCategory", "visible", false);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.period_year", "visible", false);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.Period_month", "visible", false);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.btnSearch", "visible", false);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.btnStatement", "visible", false);
                                } else {

                                    //display the rest of the search...
                                    formSearchDetailsInstance.itemOption("SmartLife Search.PayrollCategory", "visible", true);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.period_year", "visible", true);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.Period_month", "visible", true);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.btnSearch", "visible", true);
                                    formSearchDetailsInstance.itemOption("SmartLife Search.btnStatement", "visible", true);
                                }

                            }
                        },
                    },
                    {
                        label: {
                            text: "Commission Type"
                        },
                        editorType: "dxLookup",
                        dataField: "PayrollCategory",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            dataSource: SmartLife.PyPayrollCategory,
                            displayExpr: 'Description',
                            valueExpr: 'id',
                            width: '200',
                            value: 1
                        },
                        validationRules: [{
                            type: "required",
                            message: "Period Year is required"
                        }]
                    },
                    {
                        label: {
                            text: "Period Year"
                        },
                        editorType: "dxNumberBox",
                        dataField: "period_year",
                        editorOptions: {
                            width: '180'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Period Year is required"
                        }]
                    }, {
                        label: {
                            text: "Period Month"
                        },
                        editorType: "dxNumberBox",
                        dataField: "Period_month",
                        editorOptions: {
                            width: '180'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Period Month is required"
                        }]
                    },
                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "right",
                        dataField: "btnSearch",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "Search",
                            horizontalAlignment: "right",
                            verticalAlignment: "bottom",
                            icon: "search",
                            type: "danger",
                            width: '180',
                            /*elementAttr: {
                                class: "buttonPrimary"
                            },*/
                            onClick: function (args) {
                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {
                                    //save
                                    let data = formSearchDetailsInstance.option("formData");
                                    let office_agent = SmartLife.agent_no;
                                    if(data['office_agents'] != null && data['office_agents'] != undefined &&
                                        data['office_agents'] != "") {
                                        office_agent = data['office_agents'];
                                    }
                                    //data['criteria'];data['search_entry']
                                    params_url = "agents/getAgentCommission?agent_no=" + office_agent +
                                        "&period_year=" + data['period_year'] + "&Period_month=" + data['Period_month'] +
                                        "&FinancialAdvisorCategory=" + FinancialAdvisorCategory + "&PayrollCategory=" + data['PayrollCategory'];
                                    viewModel.get_all_commissions();
                                    viewModel.get_clawback_details(data['office_agents']);
                                }
                            }
                        }
                    },
                    {
                        label: {
                            text: "Action"
                        },
                        visible: false,
                        itemType: "button",
                        horizontalAlignment: "left",
                        dataField: "btnStatement",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "PaySlip",
                            horizontalAlignment: "left",
                            verticalAlignment: "bottom",
                            icon: "doc",
                            type: "normal",
                            /*elementAttr: {
                                class: "buttonPrimary"
                            },*/
                            onClick: function (args) {
                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {
                                    //save
                                    let data_form = formSearchDetailsInstance.option("formData");
                                    //data['criteria'];data['search_entry']
                                    /*params_url = "agents/getAgentCommission?agent_no=" + SmartLife.agent_no +
                                        "&period_year=" + data['period_year'] + "&Period_month=" + data['Period_month'];
                                    viewModel.get_all_commissions();*/
                                    
                                    //TODO - if is micro or bancassurance can change
                                    if (is_micro) FinancialAdvisorCategory = 2;

                                    //dta.policy_no
                                    var data = {
                                        "agent_no": SmartLife.agent_no, "settings": 12, "FinancialAdvisorCategory": FinancialAdvisorCategory,
                                        "PayrollCategory": data_form['PayrollCategory'], "period_year": data_form['period_year'],
                                        "period_month": data_form['Period_month']
                                    };
                                    viewModel.navigateForward("reports", JSON.stringify(data));

                                }
                            }
                        }
                    }
                ],
            }],

        },

        preview_payslip: function () {
            let data_form = formSearchDetailsInstance.option("formData");
            //data['criteria'];data['search_entry']
            /*params_url = "agents/getAgentCommission?agent_no=" + SmartLife.agent_no +
                "&period_year=" + data['period_year'] + "&Period_month=" + data['Period_month'];
            viewModel.get_all_commissions();*/

            //TODO - if is micro or bancassurance can change
            if (is_micro) FinancialAdvisorCategory = 2;

            let period_month = parseInt(data_form['Period_month']) + 1;

            //dta.policy_no, data_form['PayrollCategory']
            var data = {
                "agent_no": SmartLife.agent_no, "settings": 12, "FinancialAdvisorCategory": FinancialAdvisorCategory,
                "PayrollCategory": 1, "period_year": data_form['period_year'],
                "period_month": period_month
            };
            viewModel.navigateForward("reports", JSON.stringify(data));
        },

        
        ///transaction pop up///
        transactionsVisible: ko.observable(false),
        transactions_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        //policy_no, ReceiptNoOLD, received, BasicPay, OverrideComm, OverrideRate
        transactions_columns: [
            {
                allowEditing: false,
                dataField: 'client_name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'payment_date',
                dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'ReceiptNoOLD',
                visible: false
            },//
            {
                allowEditing: false,
                dataField: 'received',
                caption: 'Premium',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                allowEditing: false,
                dataField: 'current_premiums',
                caption: 'Premium Count',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(0);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'comm_payable',
                caption: 'Commission Payable',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'overrideComm1',
                caption: 'Override Commission',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: false//FinancialAdvisorCategory
            },
            {
                allowEditing: false,
                dataField: 'FinancialAdvisorCategory',
                caption: 'Category',
                visible: false//FinancialAdvisorCategory
            }
        ],
        ///end of transaction pop up//

        override_commissions_store: ko.observableArray(),
        override_transactions_columns: [
            {
                allowEditing: false,
                dataField: 'client_name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'payment_date',
                dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'ReceiptNoOLD',
                visible: false
            },//
            {
                allowEditing: false,
                dataField: 'received',
                caption: 'Premium',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                allowEditing: false,
                dataField: 'current_premiums',
                caption: 'Premium Count',
                
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'comm_payable',
                caption: "Agent's Commission",
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'overRate1',
                caption: "Override Rate",
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'overrideComm1',
                caption: 'Override Commission',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true//FinancialAdvisorCategory
            },
            {
                allowEditing: false,
                dataField: 'FinancialAdvisorCategory',
                caption: 'Category',
                visible: false//FinancialAdvisorCategory
            }
        ],

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
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'Post_Date',
                visible: true
            }
            /*,
            {
                allowEditing: false,
                dataField: 'received',
                caption: 'Premium',
                visible: false
            }*/,
            {
                allowEditing: false,
                dataField: 'comm_payable',
                visible: true
            }
        ],

        //Add grid for payslip here....
        payslip_store: ko.observableArray(),
        payslip_columns: [
            {
                allowEditing: false,
                dataField: 'PAYSLIP_NAME',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'AMOUNT',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }
        ],

        //clawback details////clawback....////
        get_clawback_details: function (agent_no) {
            viewModel.LoadPanelShown(true);
            let get_agent_details = new DB({
                name: "getting agent details"
            });
            get_agent_details.DBget("agents/getAgentDetails?agent_no=" + agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {

                    viewModel.clawback_store(result.AgentClawBack);

                    console.log(result.AgentDetails);
                    rcd_id = result.AgentDetails[0].id;
                    $("#dxFormAccount").dxForm({
                        formData: result.AgentDetails[0]
                    }).dxForm("instance");

                } else {
                    viewModel.LoadPanelShown(false);
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        vs_claw_back: ko.observable(vs_claw_back),
        clawback_store: ko.observable(),
        clawback_columns: [
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'Clawbackamount',
                caption: 'Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                allowEditing: false,
                dataField: 'IsBasicCommission',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'IsDirectOverride',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'IsFamilyDirectOverride',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'Isactive',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'claim_no',
                caption: "Reason",
                visible: true
            }, {
                allowEditing: false,
                dataField: 'PayslipProcessed',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'PeriodYear',
                caption: "PayRoll Year",
                visible: true
            }, {
                allowEditing: false,
                dataField: 'PeriodMonth',
                caption: "PayRoll Month",
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'created_on',
                dataType: 'date',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }
        ],
        onrowPrepared: function (e) {
            //if (IsIL) {
            if (e.data != undefined) {
                /*if (e.data.StatusDescription == "DRAFT")
                    e.rowElement.css('background', '#00ffff');// blue
                else if (e.data.StatusDescription == "SUBMITTED")
                    e.rowElement.css('background', '#ffff00');//yellow
                    */
                if (e.data.PayslipProcessed == "0")
                    e.rowElement.css('background', '#ff4000');//red

            }
            //}
            /*if (IsMicro) {
                if (e.data != undefined) {
                    if (e.data.Status == "6")
                        e.rowElement.css('background', '#bfff00');//green
                    else if (e.data.Status == "7" || e.data.UwCode == "8")
                        e.rowElement.css('background', '#ff4000');//red

                }
            }*/
        },
        ///end of clawback....////


    };

    return viewModel;
};