SmartLife.activities_list = function (params) {
    "use strict";
    var formSearchDetailsInstance;
    var is_micro = 0;
    if (SmartLife.login_type == 3) {
        //pos 
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1;
        }
    }

    var vs_search_dates = true;
    if (SmartLife.login_type == 1) {
        vs_search_dates = false;
    }

    //save fn



    //retreive fn

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

        vs_add_claim: ko.observable(false),


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

            viewModel.get_access_roles();
            viewModel.get_user_activities();

        },

        get_access_roles: function () {
            var get_roles = new Access({
                name: "getting access roles"
            });
            get_roles.get_access_roles(function () {

            });
        },

        get_user_activities: function () {
            viewModel.LoadPanelShown(true);
            let data = formSearchDetailsInstance.option("formData");
            var get_form = new DB({
                name: "get existings checklists"
            });
            get_form.DBget("policy/getActivitiesData?created_by=" + SmartLife.pos_name + "&is_micro=" + is_micro +
                "&date_from=" + viewModel.formatDate(new Date(data["date_from"])) + "&date_to=" + viewModel.formatDate(new Date(data["date_to"]))).done(function (result) {
                    viewModel.LoadPanelShown(false);
                    if (result.success == true) {
                        viewModel.activity_Store(result.Activities);
                        viewModel.per_client_store(result.ClientSummary);
                    } else {
                        viewModel.show_test(result.msg, 'error');
                    }
                }).fail(function () {
                    viewModel.LoadPanelShown(false);
                    //alert_dialog("Server not accessible. Check internet connectivity");
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });
        },

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

                                viewModel.get_user_activities();

                            }
                        }
                    }
                }],

        },



        LoadPanelShown: ko.observable(false),
        activity_Store: ko.observableArray(),
        activity_columns: [
            {
                dataField: 'id',
                visible: false
            }, {
                allowEditing: false,
                dataField: 'Activity',
                lookup: {
                    dataSource: SmartLife.Activities, valueExpr: 'id', displayExpr: 'description'
                },
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'staff_no',
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'ClientName',
                visible: true,
            }, {//
                allowEditing: false,
                dataField: 'created_by',
                caption: 'POS officer',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {//statuscode
                allowEditing: false,
                dataField: 'created_on',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'eClaimId',
                visible: false
            }, {

                dataField: 'eEndorsementId',
                visible: false
            }, {
                allowEditing: false,
                dataField: 'ComplaintType',
                lookup: {
                    dataSource: SmartLife.POSComplaintType, valueExpr: 'id', displayExpr: 'description'
                },
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'Narration',//SmartLife.ClaimType, 
                visible: true,
            }
        ],

        claim_click: function (e) {
            var data = [{ policy_no: e.itemData.policy_no, claim_type: e.itemData.claim_type, notification_date: e.itemData.notification_date, tot_proceeds: e.itemData.tot_proceeds, net_pay: e.itemData.net_pay, reason: e.itemData.reason, amount_applied: e.itemData.amount_applied }];
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },

        add_activity: function () {
            viewModel.navigateForward("activity_form", "0");
        },



        per_client_store: ko.observableArray([]),
        per_client_menu_items: [
            {
                dataField: 'branch_name'
            },
            {
                dataField: 'total'
            },
        ],

        per_activity_store: ko.observableArray([]),
        per_activity_menu_items: [
            
        ]

    };

    return viewModel;
};