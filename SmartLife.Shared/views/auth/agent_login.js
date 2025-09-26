SmartLife.agent_login = function (params) {
    "use strict";
    var formLoginInstance;

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
            var table = $('#forgot_password').children();
            table.find('p').click(function () {
                viewModel.navigateForward("forgot_password", "");
            });
        },

        dxFormLogin: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formLoginInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    label: {
                        text: "Agent Number"
                    },
                    editorType: "dxTextBox",
                    dataField: "agent_no",
                    editorOptions: {
                        readOnly: false,
                        //value:'CA066'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Agent Number is required"
                    }]
                }, {
                    label: {
                        text: "Password",
                        
                    },
                    editorType: "dxTextBox",
                    dataField: "password",
                    editorOptions: {
                        readOnly: false,
                        mode: 'password',
                        //value: 'admin'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Password is required"
                    }]
                }, {
                    itemType: "empty"
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "LOGIN",
                        icon: "user",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //post data...

                                //let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                viewModel.doLogin();

                            }
                        }
                    }
                }]
        },

        doLogin: function () {
            //SmartLife.app.navigate('home', { root: true });
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            let data = formLoginInstance.option("formData");
            console.log(data);
            get_life.DBpost("auth/AgentLogin", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.record_id);
                    //navigate to the my applications screen
                    /*
                    "success": true,
    "agent_no": "DTB0003",
    "BusinessChannel": "5",
    "name": "JATO JACKSON"
                     */
                    SmartLife.is_logged = 1;
                    SmartLife.is_admin = 0;
                    SmartLife.clientno = '';////K661141   C00300142
                    SmartLife.client_name = '';
                    SmartLife.agent_no = result.agent_no;///NYA0001, DTB0003, CA066  - MRtaUh
                    SmartLife.agent_name = result.name;
                    SmartLife.agent_photo = result.photo;
                    SmartLife.agent_position = result.Position;
                    SmartLife.agent_position_id = result.PositionId;
                    SmartLife.agent_office = result.Office;
                    SmartLife.IsManager = result.IsManager;
                    SmartLife.pos = '';
                    SmartLife.pos_name = '';
                    SmartLife.channel = result.BusinessChannel;
                    SmartLife.login_type = 2;//agent
                    SmartLife.pos_type = 0;

                    var save_roles = new Access({
                        name: "saving access roles"
                    });
                    save_roles.save_login(function (status) {
                        if (status) {
                            /*if (SmartLife.agent_position_id == "8") {
                                SmartLife.app.navigate('sales', { root: true });
                            } else {
                                
                            }*/
                            SmartLife.app.navigate('agent_home', { root: true });
                        }
                    });
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