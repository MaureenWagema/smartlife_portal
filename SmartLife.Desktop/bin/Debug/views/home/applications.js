SmartLife.applications = function (params) {
    "use strict";

    //"use strict";
    var ProductsList = SmartLife.planinfo;
    //TODO-SmartLife.planinfo
    //1. if POS - display either micro or life 
    //pos_type:0-Admin;1-Individual;2-Micro;3-Group;4-Pension;5-Medical;6-Bancassurance.
    if (SmartLife.login_type == 3) {
        if (SmartLife.pos_type == 2) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "1" && plan.IsForMportal == "1"));
        } else {
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "0" && plan.IsForMportal == "1") || (plan.IsCreditLife == 1 || plan.mortgage == 1 || plan.is_keyman == 1));
        }
    }

    //2. If agent - display micro, inv life & bancassurance
    if (SmartLife.login_type == 2) {
        if (SmartLife.channel == 5) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 1));
        }
        if (SmartLife.channel == 3) {//inv life plan.microassurance == 0 && plan.isBancAssurance == 1 &&
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "0" && plan.mortgage == "0" && plan.IsForMportal == "1" && plan.isBancAssurance == "0"));
        }
        if (SmartLife.channel == 4) {//bancassurance,   plan.plan_id == "45" || plan.plan_id == "9"
            //console.log(ProductsList);
            //ProductsList = SmartLife.planinfo.filter(plan => ((plan.microassurance == "0" && plan.mortgage == "0" && plan.IsForMportal == "1") || plan.IsCreditLife == 1 || plan.mortgage == 1));
            ProductsList = SmartLife.planinfo.filter(plan => (plan.showNIBB == "1"));
            //let prefix = SmartLife.agent_name.split("-");
            //for (let key in ProductsList) {
            //if (key === "age") {
            //ProductsList[plan_code] = prefix+"-"+ProductsList[plan_code];
            //}
            //}
            let prefix = SmartLife.agent_name.split("-")[0];
            ProductsList.forEach(function (jsonObject) {
                // Print the name property of each object
                console.log(jsonObject.description);
                jsonObject.description = prefix + "-" + jsonObject.description;
            });
        }
        if (SmartLife.channel == 1) {//bank
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 0 && plan.isBancAssurance == 0 && plan.mortgage == 0 && plan.IsForMportal == "1"));
        }
    }

    var formRecurInstance;
    var invoice_end_date, modal_premium, paymode, name, email, policy_no;
    var recurringInvoiceId, requestId, otpPrefix;
    //|| telco.emp_code === "V-CASH" Telcos
    console.log(SmartLife.Telcos);
    var Telcos = SmartLife.Telcos.filter(telco => (telco.emp_code == "MTNMOB" || telco.emp_code == "V-CASH"));
    var keysWithAge25 = Telcos.map(person => person.emp_code);
    var is_micro = false;
    if (SmartLife.pos_type == 2) is_micro = true;

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
        getNumberOfDays: function (dateFrom, dateTo) {
            const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

            // Convert the date strings to Date objects
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);

            // Calculate the difference in milliseconds between the two dates
            const diffInMilliseconds = Math.abs(toDate - fromDate);

            // Calculate the number of days by dividing the difference by the number of milliseconds in a day
            const numberOfDays = Math.round(diffInMilliseconds / oneDay);

            return numberOfDays;
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

        send_payment_prompt: function (mobile,modal_premium,paymode,name,email,policy_no) {
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

        get_policy_applications: function (url_params) {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting applications"
            });
            get_records.DBget(url_params).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    var tmp_policy_arr = result.policy_arr;
                    var tmp_pol_arr = [];
                    for (var key in tmp_policy_arr) {
                        //var obj = data.messages[key];
                        //console.log(tmp_policy_arr[key]['name']);
                        if (SmartLife.client_name == tmp_policy_arr[key]['name']) {
                            tmp_pol_arr.push(tmp_policy_arr[key]);
                        }
                    }
                    //console.log(tmp_pol_arr);
                    viewModel.applications_store(result.policy_arr);
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
            //sync the data here..
            //agent
            if (SmartLife.login_type == 2) {//SmartLife.agent_no
                viewModel.get_policy_applications("policy/getProposal?agent_code=" + SmartLife.agent_no);
            } else if (SmartLife.login_type == 3) {//POS
                viewModel.get_policy_applications("policy/getProposal?pos_type=" + SmartLife.pos_type);
            }
        },

        new_proposal: function () {
            viewModel.navigateForward("products_list", "");
        },

        //applications grid
        applications_store: ko.observableArray(),
        //names, email, gender, plan, proposal_no
        applications_columns: [
            {
                dataField: 'ID',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'surname',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'other_name',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'email',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'mobile',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'modal_premium',
                caption: 'Premium',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'gender_code',
                lookup: {
                    dataSource: SmartLife.Genderinfo, valueExpr: 'Code', displayExpr: 'Desc'
                },
                visible: false,
            },
            {
                allowEditing: false,
                dataField: 'plan_code',
                lookup: {
                    dataSource: ProductsList, valueExpr: 'plan_id', displayExpr: 'description'
                },
                visible: true//
            },
            {
                allowEditing: false,
                dataField: 'proposal_no',
                visible: true
            },
            {//HasBeenPicked
                allowEditing: false,
                dataField: 'isApproved',
				dataType: 'boolean',
                visible: false
            },{
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
                                        "name": "View / Edit",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    }, {
                                        "id": 2,
                                        "name": "Prompt Premium Payment",
                                        "icon": "mdi mdi-cash",
                                        // visible: false,
                                    },
                                    {
                                        "id": 3,
                                        "name": "Reg Recurring Deductions",
                                        "icon": "mdi mdi-eye"

                                    },
                                    {
                                        "id": 4,
                                        "name": "Worksheet",
                                        "icon": "mdi mdi-eye"

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
                                var data = { plan_code: dta.plan_code, id: dta.ID, rd_form: false };
                                if (dta.plan_code == "45") {
                                    viewModel.navigateForward("embedded_form", JSON.stringify(data));//embeded
                                } else if (dta.plan_code == "9") {
                                    viewModel.navigateForward("application_form", JSON.stringify(data));
                                }  else {
                                    viewModel.navigateForward("proposal_form", JSON.stringify(data));
                                }
                                /*} else {
                                    DevExpress.ui.dialog.alert("Proposal is appraised");
                                }*/
                            }
                            else if (item.id == 2) {
                                //add an alert dialog - Are you sure ...Prompting pay
                                alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.mobile, dta.modal_premium, "MONTHLY", dta.name, dta.email, dta.policy_no);
                            }
                            else if (item.id == 3) {
                                //TODO - Display the pop for reccuring billing
                                invoice_end_date = "2024-10-01";//dta.maturity_date;
                                modal_premium = dta.modal_premium;
                                paymode = "MONTHLY";//dta.pay_mode;
                                name = dta.name;
                                email = dta.email;
                                policy_no = dta.policy_no;
                                viewModel.pop_reccur_momo(true);
                            } else if (item.id == 4) {
                                if (dta.isApproved) {
                                    let settings = 4;
                                    if (is_micro) settings = 1;
                                    var data = { policy_no: dta.policy_no, settings: settings };
                                    viewModel.navigateForward("reports", JSON.stringify(data));
                                } else {
                                    DevExpress.ui.dialog.alert("Generate Proposal no first", "Failed");
                                }
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],

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