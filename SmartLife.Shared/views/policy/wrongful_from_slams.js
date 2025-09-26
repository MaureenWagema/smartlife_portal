SmartLife.wrongful_from_slams = function (params) {
    "use strict";
    var formInstance;

    var viewModel = {
        //  Put the binding properties here
        go_back: function () {
            SmartLife.app.back();
        },
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

        dxFormWrongful: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                items: [
                    {
                        label: {
                            text: "Source"
                        },
                        editorType: "dxLookup",
                        dataField: "PaySourceType",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            dataSource: [{ id: 1, name: 'BANK' }, { id: 2, name: 'EMPLOYER' }],
                            displayExpr: 'name',
                            valueExpr: 'id',
                            onValueChanged: function (e) {
                                if (e.value == 1) {
                                    formInstance.itemOption("BankName", "visible", true);
                                    formInstance.itemOption("Employer_TelcoName", "visible", false);
                                } else {
                                    formInstance.itemOption("Employer_TelcoName", "visible", true);
                                    formInstance.itemOption("BankName", "visible", false);
                                }

                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "Source Type is required"
                        }]
                    },
                    //StaffNumber, FullName, IsForBanks, BankName, IsForEmployer, Employer_TelcoName, PaymentDate
                    {
                        label: {
                            text: "Employer"
                        },
                        editorType: "dxLookup",
                        visible: false,
                        dataField: "Employer_TelcoName",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            dataSource: SmartLife.Employerinfo,
                            displayExpr: 'Name',
                            valueExpr: 'emp_code'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Reference No is required"
                        }]
                    },
                    {
                        label: {
                            text: "Bank"
                        },
                        editorType: "dxLookup",
                        visible: false,
                        dataField: "BankName",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            dataSource: SmartLife.Bankinfo,
                            displayExpr: 'description',
                            valueExpr: 'bank_code',
                        },
                        validationRules: [{
                            type: "required",
                            message: "Reference No is required"
                        }]
                    },
                    {
                        label: {
                            text: "Staff No"
                        },
                        editorType: "dxTextBox",
                        dataField: "StaffNumber",
                        editorOptions: {
                            //width: '180'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Reference No is required"
                        }]
                    },
                    {
                        label: {
                            text: "FullName"
                        },
                        editorType: "dxTextBox",
                        dataField: "FullName",
                        editorOptions: {
                            //width: '180'
                        },
                        validationRules: [{
                            type: "required",
                            message: "FullName is required"
                        }]
                    },
                    {
                        label: {
                            text: "Payment Date"
                        },
                        editorType: "dxDateBox",
                        editorOptions: {
                            displayFormat: 'dd/MM/yyyy',
                            onValueChanged: function (e) {
                                if (e.value && new Date(e.value) >= new Date('2023-10-02')) {
                                    viewModel.show_test("Payment Date must be before 02nd October 2023", 'error');
                                    e.component.option('value', null);
                                }
                            }
                        },
                        dataField: "PaymentDate",
                        validationRules: [
                            {
                                type: "required",
                                message: "Payment Date is required"
                            },
                            {
                                type: "custom",
                                message: "Payment Date must be before 02nd October 2023",
                                validationCallback: function (e) {
                                    return new Date(e.value) < new Date('2023-10-02');
                                }
                            }
                        ]
                    },
                    {
                        label: {
                            text: "Amount Payable"
                        },
                        editorType: "dxNumberBox",
                        dataField: "AmountPayable",
                        editorOptions: {
                            //width: '180'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Amount Payable is required"
                        }]
                    },
                    {
                        label: {
                            text: "Reason"
                        },
                        editorType: "dxTextArea",
                        dataField: "Reason",
                        editorOptions: {
                            //width: '180'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Reason is required"
                        }]
                    },


                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "right",
                        dataField: "btnSearch",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "SUBMIT",
                            horizontalAlignment: "right",
                            verticalAlignment: "bottom",
                            icon: "save",
                            type: "danger",
                            /*elementAttr: {
                                class: "buttonPrimary"
                            },*/
                            onClick: function (args) {
                                var result = args.validationGroup.validate();
                                if (result.isValid) {
                                    //save
                                    let data = formInstance.option("formData");
                                    let IsForBanks = 0;
                                    let IsForEmployer = 0;
                                    if (data['Source'] == 1) {
                                        IsForBanks = 1;
                                        IsForEmployer = 0;
                                    } else {
                                        IsForBanks = 0;
                                        IsForEmployer = 1;
                                    }

                                    //POST the data
                                    viewModel.LoadPanelShown(true);
                                    let get_life = new DB({
                                        name: "Saving Wrongful from SLAMS"
                                    });
                                    //StaffNumber, FullName, IsForBanks, BankName, IsForEmployer, Employer_TelcoName, PaymentDate, Reason
                                    //data['user_id'] = SmartLife.pos_name;
                                    console.log(data);
                                    get_life.DBpost("claims/insertSLAMSWrongful",
                                        {
                                            StaffNumber: data['StaffNumber'],
                                            FullName: data['FullName'],
                                            IsForBanks: IsForBanks,
                                            BankName: data['BankName'],
                                            IsForEmployer: IsForEmployer,
                                            Employer_TelcoName: data['Employer_TelcoName'],
                                            Reason: data['Reason'],
                                            user_id: SmartLife.pos_name,
                                            PaymentDate: viewModel.formatDates(new Date(data['PaymentDate']))
                                        }).done(function (result) {
                                            viewModel.LoadPanelShown(false);
                                            if (result.success == true) {
                                                viewModel.show_test(result.message, 'success');
                                                viewModel.go_back();
                                            } else {
                                                viewModel.show_test(result.message, 'error');
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
            }],

        },


    };

    return viewModel;
};