SmartLife.worksheet = function (params) {
    "use strict";

    var formPolicyOptionsInstance;
    var DependantsStore = [];
    var BeneficiariesStore = [];
    var RidersStore = [];
    var ClientLoanStore = [];
    var is_micro = 0;
    var VsEdwankosoPolicy = false;
    var vs_is_policy = true;
    var vs_is_proposal = false;
    var type = 1;

    let policy_no;// = params.item;
    let client_number;
    let proposal_no;
    let settings;
    let vs_second_life_details = false;

    var get_data = JSON.parse(params.item);//settings
    if (get_data['policy_no'] != undefined) policy_no = get_data['policy_no'];
    if (get_data['client_number'] != undefined) client_number = get_data['client_number'];
    if (get_data['proposal_no'] != undefined) proposal_no = get_data['proposal_no'];
    if (get_data['settings'] != undefined) settings = get_data['settings'];
    if (get_data['type'] != undefined) {
        type = get_data['type'];
        //alert(type);
        if (get_data['type'] == 1) {
            vs_is_policy = true;
            vs_is_proposal = false;
        }
        if (get_data['type'] == 2) {
            vs_is_policy = false;
            vs_is_proposal = true;
        }
    }
    if (get_data['ShowSecondLifeDetails'] != undefined) {
        if (get_data['ShowSecondLifeDetails'] == 1 || get_data['ShowSecondLifeDetails'] == "1") {
            vs_second_life_details = true;
        }
        
    }
    console.log(policy_no);

    let default_policy_url = "policy/getPolicyDetails";
    if (type == 2) default_policy_url = "policy/getProposalDetails";
    if (SmartLife.pos_type == 2) {
        is_micro = 1;
        default_policy_url = "policy/getMicroPolicyDetails";
        if (type == 2) default_policy_url = "policy/getMicroProposalDetails";
    }

    if (is_micro == 1) VsEdwankosoPolicy = true;

    var Vs_Life_Prem = false;
    var Vs_Cepa_Prem = false;
    var Vs_investment_prem = false;
    var Vs_basic_prem = false;
    var Vs_extra_prem = false;
    var Vs_total_rider_prem = false;
    var Vs_policyFee = false;
    var Vs_modal_prem = false;
    var Vs_escalation = false;

    if (is_micro == 1) {
        //p.LifePremium,p.InvestmentPremium,p.BasicPremium,p.RiderPremium,p.PolicyFee,p.ModalPremium
        Vs_Life_Prem = true;
        Vs_investment_prem = true;
        Vs_basic_prem = true;
        Vs_total_rider_prem = true;
        Vs_policyFee = true;
        Vs_modal_prem = true;
        Vs_escalation = false;
    } else {
        Vs_Life_Prem = true;
        Vs_Cepa_Prem = true;
        Vs_investment_prem = true;
        Vs_basic_prem = true;
        Vs_extra_prem = true;
        Vs_total_rider_prem = true;
        Vs_policyFee = true;
        Vs_modal_prem = true;
        Vs_escalation = true;
    }

    function formatSummary(value) {
        const formattedValue = value.toFixed(2);
        return Number(formattedValue).toLocaleString();
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

        vs_is_policy: ko.observable(vs_is_policy),
        vs_is_proposal: ko.observable(vs_is_proposal),

        get_claimsHistory: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get claims History"
            });
            var is_micro = 0;
            if (SmartLife.pos_type == 2) is_micro = 1;
            get_form.DBget("claims/getHistoryClaims?policy_no=" + policy_no + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.claimHistory_Store(result.Claims);
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_claims: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings checklists"
            });
            var is_micro = 0;
            if (SmartLife.pos_type == 2) is_micro = 1;
            if (policy_no == undefined) policy_no = "";
            get_form.DBget("claims/getClientClaims?policy_no=" + policy_no + "&is_micro=" + is_micro + "&proposal_no=" +proposal_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.claim_Store(result.Claims);
                } else {
                    viewModel.show_test(result.message, 'error');
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
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        //PropDep
        getPropDepInfo: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings proposal deposit"
            });
            get_form.DBget("policy/getPropDepInfo?proposal_no=" + proposal_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.PropDepStore(result.PropDep);
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        //ClientAccount
        get_ClientAccount: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings Client Account"
            });
            get_form.DBget("policy/getClientAccount?client_number=" + client_number).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.ClientAccountStore(result.ClientAccount);
                } else {
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_endorsementHistory: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings endorsements"
            });
            let micro = 0;
            if (SmartLife.pos_type == 2) micro = 1;
            get_form.DBget("policy/getHistoryEndorsements?policy_no=" + policy_no + "&is_micro=" + micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.endorsementHistory_Store(result.EndorsementHistory);
                } else {
                    viewModel.show_test(result.message, 'error');
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
                    viewModel.show_test(result.message, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        get_policy_details: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "geting the policy details"
            });
            let url = default_policy_url + "?policy_no=" + policy_no;
            if (type == 2) url = default_policy_url + "?proposal_no=" + proposal_no;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.policy_obj(result.PolicyDetails[0]);
                    $("#formPolicyOptions").dxForm({
                        formData: result.PolicyDetails[0]
                    }).dxForm("instance");
                    viewModel.get_beneficiaries(result.PolicyDetails[0].id);
                    if (type == 1) viewModel.get_client_loans(result.PolicyDetails[0].client_number);

                    if (parseFloat(result.PolicyDetails[0].investment_prem) > 0) {
                        viewModel.getMicroCashValue(0);
                    }
                } else {
                    viewModel.show_test(result.message, 'error');
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
                    viewModel.show_test(result.message, 'error');
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
            let url = "policy/getPolicyBeneficiaries?policyId=" + policyId + "&is_micro=" + is_micro;
            if (type == 2) url = "policy/getPolicyBeneficiaries?proposal_no=" + proposal_no + "&is_micro=" + is_micro;
            get_form.DBget(url).done(function (result) {
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
                    viewModel.show_test(result.message, 'error');
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
            let url = "policy/getPolicyDependants?policyId=" + policyId + "&is_micro=" + is_micro;
            if (type == 2) url = "policy/getPolicyDependants?proposal_no=" + proposal_no + "&is_micro=" + is_micro;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    if (result.FuneralMembers.length > 0) {
                        formPolicyOptionsInstance.itemOption("dependant", "visible", true);
                        viewModel.refresh_dynamic_ds();
                        DependantsStore = result.FuneralMembers;
                        formPolicyOptionsInstance.getEditor("dependant").option("dataSource", DependantsStore);
                    }
                } else {
                    viewModel.show_test(result.message, 'error');
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
            let url = "policy/getPolicyRiders?policyId=" + policyId + "&is_micro=" + is_micro;
            if (type == 2) url = "policy/getPolicyRiders?proposal_no=" + proposal_no + "&is_micro=" + is_micro;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    if (result.Riders.length > 0) {
                        formPolicyOptionsInstance.itemOption("riders", "visible", true);
                        viewModel.refresh_dynamic_ds();
                        RidersStore = result.Riders;
                        formPolicyOptionsInstance.getEditor("riders").option("dataSource", RidersStore);
                    }
                } else {
                    viewModel.show_test(result.message, 'error');
                    //fn(false);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },

        getMicroCashValue: function (RebuildCashValue) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get the micro cashvalue"
            });
            let url = "policy/getMicroCashValue?policy_no=" + policy_no + "&RebuildCashValue=" + RebuildCashValue;
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    let AmountAvailable = result.CashValue;
                    if (formPolicyOptionsInstance.getEditor("cashvalue") != null)
                        formPolicyOptionsInstance.updateData("cashvalue", AmountAvailable);
                    //fn(true);
                } else {
                    viewModel.show_test(result.message, 'error');
                    if (formPolicyOptionsInstance.getEditor("cashvalue") != null)
                        formPolicyOptionsInstance.updateData("cashvalue", '0');
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
            //viewModel.get_worksheet();
            viewModel.get_policy_details();
            viewModel.get_ClientAccount();
            viewModel.get_claims();
            if (vs_is_proposal) viewModel.getPropDepInfo();
            if (vs_is_policy) viewModel.get_claimsHistory();
            if (vs_is_policy) viewModel.get_endorsements();
            if (vs_is_policy) viewModel.get_endorsementHistory();
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
                        columnHidingEnabled: false,
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
                                width: '100',
                                dataField: 'LoanYear',
                                caption: 'Year',
                            }, {
                                allowEditing: false,
                                width: '150',
                                dataField: 'StartDate',
                                caption: 'Start Date',
                                dataType: 'date',
                                cellDisplayFormat: 'dd/MM/yyyy'
                            }, {
                                allowEditing: false,
                                width: '100',
                                dataField: 'Term',
                            }, {
                                allowEditing: false,
                                width: '120',
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
                                width: '150',
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
                                width: '150',
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
                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: 'Personal Details',
                    visible: true,
                    colCount: 4,
                    items: [
                        {
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
                                text: "Age at Entry"
                            },
                            dataField: "age",
                            editorOptions: {
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
                        }, {
                            label: {
                                text: "Occupation"
                            },
                            editorType: "dxLookup",
                            dataField: "occupation_code",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Occupationinfo,
                                displayExpr: 'occupation_name',
                                valueExpr: 'occupation_code'
                            },
                        }
                    ]
                },
                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: 'Premium Arreas Details',
                    visible: true,
                    colCount: 3,
                    items: [
                        {
                            label: {
                                text: "Expected Premium Count"
                            },
                            dataField: "ExpectedCount",
                            editorOptions: {
                                
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "Paid Premium Count"
                            },
                            dataField: "PaidCount",
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "UnPaid Premium Count"
                            },
                            dataField: "UnPaidCount",
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "Expected Premiums"
                            },
                            dataField: "ExpectedPremiums",
                            editorType: "dxNumberBox",
                            format: function (value) {
                                console.log(value);
                                return formattedValue;
                            },
                            editorOptions: {
                                format: function (value) {
                                    console.log(value);
                                    const formattedValue = value.toFixed(2);
                                    return Number(formattedValue).toLocaleString();
                                    return formattedValue;
                                },
                                //format: { style: "currency", currency: "EUR", useGrouping: true },
                                //format: ",##0.##",
                                //format: "#,##0.00",
                                /*format: function (value) {
                                    const formattedValue = value.toFixed(2);
                                    return Number(formattedValue).toLocaleString();
                                },*/
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "Paid Premiums"
                            },
                            dataField: "PaidPremiums",
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "UnPaid Premiums"
                            },
                            dataField: "OutstandingPremiums",
                            editorOptions: {
                                readOnly: true,
                            }
                        }, {
                            colSpan: 3,
                            itemType: "button",
                            dataField: "btnArreasRpt",
                            visible: (SmartLife.pos_type == 1),
                            buttonOptions: {
                                text: "Arreas Report",
                                icon: "doc",
                                type: "danger",
                                onClick: function () {
                                    
                                    //if unpaid premiums is not > 1, display no arreas message
                                    let form_data = formPolicyOptionsInstance.option("formData");
                                    if (parseInt(form_data['OutstandingPremiums']) > 0) {
                                        var data = {
                                            policy_no: form_data['policy_no'],
                                            settings: 18,
                                            units: form_data['UnPaidCount'],
                                            outstanding_premium: form_data['OutstandingPremiums']
                                        };
                                        viewModel.navigateForward("reports", JSON.stringify(data));
                                    } else {
                                        DevExpress.ui.dialog.alert("You Don't have any Outstanding Premium Arrears");
                                    }
                                    
                                }
                            }
                        }
                        
                    ]
                },
                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: 'Policy Details',
                    visible: true,
                    colCount: 4,
                    items: [
                        {
                            colSpan: 2,
                            label: {
                                text: "Policy Number"
                            },
                            dataField: "policy_no",
                            editorOptions: {
                                readOnly: true,
                            }
                        }, {
                            colSpan: 2,
                            label: {
                                text: "Linked Policy"
                            },
                            dataField: "EdwankosoPolicy",
                            visible: VsEdwankosoPolicy,
                            editorOptions: {
                                readOnly: true,
                            }
                        }, {
                            colSpan: 4,
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
                        }, {
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
                                text: "Change of Status Date"
                            },
                            dataField: "Status_date",
                            editorType: "dxDateBox",
                            editorOptions: {
                                displayFormat: 'dd/MM/yyyy',
                                readOnly: true,
                            }
                        },  /*{
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
                                text: "Premium Due Date"
                            },
                            dataField: "prem_due_date",
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
                            format: {
                                type: 'fixedPoint',
                                precision: 2,
                            },
                            editorOptions: {
                                readOnly: true,
                                //format: "#,##0.00",
                                //format: "currency"
                                format: function (value) {
                                    console.log(value);
                                    const formattedValue = value.toFixed(2);
                                    return Number(formattedValue).toLocaleString();
                                    console.log(formattedValue);
                                    return formattedValue;
                                },
                                /*format: function (value) {
                                    let formattedValue = parseFloat(value.toString()).toFixed(2);
                                    return formattedValue;//Number(formattedValue).toLocaleString();
                                }*/
                            }
                        },
                        //Life_Prem,Cepa_Prem,investment_prem,basic_prem,extra_prem,total_rider_prem,policyFee,modal_prem
                        
                        {
                            label: {
                                text: "Life Premium"
                            },
                            dataField: "Life_Prem",
                            visible: Vs_Life_Prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "CEPA Premium"
                            },
                            dataField: "Cepa_Prem",
                            visible: Vs_Cepa_Prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Investment Premium"
                            },
                            dataField: "investment_prem",
                            visible: Vs_investment_prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Basic Premium"
                            },
                            dataField: "basic_prem",
                            visible: Vs_basic_prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Extra Premium"
                            },
                            dataField: "extra_prem",
                            visible: Vs_extra_prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Rider Premium"
                            },
                            dataField: "total_rider_prem",
                            visible: Vs_total_rider_prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Policy Fee"
                            },
                            dataField: "policyFee",
                            visible: Vs_policyFee,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Modal Premium"
                            },
                            dataField: "modal_prem",
                            visible: Vs_modal_prem,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Total Premium"
                            },
                            dataField: "TotalPremium",
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Escalation Percentage"
                            },
                            dataField: "PercentageValue",
                            visible: Vs_escalation,
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            label: {
                                text: "Current Cash Value"
                            },
                            dataField: "cashvalue",
                            editorType: "dxNumberBox",
                            editorOptions: {
                                readOnly: true,
                                format: ",##0.###",
                            }
                        }, {
                            
                            itemType: "button",
                            dataField: "btnRebuildCashValue",
                            visible: true,
                            //visible: (SmartLife.pos_type == 1 || SmartLife.pos_type == '1'),
                            buttonOptions: {
                                text: "Re-Build CashValue",
                                icon: "refresh",
                                type: "danger",
                                onClick: function () {
                                    //viewModel.LoadPanelShown(true);
                                    viewModel.getMicroCashValue(1);
                                    //viewModel.show_new_beneficiary();
                                    //viewModel.pop_beneficiary(true);
                                    //DevExpress.ui.dialog.alert("Feature in Development", "ALERT!");
                                }
                            }
                        }
                    ]
                },
                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: 'Payment Details',
                    visible: true,
                    colCount: 4,
                    items: [
                        {
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
                                        formPolicyOptionsInstance.itemOption("Payment Details.emp_code", "visible", true);
                                        formPolicyOptionsInstance.itemOption("Payment Details.employee_no", "visible", true);

                                        formPolicyOptionsInstance.updateData("emp_code", viewModel.policy_obj()['employer_name']);
                                        //employer_codeOLD = viewModel.policy_obj()['employer_name'];
                                        formPolicyOptionsInstance.updateData("employee_no", viewModel.policy_obj()['employee_no']);
                                    } else if (e.value == '3' || e.value == '4' || e.value == '5') {
                                        //if bank, branch, account_no
                                        formPolicyOptionsInstance.itemOption("Payment Details.EFTBank_code", "visible", true);
                                        formPolicyOptionsInstance.itemOption("Payment Details.EFTBankBranchCode", "visible", true);
                                        formPolicyOptionsInstance.itemOption("Payment Details.EFTBank_account", "visible", true);
                                        formPolicyOptionsInstance.itemOption("Payment Details.EftBankaccountName", "visible", true);

                                        formPolicyOptionsInstance.updateData("EFTBank_code", viewModel.policy_obj()['bank_name']);
                                        formPolicyOptionsInstance.updateData("EFTBankBranchCode", viewModel.policy_obj()['bank_branch']);
                                        formPolicyOptionsInstance.updateData("EFTBank_account", viewModel.policy_obj()['EFTBank_account']);
                                        formPolicyOptionsInstance.updateData("EftBankaccountName", viewModel.policy_obj()['EFTBankaccountName']);
                                    } else if (e.value == '6') {
                                        //momo - telco & momo_no
                                        formPolicyOptionsInstance.itemOption("Payment Details.emp_code", "label.text", "Telco");
                                        formPolicyOptionsInstance.itemOption("Payment Details.emp_code", "visible", true);
                                        formPolicyOptionsInstance.itemOption("Payment Details.MobileWallet", "visible", true);
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
                            dataField: "SearchReferenceNumber",
                            visible: true,
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
                        }
                    ]
                },
                ////////////////////////////////////////////////////
                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: '2nd Life Details',
                    visible: vs_second_life_details,
                    colCount: 2,
                    items: [
                    //second_l_name, second_l_address, second_gender_code, second_class_code, second_dob, second_age 
                        {
                            label: {
                                text: "Names"
                            },
                            editorType: "dxTextBox",
                            dataField: "second_l_name",
                            visible: vs_second_life_details,
                            editorOptions: {
                                readOnly: true//change this to true later
                            }
                        }, {
                            label: {
                                text: "Address"
                            },
                            editorType: "dxTextBox",
                            dataField: "second_l_address",
                            visible: vs_second_life_details,
                            editorOptions: {
                                readOnly: true//change this to true later
                            }
                        }, {
                            label: {
                                text: "Gender"
                            },
                            dataField: "second_gender_code",
                            visible: vs_second_life_details,
                            editorType: "dxLookup",
                            editorOptions: {
                                readOnly: true,
                                dataSource: SmartLife.Genderinfo,
                                displayExpr: 'Desc',
                                valueExpr: 'Code'
                            }
                        }, {
                            label: {
                                text: "Class Code"
                            },
                            editorType: "dxTextBox",
                            dataField: "second_class_code",
                            visible: vs_second_life_details,
                            editorOptions: {
                                readOnly: true//change this to true later
                            }
                        }, {
                            label: {
                                text: "DOB"
                            },
                            dataField: "second_dob",
                            visible: vs_second_life_details,
                            editorType: "dxDateBox",
                            editorOptions: {
                                displayFormat: 'dd/MM/yyyy',
                                readOnly: true//change this to true later
                            }
                        }, {
                            label: {
                                text: "Age"
                            },
                            editorType: "dxTextBox",
                            dataField: "second_age",
                            visible: vs_second_life_details,
                            editorOptions: {
                                readOnly: true//change this to true later
                            }
                        }
                    ]
                },
                ////////////////////////////////////////////////////
                {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
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
                                cellDisplayFormat: 'dd/MM/yyyy'
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
                            }, {
                                allowEditing: false,
                                dataField: 'ClaimNotified',
                                caption: 'Active',
                                dataType: 'boolean',
                                cellTemplate: function (container, options) {
                                    var isTrue = options.value === "0";

                                    $("<div>")
                                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                                        .appendTo(container);
                                }
                            }
                        ]
                    }
                },
                //beneficiaries
                {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                },
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
                                dataType: 'date',
                                cellDisplayFormat: 'dd/MM/yyyy'
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
                }]
        },

        /////end of policy form///

        add_suspense_proposal: function () {
            //check if policy number exists.....
            let data = formPolicyOptionsInstance.option("formData");
            if (data['policy_no'] == "" || data['policy_no'] == undefined) {
                get_data['claim_type'] = "REP";
                viewModel.navigateForward("request_claim_form", JSON.stringify(get_data));
            } else {
                DevExpress.ui.dialog.alert("This Proposal Already Appraised to a Policy therefore, REFUND - SUSPENSE ACCOUNT(PROPOSAL) cannot be done");
            }
        },

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
                dataField: 'Endorsementtype',
                visible: true,
                lookup: {
                    dataSource: SmartLife.EndorsementTypes, valueExpr: 'Id', displayExpr: 'Description'
                },
                groupIndex: 0
            }, {

                dataField: 'policy_no',
                visible: true,
                width: '150'
            }, {
                dataField: 'EndorsementNumber',
                caption: 'Assigned No',
                visible: true,
            }, {
                dataField: 'RequestDate',
                visible: true,
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm'
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
            }, {
                dataField: 'Cancel_narration',
                visible: true
            }, {
                dataField: 'Reason',
                caption: 'Reason',
                visible: true,
            }
        ],
        endorsementClick: function (e) {
            //alert(e.data.id);
            var data = { policy_no: policy_no, rcd_id: e.data.id };
            //console.log(data);
            //viewModel.navigateForward("endorsement", JSON.stringify(data));
        },

        ////////////////claim history///////////////
        claimHistory_Store: ko.observableArray(),
        claimHistory_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'reason',
                visible: false
            }, {
                dataField: 'claim_type',//SmartLife.ClaimType
                visible: true,
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
                groupIndex: 0,
            }, {

                dataField: 'policy_no',//SmartLife.ClientPolicies
                visible: true,
                width: '150'
            }, {
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
            },  {

                dataField: 'tot_cash_value',
                visible: false
            }, {

                dataField: 'amount_available',
                visible: false
            }, {

                dataField: 'AmountAppliedFor',
                visible: false
            }, {
                dataField: 'total_proceeds',
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
                dataField: 'total_deductions',
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
                dataField: 'net_payment',
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
                dataField: 'pay_due_date',
                dataType: 'date',
                cellDisplayFormat: 'dd/MM/yyyy',
                visible: true
            }, {

                dataField: 'created_on',
                caption: 'Received On',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }/*, {

                dataField: 'status',
                caption: 'Status',
                visible: false
            }*/, {//

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }/*, {//

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }*/, {//

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {
                dataField: 'statuscode',
                caption: 'Current Status',
                visible: false
            }, {
                dataField: 'Cancel_narration',
                caption: 'Reason',
                visible: true
            }, {
                dataField: 'NarrationForRefunds',
                visible: true
            }, {
                dataField: 'payment_method',
                visible: true
            }, {
                dataField: 'cheque_no',
                visible: true
            }, {
                dataField: 'Bank',
                visible: false
            }, {
                dataField: 'bank_name',
                visible: true
            }, {
                dataField: 'bank_branch_name',
                visible: true
            }, {
                dataField: 'BankAccount',
                visible: true
            }, {
                dataField: 'MobileNumber',
                visible: true
            }, {
                dataField: 'TelcoCompany',
                visible: true
            }, {
                dataField: 'Deceased',
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
        //////////////end of claim history////////

        ///////////////proposal deposit//////////
        PropDepStore: ko.observableArray(),
        PropDep_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'proposal_no',
                //width: '120',
                visible: true
            }, {

                dataField: 'payment_date',
                //width: '150',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }, {

                dataField: 'Reference',
                //width: '150',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'amount',
                width: '100',
                visible: true,
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {

                dataField: 'account_year',
                width: '100',
                visible: true
            }, {

                dataField: 'account_month',
                width: '100',
                visible: true
            }
        ],
        /////////////end of proposal deposit////

        ////////////////Client Account///////////////
        ClientAccountStore: ko.observableArray(),
        ClientAccount_columns: [
            {
                dataField: 'id',
                visible: false
            }, {
                dataField: 'client_number',
                visible: false
            },
            {
                dataField: 'policy_no',
                //width:'120',
                visible: true
            }, {

                dataField: 'PaymentDate',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'Dr',
                caption: 'DR',
                visible: false,
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
                dataField: 'Cr',
                caption: 'Premium Amount',
                visible: true,
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
                dataField: 'IsFromMainsuspense',
                dataType: 'boolean',
                visible: false,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                allowEditing: false,
                dataField: 'IsOverPayment',
                dataType: 'boolean',
                visible: false,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }
        ],
        //////////////Client Account////////

        ////////////////endorsement history///////////////
        endorsementHistory_Store: ko.observableArray(),
        endorsementHistory_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            },
            {
                dataField: 'EndorsementNumber',
                visible: true
            }, {
                dataField: 'Endorsementtype',
                caption: 'Endorsement Type',
                visible: true,
                lookup: {
                    dataSource: SmartLife.EndorsementTypes, valueExpr: 'Id', displayExpr: 'Description'
                },
                groupIndex: 0
            }, {
                allowEditing: false,
                dataField: 'IsCancelled',
                dataType: 'boolean',
                visible: true,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                dataField: 'Cancel_narration',
                visible: true
            }, {

                dataField: 'Reason',//SmartLife.ClientPolicies
                visible: true,
            }, {
                dataField: 'EndorsementDate',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }, {
                dataField: 'EffectiveDate',
                dataType: 'date',
                cellDisplayFormat: 'dd/MM/yyyy',
                visible: true
            }, {//statuscode

                dataField: 'created_on',
                caption: 'Received On',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }/*, {

                dataField: 'status',
                caption: 'Status',
                visible: false
            }*/, {//

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }/*, {//

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }*/,  {
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
        //////////////end of endorsement history////////
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
                dataField: 'claim_type',//SmartLife.ClaimType
                visible: true,
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
                groupIndex: 0
            }, {//
                dataField: 'ProposalNumber',
                visible: vs_is_proposal,
                width: '150'
            }, {

                dataField: 'policy_no',//SmartLife.ClientPolicies
                visible: vs_is_policy,
                width:'150'
            }, {
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
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
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
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
            }, {
                allowEditing: false,
                dataField: 'IsCancelled',
                dataType: 'boolean',
                visible: false,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }
            }, {
                dataField: 'NarrationForRefunds',
                visible: true
            }, {
                dataField: 'statuscode',
                caption: 'Status',
                visible: true
            }, {
                dataField: 'Cancel_narration',
                caption: 'Cancellation Reason',
                visible: true
            }, {
                dataField: 'requisition_no',
                visible: true
            }, {
                dataField: 'pv_no',
                visible: true
            }, {
                dataField: 'SpecificReason',
                caption: 'Reason',
                visible: true
            }, {
                dataField: 'Deceased',
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