SmartLife.add_member = function (params) {
    "use strict";

    var formMemberDetailsInstance;
    var rcd_id;
    var get_data;
    if (params.item && params.item !== null && params.item !== undefined && params.item !== '' && params.item.length !== 0) get_data = JSON.parse(params.item);
    console.log(get_data);
    if (get_data != undefined) rcd_id = get_data['rcd_id'];

    var viewModel = {
        //  Put the binding properties here
        go_back: function () {
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
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },

        //get loan 
        get_member: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing loan details"
            });

            get_form.DBget("agents/getAgentLoans?id=" + rcd_id + "&agent_no=" + SmartLife.agent_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    $("#dxFormLoan").dxForm({
                        formData: result.AgentLoans[0]
                    }).dxForm("instance");
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },


        viewShown: function () {

            if (rcd_id != undefined && parseInt(rcd_id) > 0) {
                viewModel.get_member();
            }

        },


        dxFormMember: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formMemberDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //SchemeID,policy_no,member_no, Names, dob,commence_date,status,exit_date, TotalPremium,Salary
            items: [
                {
                    label: {
                        text: "MemberId"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "MemberId"
                }, {
                    label: {
                        text: "Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "Names",
                    validationRules: [{
                        type: "required",
                        message: "Names For is required"
                    }]
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    editorType: "dxDateBox",
                    dataField: "dob",
                    validationRules: [{
                        type: "required",
                        message: "Date of Birth is required"
                    }]
                }, {
                    label: {
                        text: "Commencement Date"
                    },
                    editorType: "dxDateBox",
                    dataField: "commence_date",
                    validationRules: [{
                        type: "required",
                        message: "Commencement Date is required"
                    }]
                }, {//Salary
                    label: {
                        text: "Total Premium"
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        readOnly: false
                    },
                    dataField: "TotalPremium",
                    validationRules: [{
                        type: "required",
                        message: "Narration is required"
                    }]
                }, {//Salary
                    label: {
                        text: "Salary"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly: false
                    },
                    dataField: "Salary",
                    validationRules: [{
                        type: "required",
                        message: "Salary is required"
                    }]
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "ADD MEMBER",
                        horizontalAlignment: "right",
                        width: 150,
                        type: "default",
                        onClick: function (args) {

                            //tabsInstance.option("selectedIndex", 1);
                            //TODO.. 
                            //1. if rcd_id is undefined or empty then save and assign the rcd_id-
                            var result = args.validationGroup.validate();

                            if (result.isValid) {
                                //if (rcd_id == undefined || rcd_id == "") {
                                //save
                                ///post data form as it is
                                viewModel.LoadPanelShown(true);
                                let get_life = new DB({
                                    name: "submitting the member data"
                                });
                                let data = formMemberDetailsInstance.option("formData");
                                data['dob'] = viewModel.formatDates(new Date(data['dob']));
                                data['commence_date'] = viewModel.formatDates(new Date(data['commence_date']));
                                data['policy_no'] = SmartLife.scheme_no;
                                data['Status'] = "001";
                                var tableData = { tableData: JSON.stringify(data) };
                                get_life.DBpost("group/addMemberToScheme", tableData).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        console.log(result.record_id);
                                        //rcd_id = result.record_id;
                                        //navnextPrev(1);
                                        viewModel.go_back();
                                    } else {
                                        viewModel.show_test(result.msg, 'error');
                                    }
                                }).fail(function () {
                                    viewModel.LoadPanelShown(false);
                                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                });
                                //}
                            }
                        }
                    }
                }],
        },


    };

    return viewModel;
};