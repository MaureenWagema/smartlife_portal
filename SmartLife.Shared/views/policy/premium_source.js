SmartLife.premium_source = function (params) {
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
        formatSummary: function (value) {
            const formattedValue = value.toFixed(2);
            return Number(formattedValue).toLocaleString();
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
            colCount: 5,
            items: [
                //TODO - Add Type & bank or employer...
                {
                    label: {
                        text: "Type"
                    },
                    editorType: "dxLookup",
                    visible: true,
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
                                viewModel.vs_bank_grid(false);
                                viewModel.vs_employer_grid(true);
                                //formSearchDetailsInstance.itemOption("Employer", "visible", true);
                                //formSearchDetailsInstance.itemOption("Bank", "visible", false);
                            } if (e.value == 2) {
                                viewModel.vs_bank_grid(true);
                                viewModel.vs_employer_grid(false);
                                //formSearchDetailsInstance.itemOption("Employer", "visible", false);
                                //formSearchDetailsInstance.itemOption("Bank", "visible", true);
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
                        text: "Category"
                    },
                    editorType: "dxLookup",
                    visible: true,
                    dataField: "Category",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        searchEnabled: false,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: [{ 'id': 2, 'description': 'Policy' }, { 'id': 1, 'description': 'Proposal' }],
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Category is required"
                    }]
                },
                {
                    label: {
                        text: "Period Year"
                    },
                    editorType: "dxNumberBox",
                    dataField: "Period_year",
                    editorOptions: {
                        width: '180'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Period Year is required"
                    }]
                }, {
                    label: {
                        text: "Period Month"
                    },
                    editorType: "dxNumberBox",
                    dataField: "Period_month",
                    editorOptions: {
                        width: '180'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Period Month is required"
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
                                let url = "policy/getAgentPaySourceData?agent_no=" + SmartLife.agent_no + "&Category=" + data['Category'] +
                                    "&Period_year=" + data['Period_year'] + "&Period_month=" + data['Period_month'] + "&type=" + data['type'];
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

        vs_employer_grid: ko.observable(false),
        source_store: ko.observableArray(),
        source_columns: [
            {
                dataField: 'id',
                caption: 'serial',
                visible: false
            },
            {
                dataField: 'agent_name',
                visible: false
            },
            {
                caption: 'Employer',
                dataField: 'Emp_code',
                lookup: {
                    dataSource: SmartLife.Employerinfo,
                    displayExpr: 'Name',
                    valueExpr: 'emp_code',
                },
                visible: true,
                groupIndex:0
            }, {
                dataField: 'name',
            }, {
                dataField: 'policy_no',
            }, {
                dataField: 'Staff_no',
                visible: true,
                groupIndex: 1
            }, {
                dataField: 'Premium',
                caption: 'Deducted Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'ExpectedAmount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'AllocatedAmount',
                caption: 'Amount to be Allocated',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'ExcessAmount',
                caption: 'Over Deduction',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'AllocatedAmountActual',
                caption: 'Actual Allocated Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            },
            {
                allowEditing: false,
                dataField: 'status_code',
                caption: 'Status',
                lookup: {
                    dataSource: SmartLife.Statuses, valueExpr: 'status_code', displayExpr: 'description'
                },
                visible: false,
            }, {
                allowEditing: false,
                dataField: 'IsAllocated',
                dataType: 'boolean',
                visible: true,
                /*cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }*/
            }, {
                dataField: 'payment_date',
                dataType: 'date'
            }, {
                dataField: 'Period_year',
                visible: false
            }, {
                dataField: 'Period_month',
                visible: false
            }
        ],


        vs_bank_grid: ko.observable(false),
        bank_columns: [
            {
                dataField: 'id',
                caption: 'serial',
                visible: false
            },
            {
                dataField: 'agent_name',
                visible: false
            },
            {
                caption: 'Bank',
                dataField: 'Bank_code',
                lookup: {
                    dataSource: SmartLife.Banks,
                    displayExpr: 'description',
                    valueExpr: 'bank_code',
                },
                visible: true,
                groupIndex: 0
            }, {
                dataField: 'Staff_no',
                visible: true,
                groupIndex: 1
            }, {
                dataField: 'name',
            }, {
                dataField: 'policy_no',
            }, {
                dataField: 'Premium',
                caption: 'Deducted Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'ExpectedAmount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'AllocatedAmount',
                caption: 'Amount to be Allocated',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'ExcessAmount',
                caption: 'Over Deduction',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                dataField: 'AllocatedAmountActual',
                caption: 'Actual Allocated Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            },
            {
                allowEditing: false,
                dataField: 'status_code',
                caption: 'Status',
                lookup: {
                    dataSource: SmartLife.Statuses, valueExpr: 'status_code', displayExpr: 'description'
                },
                visible: false,
            }, {
                allowEditing: false,
                dataField: 'IsAllocated',
                dataType: 'boolean',
                visible: true,
                /*cellTemplate: function (container, options) {
                    var isTrue = options.value === "1";

                    $("<div>")
                        .append($("<input type='checkbox'>").prop("checked", isTrue))
                        .appendTo(container);
                }*/
            }, {
                dataField: 'payment_date',
                dataType: 'date'
            }, {
                dataField: 'Period_year',
                visible: false
            }, {
                dataField: 'Period_month',
                visible: false
            }
        ],

    };

    return viewModel;
};