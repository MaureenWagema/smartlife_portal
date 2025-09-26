SmartLife.loan_enquiry = function (params) {
    "use strict";
    var formSearchClaimsDetailsInstance;

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
            //navigate to the loan quotation
            viewModel.navigateForward("loan_quotation", "");
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
                formSearchClaimsDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'SmartLife Search',
                colCount: 2,
                items: [
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
                                        name: "fetching wrongful claims"
                                    });
                                    let data = formSearchClaimsDetailsInstance.option("formData");
                                    let url = "policy/getClientLoan?staff_no=" + data['staff_no'] + "&is_micro=" + is_micro;

                                    get_life.DBget(url).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //console.log(result.record_id);
                                            viewModel.loan_store(result.ClientLoan);
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
            }],

        },

        loan_store: ko.observableArray(),
        loan_columns: [
            {
                allowEditing: false,
                visible: false,
                dataField: 'id'
            },
            {
                allowEditing: false,
                visible: true,
                dataField: 'LoanNumber'
            },
            {
                allowEditing: false,
                visible: true,
                dataField: 'name'
            },
            {
                allowEditing: false,
                visible: true,
                dataField: 'SearchReferenceNumber',
                caption: 'Staff No'
            }, {
                allowEditing: false,
                visible: false,
                dataField: 'balanceBf',
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
                visible: false,
                dataField: 'LoanYear',
                caption: 'Year',
            }, {
                allowEditing: false,
                visible: false,
                dataField: 'StartDate',
                caption: 'Start Date',
                dataType: 'date'
            }, {
                allowEditing: false,
                visible: true,
                dataField: 'Term',
            }, {
                allowEditing: false,
                dataField: 'Loan_Amount',
                caption: 'Loan Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                allowEditing: false,
                visible: true,
                dataField: 'RepaymentAmount',
                caption: 'Monthly Installment',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                allowEditing: false,
                dataField: 'outstandingBalance',
                caption: 'Outstanding Amount',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                }
            }, {
                allowEditing: false,
                visible: false,
                dataField: 'totalRepaid',
                caption: 'Total Repaid',
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
                caption: '',
                width: '50',
                allowEditing: false,
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        text: '',
                        icon: 'doc',
                        type: 'default',
                        onClick: function () {
                            //go to the next screen
                            if (is_micro == 1) {
                                var data = { policy_no: options.data.id, settings: 3 };
                            } else {
                                var data = { policy_no: options.data.id, settings: 16 };
                                viewModel.navigateForward("reports", JSON.stringify(data));
                            }
                        }
                    }).appendTo(container);
                }
            }
        ]

    };

    return viewModel;
};