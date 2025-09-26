SmartLife.broker_forgot = function (params) {
    "use strict";
    var formForgotPassInstance;
    var ReceivedOTP;

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

        dxFormForgotPassword: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formForgotPassInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    label: {
                        text: "Contact Number"
                    },
                    editorType: "dxTextBox",
                    dataField: "mobile_no",
                    visible: true,
                    editorOptions: {
                        readOnly: false,
                        //mode:'email'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Contact Number is required"
                    }]
                }, {
                    label: {
                        text: "OTP"
                    },
                    editorType: "dxTextBox",
                    dataField: "otp",
                    visible: false,
                    validationRules: [{
                        type: "required",
                        message: "Agent Number is required"
                    }]
                }, {
                    itemType: "empty"
                }, {
                    itemType: "button",
                    dataField: "agent_verify",
                    visible: true,
                    buttonOptions: {
                        text: "VERIFY",
                        icon: "user",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //post data...

                                //let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                viewModel.doAgentVerify();

                            }
                        }
                    }
                }, {
                    itemType: "button",
                    dataField: "otp_verify",
                    visible: false,
                    buttonOptions: {
                        text: "VERIFY OTP",
                        icon: "user",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                let data = formForgotPassInstance.option("formData");
                                if (ReceivedOTP == data['otp']) {
                                    viewModel.doOTPVerify();
                                } else {
                                    DevExpress.ui.dialog.alert("Wrong OTP", "ALERT!");
                                }
                            }
                        }
                    }
                }]
        },

        doAgentVerify: function () {
            //SmartLife.app.navigate('home', { root: true });
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            let data = formForgotPassInstance.option("formData");
            console.log(data);
            get_life.DBpost("auth/SendBrokerOTP", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    ReceivedOTP = result.otp;
                    //SmartLife.app.navigate('home', { root: true });
                    formForgotPassInstance.itemOption("otp", "visible", true);
                    formForgotPassInstance.itemOption("otp_verify", "visible", true);

                    formForgotPassInstance.itemOption("agent_no", "visible", false);
                    formForgotPassInstance.itemOption("agent_verify", "visible", false);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        doOTPVerify: function () {
            //SmartLife.app.navigate('home', { root: true });
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            let data = formForgotPassInstance.option("formData");
            data['is_forgot'] = 1;
            let mobile_no = data['mobile_no'];
            console.log(data);
            get_life.DBpost("auth/AgentRegistration", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    let data = [{ 'mobile_no': mobile_no }];
                    viewModel.navigateForward("confrim_password", JSON.stringify(data));
                    //SmartLife.app.navigate('confrim_password', { root: true });
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