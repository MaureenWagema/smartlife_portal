SmartLife.caputre_quotation = function (params) {
    "use strict";
    var formQuoteInstance;
    var formDependantsInstance;
    var formDependantInstance;
    var get_data = JSON.parse(params.item);
    var plan_code = get_data['plan_code'];


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
        go_back: function () {
            SmartLife.app.back();
        },
        LoadPanelShown: ko.observable(false),
        formatDate: function (input) {
            if (input == undefined || input == '' || input == " ") {
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
        default_vs_premiums: function () {
            formQuoteInstance.itemOption("inv_premium", "visible", false);
            formQuoteInstance.itemOption("life_premium", "visible", false);
            formQuoteInstance.itemOption("rider_premium", "visible", false);
            formQuoteInstance.itemOption("cepa", "visible", false);
            formQuoteInstance.itemOption("basic_premium", "visible", false);
            formQuoteInstance.itemOption("modal_premium", "visible", false);
            formQuoteInstance.itemOption("total_premium", "visible", false);
            formQuoteInstance.itemOption("transfer_charge", "visible", false);
            formQuoteInstance.itemOption("dependants", "visible", false);//btndependants
            formQuoteInstance.itemOption("btndependants", "visible", false);
            formQuoteInstance.itemOption("riders", "visible", false);
        },
        display_vs_funeral_premium: function () {
            formQuoteInstance.itemOption("modal_premium", "visible", true);
            formQuoteInstance.itemOption("basic_premium", "visible", true);
            formQuoteInstance.itemOption("dependants", "visible", true);
            formQuoteInstance.itemOption("btndependants", "visible", true);
            formQuoteInstance.itemOption("modal_premium", "readOnly", true);
            formQuoteInstance.itemOption("basic_premium", "readOnly", true);
            formQuoteInstance.itemOption("pol_fee", "readOnly", true);
            formQuoteInstance.itemOption("sum_assured", "readOnly", true);
        },
        display_vs_esb: function () {
            //inv_prem, rider_prem, transfer_charge, riders
            formQuoteInstance.itemOption("inv_premium", "visible", true);
            formQuoteInstance.itemOption("rider_premium", "visible", true);
            formQuoteInstance.itemOption("transfer_charge", "visible", true);
            formQuoteInstance.itemOption("riders", "visible", true);
            formQuoteInstance.itemOption("modal_premium", "visible", true);
        },

        assign_plan: function () {
            if (plan_code == "29") {
                //funeral policy
                formQuoteInstance.updateData("plan_code", "29");
            }
            if (plan_code == "02") {
                //funeral policy
                formQuoteInstance.updateData("plan_code", "02");
            }
        },
        viewShown: function () {
            viewModel.assign_plan();
        },

        //////pop up dependants////
        pop_dependants: ko.observable(false),
        hide_dependants: function () {
            //do the cumulative additions here.
            viewModel.pop_dependants(false);
        },
        show_dependants: function () {
            viewModel.pop_dependants(true);
        },
        dxFormDependant: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formDependantInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
            items: [
                {
                    label: {
                        text: "Relationship"
                    },
                    editorType: "dxLookup",
                    dataField: "dp_relationship",
                    colSpan: 2,
                    editorOptions: {
                        readOnly: false,
                        dataSource: SmartLife.Relationshipinfo,
                        displayExpr: 'description',
                        valueExpr: 'code',
                        onValueChanged: function (e) {
                            if (e.value == "SF") {
                                let data = formQuoteInstance.option("formData");
                                formDependantInstance.updateData("dp_dob", data['dob']);
                                formDependantInstance.updateData("dp_anb", data['anb']);
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Relationship is required"
                    }]
                }, {
                    label: {
                        text: "Dob"
                    },
                    editorType: "dxDateBox",
                    editorOptions: {

                    },
                    dataField: "dp_dob",
                    validationRules: [{
                        type: "required",
                        message: "Disease Date is required"
                    }]
                }, {
                    label: {
                        text: "ANB"
                    },
                    editorType: "dxNumberBox",
                    dataField: "dp_anb",
                    editorOptions: {
                        readOnly: true
                    },
                    validationRules: [{
                        type: "required",
                        message: "ANB is required"
                    }]
                }, {
                    label: {
                        text: "Sum Assured"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            //funeral policy - premium
                            let dependants_data = formDependantInstance.option("formData");
                            let data = formQuoteInstance.option("formData");
                            if (plan_code == "29") {
                                viewModel.calculate_funeral_premium(e.value, dependants_data['dp_anb'], data['term'], 1, function (result) {
                                    console.log(result.premium);
                                    //newData.dp_premium = parseFloat(result.premium);
                                    formDependantInstance.updateData("dp_premium", result.premium);
                                    //console.log(newData);
                                });
                            }
                        }
                    },
                    dataField: "dp_sa",
                    validationRules: [{
                        type: "required",
                        message: "Sum Assured is required"
                    }]
                }, {
                    label: {
                        text: "Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "dp_premium",
                    validationRules: [{
                        type: "required",
                        message: "Premium is required"
                    }]
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "DELETE",
                        horizontalAlignment: "left",
                        icon: "trash",
                        type: "normal",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                        }
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "OK",
                        icon: "check",
                        type: "normal",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //add to the list of dependants
                                //["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
                                //get the dataSource
                                let dependants_data = formDependantInstance.option("formData");
                                let data = formQuoteInstance.getEditor('dependants').option('dataSource');
                                //add this to it 
                                data.push(dependants_data);
                                //update the dataSource
                                formQuoteInstance.getEditor("dependants").option("dataSource", data);
                                //hide
                                viewModel.hide_dependants();
                                viewModel.add_dependants_prem(dependants_data['dp_sa'], dependants_data['dp_premium']);
                            }
                        }
                    }
                }]
        },
        //////end of pop up dependants//

        calc_anb: function (e) {
            //insert the value of the ANB.
            var current_date = new Date();
            var current_yr = current_date.getFullYear();
            var current_month = current_date.getMonth() + 1;
            var current_day = current_date.getDate();
            var selected_date = new Date(e.value);
            var yr = selected_date.getFullYear();
            var month_yr = selected_date.getMonth() + 1;
            var date_yr = selected_date.getDate();
            var anb_age = (current_yr - yr) + 1;
            let term = 0;

            //if (DateTime.Now.Month < birthdate.Month || (DateTime.Now.Month == birthdate.Month && DateTime.Now.Day < birthdate.Day))

            //alert(current_day);
            if ((current_month <= month_yr) && (current_day < date_yr)) {
                anb_age = anb_age - 1;
            }

            if (plan_code == "29") {//funeral plan
                //calculate the term
                term = 100 - anb_age;
                formQuoteInstance.updateData("term", term);
                formQuoteInstance.getEditor("term").option("readOnly", true);
            }


            formQuoteInstance.updateData("anb", anb_age);
        },

        plan_changed: function (e, fn) {
            if (e.value == "29") {//funeral plan
                //calculate the term

            }
        },

        calculate_funeral_premium(sa, anb, term, CategoryCode, fn) {
            viewModel.LoadPanelShown(true);
            let calc = new DB({
                name: "calculating premium funeral policy"
            });
            let data = {
                plan_code: "37",
                sum_assured: sa,
                anb: anb,
                term: term,
                paymode: "M",
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/PremiumFuneralPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calculate_esb(total_premium, anb, term, fn) {
            viewModel.LoadPanelShown(true);
            let calc = new DB({
                name: "calculating premium funeral policy"
            });
            let data = {
                PlanCode: "2",
                total_premium: total_premium,
                anb: anb,
                term: term,
                gender: "M",
                class_code: "001"
            };
            calc.DBpost("calc/ESB", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result);
                    //assign all here
                    //sum_assured,policy_fee,inv_prem,rider_prem,transfer_charge,riders
                    formQuoteInstance.updateData("sum_assured", result.sum_assured);
                    //formQuoteInstance.updateData("policy_fee", result.policy_fee);
                    formQuoteInstance.updateData("inv_premium", result.inv_prem);
                    formQuoteInstance.updateData("rider_premium", result.rider_prem);
                    console.log(result.riders);
                    formQuoteInstance.getEditor("riders").option("dataSource", result.riders);

                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        add_dependants_prem: function (sa, prem) {
            if (plan_code == "29") {
                //add sa
                let data = formQuoteInstance.option("formData");
                if (data['sum_assured'] == undefined) data['sum_assured'] = 0;
                let sum_assured = parseFloat(data['sum_assured']) + parseFloat(sa);
                if (data['basic_premium'] == undefined) data['basic_premium'] = 0;
                let basic_premium = data['basic_premium'] + parseFloat(prem);
                formQuoteInstance.updateData("sum_assured", sum_assured);
                formQuoteInstance.updateData("basic_premium", basic_premium);

                //calculate modal_premium
                let modal_premium = basic_premium + data['pol_fee'];
                formQuoteInstance.updateData("modal_premium", modal_premium);
            }
        },

        //names,dob,mobile,email,anb, plan_code,premium,created_on
        dxFormQuotation: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formQuoteInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //names,dob,mobile,email,anb, plan_code,premium,created_on
            items: [
                {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    label: {
                        text: "Surname"
                    },
                    editorType: "dxTextBox",
                    dataField: "surname",
                    validationRules: [{
                        type: "required",
                        message: "Surname is required"
                    }]
                }, {
                    label: {
                        text: "Other Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "other_name",
                    validationRules: [{
                        type: "required",
                        message: "Other Name is required"
                    }]
                }, {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxNumberBox",
                    dataField: "mobile",
                    validationRules: [{
                        type: "required",
                        message: "Mobile is required"
                    }]
                }, {
                    label: {
                        text: "Email"
                    },
                    editorType: "dxTextBox",
                    dataField: "email",
                    validationRules: [{
                        type: "required",
                        message: "Email is required"
                    }]
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    dataField: "dob",
                    editorType: "dxDateBox",

                    editorOptions: {
                        width: '100%',
                        onValueChanged: function (e) {
                            viewModel.calc_anb(e);
                        },
                    },
                    validationRules: [{
                        type: "required",
                        message: "Date of Birth is required"
                    }]
                }, {
                    label: {
                        text: "ANB"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly: true,
                    },
                    dataField: "anb",
                    validationRules: [{
                        type: "required",
                        message: "Age Next Birthday is required"
                    }]
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {

                    colSpan: 2,
                    label: {
                        text: "Plan"
                    },
                    editorType: "dxLookup",
                    dataField: "plan_code",
                    editorOptions: {
                        readOnly: false,
                        dataSource: SmartLife.planinfo,
                        displayExpr: 'description',
                        valueExpr: 'plan_code',
                        onValueChanged: function (e) {
                            viewModel.default_vs_premiums();
                            formQuoteInstance.updateData("pol_fee", 1);
                            if (plan_code == "29") {
                                viewModel.display_vs_funeral_premium();
                            }
                            if (plan_code == "02") {
                                viewModel.display_vs_esb();
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Plan is required"
                    }]
                },
                {

                    colSpan: 2,
                    label: {
                        text: "Term"
                    },
                    editorType: "dxNumberBox",
                    dataField: "term",
                    validationRules: [{
                        type: "required",
                        message: "Term is required"
                    }]
                },

                 {
                     colSpan: 4,
                     itemType: "empty"
                 },
                 {
                     colSpan: 2,
                     itemType: "empty"
                 },
                {
                   
                    itemType: "button",
                    dataField: "btndependants",
                    buttonOptions: {
                        text: "ADD DEPENDANTS +",
                       
                        elementAttr: {

                            class: "buttonPrimary"
                        },
                       // type: "danger",
                        onClick: function () {
                            viewModel.show_dependants();
                        }
                    }
                },

                 {
                    
                     itemType: "empty"
                 },
                {
                    colSpan: 4,
                    dataField: "dependants",
                    editorType: "dxDataGrid",
                    visible: true,
                    editorOptions: {
                        dataSource: [],
                        onInitialized: function (e) {
                            formDependantsInstance = e.component;
                        },
                        wordWrapEnabled: true,
                        editing: {
                            texts: {
                                addRow: 'Add Dependant',
                                saveRowChanges: "Save Dependant"
                            },
                            allowUpdating: true,
                            mode: 'form',
                            allowAdding: false,
                            allowDeleting: true,
                            form: {
                                items: ["dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium"]
                            }
                        },
                        onRowUpdating: function (e) {
                            //e.cancel
                            //var d = $.Deferred();
                            //viewModel.add_dependants_prem(e.newData.dp_sa, e.newData.dp_premium);
                            //alert(e.data.dp_good_health);
                            //alert("here");
                            //is_checklist = false;
                            //viewModel.show_disease_desc(1);
                            //return d.reject();
                        },
                        columns: [
                            {
                                dataField: 'dp_fullname',
                                caption: 'Fullnames',
                                visible: false
                            }, {
                                dataField: 'dp_relationship',
                                caption: 'Relationship',
                                lookup: {
                                    dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                },
                                /*setCellValue: function (newData, value, currentRowData) {
                                    newData.dp_relationship = value;
                                    let data = formQuoteInstance.option("formData");
                                    if (value == "SF") {
                                        newData.dp_dob = new Date(data['dob']);
                                        newData.dp_anb = data['anb'];
                                    }
                                }*/
                            }, {
                                dataField: 'dp_dob',
                                caption: 'Date of Birth',
                                dataType: 'date'
                            }, {
                                dataField: 'dp_anb',
                                caption: 'Age',
                                dataType: 'number',
                                allowEditing: false
                            }, {
                                dataField: 'dp_class_code',
                                caption: 'Class Code',
                                visible: false,
                                lookup: {
                                    dataSource: SmartLife.Paclassinfo, valueExpr: 'class_code', displayExpr: 'Description'
                                }
                            }, {
                                dataField: 'dp_bapackage',
                                caption: 'BA Package',
                                visible: false,
                                lookup: {
                                    dataSource: SmartLife.confirmations, valueExpr: 'id', displayExpr: 'name'
                                }
                            }, {
                                dataField: 'dp_hci_sum',
                                caption: 'HCI Sum Assured',
                                visible: false,
                                dataType: 'number'
                            }, {
                                dataField: 'dp_sa',
                                caption: 'Sum Assured',
                                dataType: 'number',
                                /*setCellValue: function (newData, value, currentRowData) {
                                    newData.dp_sa = value;
                                    newData.dp_premium = 313;
                                    if (plan_code == "29") {
                                        viewModel.calculate_funeral_premium(value, function (result) {
                                            console.log(result.premium);
                                            newData.dp_premium = parseFloat(result.premium);
                                            console.log(newData);
                                        });
                                    }
                                }*/
                            }, {
                                dataField: 'dp_premium',
                                caption: 'Premium',
                                dataType: 'number'
                            }, {
                                dataField: 'dp_good_health',
                                caption: 'Are you in good Health?',
                                visible: false,
                                lookup: {
                                    dataSource: SmartLife.Confirmations, valueExpr: 'id', displayExpr: 'name'
                                }
                            }
                        ]
                    }
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    label: {
                        text: "Sum Assured"
                    },
                    editorType: "dxNumberBox",
                    dataField: "sum_assured",
                    editorOptions: {
                        onValueChanged: function (e) {

                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Sum Assured is required"
                    }]
                }, {
                    label: {
                        text: "Modal Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "modal_premium",
                    visible: true,
                    editorOptions: {
                        onValueChanged: function (e) {
                            let data = formQuoteInstance.option("formData");
                            viewModel.calculate_esb(data['modal_premium'], data['anb'], data['term'], function () {

                            });
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Modal Premium is required"
                    }]
                }, {
                    label: {
                        text: "Investment Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "inv_premium",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    label: {
                        text: "CEPA"
                    },
                    editorType: "dxNumberBox",
                    dataField: "cepa",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {

                    label: {
                        text: "Protection Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "rider_premium",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },

                {
                    colSpan: 4,
                    dataField: "riders",
                    editorType: "dxDataGrid",
                    visible: true,
                    editorOptions: {
                        dataSource: [],
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: true,
                            mode: 'form',
                            allowAdding: false,
                            allowDeleting: true,
                        },
                        columns: [
                            {
                                dataField: 'r_rider',
                                caption: 'Rider',
                                lookup: {
                                    dataSource: SmartLife.riderinfo, valueExpr: 'rider_code', displayExpr: 'description'
                                }
                            }, {
                                dataField: 'r_sa',
                                caption: 'Sum Assured',
                                dataType: 'number'
                            }, {
                                dataField: 'r_premium',
                                caption: 'Premium',
                                dataType: 'number'
                            }
                        ]
                    }
                },

                {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    label: {
                        text: "Life Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "life_premium",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {

                    colSpan:2,
                    label: {
                        text: "Basic Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "basic_premium",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    colSpan: 2,
                    label: {
                        text: "Policy Fee"
                    },
                    editorType: "dxNumberBox",
                    dataField: "pol_fee",
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    label: {
                        text: "Transfer Charge"
                    },
                    editorType: "dxNumberBox",
                    dataField: "transfer_charge",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    label: {
                        text: "Total Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "total_premium",
                    visible: true
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },

                 {
                   
                     itemType: "empty"
                 },


                {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "BACK",
                        horizontalAlignment: "left",
                        //icon: "chevronprev",
                        //type: "normal",
                        elementAttr: {

                            class: "buttonSecondary"
                        },
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                        }
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "OK ✓",
                        elementAttr: {

                            class: "buttonPrimary"
                        },
                       // icon: "check",
                       // type: "normal",
                        onClick: function (args) {
                            //alter the array depending on the form
                            //qn_intermediary, fm_health_intermediary;
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //viewModel.navigateForward("applications", "");
                                //handle sending to db
                                viewModel.save_to_db();
                            }
                        }
                    }
                }]
        },
        save_to_db: function () {
            //post
            viewModel.LoadPanelShown(true);
            let saveQuote = new DB({
                name: "saving quotation"
            });
            //dob,anb,plan_code,term,sum_assured,pol_fee,inv_premium,
            //cepa,rider_premium,life_premium,basic_premium,modal_premium,
            //total_premium,quotation_date
            let form_data = formQuoteInstance.option("formData");//client_no
            form_data['client_no'] = SmartLife.clientno();
            form_data['dob'] = viewModel.formatDate(new Date(form_data['dob']));
            if (plan_code == "29") {
                form_data['dependants'] = JSON.stringify(formQuoteInstance.getEditor('dependants').option('dataSource'));
            }
            saveQuote.DBpost("quotation/saveQuote", form_data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //navigate to my applications...
                    SmartLife.app.back();
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