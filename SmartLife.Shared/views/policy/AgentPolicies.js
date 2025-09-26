SmartLife.AgentPolicies = function (params) {
    "use strict";

    //save fn
    var formPayInstance;
    var formSearchDetailsInstance;
    var formRecurInstance;
    var invoice_end_date, modal_premium, paymode, name, email, policy_no;
    var recurringInvoiceId, requestId, otpPrefix;
    var vs_agent_office = false;
    var vs_enquiry_button = false;
    var agent_office_index = undefined;
    var vs_agent_branch = false;
    var vs_agent_sector = false;
    var agent_branch_index = undefined;
    var agent_sector_index = undefined;

    if (SmartLife.agent_position_id == "8" || SmartLife.agent_position_id == "7") {
        
        vs_enquiry_button = true;

        vs_agent_office = true;
        vs_agent_branch = true;
        vs_agent_sector = true;


        agent_office_index = 2;
        agent_branch_index = 1;
        agent_sector_index = 0;
    }

    //|| telco.emp_code === "V-CASH"
    var Telcos = SmartLife.Telcos.filter(telco => (telco.emp_code == "MTNMOB" || telco.emp_code == "V-CASH"));
    var is_micro = 0;
    if (SmartLife.pos_type == 2) {//micro
        is_micro = 1;
    }
    let url = "policy/getPolicyDetails?search_entry=" + SmartLife.agent_no + "&criteria=5";
    if (SmartLife.channel == 5) url = "policy/getMicroPolicyDetails?search_entry=" + SmartLife.agent_no + "&criteria=5";

    var type = 1;

    function alert_dialog(title, msg, mobile, modal_premium, paymode, name, email, policy_no) {
        var myDialog = DevExpress.ui.dialog.custom({
            title: title,
            message: msg,
            buttons: [{
                text: "OK",
                onClick: function (e) {
                    //recurse...
                    //sync_autoload_params();
                    viewModel.send_payment_prompt(mobile, modal_premium, paymode, name, email, policy_no);
                    myDialog.hide();
                }
            }, {
                text: "CANCEL",
                onClick: function (e) {
                    myDialog.hide();
                }
            }]
        });
        myDialog.show();
    }



    var name = '';
    var pay_mode = '';
    var email = '';
    var policy_no = '';

    var viewModel = {
        //  Put the binding properties here
        backButtonVisible: ko.observable(false),
        backButtonAction: function (e) {
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
        formatSummary: function (value) {
            const formattedValue = value.toFixed(2);
            return Number(formattedValue).toLocaleString();
        },
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

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
        viewShown: function () {
            if (SmartLife.agent_position_id != "8" && SmartLife.agent_position_id != "6" && SmartLife.agent_position_id != "7") {
                viewModel.get_agent_policies(url);
            }
        },

        send_payment_prompt: function (mobile, modal_premium, paymode, name, email, policy_no) {
            viewModel.LoadPanelShown(true);
            let send_prompt = new DB({
                name: "getting applications"
            });
            send_prompt.DBhubtel("hubtel.php?mobile_no=" + mobile + "&modal_prem=" + modal_premium +
                "&paymentinterval=" + paymode + "&customerName=" + name + "&email=" + email + "&policyNo=" + policy_no)
                .done(function (result) {
                    viewModel.LoadPanelShown(false);
                    console.log(result);
                    if (result.ResponseCode == "0001") {
                        DevExpress.ui.dialog.alert('Payment Prompt sent Successfully', '');
                    } else {
                        viewModel.show_test(result.Message, 'error');
                    }
                }).fail(function () {
                    viewModel.LoadPanelShown(false);
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });
        },

        get_agent_policies: function (url) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get agents policies"
            });
            
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //filter to only established one's
                    var tmp_policies_Store = result.PolicyDetails;
                    tmp_policies_Store = tmp_policies_Store;//.filter(policy => (policy.status_code == 10));
                    viewModel.policies_Store(tmp_policies_Store);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
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


        pop_prompt_payment: ko.observable(false),
        hide_prompt_payment: function () {
            viewModel.pop_prompt_payment(false);
        },
        dxFormPay: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
            onInitialized: function (e) {
                formPayInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                /*{
                    label: {
                        text: "Telco Company"
                    },
                    editorType: "dxLookup",
                    dataField: "telco",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: Telcos,//[{ id: 1, description: 'Airtel' }, { id: 2, description: 'MTN' }, { id: 3, description: 'Vodaphone' }],
                        displayExpr: 'Name',
                        valueExpr: 'UniqueCode'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Telco is required"
                    }]
                },*/

                //Telcos,
                {
                    label: {
                        text: "Telco Company"
                    },
                    editorType: "dxLookup",
                    dataField: "telco",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Telco is required"
                    }]
                },
                {
                    label: {
                        text: "MOMO Number"
                    },
                    editorType: "dxTextBox",
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
                    dataField: "momo_no",
                    validationRules: [{
                        type: "required",
                        message: "MOMO Number is required"
                    }]
                }, {

                    label: {
                        text: "Premium Amount"
                    },
                    editorType: "dxNumberBox",
                    dataField: "amount",
                    validationRules: [{
                        type: "required",
                        message: "Premium Amount is required"
                    }]
                },
                {
                    dataField: "btnregister",
                    itemType: "button",
                    horizontalAlignment: "center",
                    verticalAlignment: "bottom",
                    buttonOptions: {
                        text: "Pay",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        icon: "money",
                        type: "danger",
                        onClick: function (args) {

                            //tabsInstance.option("selectedIndex", 1);
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //save
                                ///post data form as it is
                                viewModel.LoadPanelShown(true);
                                let get_life = new DB({
                                    name: "Registering MOMO client"
                                });
                                let data = formPayInstance.option("formData");

                                let send_prompt = new DB({
                                    name: "getting applications"
                                });
                                //dta.mobile, dta.TotalPremium, dta.modal_prem, dta.pay_mode, dta.name, dta.email, dta.policy_no
                                send_prompt.DBhubtel("hubtel.php?mobile_no=" + data['momo_no'] + "&modal_prem=" + data['amount'] +
                                    "&paymentinterval=" + pay_mode + "&customerName=" + name + "&email=" + email + "&policyNo=" + policy_no +
                                    "&telco=" + data['telco'] + "&is_micro=" + is_micro)
                                    .done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        console.log(result);
                                        if (result.ResponseCode == "0001") {
                                            viewModel.pop_prompt_payment(false);
                                            DevExpress.ui.dialog.alert('Payment Prompt sent Successfully', '');
                                        } else {
                                            viewModel.show_test(result.Message, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                            }

                        }
                    }
                }
            ],
        },


        /////search form////

        dxFormSearchDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            visible: true,
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSearchDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            colCount: 3,
            items: [
                {
                    label: {
                        text: "Date From"
                    },
                    editorType: "dxDateBox",
                    dataField: "date_from",
                    editOptions: {
                        displayFormat: 'dd/MM/yyyy'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Date From is required"
                    }]
                },
                {
                    label: {
                        text: "Date To"
                    },
                    editorType: "dxDateBox",
                    dataField: "date_to",
                    editOptions: {
                        displayFormat: 'dd/MM/yyyy'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Date To is required"
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
                            //url = "policy/getPolicyDetails?search_entry=" + SmartLife.agent_no + "&criteria=5";
                                //viewModel.get_user_activities();
                                let data = formSearchDetailsInstance.option("formData");
                                viewModel.get_agent_policies("policy/getPolicyDetails?search_entry=" + SmartLife.agent_no +
                                    "&criteria=5" + 
                                    "&date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                    "&date_to=" + viewModel.formatDate(new Date(data['date_to']))
                                );
                            }
                        }
                    }
                }],

        },

        ////end of search form///
        showPolicyEnquiry: function (e) {
            viewModel.pop_policy_enquiry(true);
        },

        policies_Store: ko.observableArray(),
        policies_columns: [
            {
                dataField: 'is_micro',
                visible: false
            },
            {
                caption: 'ACTION',
                visible: vs_enquiry_button,
                width: '50',
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        icon: 'doc',
                        text: '',
                        onClick: function () {
                            //viewModel.showPolicyEnquiry()
                            //Do the search based on the staff no
                            viewModel.LoadPanelShown(true);
                            let get_life = new DB({
                                name: "fetching client policies"
                            });
                            let url = "policy/getPolicyDetails?criteria=4&search_entry=" + options.data.SearchReferenceNumber;
                            get_life.DBget(url).done(function (result) {
                                viewModel.LoadPanelShown(false);
                                if (result.success == true) {
                                    //console.log(result.record_id);
                                    viewModel.applications_store(result.PolicyDetails);
                                    viewModel.pop_policy_enquiry(true);
                                } else {
                                    viewModel.show_test(result.msg, 'error');
                                }
                            }).fail(function () {
                                viewModel.LoadPanelShown(false);
                                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                            });
                        }
                    })
                }
            },
            {
                dataField: 'Sector',
                caption: 'Sector',
                visible: vs_agent_sector,
                groupIndex: agent_sector_index,
            },
            {
                dataField: 'Branch',
                caption: 'Branch',
                visible: vs_agent_branch,
                groupIndex: agent_branch_index,
            },
            {
                dataField: 'agent_office',
                caption: "Office",
                visible: vs_agent_office,
                groupIndex: agent_office_index
            },
            {//agent_name
                allowEditing: false,
                dataField: 'agent_name',
                visible: true,
                groupIndex: 3,
            },
            {
                dataField: 'id',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                width:'125',
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
            {//client_name
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
                dataField: 'name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'SearchReferenceNumber',
                caption: 'Staff No',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'email',
                visible: false
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
                caption: 'pay_mode',
                dataField: 'pay_mode',
                visible: false
            },
            {//
                allowEditing: false,
                dataField: 'issued_date',
                dataType: 'date',
                visible: true
            },
            {//issued_date
                allowEditing: false,
                dataField: 'last_prem_date',
                caption: 'Last Premium Payment Date',
                dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'maturity_date',
                dataType: 'date',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'mobile',
                visible: true,
            },
            {
                allowEditing: false,
                dataField: 'term_of_policy',
                caption: 'Term',
                visible: true
            },
            {//agent_name
                allowEditing: false,
                dataField: 'agent_no',
                visible: true
            },

            {
                dataField: 'pay_method',
                lookup: {
                    dataSource: SmartLife.Paymentinfo, valueExpr: 'payment_mode', displayExpr: 'decription'
                },
                visible: true
            }, {
                dataField: 'SearchReferenceNumber',
                visible: true
            }, {
                dataField: 'MobileWallet',
                visible: true
            }, {
                dataField: 'EFTBank_code',
                lookup: {
                    dataSource: SmartLife.Banks, valueExpr: 'bank_code', displayExpr: 'description'
                },
                visible: true
            }, {
                dataField: 'EFTBankBranchCode',
                lookup: {
                    dataSource: SmartLife.BanksBranches, valueExpr: 'id', displayExpr: 'bankBranchName'
                },
                visible: false
            }, {
                dataField: 'EftBankaccountName',
                visible: true
            }, {
                dataField: 'EFTBank_account',
                visible: true
            }, {
                dataField: 'emp_code',
                lookup: {
                    dataSource: SmartLife.Employerinfo, valueExpr: 'emp_code', displayExpr: 'Name'
                },
                visible: true
            }, {
                caption: 'ACTION',
                allowEditing: false,
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
                                        "name": "Prompt Premium Payment",
                                        "icon": "mdi mdi-cash",
                                        // visible: false,
                                    },
                                    {
                                        "id": 2,
                                        "name": "Register Recurring Billing",
                                        "icon": "mdi mdi-cash",
                                    },
                                    {
                                        "id": 3,
                                        "name": "Premium Statement",
                                        "icon": "mdi mdi-cash",
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

                            is_micro = options.data.is_micro;
                            if (item.id == 1) {
                                //view
                                /*var data = { member_no: dta.member_no, telephone: dta.telephone, Names: dta.Names, SchemeID: dta.SchemeID };
                                viewModel.navigateForward("request_claim_form", JSON.stringify(data));*/
                                /*if (dta.mobile != undefined && dta.mobile != '') {
                                    alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.mobile, dta.TotalPremium, dta.pay_mode, dta.name, dta.email, dta.policy_no);
                                } else {
                                    DevExpress.ui.dialog.alert("Client's Mobile number is not in the system", "Failed");
                                }*/


                                
                                name = options.data.name;
                                pay_mode = options.data.pay_mode;
                                email = options.data.email;
                                policy_no = options.data.policy_no;

                                viewModel.pop_prompt_payment(true);

                                //assign mobile & total_premium
                                formPayInstance.updateData("momo_no", options.data.mobile);
                                formPayInstance.updateData("amount", parseFloat(options.data.TotalPremium).toFixed(2));

                            }
                            else if (item.id == 2) {
                                invoice_end_date = dta.maturity_date;
                                modal_premium = dta.TotalPremium;
                                paymode = dta.pay_mode;
                                name = dta.name;
                                email = dta.email;
                                policy_no = dta.policy_no;
                                viewModel.pop_reccur_momo(true);
                            }
                            else if (item.id == 3) {
                                /*if (is_micro == 1) {
                                    var data = { policy_no: dta.policy_no, settings: 2 };
                                } else {
                                    var data = { policy_no: dta.policy_no, settings: 11 };
                                }*/
                                if (is_micro == 1) {
                                    var data = { policy_no: dta.policy_no, settings: 3 };
                                } else {
                                    var data = { policy_no: dta.policy_no, settings: 8 };
                                }
                                viewModel.navigateForward("reports", JSON.stringify(data));
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],

        claim_click: function (e) {
            var data = [{ policy_no: e.itemData.policy_no, claim_type: e.itemData.claim_type, notification_date: e.itemData.notification_date, tot_proceeds: e.itemData.tot_proceeds, net_pay: e.itemData.net_pay, reason: e.itemData.reason, amount_applied: e.itemData.amount_applied }];
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },

        add_member: function () {
            viewModel.navigateForward("add_member", "0");
        },

        //pop up for enquiry of policy//
        //applications grid
        pop_policy_enquiry: ko.observable(false),
        hide_policy_enquiry: function () {
            viewModel.pop_policy_enquiry(false);
        },
        applications_store: ko.observableArray(),
        //names, email, gender, plan, proposal_no, 
        applications_columns: [
            {
                dataField: 'ShowSecondLifeDetails',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'SearchReferenceNumber',
                caption: 'Staff No',
                visible: true
            },
            {
                dataField: 'client_number',
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
            }, {
                caption: 'ACTION',
                allowEditing: false,
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
                                        "name": "Enquiry",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    }, {
                                        "id": 2,
                                        "name": "Policy Schedule",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    },
                                    {
                                        "id": 3,
                                        "name": "Premium Statements",
                                        "icon": "mdi mdi-eye"
                                    },
                                    {
                                        "id": 4,
                                        "name": "Investment Contribution",
                                        "icon": "mdi mdi-eye"
                                    }, {
                                        "id": 5,
                                        "name": "Prompt Pay",
                                        "icon": "mdi mdi-cash",
                                    }, {
                                        "id": 6,
                                        "name": "Register Recurring Billing",
                                        "icon": "mdi mdi-cash",
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
                                //if (!dta.isApproved) {
                                let settings = 4;
                                if (is_micro == 1) settings = 1;
                                var data = {
                                    policy_no: dta.policy_no, proposal_no: dta.proposal_no, settings: settings,
                                    status_code: dta.status_code, prem_units: dta.prem_units, 'type': type,
                                    'ShowSecondLifeDetails': dta.ShowSecondLifeDetails, 'client_number': dta.client_number,
                                    'plan_code': dta.plan_code
                                };
                                viewModel.navigateForward("worksheet", JSON.stringify(data));
                                //window.open(SmartLife.rpt_url + 'Report/Report?PolicyNumber=' + dta.policy_no +"&settings=1", '_blank', 'hidden=no');
                            }
                            else if (item.id == 2) {
                                if (is_micro == 1) {
                                    var data = { policy_no: dta.policy_no, settings: 2 };
                                } else {
                                    var data = { policy_no: dta.policy_no, settings: 11 };
                                }
                                viewModel.navigateForward("reports", JSON.stringify(data));
                            }
                            else if (item.id == 3) {
                                //premium statement
                                if (is_micro == 1) {
                                    var data = { policy_no: dta.policy_no, settings: 3 };
                                } else {
                                    var data = { policy_no: dta.policy_no, settings: 8 };
                                }
                                viewModel.navigateForward("reports", JSON.stringify(data));
                            }
                            else if (item.id == 4) {
                                //investment statement
                                if (is_micro == 1) {
                                    var data = { policy_no: dta.policy_no, settings: 7 };
                                } else {
                                    var data = { policy_no: dta.policy_no, settings: 10 };
                                }
                                viewModel.navigateForward("reports", JSON.stringify(data));
                            }
                            else if (item.id == 5) {
                                //add an alert dialog - Are you sure ...Prompting pay
                                alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.TotalPremium, dta.modal_prem, dta.pay_mode, dta.name, dta.email, dta.policy_no);
                            }
                            else if (item.id == 6) {
                                //TODO - Display the pop for reccuring billing
                                invoice_end_date = dta.maturity_date;
                                modal_premium = dta.TotalPremium;
                                paymode = dta.pay_mode;
                                name = dta.name;
                                email = dta.email;
                                policy_no = dta.policy_no;
                                viewModel.pop_reccur_momo(true);
                            }
                            else if (item.id == 3) {

                            }
                        }
                    }).appendTo(container);
                }
            }
        ],
        //end of pop up for enquiry policy///


        //pop up for recurring billing
        pop_reccur_momo: ko.observable(false),
        hide_recur_momo: function () {
            viewModel.pop_reccur_momo(false);
        },
        dxFormRecur: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
            onInitialized: function (e) {
                formRecurInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                {
                    label: {
                        text: "Telco Company"
                    },
                    editorType: "dxLookup",
                    dataField: "telco",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: Telcos,//[{ id: 1, description: 'Airtel' }, { id: 2, description: 'MTN' }, { id: 3, description: 'Vodaphone' }],
                        displayExpr: 'Name',
                        valueExpr: 'UniqueCode'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Telco is required"
                    }]
                }, {
                    label: {
                        text: "MOMO Number"
                    },
                    editorType: "dxTextBox",
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
                    dataField: "momo_no",
                    validationRules: [{
                        type: "required",
                        message: "MOMO Number is required"
                    }]
                }, {

                    label: {
                        text: "First Deduction Date"
                    },
                    editorType: "dxDateBox",
                    dataField: "deduction_date",
                    validationRules: [{
                        type: "required",
                        message: "First Deduction Date is required"
                    }]
                },
                {
                    dataField: "btnregister",
                    itemType: "button",
                    horizontalAlignment: "center",
                    verticalAlignment: "bottom",
                    buttonOptions: {
                        text: "Request",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        icon: "save",
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
                                    name: "Registering MOMO client"
                                });
                                let data = formRecurInstance.option("formData");
                                //console.log(data);
                                //invoice_end_date,modal_premium,paymode,name,email,policy_no
                                let order_date = viewModel.addOneDay(viewModel.formatDates(data['deduction_date']));
                                get_life.DBhubtel("hubtel_create.php?order_date=" + order_date + "&invoice_end_date=" + invoice_end_date +
                                    "&mobile_no=" + data['momo_no'] + "&modal_prem=" + modal_premium + "&paymentinterval=" + paymode +
                                    "&customerName=" + name + "&email=" + email + "&policyNo=" + policy_no +
                                    "&telco_id=" + data['telco'] + "&is_micro=" + is_micro).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.responseCode == "0001") {
                                            //console.log(result.record_id);
                                            //viewModel.applications_store(result.PolicyDetails);
                                            recurringInvoiceId = result.data.recurringInvoiceId;
                                            requestId = result.data.requestId;
                                            otpPrefix = result.data.otpPrefix;

                                            formRecurInstance.itemOption("telco", "visible", false);
                                            formRecurInstance.itemOption("momo_no", "visible", false);
                                            formRecurInstance.itemOption("btnregister", "visible", false);
                                            formRecurInstance.itemOption("deduction_date", "visible", false);

                                            formRecurInstance.itemOption("otp", "visible", true);
                                            formRecurInstance.itemOption("btnconfirm", "visible", true);

                                        } else {
                                            viewModel.show_test(result.errors[0].messages, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                            }

                        }
                    }
                }, {
                    label: {
                        text: "OTP"
                    },
                    editorType: "dxNumberBox",
                    visible: false,
                    dataField: "otp"
                },
                {
                    dataField: "btnconfirm",
                    visible: false,
                    itemType: "button",
                    horizontalAlignment: "center",
                    verticalAlignment: "bottom",
                    buttonOptions: {
                        text: "Register",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        icon: "money",
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
                                    name: "Sending OTP"
                                });
                                let data = formRecurInstance.option("formData");
                                let otpCode = otpPrefix + "-" + data['otp'];
                                get_life.DBhubtel("hubtel_verify.php?recurringInvoiceId=" + recurringInvoiceId + "&requestId="
                                    + requestId + "&otpCode=" + otpCode).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.responseCode == "0001") {

                                            viewModel.hide_recur_momo();
                                            formRecurInstance.resetValues();

                                            formRecurInstance.itemOption("telco", "visible", true);
                                            formRecurInstance.itemOption("momo_no", "visible", true);
                                            formRecurInstance.itemOption("btnregister", "visible", true);
                                            formRecurInstance.itemOption("deduction_date", "visible", true);

                                            formRecurInstance.itemOption("otp", "visible", false);
                                            formRecurInstance.itemOption("btnconfirm", "visible", false);

                                            DevExpress.ui.dialog.alert("Complete by approving the prompt on your phone", "Success");

                                        } else {
                                            viewModel.show_test(result.errors[0].messages, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                            }

                        }
                    }
                }
            ],
        },
        addOneDay: function (dateInput) {
            // Convert the input to a Date object
            const inputDate = new Date(dateInput);

            // Add one day to the input date
            const newDate = new Date(inputDate);
            newDate.setDate(inputDate.getDate() + 1);

            // Return the new date as a string in the format YYYY-MM-DD
            return newDate.toISOString().slice(0, 10);
        }

    };

    return viewModel;
};