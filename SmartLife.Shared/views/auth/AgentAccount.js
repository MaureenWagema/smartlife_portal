SmartLife.AgentAccount = function (params) {
    "use strict";
    var formAccountInstance;
    var formRecruitLinkInstance;
    var BankBranches = SmartLife.BanksBranches;
    var PayMethods = SmartLife.AgentsPaymethodInfo.filter(paymethod => (paymethod.Bank == 1 || paymethod.MobileMoney == 1));
    var rcd_id;

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
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        LoadPanelShown: ko.observable(false),
        viewShown: function () {
            //TO DO - Display Previous
            viewModel.get_details();
        },

        get_details: function () {
            viewModel.LoadPanelShown(true);
            let get_agent_details = new DB({
                name: "getting agent details"
            });
            get_agent_details.DBget("agents/getAgentDetails?agent_no=" + SmartLife.agent_no).done(function (result) {
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
        ////recruitement link pop up/////
        pop_recruit_link: ko.observable(false),
        hide_recruit_link: function () {
            viewModel.pop_recruit_link(false);
        },
        dxFormRecruitLink: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formRecruitLinkInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "mobile",
                    editorOptions: {
                        maskRules: {
                            "9": /[0-9]/
                        },
                        onKeyPress: function (e) {
                            var key = String.fromCharCode(e.event.keyCode || e.event.which);
                            var regex = /[0-9]|\./;
                            if (!regex.test(key)) {
                                e.event.preventDefault();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Mobile is required"
                    }]
                }, {
                    itemType: "empty"
                }, {
                    itemType: "empty"
                }, {
                    itemType: "button",
                    dataField: "btnSave",
                    buttonOptions: {
                        text: "SEND LINK",
                        icon: "message",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //post data...

                                //let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                viewModel.LoadPanelShown(true);
                                let edit_agent = new DB({
                                    name: "send recruitment link"
                                });
                                let data = formRecruitLinkInstance.option("formData");
                                let tableData = {
                                    "msg": "https://recruitment.glicolife.com/enroll/" + SmartLife.agent_no,
                                    "mobile_no": data["mobile"],
                                    "is_recruitment_link": "1"
                                };
                                
                                edit_agent.DBpost("collections/sendOTP", tableData).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        viewModel.hide_recruit_link();
                                        DevExpress.ui.dialog.alert("Recruitment Link Sent", "");
                                    } else {
                                        viewModel.show_test(result.message, 'error');
                                    }
                                }).fail(function () {
                                    viewModel.LoadPanelShown(false);
                                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                });   

                            }
                        }
                    }

                }

            ]
        },
        ////end of recruitement link pop up///

        ////clawback....////
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

        defualt_paymethod: function () {
            //formAccountInstance.itemOption("payment_mode", "visible", false);
            formAccountInstance.itemOption("bank_code", "visible", false);
            formAccountInstance.itemOption("bank_branch", "visible", false);
            formAccountInstance.itemOption("bank_ac", "visible", false);
            formAccountInstance.itemOption("Bank_ac_Name", "visible", false);

            formAccountInstance.itemOption("TelcoCode", "visible", false);
            formAccountInstance.itemOption("mobileMOMO", "visible", false);
        },
        clear_payment_fields: function () {
            formAccountInstance.updateData("bank_code", null);
            formAccountInstance.updateData("bank_branch", null);
            formAccountInstance.updateData("bank_ac", '');
            formAccountInstance.updateData("Bank_ac_Name", '');

            formAccountInstance.updateData("TelcoCode", '');
            formAccountInstance.updateData("mobileMOMO", '');
        },

        agent_changed_pay_method: function (val) {
            //viewModel.clear_payment_fields();
            let data = formAccountInstance.option("formData");
            viewModel.defualt_paymethod();


            if (val == "1") {//EFT
                formAccountInstance.itemOption("bank_code", "visible", true);
                formAccountInstance.itemOption("bank_branch", "visible", true);
                formAccountInstance.itemOption("bank_ac", "visible", true);
                formAccountInstance.itemOption("Bank_ac_Name", "visible", true);


            }
            if (val == "2") {//MOMO
                formAccountInstance.itemOption("TelcoCode", "visible", true);
                formAccountInstance.itemOption("mobileMOMO", "visible", true);
            }


            viewModel.refresh_dataSources();
            formAccountInstance.updateData(data);
        },

        refresh_dataSources: function () {
            if (formAccountInstance.getEditor("bank_branch") != null)
                formAccountInstance.getEditor("bank_branch").option("dataSource", BankBranches);
        },

        dxFormAccount: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formAccountInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "RECRUITMENT LINK",
                        icon: "edit",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function () {
                            viewModel.pop_recruit_link(true);
                            //let url = "https://recruitment.glicolife.com/enroll/" + SmartLife.agent_no;
                            //window.open(url, '_blank');
                        }
                    }
                },
                {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "mobile",
                    editorOptions: {
                        maskRules: {
                            "9": /[0-9]/
                        },
                        onKeyPress: function (e) {
                            var key = String.fromCharCode(e.event.keyCode || e.event.which);
                            var regex = /[0-9]|\./;
                            if (!regex.test(key)) {
                                e.event.preventDefault();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Mobile is required"
                    }]
                }, {
                    label: {
                        text: "Email"
                    },
                    editorType: "dxTextBox",
                    dataField: "Emailaddress"
                },
                {
                    colSpan: 2,
                    itemType: 'group',
                    caption: 'Payment Details',
                    visible: true,
                    colCount: 2,
                    items: [
                        {
                            label: {
                                text: "Preffered Payment Method"
                            },
                            disabled: true,
                            editorType: "dxLookup",
                            dataField: "payment_method",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: PayMethods,
                                displayExpr: 'description',
                                valueExpr: 'id',
                                onValueChanged: function (e) {
                                    //viewModel.agent_changed_pay_method(e.value);
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "Payment Method is required"
                            }]
                        }, {
                            colSpan: 2,
                            itemType: "empty"
                        },//payment_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code,
                        //ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
                        {
                            label: {
                                text: "Bank"
                            },
                            editorType: "dxLookup",
                            visible: true,
                            disabled: true,
                            dataField: "bank_code",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Banks,
                                displayExpr: 'description',
                                valueExpr: 'bank_code',
                                onValueChanged: function (e) {
                                    //filter the bank branches BankBranches
                                    //formAccountInstance.updateData("bank_branch", '');
                                    BankBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == e.value));
                                    console.log(BankBranches);
                                    formAccountInstance.getEditor("bank_branch").option("dataSource", BankBranches);
                                }
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Bank is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formAccountInstance.option("formData");
                                    if (data['payment_method'] == '7' || data['payment_method'] == '9') {
                                        if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;//don't check validation
                                    }
                                }
                            }]
                        }, {
                            label: {
                                text: "Bank Branch"
                            },
                            editorType: "dxLookup",
                            visible: true,
                            disabled: true,
                            dataField: "bank_branch",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: BankBranches,
                                displayExpr: 'bankBranchName',
                                valueExpr: 'id',
                            },

                        }, {//SmartLife.
                            label: {
                                text: "Bank Account Number"
                            },
                            editorType: "dxTextBox",
                            visible: true,
                            disabled: true,
                            dataField: "bank_ac",
                            editorOptions: {
                                //readOnly: true
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Bank Account Number is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formAccountInstance.option("formData");
                                    if (data['payment_method'] == '7' || data['payment_method'] == '9') {
                                        if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;//don't check validation
                                    }
                                }
                            }]
                        }, {//SmartLife.
                            label: {
                                text: "Bank Account Name"
                            },
                            editorType: "dxTextBox",
                            visible: true,
                            disabled: true,
                            editorOptions: {
                                //readOnly: true
                            },
                            dataField: "Bank_ac_Name",
                            validationRules: [{
                                type: "custom",
                                message: "Bank Account Name is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formAccountInstance.option("formData");
                                    if (data['payment_method'] == '7' || data['payment_method'] == '9') {
                                        if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;//don't check validation
                                    }
                                }
                            }]
                        }, {
                            label: {
                                text: "Telco Company"
                            },
                            editorType: "dxLookup",
                            visible: true,
                            disabled: true,
                            editorOptions: {
                                readOnly: true
                            },
                            dataField: "TelcoCode",
                            editorOptions: {
                                //readOnly:true,
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Telcos,
                                displayExpr: 'Name',
                                valueExpr: 'emp_code'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Telco Company is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formAccountInstance.option("formData");
                                    if (data['payment_method'] == '6') {
                                        if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;//don't check validation
                                    }
                                }
                            }]
                        },
                        {
                            label: {
                                text: "MOMO Number"
                            },
                            editorType: "dxTextBox",
                            disabled: true,
                            editorOptions: {
                                //readOnly: true,
                                maskRules: {
                                    "9": /[0-9]/
                                },
                                onKeyPress: function (e) {
                                    var key = String.fromCharCode(e.event.keyCode || e.event.which);
                                    var regex = /[0-9]|\./;
                                    if (!regex.test(key)) {
                                        e.event.preventDefault();
                                    }
                                }
                            },
                            visible: true,
                            dataField: "mobileMOMO",
                            validationRules: [{
                                type: "custom",
                                message: "MOMO Number is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formAccountInstance.option("formData");
                                    if (data['payment_method'] == '6') {
                                        if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;//don't check validation
                                    }
                                }
                            }]
                        },
                        {
                            label: {
                                text: "Change Payment Details"
                            },
                            editorType: "dxCheckBox",
                            visible: false,
                            disabled: false,
                            dataField: "isPaymentChange",
                            editorOptions: {
                                readOnly: false,
                                disabled: false,
                                onValueChanged: function (e) {
                                    //enable the fields....
                                    //display the form to change the Claim PayMethods btnSave
                                    if (e.value == 1) {
                                        formAccountInstance.itemOption("Payment Details.payment_method", "disabled", false);
                                        formAccountInstance.itemOption("Payment Details.bank_code", "disabled", false);
                                        formAccountInstance.itemOption("Payment Details.bank_branch", "disabled", false);
                                        formAccountInstance.itemOption("Payment Details.bank_ac", "disabled", false);
                                        formAccountInstance.itemOption("Payment Details.Bank_ac_Name", "disabled", false);
                                        formAccountInstance.itemOption("Payment Details.TelcoCode", "disabled", false);
                                        formAccountInstance.itemOption("Payment Details.mobileMOMO", "disabled", false);

                                        formAccountInstance.itemOption("Payment Details.btnSave", "visible", true);
                                    } else {
                                        formAccountInstance.itemOption("Payment Details.payment_method", "disabled", true);
                                        formAccountInstance.itemOption("Payment Details.bank_code", "disabled", true);
                                        formAccountInstance.itemOption("Payment Details.bank_branch", "disabled", true);
                                        formAccountInstance.itemOption("Payment Details.bank_ac", "disabled", true);
                                        formAccountInstance.itemOption("Payment Details.Bank_ac_Name", "disabled", true);
                                        formAccountInstance.itemOption("Payment Details.TelcoCode", "disabled", true);
                                        formAccountInstance.itemOption("Payment Details.mobileMOMO", "disabled", true);

                                        formAccountInstance.itemOption("Payment Details.btnSave", "visible", false);
                                    }
                                    viewModel.refresh_dataSources();
                                }
                            }
                        }, {
                            itemType: "empty"
                        }, {
                            itemType: "empty"
                        },
                        {
                            itemType: "button",
                            dataField: "btnSave",
                            visible: false,
                            buttonOptions: {
                                text: "SAVE",
                                icon: "user",
                                horizontalAlignment: "centre",
                                type: "default",
                                onClick: function (args) {
                                    //alter the array depending on the form
                                    var result = args.validationGroup.validate();
                                    if (result.isValid) {
                                        //post data...

                                        //let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                        viewModel.doSave();

                                    }
                                }
                            }

                        }]
                }
            ]
        },
        doSave: function () {
            //TODO - Push to server...
            //push the form to the server...
            viewModel.LoadPanelShown(true);
            let edit_agent = new DB({
                name: "editing agents details"
            });
            let data = formAccountInstance.option("formData");
            // name, sex, mobile, email,
            //delete dataSubmit.name;

            data['id'] = rcd_id;
            var tableData = { 'tableData': JSON.stringify(data) };
            console.log(tableData);
            edit_agent.DBpost("agents/editAgentsDetails", tableData).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    DevExpress.ui.dialog.alert(result.message, "SAVED");
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });           
        }
    };

    return viewModel;
};