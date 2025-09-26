SmartLife.PaySourceData = function (params) {
    //"use strict";

    var formPaySourceInstance;
    var formSearchDetailsInstance;
    var formSearchClaimsDetailsInstance;
    var PaySourceRawDataStore = [];

    var vs_refund_bank = false;
    var vs_refund_emp = false;
    var claim_type = "";
    var get_data = JSON.parse(params.item);
    if (get_data['claim_type'] != undefined) {
        claim_type = get_data['claim_type'];
        if (get_data['claim_type'] == "RFD") vs_refund_bank = true;
        if (get_data['claim_type'] == "RFU") vs_refund_emp = true;
    }
    var keys;
    var bank_code = "";
    var emp_code = "";
    var reference_no = "";

    var viewModel = {
        vs_refund_bank: ko.observable(vs_refund_bank),
        vs_refund_emp: ko.observable(vs_refund_emp),
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
        from_banks: function () {
            //if (keys != undefined) {
                var data = { claim_type: 'RFD', bank_code: bank_code, reference_no: reference_no };
                viewModel.navigateForward("request_claim_form", JSON.stringify(data));
            //} else {
                //DevExpress.ui.dialog.alert("Kindly Select Row First", "SUBMITTED");
            //}
        },
        from_wrongful: function () {
            var data = { is_wrongful: '1', emp_code: emp_code, reference_no: reference_no };
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },
        from_wrongful_slams: function () {
            var data = { is_wrongful: '1', emp_code: emp_code, reference_no: reference_no };
            viewModel.navigateForward("wrongful_from_slams", JSON.stringify(data));
        },
        from_employer: function () {
            //if (keys != undefined) {
                var data = { claim_type: 'RFU', emp_code: emp_code, reference_no: reference_no };
                viewModel.navigateForward("request_claim_form", JSON.stringify(data));
            //} else {
                //DevExpress.ui.dialog.alert("Kindly Select Row First", "SUBMITTED");
            //}
        },
        viewShown: function () {

            //build


        },

        //adding date from and date to searches,period year, period month
        /////////////search form//////////////////////////
        dxFormSearchDetails: {
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
            items: [{
                itemType: 'group',
                //caption: 'SmartLife Search',
                colCount: 3,
                items: [
                    /*{
                        colSpan: 5,
                        label: {
                            text: "Source"
                        },
                        editorType: "dxLookup",
                        dataField: "PaySourceType",
                        editorOptions: {
                            closeOnOutsideClick: true,
                            dataSource: [{ id: 1, name: 'View from Raw Data' }, { id: 2, name: 'View from Allocated Receipts' }],
                            displayExpr: 'name',
                            valueExpr: 'id',
                            onValueChanged: function (e) {
                                //viewModel.getPaySourceRawData(e.value);
                                if (e.value == 1) {
                                    claim_type = "RFD";
                                    formPaySourceInstance.itemOption("btncomplete", "visible", false);
                                } else {
                                    claim_type = "RFU";
                                    formPaySourceInstance.itemOption("btncomplete", "visible", true);
                                }

                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "Source Type is required"
                        }]
                    },*/
                    /*{
                        label: {
                            text: "Employer"
                        },
                        editorType: "dxLookup",
                        dataField: "Employer",
                        visible: vs_refund_emp,
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
                        visible: vs_refund_bank,
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
                    },*/

                    {
                        label: {
                            text: "Staff No"
                        },
                        editorType: "dxTextBox",
                        dataField: "staff_no",
                        editorOptions: {
                            //width: '180'
                        },
                        /*validationRules: [{
                            type: "required",
                            message: "Reference No is required"
                        }]*/
                    },
                    
                    
                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "left",
                        dataField: "btnSearch",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "",
                            horizontalAlignment: "left",
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
                                    //save
                                    let data = formSearchDetailsInstance.option("formData");
                                    let bank_employer = "";
                                    if (vs_refund_emp) bank_employer = "";//data['Employer'];
                                    if (vs_refund_bank) bank_employer = "";//data['Bank'];
                                    viewModel.getPaySourceRawData(2, bank_employer, data['staff_no']);
                                }
                            }
                        }
                    }
                ],
            }],

        },
        ////////////end of search form////////////////////

        getPaySourceRawData: function (source_type, bank_employer, staff_no) {
            if (staff_no == undefined) staff_no = "";
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing Raw Data"
            });
            let tmp_url = "policy/getBanksRawData?source_type=" + source_type + "&bank_employer=" + bank_employer + "&staff_no=" + staff_no + "&is_wrongful=1";
            if (claim_type == "RFU") tmp_url = "policy/getPaySourceRawData?source_type=" + source_type + "&bank_employer=" + bank_employer + "&staff_no=" + staff_no + "&is_wrongful=1";
            get_form.DBget(tmp_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    PaySourceRawDataStore = result.PaySourceRawData;
                    if (formPaySourceInstance.getEditor("PaySourceRawData") != null)
                        formPaySourceInstance.getEditor("PaySourceRawData").option("dataSource", PaySourceRawDataStore);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },


        dxFormPaySource: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formPaySourceInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //
            items: [
                {
                    colSpan: 2,
                    label: {
                        text: "LOADED DATA"
                    },
                    dataField: "PaySourceRawData",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: PaySourceRawDataStore,
                        readOnly: true,
                        wordWrapEnabled: true,
                        keyExpr: 'id',
                        selection: {
                            mode: 'single',
                        },
                        //columnHidingEnabled: true,
                        onRowClick: function (e) {
                            //viewModel.show_beneficiary(e);
                        },
                        headerFilter: { visible: true },
                        filterRow: {
                            visible: true,
                            applyFilter: 'auto',
                        },
                        searchPanel: {
                            highlightCaseSensitive: false,
                            highlightSearchText: true,
                            placeholder: 'Search...',
                            searchVisibleColumnsOnly: true,
                            text: '',
                            visible: true,
                            width: 250
                        },
                        onSelectionChanged(selectedItems) {
                            const data = selectedItems.selectedRowsData[0];
                            keys = data;
                            if (vs_refund_bank) bank_code = data.BankName;
                            if (vs_refund_emp) emp_code = data.emp_code;
                            reference_no = data.ReferenceNumber;
                        },
                        //Staff_no, name, Period_year, Period_month, ReferenceNumber, AllocatedAmount, RecordMatched
                        columns: [
                            {
                                dataField: 'id',
                                caption: 'serial',
                                visible: false
                            },
                            {
                                dataField: 'SOURCE',
                            },
                            {
                                dataField: 'TYPE',
                            },
                            {
                                caption: 'Bank',
                                dataField: 'BankName',
                                lookup: {
                                    dataSource: SmartLife.Banks,
                                    displayExpr: 'description',
                                    valueExpr: 'bank_code',
                                },
                                visible: false//vs_refund_bank,
                            },
                            {
                                caption: 'Employer',
                                dataField: 'EmployerName',
                                lookup: {
                                    dataSource: SmartLife.Employerinfo,
                                    displayExpr: 'Name',
                                    valueExpr: 'emp_code',
                                },
                                visible: false//vs_refund_emp,
                            }, {
                                dataField: 'ReferenceNumber',
                            }, {
                                dataField: 'name',
                            }, {
                                dataField: 'PaymentDate',
                                dataType: 'date'
                            }, {
                                dataField: 'AllocatedAmount',
                                dataType: 'number',
                                customizeText: function (cellInfo) {
                                    if (typeof cellInfo.value === 'number') {
                                        const formattedValue = cellInfo.value.toFixed(2);
                                        return Number(formattedValue).toLocaleString();
                                    }
                                    return '';
                                }
                            }, {
                                dataField: 'period_year',
                            }, {
                                dataField: 'period_month',
                            }/*, {
                                dataField: 'RecordMatched',
                                dataType: 'boolean',
                            }*/
                        ]
                    }
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }/*,  {
                    itemType: "button",
                    horizontalAlignment: "right",
                    dataField: "btncomplete",
                    buttonOptions: {
                        text: "COMPLETE ✓",
                        horizontalAlignment: "right",
                        width: '120',
                        type: 'danger',
                        onClick: function (args) {
                            


                        }
                    }
                }*/]
        },


        ///////////////wrongful pop up/////////////////////
        pop_wrongful_claims: ko.observable(false),
        hide_wrongful_claims: function () {
            viewModel.pop_wrongful_claims(false);
        },
        show_wrongful_flaims: function () {
            viewModel.pop_wrongful_claims(true);
        },
        dxFormSearchClaimsDetails: {
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
                            text: "Staff No / Reference No"
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
                                    let url = "claims/getHistoryClaims?staff_no=" + data['staff_no'] + "&is_micro=0";
                                    
                                    get_life.DBget(url).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //console.log(result.record_id);
                                            viewModel.wrongful_claims_store(result.Claims);
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
        wrongful_claims_store: ko.observableArray(),
        wrongful_claims_columns: [
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'reason',
                visible: false
            }, {
                allowEditing: false,
                dataField: 'policy_no',//SmartLife.ClientPolicies
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'claim_no',
                caption: 'Assigned No',
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'claim_type',//SmartLife.ClaimType
                visible: true,
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
            }, {

                dataField: 'tot_cash_value',
                visible: false
            }, {

                dataField: 'amount_available',
                visible: false
            }, {

                dataField: 'AmountAppliedFor',
                visible: false
            }, {
                allowEditing: false,
                dataField: 'total_proceeds',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                allowEditing: false,
                dataField: 'total_deductions',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                allowEditing: false,
                dataField: 'net_payment',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            }, {
                allowEditing: false,
                dataField: 'pay_due_date',
                dataType: 'date',
                cellDisplayFormat: 'dd/MM/yyyy',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'created_on',
                caption: 'Received On',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }, {//
                allowEditing: false,
                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }, {//
                allowEditing: false,
                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {
                dataField: 'statuscode',
                caption: 'Current Status',
                visible: false
            }
        ],
        //////////////end of wrongful pop up//////////


    };

    return viewModel;
};