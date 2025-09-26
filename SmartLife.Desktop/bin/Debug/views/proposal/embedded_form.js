SmartLife.embedded_form = function (params) {
    "use strict";
    var formPolicyDetailsInstance;
    let rcd_id;// = params.item;

    var get_data = JSON.parse(params.item);
    var plan_code = get_data['plan_code'];
    if (get_data['id'] != undefined) rcd_id = get_data['id'];
    var rd_form = get_data['rd_form'];

    var Bank = SmartLife.Banks.filter(bank => (bank.bank_code == "NIB"));
    var BanksBranches = SmartLife.BanksBranches;

    var viewModel = {
//  Put the binding properties here

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
        navigateForward: function (dxview, data) {
            SmartLife.app.navigate({
                view: dxview,
                item: data,
                id: 1
            });
        },
        formatDates: function (input) {
            if (input === undefined || input === '' || input === null) {
                return null;
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
        go_back: function () {
            SmartLife.app.back();
        },
        LoadPanelShown: ko.observable(false),

        get_details: function () {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting single record"
            });
            get_records.DBget("policy/getProposal?record_id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.policy_arr);
                    $("#dxFormPolicy").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    //format the dob date here
                    //formPolicyDetailsInstance.getEditor("beneficiaries").option("dataSource", result.beneficiaries);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        InsuranceCoverTypes: ko.observableArray(),
        get_cover_types: function () {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting insurance covers"
            });
            get_records.DBget("params/getInsuranceCoverTypes?Plan_code=" + plan_code).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //format the dob date here
                    viewModel.InsuranceCoverTypes(result.InsuranceCoverTypes);
                    formPolicyDetailsInstance.getEditor("InsuranceType").option("dataSource", result.InsuranceCoverTypes);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        viewShown: function () {
            viewModel.get_cover_types();
            if (parseInt(rcd_id) > 0) {
                //get client details
                viewModel.get_details();
            }
        },

        //form for policy details
        dxFormPolicyDetails: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: rd_form,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formPolicyDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                {
                    label: {
                        text: "ID"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "ID"
                }, {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    label: {
                        text: "Identity Type"
                    },
                    editorType: "dxLookup",
                    dataField: "id_type",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.IDTypes,
                        displayExpr: 'description',
                        valueExpr: 'id_type'
                    },
                    /*validationRules: [{
                        type: "required",
                        message: "Identity Type is required"
                    }]*/
                }, {
                    label: {
                        text: "Identity No"
                    },
                    editorType: "dxTextBox",
                    dataField: "IdNumber",
                    /*validationRules: [{
                        type: "required",
                        message: "Identity No is required"
                    }]*/
                }, {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxNumberBox",
                    dataField: "mobile",
                    validationRules: [{
                        type: "required",
                        message: "Mobile is required"
                    }]
                }, {
                    label: {
                        text: "Title"
                    },
                    editorType: "dxLookup",
                    dataField: "title",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.titleInfo,
                        displayExpr: 'description',
                        valueExpr: 'Code'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Title is required"
                    }]
                },
                {
                    label: {
                        text: "Surname"
                    },
                    editorType: "dxTextBox",
                    dataField: "surname",
                    validationRules: [{
                        type: "required",
                        message: "Surname is required"
                    }]
                }, {
                    label: {
                        text: "Other Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "other_name",
                    validationRules: [{
                        type: "required",
                        message: "Other Name is required"
                    }]
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    dataField: "dob",
                    editorType: "dxDateBox",
                    editorOptions: {
                        width: '100%',
                    },
                    validationRules: [{
                        type: "required",
                        message: "Date of Birth is required"
                    }]
                }, {
                    label: {
                        text: "Gender"
                    },
                    editorType: "dxLookup",
                    dataField: "gender_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Genderinfo,
                        displayExpr: 'Desc',
                        valueExpr: 'Code'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Gender is required"
                    }]
                }, {
                    label: {
                        text: "Insuarance Cover"
                    },
                    editorType: "dxLookup",
                    dataField: "InsuranceType",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: [],
                        displayExpr: 'description',
                        valueExpr: 'InsuranceType',
                        onValueChanged: function (e) {
                            //get the premium match
                            for (var key in viewModel.InsuranceCoverTypes()) {
                                var obj = viewModel.InsuranceCoverTypes()[key];
                                console.log(obj);
                                if (obj['InsuranceType'] == e.value) {
                                    formPolicyDetailsInstance.updateData("modal_premium", obj['PremiumAmount']);
                                }
                            }
                        }
                    }
                }, {
                    label: {
                        text: "Bank"
                    },
                    editorType: "dxLookup",
                    dataField: "bank_code",
                    editorOptions: {
                        value: "NIB",
                        readOnly:true,
                        closeOnOutsideClick: true,
                        dataSource: Bank,
                        displayExpr: 'description',
                        valueExpr: 'bank_code'
                    }
                }, {
                    label: {
                        text: "Bank Branch"
                    },
                    editorType: "dxLookup",
                    dataField: "bank_branch",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: BanksBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    }
                }, {//SmartLife.
                    label: {
                        text: "Account Number"
                    },
                    editorType: "dxTextBox",
                    dataField: "bank_account_no"
                },{//SmartLife.
                    label: {
                        text: "Premium Amount"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly:true
                    },
                    dataField: "modal_premium"
                },
                {
                    colSpan: 2,
                    itemType: "empty",

                },
                {
                    colSpan: 2,
                    itemType: "empty",

                }, /*{
                    colSpan: 2,
                    label: {
                        text: "BENEFICIARIES / NEXT OF KIN"
                    },
                    dataField: "beneficiaries",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: [],
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: true,
                            mode: 'form',
                            allowAdding: true,
                            allowDeleting: true,
                        },
                        columns: [
                            {
                                dataField: 'b_name',
                                caption: 'Fullnames'
                            }, {
                                dataField: 'b_relationship',
                                caption: 'Relationship',
                                lookup: {
                                    dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                }
                            }, {
                                dataField: 'b_dob',
                                caption: 'Date of Birth',
                                dataType: 'date'
                            }, {
                                dataField: 'b_percentage_allocated',
                                caption: '% Allocated'
                            }, {
                                dataField: 'b_mobile_no',
                                caption: 'Mobile No'
                            }
                        ]
                    }
                },*/ 
                {
                    colSpan: 2,
                    itemType: "empty",

                },
                {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "SAVE →",
                        horizontalAlignment: "left",
                        // icon: "chevronnext",
                        // type: "default",
                        onClick: function (args) {

                            //save and navigate next screen.
                            //navnextPrev(1);
                            viewModel.save(args);

                        }
                    }
                }
            ],
        },
        save: function (args) {

            //TODO-Save it and navigate to the my_applications view
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            let data = formPolicyDetailsInstance.option("formData");
            data['plan_code'] = plan_code;
            data['agent_code'] = SmartLife.agent_no;
            //format your dates here..
            data['dob'] = viewModel.formatDates(new Date(data['dob']));
            //data['beneficiaries'] = JSON.stringify(formPolicyDetailsInstance.getEditor('beneficiaries').option('dataSource'));
            

            console.log(data);
            get_life.DBpost("sync/synProposal", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    //navigate to the my applications screen
                    //SmartLife.app.back();
                    viewModel.navigateForward("applications", "");
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        }

    };

    return viewModel;
};