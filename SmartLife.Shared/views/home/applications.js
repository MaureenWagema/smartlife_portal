SmartLife.applications = function (params) {
    "use strict";

    var formSearchDetailsInstance;
    var agent_name_group_index = undefined;
    var vs_agent_name = false;
    var vs_agent_office = false;
    var agent_office_index = undefined;
    var vs_agent_branch = false;
    var vs_agent_sector = false;
    var agent_branch_index = undefined;
    var agent_sector_index = undefined;
    //"use strict";
    var IsAgent = false;
    var IsMicro = false;
    var IsIL = true;
    var bool_grouping = false;
    var ProductsList = SmartLife.planinfo;
    //TODO-SmartLife.planinfo
    //1. if POS - display either micro or life 
    //pos_type:0-Admin;1-Individual;2-Micro;3-Group;4-Pension;5-Medical;6-Bancassurance.
    if (SmartLife.login_type == 3) {
        agent_name_group_index = undefined;
        vs_agent_name = false;
        if (SmartLife.pos_type == 2) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "1" && plan.IsForMportal == "1"));

        } else {
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "0" && plan.IsForMportal == "1") || (plan.IsCreditLife == 1 || plan.mortgage == 1 || plan.is_keyman == 1));
        }
    }

    //2. If agent - display micro, inv life & bancassurance
    if (SmartLife.login_type == 2) {
        bool_grouping = true;
        IsAgent = true;
        agent_name_group_index = 3;
        vs_agent_name = true;
        if (SmartLife.channel == 5) {//micro
            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == 1));
            IsMicro = true;
            IsIL = false;
        }
        if (SmartLife.channel == 3) {//inv life plan.microassurance == 0 && plan.isBancAssurance == 1 &&
            if (SmartLife.agent_position_id == "8" || SmartLife.agent_position_id == "7") {
                vs_agent_sector = true;
                vs_agent_branch = true;
                vs_agent_office = true;
                agent_sector_index = 0;
                agent_branch_index = 1;
                agent_office_index = 2;
            }
            if (SmartLife.agent_position_id == "6" || SmartLife.agent_position_id == "4") {
                vs_agent_office = true;
                agent_office_index = 2;
            }

            ProductsList = SmartLife.planinfo.filter(plan => (plan.microassurance == "0" && plan.mortgage == "0" && plan.IsForMportal == "1" && plan.isBancAssurance == "0"));
        }
        if (SmartLife.channel == 4) {//bancassurance,   plan.plan_id == "45" || plan.plan_id == "9"
            ProductsList = [];

            ProductsList = SmartLife.planinfo;
            
            let prefix = SmartLife.agent_name.split("-")[0];
            ProductsList.forEach(function (jsonObject) {
                // Print the name property of each object
                console.log(jsonObject.description);
                jsonObject.description = jsonObject.description;//prefix + "-" + jsonObject.description;
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

    function addYearsToDate(years) {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getFullYear() + years, currentDate.getMonth(), currentDate.getDate());

        const year = futureDate.getFullYear();
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
        const day = futureDate.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
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
        formatSummary: function (value) {
            const formattedValue = value.toFixed(2);
            return Number(formattedValue).toLocaleString();
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
        get_start_date: function () {
            const currentDate = new Date();

            // Set the date to the first day of the current month
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            // Extract the day, month, and year
            const day = String(startOfMonth.getDate()).padStart(2, '0');
            const month = String(startOfMonth.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
            const year = startOfMonth.getFullYear();

            // Format the date as dd/mm/yyyy
            const formattedStartOfMonth = `${day}/${month}/${year}`;
            return formattedStartOfMonth;
        },
        viewShown: function () {
            //sync the data here..
            //agent
            if (SmartLife.login_type == 2) {//SmartLife.agent_no
                //TODO - put the current month on date_from and date_to
                //formSearchDetailsInstance.updateData("date_from", viewModel.get_start_date());
                //formSearchDetailsInstance.updateData("date_to", Date());
                /*let data = formSearchDetailsInstance.option("formData");
                viewModel.get_policy_applications("policy/getProposal?agent_code=" + SmartLife.agent_no +
                    "&date_from=" + viewModel.formatDates(new Date(data['date_from'])) + 
                    "&date_to=" + viewModel.formatDates(new Date(data['date_to']))
                );*/
            } else if (SmartLife.login_type == 3) {//POS
                viewModel.get_policy_applications("policy/getProposal?pos_type=" + SmartLife.pos_type + "&IsCreditLifeUser=" + SmartLife.IsCreditLifeUser);
            }
        },


        new_proposal: function () {
            viewModel.navigateForward("products_list", "");
        },

        /////search form////

        dxFormSearchDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            visible: IsAgent,
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

                                //viewModel.get_user_activities();
                                let data = formSearchDetailsInstance.option("formData");
                                viewModel.get_policy_applications("policy/getProposal?agent_code=" + SmartLife.agent_no +
                                    "&date_from=" + viewModel.formatDates(new Date(data['date_from'])) +
                                    "&date_to=" + viewModel.formatDates(new Date(data['date_to']))
                                );
                            }
                        }
                    }
                }],

        },

        ////end of search form///


        onrowPrepared: function (e) {
            if (IsIL) {
                if (e.data != undefined) {
                    /*if (e.data.StatusDescription == "DRAFT")
                        e.rowElement.css('background', '#00ffff');// blue
                    else if (e.data.StatusDescription == "SUBMITTED")
                        e.rowElement.css('background', '#ffff00');//yellow
                        */
                    if (e.data.UwCode == "6")
                        e.rowElement.css('background', '#bfff00');//green
                    else if (e.data.UwCode == "7" || e.data.UwCode == "8" || e.data.UwCode == "12")
                        e.rowElement.css('background', '#ff4000');//red

                }
            }
            /*if (IsMicro) {
                if (e.data != undefined) {
                    if (e.data.Status == "6")
                        e.rowElement.css('background', '#bfff00');//green
                    else if (e.data.Status == "7" || e.data.UwCode == "8")
                        e.rowElement.css('background', '#ff4000');//red

                }
            }*/
        },
        //applications grid
        applications_store: ko.observableArray(),
        //names, email, gender, plan, proposal_no, UwCode, uw_name

        //agent_code_no, Status, HasBeenPicked, isWebCompleted, MicroProposal, ProposalNumberLink, UwCode, StatusName, uw_name, uw_reason,
        //ID, surname, other_name, email, name, mobile, TotalPremium, term, gender_code, plan_code, proposal_no, date_synced, isApproved
        //agent_office
        bool_grouping: ko.observable(bool_grouping),
        applications_columns: [
            {
                allowEditing: false,
                dataField: 'AllowMproposalEdit',
                dataType: 'boolean',
                visible: false,
                cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
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
            /*{
                dataField: 'agent_name',
                visible: vs_agent_name,
                groupIndex: agent_name_group_index
            },*/
            {
                dataField: 'agent_code',
                caption: 'Agent Name',
                lookup: {
                    dataSource: SmartLife.LifeAgents, valueExpr: 'id', displayExpr: 'agent_no_name'
                },
                visible: vs_agent_name,
                groupIndex: agent_name_group_index
            },
            {
                dataField: 'Status',
                visible: false
            },
            {
                dataField: 'HasBeenPicked',
                visible: false
            },
            {
                dataField: 'isWebCompleted',
                visible: false
            }, {
                dataField: 'MicroProposal',
                visible: false
            },
            {
                dataField: 'ProposalNumberLink',
                visible: false
            },
            {
                dataField: 'UwCode',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'proposal_no',
                visible: true
            },
            {
                dataField: 'StatusName',
                visible: IsMicro
            },
            {
                dataField: 'uw_name',
                caption: "Status",
                visible: IsIL
            },
            {
                dataField: 'uw_reason',
                caption: "Reason",
                visible: true
            },
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
                dataField: 'TotalPremium',
                caption: 'Premium',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'date_synced',
                dataType: 'date',
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
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'term',
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
            {//HasBeenPicked
                allowEditing: false,
                dataField: 'isApproved',
				dataType: 'boolean',
                visible: false
            },{
                dataField: 'pay_code',
                caption: 'Payment Method',
                lookup: {
                    dataSource: SmartLife.Paymentinfo, valueExpr: 'payment_mode', displayExpr: 'decription'
                },
                visible: true
            }, {
                dataField: 'employer',
                lookup: {
                    dataSource: SmartLife.Employerinfo, valueExpr: 'emp_code', displayExpr: 'Name'
                },
                visible: true
            }, {
                dataField: 'employee_no',
                visible: true
            }, {
                dataField: 'momo_no',
                visible: true
            }, {
                dataField: 'bank_code',
                caption: 'Bank',
                lookup: {
                    dataSource: SmartLife.Banks, valueExpr: 'bank_code', displayExpr: 'description'
                },
                visible: true
            }, {
                dataField: 'bank_branch',
                lookup: {
                    dataSource: SmartLife.BanksBranches, valueExpr: 'id', displayExpr: 'bankBranchName'
                },
                visible: false
            }, {
                dataField: 'BankaccountName',
                visible: true
            }, {
                dataField: 'bank_account_no',
                visible: true
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
                                var data = { plan_code: dta.plan_code, id: dta.ID, rd_form: false };
                                if (dta.HasBeenPicked == 0 || dta.isWebCompleted == 0) {
                                    if (dta.plan_code == "45" || dta.plan_code == "52") {
                                        viewModel.navigateForward("embedded_form", JSON.stringify(data));//embeded
                                    } else if (dta.plan_code == "9") {
                                        viewModel.navigateForward("application_form", JSON.stringify(data));
                                    }  else {
                                        viewModel.navigateForward("proposal_form", JSON.stringify(data));
                                    }
                                } else {
                                    if (dta.AllowMproposalEdit == "1") {
                                        viewModel.navigateForward("proposal_form", JSON.stringify(data));
                                    } else {
                                        DevExpress.ui.dialog.alert("Proposal is appraised");
                                    }
                                }
                            }
                            else if (item.id == 2) {
                                //add an alert dialog - Are you sure ...Prompting pay
                                alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.mobile, dta.TotalPremium, "MONTHLY", dta.name, dta.email, dta.policy_no);
                            }
                            else if (item.id == 3) {
                                //TODO - Display the pop for reccuring billing
                                invoice_end_date = addYearsToDate(parseInt(dta.term));//dta.maturity_date;
                                modal_premium = dta.TotalPremium;
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