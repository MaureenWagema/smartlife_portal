SmartLife.source_data = function (params) {
    "use strict";
    var formSearchDetailsInstance;

    var is_micro = 0;
    if (SmartLife.pos_type == 2) {
        is_micro = 1;
    }

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
        vs_command: ko.observable(false),
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

        show_loan_quote: function (e) {

        },

        to_wrongful_data: function () {
            var data = { claim_type: 'RFU' };
            viewModel.navigateForward("PaySourceData", JSON.stringify(data));
        },

        dxFormSearchLoansDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSearchDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            colCount: 4,
            items: [
                //TODO - Add Type & bank or employer...
                {
                    label: {
                        text: "Type"
                    },
                    editorType: "dxLookup",
                    dataField: "type",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        searchEnabled: false,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: [{ 'id': 1, 'description': 'Employer' }, { 'id': 2, 'description': 'Bank' }],
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            if (e.value == 1) {
                                formSearchDetailsInstance.itemOption("Employer", "visible", true);
                                formSearchDetailsInstance.itemOption("Bank", "visible", false);
                            } if (e.value == 2) {
                                formSearchDetailsInstance.itemOption("Employer", "visible", false);
                                formSearchDetailsInstance.itemOption("Bank", "visible", true);
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Type is required"
                    }]
                },
                {
                    label: {
                        text: "Employer"
                    },
                    editorType: "dxLookup",
                    dataField: "Employer",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Employerinfo,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code',
                        onValueChanged: function (e) {
                            //viewModel.getPaySourceRawData(e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Source Type is required"
                    }]
                }, {
                    label: {
                        text: "Bank"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "Bank",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'bank_code',
                        onValueChanged: function (e) {
                            //viewModel.getPaySourceRawData(e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Source Type is required"
                    }]
                },
                {
                    label: {
                        text: "Staff No"
                    },
                    editorType: "dxTextBox",
                    dataField: "staff_no",
                    validationRules: [{
                        type: "required",
                        message: "Staff No / Reference No is required"
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

                                viewModel.LoadPanelShown(true);
                                let get_life = new DB({
                                    name: "fetching allocated premiums"
                                });
                                let data = formSearchDetailsInstance.option("formData");
                                let url = "policy/getPaySourceRawData?staff_no=" + data['staff_no'] + "&bank_employer=" + data['Employer'] + "&is_micro=" + is_micro + "&is_wrongful=0";
                                if (data['type'] == 2) {
                                    url = "policy/getBanksRawData?staff_no=" + data['staff_no'] + "&bank_employer=" + data['Bank'] + "&is_micro=" + is_micro + "&is_wrongful=0";
                                }
                                get_life.DBget(url).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        //console.log(result.record_id);
                                        viewModel.source_store(result.PaySourceRawData);
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
                }],
        },

        source_store: ko.observableArray(),
        source_columns: [
            {
                dataField: 'id',
                caption: 'serial',
                visible: false
            },
            {
                caption: 'Bank',
                dataField: 'BankName',
                lookup: {
                    dataSource: SmartLife.Banks,
                    displayExpr: 'description',
                    valueExpr: 'bank_code',
                },
                visible: false,
            },
            {
                caption: 'Employer',
                dataField: 'EmployerName',
                lookup: {
                    dataSource: SmartLife.Employerinfo,
                    displayExpr: 'Name',
                    valueExpr: 'emp_code',
                },
                visible: false,
            }, {
                dataField: 'ReferenceNumber',
                visible: false,
            }, {
                dataField: 'name',
            }, {
                dataField: 'payment_date',
                dataType: 'date'
            }, {
                dataField: 'premium',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'Period_year',
            }, {
                dataField: 'Period_month',
            }
        ]

    };

    return viewModel;
};