SmartLife.confrim_password = function (params) {
    "use strict";
    var formConfirmPassInstance;

    var agent_no;
    var get_data = JSON.parse(params.item);
    agent_no = get_data[0]['agent_no'];
    

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
        LoadPanelShown: ko.observable(false),
        viewShown: function () {
            var table = $('#register').children();
            table.find('p').click(function () {
                viewModel.navigateForward("register", "");
            });
        },

        dxFormChangePassword: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formConfirmPassInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    label: {
                        text: "New Password"
                    },
                    editorType: "dxTextBox",
                    dataField: "password",
                    editorOptions: {
                        readOnly: false,
                        mode: 'password',
                    },
                    validationRules: [{
                        type: "required",
                        message: "Password is required"
                    }]
                }, {
                    label: {
                        text: "Confirm New Password"
                    },
                    editorType: "dxTextBox",
                    dataField: "confirm_password",
                    editorOptions: {
                        readOnly: false,
                        mode: 'password',
                    },
                    validationRules: [{
                        type: "compare",
                        comparisonTarget: function () {
                            let data = formConfirmPassInstance.option("formData");
                            return data['password'];
                        },
                        message: "'Password' and 'Confirm Password' do not match."
                    },
                        {
                            type: "required",
                            message: "Confirm Password is required"
                        }]
                }, {
                    itemType: "empty"
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "SAVE",
                        icon: "user",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //post data...

                                //let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                viewModel.doChange();

                            }
                        }
                    }
                }]
        },

        doChange: function () {
            //SmartLife.app.navigate('home', { root: true });
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            let data = formConfirmPassInstance.option("formData");
            data['agent_no'] = agent_no;
            console.log(data);
            get_life.DBpost("auth/ChangePassword", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.record_id);
                    //navigate to the my applications screen
                    SmartLife.app.navigate('agent_login', { root: true });
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        }
    };

    return viewModel;
};