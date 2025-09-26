SmartLife.agent_loan = function (params) {
    "use strict";

    var formLoanlDetailsInstance;
    var rcd_id;
    var get_data;
    if (params.item && params.item !== null && params.item !== undefined && params.item !== '' && params.item.length !== 0) get_data = JSON.parse(params.item);
    console.log(get_data);
    if (get_data != undefined) rcd_id = get_data['rcd_id'];

    var viewModel = {
        //  Put the binding properties here
        go_back: function () {
            SmartLife.app.back();
        },
        // 'custom' | 'error' | 'info' | 'success' | 'warning' 
        toast_msg: ko.observable(''),
        toast_type: ko.observable(''),
        isToastVisible: ko.observable(false),
        show_test: function (msg, type) {
            viewModel.toast_msg(msg);
            viewModel.toast_type(type);
            viewModel.isToastVisible(true);
        },
        LoadPanelShown: ko.observable(false),
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },

        //get loan 
        get_loan: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing loan details"
            });

            get_form.DBget("agents/getAgentLoans?id=" + rcd_id + "&agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    $("#dxFormLoan").dxForm({
                        formData: result.AgentLoans[0]
                    }).dxForm("instance");
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

            if (rcd_id != undefined && parseInt(rcd_id) > 0) {
                viewModel.get_loan();
            }
            
        },


        dxFormLoan: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formLoanlDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                {
                    label: {
                        text: "ID"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "id"
                }, {
                    label: {
                        text: "Loan Type"
                    },
                    editorType: "dxLookup",
                    dataField: "ParaCode",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.ParaCode,
                        displayExpr: 'para_name',
                        valueExpr: 'id'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Loan Type is required"
                    }]
                }, {
                    label: {
                        text: "Amount Applied For"
                    },
                    editorType: "dxNumberBox",
                    dataField: "TotalAmount",
                    validationRules: [{
                        type: "required",
                        message: "Amount Applied For is required"
                    }]
                }, {
                    label: {
                        text: "Repayment Period (Months)"
                    },
                    editorType: "dxNumberBox",
                    dataField: "RepaymentPeriod",
                    validationRules: [{
                        type: "required",
                        message: "Repayment Period (Months) is required"
                    }]
                }, {
                    label: {
                        text: "Narration (Reason for Loan)"
                    },
                    editorType: "dxTextArea",
                    editorOptions: {
                        readOnly: false
                    },
                    dataField: "Narration",
                    validationRules: [{
                        type: "required",
                        message: "Narration is required"
                    }]
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "SUBMIT REQUEST",
                        horizontalAlignment: "right",
                        width: 150,
                        type: "default",
                        onClick: function (args) {

                            //tabsInstance.option("selectedIndex", 1);
                            //TODO.. 
                            //1. if rcd_id is undefined or empty then save and assign the rcd_id-
                            var result = args.validationGroup.validate();

                            if (result.isValid) {
                                //if (rcd_id == undefined || rcd_id == "") {
                                //save
                                ///post data form as it is
                                viewModel.LoadPanelShown(true);
                                let get_life = new DB({
                                    name: "submitting the agent request"
                                });
                                let data = formLoanlDetailsInstance.option("formData");
                                data['PayNo'] = SmartLife.agent_no;
                                data['Status'] = "Submitted";
                                var tableData = { tableData: JSON.stringify(data) };
                                get_life.DBpost("agents/saveAgentLoanRequest", tableData).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        console.log(result.record_id);
                                        //rcd_id = result.record_id;
                                        //navnextPrev(1);
                                        viewModel.go_back();
                                    } else {
                                        viewModel.show_test(result.msg, 'error');
                                    }
                                }).fail(function () {
                                    viewModel.LoadPanelShown(false);
                                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                });
                                //}
                            }
                        }
                    }
                }],
        },


    };

    return viewModel;
};