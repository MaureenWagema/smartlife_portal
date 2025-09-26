SmartLife.endorsement_list = function (params) {
    "use strict";
    var formSearchClaimsDetailsInstance;
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

    var viewModel = {
//  Put the binding properties here
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
        LoadPanelShown: ko.observable(false),
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        get_endorsements: function () {
            viewModel.LoadPanelShown(true);
            let data = formSearchClaimsDetailsInstance.option("formData");
            var get_form = new DB({
                name: "get existings endorsements"
            });
            get_form.DBget("policy/getRequestedEndorsements?client_no=" + SmartLife.clientno + "&is_micro=" + is_micro +
                "&date_from=" + viewModel.formatDate(new Date(data["date_from"])) + "&date_to=" + viewModel.formatDate(new Date(data["date_to"]))).done(function (result) {
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
        vs_endorsement_claim: ko.observable(false),
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

            if (SmartLife.login_type == 1) {
                viewModel.vs_endorsement_claim(true);
                viewModel.get_endorsements();
            } else {
                viewModel.vs_endorsement_claim(false);
            }

            
            
        },
        add_endorsement: function () {
            //life_endorsement
            viewModel.navigateForward("endorsement", "");
        },

        dxFormSearchDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            visible: vs_search_dates,
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSearchClaimsDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'SmartLife Search',
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

                                    viewModel.get_endorsements();

                                }
                            }
                        }
                    }],
            }],

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


    };

    return viewModel;
};