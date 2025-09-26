SmartLife.quote_group_form = function (params) {
    "use strict";

    var formQuoteDetailsInstance;
    var rcd_id;
    var get_data;// = JSON.parse(params.item);
    if (params.item && params.item !== null && params.item !== undefined && params.item !== '' && params.item.length !== 0) get_data = JSON.parse(params.item);
    //console.log(get_data[0]['rcd_id']);
    if (get_data != undefined) rcd_id = get_data[0]['rcd_id'];

    var vs_travel = false;
    var ProductCode;


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
        LoadPanelShown: ko.observable(false),
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },

        //get loan 
        get_quote: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing quote details"
            });

            get_form.DBget("group/getGroupQuotations?id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    $("#dxFormQuote").dxForm({
                        formData: result.Quotes[0]
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
                viewModel.get_quote();
            }

        },

        resetFormValues: function () {
            var data = formQuoteDetailsInstance.option("formData");
            ProductCode = data["ProductCode"];
            //alert(ProductCode);
            formQuoteDetailsInstance.resetValues();
            formQuoteDetailsInstance.updateData("ProductCode", ProductCode);
        },

        default_form: function () {
            vs_travel = false;
            formQuoteDetailsInstance.itemOption("ClientName", "visible", false);
            //formQuoteDetailsInstance.itemOption("TravelCategory", "visible", false);
            formQuoteDetailsInstance.itemOption("TotalMembers", "visible", false);
            formQuoteDetailsInstance.itemOption("AverageAge", "visible", false);
            formQuoteDetailsInstance.itemOption("TotalSalary", "visible", false);//Destination
            formQuoteDetailsInstance.itemOption("ContactNumber", "visible", false);
            formQuoteDetailsInstance.itemOption("OccupClass", "visible", false);
            formQuoteDetailsInstance.itemOption("CoverDuration", "visible", false);
            formQuoteDetailsInstance.itemOption("StartDate", "visible", false);
            formQuoteDetailsInstance.itemOption("Destination", "visible", false);
            formQuoteDetailsInstance.itemOption("IndividualClient", "visible", false);
            formQuoteDetailsInstance.itemOption("BirthDate", "visible", false);
            formQuoteDetailsInstance.itemOption("Age", "visible", false);
        },

        product_changed: function (e) {
            viewModel.resetFormValues();
            viewModel.default_form();
            if (e.value == "2") {
                formQuoteDetailsInstance.itemOption("ClientName", "visible", true);
                formQuoteDetailsInstance.itemOption("TotalMembers", "visible", true);
                formQuoteDetailsInstance.itemOption("AverageAge", "visible", true);
                formQuoteDetailsInstance.itemOption("TotalSalary", "visible", true);
                formQuoteDetailsInstance.itemOption("ContactNumber", "visible", true);
                formQuoteDetailsInstance.itemOption("OccupClass", "visible", true);
            } else if (e.value == "11") {//Travel
                vs_travel = true;
                formQuoteDetailsInstance.itemOption("ClientName", "visible", true);
                //formQuoteDetailsInstance.itemOption("TravelCategory", "visible", true);
                formQuoteDetailsInstance.itemOption("CoverDuration", "visible", true);
                formQuoteDetailsInstance.itemOption("StartDate", "visible", true);
                formQuoteDetailsInstance.itemOption("TotalMembers", "visible", true);
                formQuoteDetailsInstance.itemOption("IndividualClient", "visible", true);
                formQuoteDetailsInstance.itemOption("Destination", "visible", true);
            } else {
                formQuoteDetailsInstance.itemOption("ClientName", "visible", true);
                formQuoteDetailsInstance.itemOption("TotalMembers", "visible", true);
                formQuoteDetailsInstance.itemOption("AverageAge", "visible", true);
                formQuoteDetailsInstance.itemOption("TotalSalary", "visible", true);
                formQuoteDetailsInstance.itemOption("ContactNumber", "visible", true);
                formQuoteDetailsInstance.itemOption("OccupClass", "visible", true);
            }
        },
        calc_anb: function (e, is_dp) {
            //insert the value of the ANB.
            var current_date = new Date();
            var current_yr = current_date.getFullYear();
            var current_month = current_date.getMonth() + 1;
            var current_day = current_date.getDate();
            var selected_date = new Date(e.value);
            var yr = selected_date.getFullYear();
            var month_yr = selected_date.getMonth() + 1;
            var date_yr = selected_date.getDate();
            var anb_age = (current_yr - yr);

            if ((current_month <= month_yr) && (current_day < date_yr)) {
                anb_age = anb_age - 1;
            }
            formQuoteDetailsInstance.updateData("Age", anb_age);
        },

        //ProductCode,ClientName,TotalMembers,AverageAge,TotalSalary,ContactNumber,
        dxFormQuote: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formQuoteDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //ProductCode, ClientName, QuotationDate, TotalMembers, AverageAge, TotalSalary, ContactNumber, BrokerID, StatusDescription
            items: [
                {
                    label: {
                        text: "ID"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "ID"
                }, {
                    label: {
                        text: "Product"
                    },
                    editorType: "dxLookup",
                    dataField: "ProductCode",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.GLPlan,
                        displayExpr: 'Description',
                        valueExpr: 'class_code',
                        onValueChanged: function (e) {
                            if (e.value != null && e.value != undefined && e.value != "") {
                                if (ProductCode != e.value) {
                                    viewModel.product_changed(e);
                                }
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Product is required"
                    }]
                }, {
                    label: {
                        text: "Name of Client"
                    },
                    editorType: "dxTextBox",
                    dataField: "ClientName",
                    visible: false,
                    validationRules: [{
                        type: "required",
                        message: "Name of Client is required"
                    }]
                }, {
                    label: {
                        text: "Is Individual"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "IndividualClient",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.Confirmations,
                        displayExpr: 'name',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            if (e.value == 1) {
                                //display // TotalMembers
                                formQuoteDetailsInstance.itemOption("BirthDate", "visible", true);
                                formQuoteDetailsInstance.itemOption("Age", "visible", true);
                                formQuoteDetailsInstance.itemOption("TotalMembers", "visible", false);
                                //viewModel.refresh_dynamic_ds();
                            } else {
                                //don't display
                                formQuoteDetailsInstance.itemOption("BirthDate", "visible", false);
                                formQuoteDetailsInstance.itemOption("Age", "visible", false);
                                formQuoteDetailsInstance.itemOption("TotalMembers", "visible", true);
                                //viewModel.refresh_dynamic_ds();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Product is required"
                    }]
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    dataField: "BirthDate",
                    visible: false,
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy',
                        width: '100%',
                        onValueChanged: function (e) {
                            viewModel.calc_anb(e, false);
                        },
                    },
                    validationRules: [{
                        type: "required",
                        message: "Date of Birth is required"
                    }]
                }, {
                    label: {
                        text: "Age"
                    },
                    editorType: "dxNumberBox",
                    visible: false,
                    editorOptions: {
                        readOnly: false
                    },
                    dataField: "Age"
                }/*, {
                    label: {
                        text: "Travel Category"
                    },
                    editorType: "dxLookup",
                    dataField: "TravelCategory",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.GLTravelCat,
                        displayExpr: 'Description',
                        valueExpr: 'ID'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Travel Category is required",
                        validationCallback: function (obj) {
                            if (vs_travel) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]
                }*/, {
                    label: {
                        text: "Cover Duration"
                    },
                    editorType: "dxNumberBox",
                    dataField: "CoverDuration",
                    visible: false,
                    validationRules: [{
                        type: "custom",
                        message: "Cover Period is required",
                        validationCallback: function (obj) {
                            if (vs_travel) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]
                }, {
                    label: {
                        text: "Destination"
                    },
                    editorType: "dxTextBox",
                    dataField: "Destination",
                    visible: false,
                    validationRules: [{
                        type: "custom",
                        message: "Destination is required",
                        validationCallback: function (obj) {
                            if (vs_travel) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]
                }, {
                    label: {
                        text: "Start Date"
                    },
                    editorType: "dxDateBox",
                    dataField: "StartDate",
                    visible: false,
                    validationRules: [{
                        type: "custom",
                        message: "Start Date is required",
                        validationCallback: function (obj) {
                            if (vs_travel) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]
                }, {
                    label: {
                        text: "Occupation Class"
                    },
                    editorType: "dxLookup",
                    dataField: "OccupClass",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.GLOccup,
                        displayExpr: 'Industry',
                        valueExpr: 'ID'
                    }
                }/*, {
                    label: {
                        text: "Quotation Date"
                    },
                    editorType: "dxDateBox",
                    dataField: "QuotationDate",
                    validationRules: [{
                        type: "required",
                        message: "Quotation Date is required"
                    }]
                }*/, {
                    label: {
                        text: "Total Members"
                    },
                    editorType: "dxNumberBox",
                    dataField: "TotalMembers",
                    visible: false,
                    validationRules: [{
                        type: "required",
                        message: "Total Members is required"
                    }]
                }, {
                    label: {
                        text: "Average Age"
                    },
                    editorType: "dxNumberBox",
                    dataField: "AverageAge",
                    visible: false,
                    validationRules: [{
                        type: "required",
                        message: "Average Age is required"
                    }]
                }, {
                    label: {
                        text: "Total Salary"
                    },
                    editorType: "dxNumberBox",
                    dataField: "TotalSalary",
                    visible: false,
                    validationRules: [{
                        type: "required",
                        message: "Total Salary is required"
                    }]
                }, {
                    label: {
                        text: "Contact Number"
                    },
                    dataField: "ContactNumber",
                    editorType: "dxTextBox",
                    visible: false,
                    editorOptions: {
                        maskRules: {
                            "9": /[0-9]/
                        },
                        onKeyPress: function (e) {
                            var key = String.fromCharCode(e.event.keyCode || e.event.which);
                            var regex = /[0-9]|\./;
                            if (!regex.test(key)) {
                                e.event.preventDefault();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Contact Number is required"
                    }]
                }/*, {
                    label: {
                        text: "Broker"
                    },
                    editorType: "dxLookup",
                    dataField: "BrokerID",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.Brokers,
                        displayExpr: 'name',
                        valueExpr: 'id'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Broker is required"
                    }]
                }*/, {
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
                        text: "SUBMIT REQUEST",
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
                                    name: "submitting the group quote"
                                });
                                let data = formQuoteDetailsInstance.option("formData");
                                data['BrokerID'] = SmartLife.broker_id;
                                data['StatusDescription'] = "Submitted";
                                if (rcd_id != undefined && parseInt(rcd_id) > 0) data['ID'] = rcd_id; 
                                var tableData = { tableData: JSON.stringify(data) };
                                get_life.DBpost("group/saveQuoteGroup", tableData).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        console.log(result.record_id);
                                        rcd_id = result.record_id;
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