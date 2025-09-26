SmartLife.contact_us = function (params) {
    "use strict";

    var formContactUsInstance;

    var viewModel = {
//  Put the binding properties here

        dxFormContactUs: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formContactUsInstance = e.component;
            
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    label: {
                        text: "Email"
                    },
                    editorType: "dxTextBox",
                    dataField: "email",
                    editorOptions: {
                        readOnly: false,
                        mode: 'email',
                    },
                    validationRules: [{
                        type: "required",
                        message: "Email is required"
                    }]
                },
                {
                    label: {
                        text: "Message"
                    },
                    editorType: "dxTextArea",
                    dataField: "msg",
                    editorOptions: {
                        readOnly: false,
                    },
                    validationRules: [{
                        type: "required",
                        message: "Username is required"
                    }]
                }, {
                    itemType: "empty"
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "SEND",
                        icon: "email",
                        horizontalAlignment: "centre",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //post data...

                                //let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                //viewModel.doLogin();
                                formContactUsInstance.resetValues() 
                                DevExpress.ui.dialog.alert("Message Sent Successfully. We shall do the needfull")
                            }
                        }
                    }
                }]
        },

    };

    return viewModel;
};