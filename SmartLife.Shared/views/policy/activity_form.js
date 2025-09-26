SmartLife.activity_form = function (params) {
    "use strict";
    var formDetailsInstance;
    var is_micro = 0;
    if (SmartLife.login_type == 3) {
        //pos 
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1;
        }
    }

    var Activities = SmartLife.Activities.filter(mode => (mode.showInPortal == 1));



    //retreive fn

    var viewModel = {
        go_back: function () {
            SmartLife.app.back();
        },
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
        

        },

        save_user_activities: function () {
            viewModel.LoadPanelShown(true);
            let data = formDetailsInstance.option("formData");
            var save_activity = new DB({
                name: "saving activity"
            });
            data["created_by"] = SmartLife.pos_name;
            save_activity.DBpost("policy/postPOSActivities", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    viewModel.go_back();
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        dxFormActivityDetails: {
            width: '100%',
            visible: true,
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            colCount: 1,
            items: [
                {
                    label: {
                        text: "Client Name"
                    },
                    editorType: "dxTextBox",
                    dataField: "ClientName",
                    validationRules: [{
                        type: "required",
                        message: "Client Name is required"
                    }]
                }, {
                    label: {
                        text: "Staff Number / Mobile Number"
                    },
                    editorType: "dxTextBox",
                    dataField: "staff_no",
                    validationRules: [{
                        type: "required",
                        message: "Staff Number / Mobile Number is required"
                    }]
                },
                {
                    label: {
                        text: "Activity"
                    },
                    editorType: "dxLookup",
                    dataField: "Activity",
                    visible: true,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: Activities,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {

                            //if activity is Complaint...
                            if (e.value == 4 || e.value == '4') {
                                formDetailsInstance.itemOption("ComplaintType", "visible", true);
                            } else {
                                formDetailsInstance.itemOption("ComplaintType", "visible", false);
                            }

                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Activity is required"
                    }]
                }, {
                    label: {
                        text: "Complain Type"
                    },
                    editorType: "dxLookup",
                    dataField: "ComplaintType",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.POSComplaintType,
                        displayExpr: 'description',
                        valueExpr: 'id',
                    },
                    validationRules: [{
                        type: "required",
                        message: "Complain Type is required"
                    }]
                }, {
                    label: {
                        text: "Narration"
                    },
                    editorType: "dxTextArea",
                    dataField: "Narration",
                    validationRules: [{
                        type: "required",
                        message: "Narration is required"
                    }]
                },
                {
                    label: {
                        text: "SAVE"
                    },
                    itemType: "button",
                    horizontalAlignment: "right",
                    verticalAlignment: "bottom",
                    buttonOptions: {
                        text: "SAVE",
                        horizontalAlignment: "right",
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

                                viewModel.save_user_activities();

                            }
                        }
                    }
                }],

        },



        LoadPanelShown: ko.observable(false),

        add_activity: function () {
            viewModel.navigateForward("activity_form", "0");
        }

    };

    return viewModel;
};