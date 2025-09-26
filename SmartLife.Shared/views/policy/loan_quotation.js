SmartLife.loan_quotation = function (params) {
    "use strict";
    var formLoanDetailsInstance;
    var formSearchDetailsInstance;
    var loan_keys;
    var LoanPolicies = "";
    var vs_loan = true;

    var viewModel = {
        //  Put the binding properties here
        go_back: function () {
            SmartLife.app.back();
        },
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
        vs_command: ko.observable(false),
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
        LoadPanelShown: ko.observable(false),

        dxFormLoansDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formLoanDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'LOAN QUOTATION FORM',
                colCount: 2,
                items: [
                    {
                        colSpan: 2,
                        itemType: "button",
                        dataField: "btnFetchPolicy",
                        horizontalAlignment: "right",
                        visible: true,
                        buttonOptions: {
                            text: "FETCH CLIENT POLICIES",
                            icon: "plus",
                            type: "danger",
                            horizontalAlignment: "right",
                            verticalAlignment: "bottom",
                            onClick: function () {
                                viewModel.show_policies();
                                //viewModel.pop_beneficiary(true);
                                //DevExpress.ui.dialog.alert("Feature in Development", "ALERT!");
                            }
                        }
                    },
                    {
                        label: {
                            text: "Loan Policies"
                        },
                        editorType: "dxTextBox",
                        visible: true,
                        dataField: "LoanPolicies",
                        editorOptions: {
                            readOnly: true
                        },
                        validationRules: [{
                            type: "custom",
                            message: "Loan Policies is required",
                            validationCallback: function (obj) {
                                if (vs_loan) {
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
                    {//PreviousloanAmount
                        label: {
                            text: "Total Loan Amount"
                        },
                        editorType: "dxNumberBox",
                        dataField: "TotalLoanValue",
                        visible: true,
                        editorOptions: {
                            readOnly: true,//change this to true later
                            format: ",##0.##"
                        },
                    }, {//PreviousloanAmount
                        label: {
                            text: "Total Loan Available"
                        },
                        editorType: "dxNumberBox",
                        dataField: "TotalLoanAvailable",
                        visible: true,
                        editorOptions: {
                            readOnly: true,//change this to true later
                            format: ",##0.##"
                        },
                    }, {//PreviousloanAmount
                        label: {
                            text: "Amount Available"
                        },
                        editorType: "dxNumberBox",
                        dataField: "CurrentCashValue",
                        visible: true,
                        editorOptions: {
                            readOnly: true,//change this to true later
                            format: ",##0.##"
                        },
                        validationRules: [{
                            type: "custom",
                            message: "Amount Available is required",
                            validationCallback: function (obj) {
                                if (vs_loan || vs_partial) {
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
                            text: "Requested Amount"
                        },
                        editorType: "dxNumberBox",
                        visible: true,
                        dataField: "AmountAppliedFor",
                        editorOptions: {
                            onValueChanged: function (e) {
                                //check if the value is less than equal to amountavaliable(currentcashvalue);
                                let data = formLoanDetailsInstance.option("formData");
                                if (parseFloat(e.value) > data['CurrentCashValue']) {
                                    //clear the value and alert
                                    formLoanDetailsInstance.updateData("AmountAppliedFor", 0);
                                    DevExpress.ui.dialog.alert("Amount Applied for should be less than Amount Available", "SAVED");
                                }
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            message: "Requested Amount is required",
                            validationCallback: function (obj) {
                                if (vs_loan || vs_partial) {
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
                        colSpan: 2,
                        visible: false,
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "right",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "Apply For Loan",
                            horizontalAlignment: "right",
                            verticalAlignment: "bottom",
                            icon: "doc",
                            type: "default",
                            /*elementAttr: {
                                class: "buttonPrimary"
                            },*/
                            onClick: function (args) {
                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {

                                    
                                    var data = [{ id: dta.id, policy_no: dta.policy_no, claim_type: dta.claim_type, notification_date: dta.request_date, tot_proceeds: dta.tot_cash_value, net_pay: dta.amount_available, reason: dta.reason, amount_applied: dta.amount_applied, status_code: dta.status_code }];
                                    viewModel.navigateForward("request_claim_form", JSON.stringify(data));
                                    
                                    /*viewModel.LoadPanelShown(true);
                                    let get_life = new DB({
                                        name: "fetching wrongful claims"
                                    });
                                    let data = formLoanDetailsInstance.option("formData");
                                    let url = "policy/getClientLoan?staff_no=" + data['staff_no'] + "&is_micro=" + is_micro;

                                    get_life.DBget(url).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //console.log(result.record_id);
                                            viewModel.loan_store(result.ClientLoan);
                                        } else {
                                            viewModel.show_test(result.message, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });*/

                                }
                            }
                        }
                    }],
            }],

        },

        ///////////////policies pop up/////////////////////
        get_loan_first_policy: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get the life cashvalue"
            });
            let url = "policy/getClientLifeLoan?policy_no=" + policy_no;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success) {
                    //CurrentCashValue
                    let AmountAvailable = result.AmountAvailable;
                    let TotalLoanAmount = result.TotalLoanAmount;
                    let PreviousloanAmount = result.PreviousloanAmount;
                    let TotalLoanAvailable = result.TotalLoanAvailable;
                    let TotalWithdrawal = result.TotalWithdrawal;
                    //display it on the LoanPolicies - AmountAvailable
                    if (isEmptyString(LoanPolicies)) {
                        LoanPolicies = policy_no;
                        formLoanDetailsInstance.updateData("TotalLoanValue", TotalLoanAmount);
                        formLoanDetailsInstance.updateData("CurrentCashValue", AmountAvailable);

                        formLoanDetailsInstance.updateData("PreviousloanAmount", PreviousloanAmount);
                        formLoanDetailsInstance.updateData("TotalLoanAvailable", TotalLoanAvailable);
                        formLoanDetailsInstance.updateData("TotalWithdrawal", TotalWithdrawal);
                    }
                    //viewModel.hide_policies();
                    formLoanDetailsInstance.updateData("LoanPolicies", LoanPolicies);
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        add_loan_policy: function () {
            //getClientLifeLoan - make request to get amount...
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get the life cashvalue"
            });
            let url = "policy/getClientLifeLoan?policy_no=" + loan_keys.policy_no;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success) {
                    let data = formLoanDetailsInstance.option("formData");
                    let tmp_TotalLoanAmount = parseFloat(data['TotalLoanValue']);
                    let tmp_amount_available = parseFloat(data['CurrentCashValue']);
                    let tmp_PreviousloanAmount = parseFloat(data['PreviousloanAmount']);
                    let tmp_TotalLoanAvailable = parseFloat(data['TotalLoanAvailable']);
                    let tmp_TotalWithdrawal = parseFloat(data['TotalWithdrawal']);

                    //CurrentCashValue
                    let AmountAvailable = result.AmountAvailable;
                    let TotalLoanAmount = result.TotalLoanAmount;
                    let PreviousloanAmount = result.PreviousloanAmount;
                    let TotalLoanAvailable = result.TotalLoanAvailable;
                    let TotalWithdrawal = result.TotalWithdrawal;
                    //display it on the LoanPolicies - AmountAvailable
                    if (isEmptyString(LoanPolicies)) {
                        LoanPolicies = loan_keys.policy_no;
                        formLoanDetailsInstance.updateData("TotalLoanValue", TotalLoanAmount);
                        formLoanDetailsInstance.updateData("CurrentCashValue", AmountAvailable);

                        formLoanDetailsInstance.updateData("PreviousloanAmount", PreviousloanAmount);
                        formLoanDetailsInstance.updateData("TotalLoanAvailable", TotalLoanAvailable);
                        formLoanDetailsInstance.updateData("TotalWithdrawal", TotalWithdrawal);
                    } else {
                        LoanPolicies = LoanPolicies + "," + loan_keys.policy_no;
                        tmp_amount_available += parseFloat(AmountAvailable);
                        tmp_TotalLoanAmount += parseFloat(TotalLoanAmount);
                        tmp_PreviousloanAmount += parseFloat(PreviousloanAmount);
                        tmp_TotalLoanAvailable += parseFloat(TotalLoanAvailable);
                        tmp_TotalWithdrawal += parseFloat(TotalWithdrawal);

                        formLoanDetailsInstance.updateData("TotalLoanValue", tmp_TotalLoanAmount);
                        formLoanDetailsInstance.updateData("CurrentCashValue", tmp_amount_available);

                        formLoanDetailsInstance.updateData("PreviousloanAmount", tmp_PreviousloanAmount);
                        formLoanDetailsInstance.updateData("TotalLoanAvailable", tmp_TotalLoanAvailable);
                        formLoanDetailsInstance.updateData("TotalWithdrawal", tmp_TotalWithdrawal);
                    }
                    viewModel.hide_policies();
                    formLoanDetailsInstance.updateData("LoanPolicies", LoanPolicies);
                    ////reset search and grid
                    formSearchDetailsInstance.resetValues();
                    viewModel.applications_store([]);
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        pop_policies: ko.observable(false),
        hide_policies: function () {
            viewModel.pop_policies(false);
        },
        show_policies: function () {

            viewModel.pop_policies(true);
        },
        onSelectionPolicyChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            loan_keys = data;
            //alert(data.policy_no);

            //if (vs_refund_bank) bank_code = data.BankName;
            //if (vs_refund_emp) emp_code = data.emp_code;
            //reference_no = data.ReferenceNumber;
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
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'SmartLife Search',
                colCount: 4,
                items: [
                    {
                        label: {
                            text: "Type"
                        },
                        editorType: "dxLookup",
                        dataField: "type",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            searchEnabled: false,
                            showClearButton: true,
                            clearButtonText: 'Clear',
                            dataSource: [{ id: 1, description: 'Policy' }, { id: 2, description: 'Proposal' }],
                            displayExpr: 'description',
                            valueExpr: 'id',
                            value: 1,
                            /*onValueChanged: function (e) {
                                if (e.value == 2) {
                                    DevExpress.ui.dialog.alert("Proposal Enquiry still in production");
                                }
                            }*/
                        },
                        validationRules: [{
                            type: "required",
                            message: "Type is required"
                        }]
                    },
                    {
                        label: {
                            text: "Search Criteria"
                        },
                        editorType: "dxLookup",
                        dataField: "criteria",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            searchEnabled: false,
                            showClearButton: true,
                            clearButtonText: 'Clear',
                            dataSource: [{ id: 1, description: 'Name' }, { id: 2, description: 'Policy Number / Proposal Number' }, { id: 3, description: 'Mobile number' }, { id: 4, description: 'Staff Number' }, { id: 5, description: 'Agent Number' }],
                            displayExpr: 'description',
                            valueExpr: 'id'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Search Criteria is required"
                        }]
                    }, {
                        label: {
                            text: "Search Entry"
                        },
                        editorType: "dxTextBox",
                        dataField: "search_entry",
                        validationRules: [{
                            type: "required",
                            message: "Search Entry is required"
                        }]
                    },
                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "Search",
                            horizontalAlignment: "center",
                            verticalAlignment: "bottom",
                            icon: "search",
                            type: "danger",
                            /*elementAttr: {
                                class: "buttonPrimary"
                            },*/
                            onClick: function (args) {

                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {

                                    //save
                                    ///post data form as it is
                                    viewModel.LoadPanelShown(true);
                                    let get_life = new DB({
                                        name: "fetching client policies"
                                    });
                                    let data = formSearchDetailsInstance.option("formData");
                                    //type = data['type'];
                                    let url = "policy/getPolicyDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                    if (SmartLife.login_type == 3) {//POS
                                        //just search using pos_type
                                        if (SmartLife.pos_type == 1) {//individual life
                                            if (data['type'] == 1) {
                                                url = "policy/getPolicyDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                            } else {
                                                url = "policy/getProposalDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                            }
                                        }
                                        else if (SmartLife.pos_type == 2) {//micro
                                            if (data['type'] == 1) {
                                                url = "policy/getMicroPolicyDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                            } else {
                                                url = "policy/getMicroProposalDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                            }
                                        }
                                    }

                                    get_life.DBget(url).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //console.log(result.record_id);
                                            viewModel.applications_store(result.PolicyDetails);
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
                    }],
            }],

        },

        //applications grid
        applications_store: ko.observableArray(),
        //names, email, gender, plan, proposal_no, 
        applications_columns: [
            {
                dataField: 'ShowSecondLifeDetails',
                visible: false
            },
            {
                dataField: 'id',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'email',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'mobile',
                visible: true,
            },
            {
                allowEditing: false,
                dataField: 'TotalPremium',
                caption: 'Premium',
                visible: true,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            },
            {
                allowEditing: false,
                caption: 'plan',
                dataField: 'plan_code',
                lookup: {
                    dataSource: SmartLife.planinfo, valueExpr: 'plan_id', displayExpr: 'description'
                },
                visible: true//
            },
            {
                allowEditing: false,
                dataField: 'proposal_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'status_code',
                lookup: {
                    dataSource: SmartLife.Statuses, valueExpr: 'status_code', displayExpr: 'description'
                },
                visible: true,
            },
            {
                allowEditing: false,
                caption: 'pay_mode',
                dataField: 'pay_mode',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'maturity_date',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'employee_no',
                caption: 'Staff No',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'agent_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'agent_name',
                visible: true
            },//
            {
                allowEditing: false,
                dataField: 'agent_office',
                caption: 'OFFICE',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'prem_units',
                visible: true
            }
        ],
        ////////////////end of policies pop up/////


    };

    function isEmptyString(str) {
        return str.trim() === '';
    }

    return viewModel;
};