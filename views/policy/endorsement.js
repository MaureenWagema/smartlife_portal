SmartLife.endorsement = function (params) {
    "use strict";
    var formEndorsementInstance;
    var formPolicyDetailsInstance;

    var viewModel = {
        //  Put the binding properties here
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
        LoadPanelShown: ko.observable(false),
        viewShown: function () {

        },

        default_visibility: function () {
            formEndorsementInstance.itemOption("pay_method", "visible", false);
            formEndorsementInstance.itemOption("pay_method_change", "visible", false);
            formEndorsementInstance.itemOption("beneficiaries", "visible", false);
        },

        //TODO-Create a form with policy details --- baass

        get_payment_method: function () {
            
            viewModel.LoadPanelShown(true);
            let data = formEndorsementInstance.option("formData");
            let policyId = data['PolicyNumber'];
            var get_form = new DB({
                name: "get existings endorsements"
            });
            get_form.DBget("policy/getPolicyDetails?policyId=" + policyId).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //make benef visible
                    formEndorsementInstance.itemOption("pay_method", "visible", true);
                    formEndorsementInstance.itemOption("pay_method_change", "visible", true);
                    //assign the datasource to it
                    formEndorsementInstance.updateData("pay_method", result.PolicyDetails[0]['pay_method']);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_beneficiaries: function () {
            viewModel.LoadPanelShown(true);
            let data = formEndorsementInstance.option("formData");
            let policyId = data['PolicyNumber'];
            var get_form = new DB({
                name: "get existings endorsements"
            });
            get_form.DBget("policy/getPolicyBeneficiaries?policyId=" + policyId).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //make benef visible
                    formEndorsementInstance.itemOption("beneficiaries", "visible", true);
                    //assign the datasource to it
                    formEndorsementInstance.getEditor("beneficiaries").option("dataSource", result.Beneficiaries);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        //names,dob,mobile,email,anb, plan_code,premium,created_on
        formEndorsementOptions: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formEndorsementInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //names,dob,mobile,email,anb, plan_code,premium,created_on
            items: [
                {
                    label: {
                        text: "Policy Number"
                    },
                    editorType: "dxLookup",
                    dataField: "PolicyNumber",
                    editorOptions: {
                        dataSource: SmartLife.ClientPolicies,
                        displayExpr: 'policy_no',
                        valueExpr: 'id'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Policy Number is required"
                    }]
                }, {//Endorsementtype
                    label: {
                        text: "Endorsement"
                    },
                    editorType: "dxLookup",
                    dataField: "Endorsementtype",
                    editorOptions: {
                        dataSource: SmartLife.EndorsementTypes,
                        displayExpr: 'Description',
                        valueExpr: 'Id',
                        onValueChanged: function (e) {
                            viewModel.default_visibility();
                            //if beneficiary display benef screen and populate the beneficiaries
                            if (e.value == "6") {
                                //display beneficiaries
                                viewModel.get_beneficiaries();
                            }
                            if (e.value == "9") {
                                //display beneficiaries
                                viewModel.get_payment_method();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Plan is required"
                    }]
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },{
                    label: {
                        text: "Payment Method"
                    },
                    editorType: "dxLookup",
                    dataField: "pay_method",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Paymentinfo,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                    }
                }, {
                    label: {
                        text: "Payment Method Change"
                    },
                    editorType: "dxLookup",
                    dataField: "pay_method_change",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Paymentinfo,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                    }
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    label: {
                        text: "BENEFICIARIES / NEXT OF KIN"
                    },
                    visible: false,
                    dataField: "beneficiaries",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: [],
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: true,
                            mode: 'cell',
                            allowAdding: false,
                            allowDeleting: false,
                        },
                        columns: [
                            {
                                allowEditing: false,
                                dataField: 'Names',
                                caption: 'Fullnames'
                            }, {
                                allowEditing: false,
                                dataField: 'relationship',
                                caption: 'Relationship',
                                lookup: {
                                    dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                }
                            }, {
                                allowEditing: false,
                                dataField: 'birth_date',
                                caption: 'Date of Birth',
                                dataType: 'date'
                            }, {
                                allowEditing: false,
                                dataField: 'perc_alloc',
                                caption: '% Allocated'
                            }, {
                                allowEditing: false,
                                dataField: 'MobileNumber',
                                caption: 'Mobile No'
                            }, {
                                dataField: 'comments',
                                caption: 'Changes',
                                width: '300'
                            }
                        ]
                    }
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    label: {
                        text: "Narration"
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
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: "SAVE",
                        horizontalAlignment: "right",
                        icon: "save",
                        type: "default",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                            viewModel.save_endorsement(args);
                        }
                    }
                }]
        },

        save_endorsement: function (args) {
            var result = args.validationGroup.validate();
            //if (result.isValid) {
            //post data here
            ///post data form as it is
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting endorsement"
            });
            let data = $("#formEndorsementOptions").dxForm('instance').option("formData");
            console.log(data);
            get_life.DBpost("policy/saveEndorsement", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    //navigate to the my applications screen
                    SmartLife.app.back();
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
                            //}
        }


    };

    return viewModel;
};