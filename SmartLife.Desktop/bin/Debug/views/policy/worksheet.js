SmartLife.worksheet = function (params) {
    "use strict";

    var formPolicyOptionsInstance;
    var DependantsStore = [];
    var BeneficiariesStore = [];
    var RidersStore = [];
    var ClientLoanStore = [];
    var is_micro = 0;

    let policy_no;// = params.item;
    let settings;

    var get_data = JSON.parse(params.item);//settings
    if (get_data['policy_no'] != undefined) policy_no = get_data['policy_no'];
    if (get_data['settings'] != undefined) settings = get_data['settings'];
    console.log(policy_no);

    let default_policy_url = "policy/getPolicyDetails";
    if (SmartLife.pos_type == 2) {
        is_micro = 1;
        default_policy_url = "policy/getMicroPolicyDetails";
    }

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

        get_claims: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings checklists"
            });
            var is_micro = 0;
            if (SmartLife.pos_type == 2) is_micro = 1;
            get_form.DBget("claims/getClientClaims?policy_no=" + policy_no + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.claim_Store(result.Claims);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_worksheet: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "fetching the worksheet rpt"
            });
            get_form.DBget('reports/getWorksheet?policy_no=' + policy_no + "&settings=" + settings).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.pdf_viewer_object(result.base64Rpt);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_endorsements: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings endorsements"
            });
            let micro = 0;
            if (SmartLife.pos_type == 2) micro = 1;
            get_form.DBget("policy/getRequestedEndorsements?policy_no=" + policy_no + "&is_micro=" + micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.endorsement_Store(result.Endorsements);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        get_policy_details: function(){
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "geting the policy details"
            });
            get_form.DBget(default_policy_url+"?policy_no=" + policy_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.policy_obj(result.PolicyDetails[0]);
                    $("#formPolicyOptions").dxForm({
                        formData: result.PolicyDetails[0]
                    }).dxForm("instance");
                    viewModel.get_beneficiaries(result.PolicyDetails[0].id);
                    viewModel.get_client_loans(result.PolicyDetails[0].client_number);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_client_loans: function (client_no) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "geting the loan details"
            });
            get_form.DBget("policy/getClientLoan?client_no=" + client_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //assign the datasource to it
                    if (result.ClientLoan.length > 0) {
                        formPolicyOptionsInstance.itemOption("client_loans", "visible", true);
                        viewModel.refresh_dynamic_ds();
                        ClientLoanStore = result.ClientLoan;
                        formPolicyOptionsInstance.getEditor("client_loans").option("dataSource", ClientLoanStore);
                    }
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_beneficiaries: function (policyId) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "getting policy beneficiaries"
            });
            get_form.DBget("policy/getPolicyBeneficiaries?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //assign the datasource to it
                    BeneficiariesStore = result.Beneficiaries;
                    viewModel.refresh_dynamic_ds();
                    console.log(BeneficiariesStore);
                    formPolicyOptionsInstance.getEditor("beneficiaries").option("dataSource", BeneficiariesStore);
                    viewModel.getPolicyRiders(policyId);
                    viewModel.getPolicyDependants(policyId);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        getPolicyDependants: function (policyId) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing policy dependants"
            });
            get_form.DBget("policy/getPolicyDependants?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    if (result.FuneralMembers.length > 0) {
                        formPolicyOptionsInstance.itemOption("dependant", "visible", true);
                        viewModel.refresh_dynamic_ds();
                        DependantsStore = result.FuneralMembers;
                        formPolicyOptionsInstance.getEditor("dependant").option("dataSource", DependantsStore);
                    }
                } else {
                    viewModel.show_test(result.msg, 'error');
                    //fn(false);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },

        getPolicyRiders: function (policyId) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing policy riders"
            });
            get_form.DBget("policy/getPolicyRiders?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    if (result.Riders.length > 0) {
                        formPolicyOptionsInstance.itemOption("riders", "visible", true);
                        viewModel.refresh_dynamic_ds();
                        RidersStore = result.Riders;
                        formPolicyOptionsInstance.getEditor("riders").option("dataSource", RidersStore);
                    }
                } else {
                    viewModel.show_test(result.msg, 'error');
                    //fn(false);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },

        refresh_dynamic_ds: function () {
            //client_loans
            if (formPolicyOptionsInstance.getEditor("client_loans") != null)
                formPolicyOptionsInstance.getEditor("client_loans").option("dataSource", ClientLoanStore);
            //beneficiaries
            if (formPolicyOptionsInstance.getEditor("beneficiaries") != null)
                formPolicyOptionsInstance.getEditor("beneficiaries").option("dataSource", BeneficiariesStore);
            //riders
            if (formPolicyOptionsInstance.getEditor("riders") != null)
                formPolicyOptionsInstance.getEditor("riders").option("dataSource", RidersStore);
            //dependants
            if (formPolicyOptionsInstance.getEditor("dependant") != null)
                formPolicyOptionsInstance.getEditor("dependant").option("dataSource", DependantsStore);
        },

        policy_obj: ko.observableArray(),
        viewShown: function () {
        //
            viewModel.get_policy_details();
            //viewModel.get_worksheet();
            viewModel.get_claims();
            viewModel.get_endorsements();
        },

        display_rpt: function (Base64PDF) {
            //var pdfBase64 = "JVBERi0xLjUKJbPjz9MK..."; // truncated for brevity
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);
            // Get a reference to the existing <div> element with an id of 'pdf-container'
            var container = document.getElementById('pdf-container');

            // Create an <iframe> element and set its source to a data URL representing the PDF
            var iframe = document.createElement('iframe');
            iframe.src = 'data:application/pdf;base64,' + pdfBase64;

            // Set the height and width of the <iframe> element
            iframe.style.width = '80%';
            iframe.style.height = '90%';

            // Add the <iframe> element to the existing <div> element
            container.appendChild(iframe);
        },

        display_pdf_viewer: function (Base64PDF) {
            //var pdfBase64 = "JVBERi0xLjUKJbPjz9MK..."; // truncated for brevity
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);

            // Get a reference to the existing <div> element with an id of 'pdf-container'
            var container = document.getElementById('pdf-container');

            // Create a new <div> element to hold the PDF viewer
            var viewerContainer = document.createElement('div');

            // Set the height and width of the viewer container
            viewerContainer.style.width = '100%';
            viewerContainer.style.height = '800px';

            // Add the viewer container to the existing <div> container
            container.appendChild(viewerContainer);

            // Create a new instance of the PDF.js viewer
            var pdfViewer = new pdfjsViewer.PDFViewer({
                container: viewerContainer
            });

            // Convert the base64-encoded string to a Uint8Array buffer
            var buffer = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));

            // Load the PDF document using PDF.js
            pdfjsLib.getDocument(buffer).promise.then(function (pdfDoc) {
                // Set the document on the PDF viewer
                pdfViewer.setDocument(pdfDoc);

                // Optionally, perform additional initialization or customization of the viewer
            }).catch(function (error) {
                // Handle any errors that occurred during loading or initialization
            });
        },

        pdf_viewer_object: function (Base64PDF) {
            //var pdfBase64 = "JVBERi0xLjUKJbPjz9MK..."; // truncated for brevity
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);

            // Get a reference to the existing <div> element with an id of 'pdf-container'
            var container = document.getElementById('pdf-container');

            // Create a new <object> element to hold the PDF viewer
            var viewerObject = document.createElement('object');
            viewerObject.type = 'application/pdf';

            // Set the height and width of the viewer object
            viewerObject.style.width = '100%';
            viewerObject.style.height = '800px';

            // Set the data attribute of the viewer object to the base64-encoded string
            viewerObject.data = 'data:application/pdf;base64,' + pdfBase64;

            // Add the viewer object to the existing <div> container
            container.appendChild(viewerObject);
        },

        //////policy form////
        formPolicyOptions: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formPolicyOptionsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //names,dob,mobile,email,anb, plan_code,premium,created_on
            items: [
                {
                    colSpan: 4,
                    label: {
                        text: "CLIENT ACTIVE LOAN"
                    },
                    visible: false,
                    dataField: "client_loans",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: ClientLoanStore,
                        columnHidingEnabled: true,
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: false,
                            mode: 'cell',
                            allowAdding: false,
                            allowDeleting: false,
                        },
                        //Year, Term,LoanValue, RepaymentAmount, Outstanding
                        
                        columns: [
                            {
                                allowEditing: false,
                                dataField: 'LoanYear',
                                caption: 'Year',
                            }, {
                                allowEditing: false,
                                dataField: 'StartDate',
                                caption: 'Start Date',
                                dataType: 'date'
                            }, {
                                allowEditing: false,
                                dataField: 'Term',
                            }, {
                                allowEditing: false,
                                dataField: 'LoanValue',
                                caption: 'Loan Amount',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }, {
                                allowEditing: false,
                                dataField: 'RepaymentAmount',
                                caption: 'Loan Repayment Amount',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }, {
                                allowEditing: false,
                                dataField: 'outstandingBalance',
                                caption: 'Outstanding Amount',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }
                        ]
                    }
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                //personal details here...
                {
                    label: {
                        text: "Policy Number"
                    },
                    dataField: "policy_no",
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Plan"
                    },
                    dataField: "plan_code",
                    editorType: "dxLookup",
                    editorOptions: {
                        readOnly: true,
                        dataSource: SmartLife.planinfo,
                        displayExpr: 'description',
                        valueExpr: 'plan_id'
                    }
                },{
                    label: {
                        text: "Status"
                    },
                    dataField: "status_code",
                    editorType: "dxLookup",
                    editorOptions: {
                        readOnly: true,
                        dataSource: SmartLife.Statuses,
                        displayExpr: 'description',
                        valueExpr: 'status_code'
                    }
                }, {
                    label: {
                        text: "Names"
                    },
                    dataField: "name",
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    dataField: "birthdate",
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy',
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Gender"
                    },
                    dataField: "sex",
                    editorType: "dxLookup",
                    editorOptions: {
                        readOnly: true,
                        dataSource: SmartLife.Genderinfo,
                        displayExpr: 'Desc',
                        valueExpr: 'Code'
                    }
                }, {
                    label: {
                        text: "Mobile No(SMS Number)"
                    },
                    dataField: "mobile",
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Email"
                    },
                    dataField: "email",
                    editorOptions: {
                        readOnly: true,
                    }
                }, /*{
                    label: {
                        text: "Postal Address"
                    },
                    dataField: "postal_address",
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Residential Address"
                    },
                    dataField: "residential_address",
                    editorOptions: {
                        readOnly: true,
                    }
                },*/
                //policy details
                {
                    label: {
                        text: "Agent"
                    },
                    dataField: "agent_no",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Effective Date"
                    },
                    dataField: "effective_date",
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy',
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Maturity Date"
                    },
                    dataField: "maturity_date",
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy',
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Last Premium Date"
                    },
                    dataField: "last_premium_date",
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy',
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Term"
                    },
                    dataField: "term_of_policy",
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    label: {
                        text: "Sum Assured"
                    },
                    dataField: "sa",
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly: true,
                        format: "#,##0.00"
                    }
                }, {
                    label: {
                        text: "Total Premium"
                    },
                    dataField: "TotalPremium",
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly: true,
                        format: "#,##0.00"
                    }
                }, {
                    label: {
                        text: "Payment Mode"
                    },
                    dataField: "pay_mode",
                    editorType: "dxLookup",
                    editorOptions: {
                        readOnly: true,
                        dataSource: SmartLife.Paymentmode,
                        displayExpr: 'description',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "Payment Method"
                    },
                    editorType: "dxLookup",
                    dataField: "pay_method",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Paymentinfo,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            if (e.value == '2') {
                                //employer & staff_no
                                formPolicyOptionsInstance.itemOption("emp_code", "visible", true);
                                formPolicyOptionsInstance.itemOption("employee_no", "visible", true);

                                formPolicyOptionsInstance.updateData("emp_code", viewModel.policy_obj()['employer_name']);
                                //employer_codeOLD = viewModel.policy_obj()['employer_name'];
                                formPolicyOptionsInstance.updateData("employee_no", viewModel.policy_obj()['employee_no']);
                            } else if (e.value == '3' || e.value == '4' || e.value == '5') {
                                //if bank, branch, account_no
                                formPolicyOptionsInstance.itemOption("EFTBank_code", "visible", true);
                                formPolicyOptionsInstance.itemOption("EFTBankBranchCode", "visible", true);
                                formPolicyOptionsInstance.itemOption("EFTBank_account", "visible", true);
                                formPolicyOptionsInstance.itemOption("EftBankaccountName", "visible", true);

                                formPolicyOptionsInstance.updateData("EFTBank_code", viewModel.policy_obj()['bank_name']);
                                formPolicyOptionsInstance.updateData("EFTBankBranchCode", viewModel.policy_obj()['bank_branch']);
                                formPolicyOptionsInstance.updateData("EFTBank_account", viewModel.policy_obj()['EFTBank_account']);
                                formPolicyOptionsInstance.updateData("EftBankaccountName", viewModel.policy_obj()['EFTBankaccountName']);
                            } else if (e.value == '6') {
                                //momo - telco & momo_no
                                formPolicyOptionsInstance.itemOption("emp_code", "label.text", "Telco");
                                formPolicyOptionsInstance.itemOption("emp_code", "visible", true);
                                formPolicyOptionsInstance.itemOption("MobileWallet", "visible", true);
                                //formPolicyOptionsInstance.itemOption("detail_two", "label.text", "MOMO Number");

                                formPolicyOptionsInstance.updateData("emp_code", viewModel.policy_obj()['employer_name']);
                                formPolicyOptionsInstance.updateData("MobileWallet", viewModel.policy_obj()['MobileWallet']);
                            }
                            //viewModel.refresh_dataSources();
                        }
                    }
                },
                {
                    label: {
                        text: "Employer Name"
                    },
                    dataField: "emp_code",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    label: {
                        text: "Staff No"
                    },
                    dataField: "employee_no",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    label: {
                        text: "Bank Name"
                    },
                    dataField: "EFTBank_code",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    label: {
                        text: "Bank Branch"
                    },
                    dataField: "EFTBankBranchCode",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    label: {
                        text: "Account No"
                    },
                    dataField: "EFTBank_account",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    label: {
                        text: "Account Name"
                    },
                    dataField: "EftBankaccountName",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    label: {
                        text: "MOMO No"
                    },
                    dataField: "MobileWallet",
                    visible: false,
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                //Riders screen
                {
                    colSpan: 4,
                    label: {
                        text: "RIDERS"
                    },
                    visible: false,
                    dataField: "riders",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        columnHidingEnabled: true,
                        dataSource: RidersStore,
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: false,
                            mode: 'cell',
                            allowAdding: false,
                            allowDeleting: false,
                        },
                        columns: [
                             {
                                allowEditing: false,
                                dataField: 'RiderCode',
                                caption: 'Rider',
                                lookup: {
                                    dataSource: SmartLife.riderinfo, valueExpr: 'rider_code', displayExpr: 'description'
                                },
                            }, {
                                allowEditing: false,
                                dataField: 'sum_assured',
                                caption: 'Sum Assured',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }, {
                                allowEditing: false,
                                dataField: 'premium',
                                caption: 'Premium',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }
                        ]
                    }
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                //dependants screen
                {
                    colSpan: 4,
                    label: {
                        text: "DEPENDANTS"
                    },
                    visible: false,
                    dataField: "dependant",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: DependantsStore,
                        columnHidingEnabled: true,
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
                                dataField: 'Relationship',
                                caption: 'Relationship',
                                lookup: {
                                    dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                }
                            }, {
                                allowEditing: false,
                                dataField: 'date_of_birth',
                                caption: 'Date of Birth',
                                dataType: 'date',
                            }, {
                                allowEditing: false,
                                dataField: 'sa',
                                caption: 'Sum Assured',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }, {
                                allowEditing: false,
                                dataField: 'premium',
                                caption: 'Premium',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }
                        ]
                    }
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                //beneficiaries
                {
                    colSpan: 4,
                    label: {
                        text: "BENEFICIARIES / NEXT OF KIN"
                    },
                    dataField: "beneficiaries",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: BeneficiariesStore,
                        columnHidingEnabled: true,
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: false,
                            mode: 'cell',
                            allowAdding: false,
                            allowDeleting: false
                        },
                        onRowClick: function (e) {
                            viewModel.show_beneficiary(e);
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
                                dataField: 'mobile',
                                caption: 'Mobile No'
                            }, {
                                dataField: 'ClaimDefaultPay_method',
                                visible: false
                            }, {
                                dataField: 'ClaimDefaultTelcoCompany',
                                visible: false
                            }, {
                                dataField: 'ClaimDefaultMobileWallet',
                                visible: false
                            }, {
                                dataField: 'ClaimDefaultEFTBank_code',
                                visible: false
                            }, {
                                dataField: 'ClaimDefaultEFTBankBranchCode',
                                visible: false
                            }, {
                                dataField: 'ClaimDefaultEFTBank_account',
                                visible: false
                            }, {
                                dataField: 'ClaimDefaultEftBankaccountName',
                                visible: false
                            }, {
                                dataField: 'GuardianSurname',
                                visible: false
                            }, {
                                dataField: 'GuardianOtherNames',
                                visible: false
                            }, {
                                dataField: 'GuardianTelephone',
                                visible: false
                            }, {
                                dataField: 'GuardianEmail',
                                visible: false
                            }
                        ]
                    }
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }]
        },

        /////end of policy form///

        add_claim: function () {
            //if (viewModel.policy_obj().status_code == "10") {
                viewModel.navigateForward("request_claim_form", JSON.stringify(get_data));
            /*} else {
                DevExpress.ui.dialog.alert("Cannot Request a Claim");
            }*/
        },

        add_endorsement: function () {
            //life_endorsement
            viewModel.navigateForward("endorsement", JSON.stringify(get_data));
        },

        endorsement_Store: ko.observableArray(),
        endorsement_columns: [
            {
                dataField: 'id',
                visible: false
            }, {

                dataField: 'policy_no',
                visible: true,
                width: '150'
            }, {
                dataField: 'EndorsementNumber',
                caption: 'Assigned No',
                visible: true,
            }, {
                dataField: 'Endorsementtype',
                visible: true,
                lookup: {
                    dataSource: SmartLife.EndorsementTypes, valueExpr: 'Id', displayExpr: 'Description'
                },
            }, {
                dataField: 'RequestDate',
                visible: true,
                dataType: 'datetime'
            }, {

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }, {

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }, {

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {
                dataField: 'StatusDescription',
                caption: 'Current Status',
                visible: true,
            }
        ],
        endorsementClick: function (e) {
            //alert(e.data.id);
            var data = { policy_no: policy_no, rcd_id: e.data.id };
            //console.log(data);
            //viewModel.navigateForward("endorsement", JSON.stringify(data));
        },



        claim_Store: ko.observableArray(),
        claim_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'reason',
                visible: false
            }, {

                dataField: 'policy_no',//SmartLife.ClientPolicies
                visible: true,
                width:'150'
            }, {
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
            }, {
                dataField: 'claim_type',//SmartLife.ClaimType
                visible: true,
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
            }, {

                dataField: 'tot_cash_value',
                visible: false
            }, {

                dataField: 'amount_available',
                visible: false
            }, {

                dataField: 'AmountAppliedFor',
                visible: false
            }, {//statuscode

                dataField: 'RequestDate',
                caption: 'Request Date',
                dataType: 'datetime',
                visible: true
            }/*, {

                dataField: 'status',
                caption: 'Status',
                visible: false
            }*/, {//

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }, {//

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }, {//

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {//

                dataField: 'statuscode',
                caption: 'Current Status',
                visible: true
            }, {
                caption: 'ACTION',
                visible: false,
                width: '120',
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxMenu({
                        width: '100%',
                        dataSource: [
                            {
                                id: 452,
                                name: "",
                                icon: "mdi mdi-dots-vertical mdi-36px",
                                items: [
                                    {
                                        "id": 1,
                                        "name": "View",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    }
                                ]
                            }
                        ],
                        hideSubmenuOnMouseLeave: false,
                        displayExpr: "name",
                        icon: "icon",
                        onItemClick: function (data) {
                            var item = data.itemData;
                            console.log(item.id);
                            var dta = options.data;

                            if (item.id == 1) {
                                //view
                                var data = [{ id: dta.id, policy_no: dta.policy_no, claim_type: dta.claim_type, notification_date: dta.request_date, tot_proceeds: dta.tot_cash_value, net_pay: dta.amount_available, reason: dta.reason, amount_applied: dta.amount_applied, status_code: dta.status_code }];
                                viewModel.navigateForward("request_claim_form", JSON.stringify(data));
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],
        claimClick: function (e) {
            //check status and if its submitted make the necessary change
            //alert(e.data.id);
            var data = { policy_no: policy_no, rcd_id: e.data.id };
            //console.log(data);
            //viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },
        


    };

    return viewModel;
};