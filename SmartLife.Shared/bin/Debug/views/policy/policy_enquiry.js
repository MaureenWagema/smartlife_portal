SmartLife.policy_enquiry = function (params) {
    "use strict";
    
    var formSearchDetailsInstance;
    var formRecurInstance;
    var invoice_end_date, modal_premium, paymode, name, email, policy_no;
    var recurringInvoiceId, requestId, otpPrefix;
    //|| telco.emp_code === "V-CASH"
    var Telcos = SmartLife.Telcos.filter(telco => (telco.emp_code == "MTNMOB" || telco.emp_code == "V-CASH"));
    var keysWithAge25 = Telcos.map(person => person.emp_code);
    var is_micro = 0;
    if (SmartLife.pos_type == 2) {//micro
        is_micro = 1;
    }

    function alert_dialog(title, msg, mobile, modal_premium, paymode, name, email, policy_no) {
        var myDialog = DevExpress.ui.dialog.custom({
            title: title,
            message: msg,
            buttons: [{
                text: "OK",
                onClick: function (e) {
                    //recurse...
                    //sync_autoload_params();
                    viewModel.send_payment_prompt(mobile, '0.1', paymode, name, email, policy_no);
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
        LoadPanelShown: ko.observable(false),

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

        get_policy_applications: function (default_url) {
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching client policies"
            });
            let data = formSearchDetailsInstance.option("formData");
            console.log(data);//getMicroPolicyDetails
            get_life.DBget(default_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.record_id);
                    viewModel.applications_store(result.PolicyDetails);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        refresh_list: function () {
            viewModel.viewShown();
        },
        viewShown: function () {
            viewModel.get_access_roles();
            //sync the data here..
            if (viewModel.applications_store().length == 0) {
            //pos_type:0-Admin;1-Individual;2-Micro;3-Group;4-Pension;5-Medical;
                let default_url = "policy/getPolicyDetails";
                if (SmartLife.pos_type == 2) default_url = "policy/getMicroPolicyDetails";
                viewModel.get_policy_applications(default_url);
            }
        },

        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {

            });
        },

        //applications grid
        applications_store: ko.observableArray(),
        //names, email, gender, plan, proposal_no
        applications_columns: [
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
                dataField: 'modal_prem',
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
                                var data = { policy_no: dta.policy_no, settings: settings, status_code: dta.status_code, prem_units: dta.prem_units };
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
                                alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.mobile, dta.modal_prem, dta.pay_mode, dta.name, dta.email, dta.policy_no);
                            }
                            else if (item.id == 6) {
                                //TODO - Display the pop for reccuring billing
                                invoice_end_date = dta.maturity_date;
                                modal_premium = dta.modal_prem;
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
                colCount: 3,
                items: [
                    {
                        label: {
                            text: "Search Criteria"
                        },
                        editorType: "dxLookup",
                        dataField: "criteria",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            searchEnabled:false,
                            showClearButton: true,
                            clearButtonText: 'Clear',
                            dataSource: [{ id: 1, description: 'Name' }, { id: 2, description: 'Policy number' }, { id: 3, description: 'Mobile number' }, { id: 4, description: 'Staff Number' }, { id: 5, description: 'Agent Number' }],
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
                                    let url = "policy/getPolicyDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                    if (SmartLife.login_type == 3) {//POS
                                        //just search using pos_type
                                        if (SmartLife.pos_type == 1) {//individual life
                                            url = "policy/getPolicyDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                        }
                                        else if (SmartLife.pos_type == 2) {//micro
                                            url = "policy/getMicroPolicyDetails?criteria=" + data['criteria'] + "&search_entry=" + data['search_entry'];
                                        }
                                    }

                                    get_life.DBget(url).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //console.log(result.record_id);
                                            viewModel.applications_store(result.PolicyDetails);
                                        } else {
                                            viewModel.show_test(result.msg, 'error');
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
                    editorType: "dxNumberBox",
                    dataField: "momo_no",
                    validationRules: [{
                        type: "required",
                        message: "First Deduction Date is required"
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
                                    "&telco_id=" + data['telco']).done(function (result) {
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

                                            DevExpress.ui.dialog.alert("Complete by approving the prompt on your phone","Success");
                                        
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
    var menuItems = [{
        text: 'Upload',
        items: [
            { text: 'From your computer' },
            { text: 'From a cloud service' }
        ]
    }, {
        text: 'Share',
        items: [
            { text: 'Log in with Facebook' },
            { text: 'Log in with Twitter' }
        ]
    }];
    const menuData = [{
        id: '1',
        name: '',
        icon: 'menu',
        items: [{
            id: '1_1',
            name: 'Edit',
            icon: 'edit',
        }, {
            id: '1_2',
            name: 'Delete',
            icon: 'trash',
        }]
    }];
    return viewModel;
};