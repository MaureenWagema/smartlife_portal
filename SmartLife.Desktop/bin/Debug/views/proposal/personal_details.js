SmartLife.personal_details = function (params) {
    //"use strict";
    let rcd_id = params.item;
    var tabsInstance;
    var formInstance;
    var formDiseaseInstance;
    var qn_intermediary;
    var qn;
    var fm_health_intermediary;
    var family_history;
    var is_checklist = false;

    function getFormInstance() {
        return $("#dxForm").dxForm('instance');
    }

    function setformdata(formdata) {
        getFormInstance().updateData(formdata);
    }

    var is_item_changed = false;
    var prev_val = '';
    //onplan changed
    function plan_changed(e) {
        is_item_changed = true;
        viewModel.LoadPanelShown(true);
        //TODO - get the plan obj - it will help
        for (let i=0; i < SmartLife.planinfo.length; i++) {
            if (SmartLife.planinfo[i].plan_code == e.value) {
                viewModel.plan_obj(SmartLife.planinfo[i]);
            }
        }
        if (is_item_changed) {
            handle_policy_visiblity(e.value);
        }
        

        console.log(viewModel.plan_obj());
        viewModel.LoadPanelShown(false);
    }
    function handle_policy_visiblity(plan_code) {
        viewModel.LoadPanelShown(false);
        is_item_changed = false;
        if (plan_code == "14") {
            let formdata = getFormInstance().option("formData");
            //alert("here");
            console.log(viewModel.dxFormOptions.items[0].tabs[0].items[0]);
            //viewModel.dxFormOptions.items[0].tabs[0].items[0].editorOptions.visible(ko.observable(false)); 
            //viewModel.dxFormOptions.items[0].tabs[0].items[0].editorOptions.visible(false);  
            $("#dxForm").dxForm('instance').itemOption("PERSONAL DETAILS.surname", "visible", true);
            setformdata(formdata);
        }
    }

    function default_form_display() {
        /*dependants
        inv_premium
        cepa
        rider_premium
        riders
        life_premium
        basic_premium
        modal_premium
        total_premium
        transfer_charge
        $("#dxForm").dxForm('instance').itemOption("POLICY DETAILS.dependants", "visible", true);
        $("#dxForm").dxForm('instance').getEditor("family_health").option("dataSource", result.family_health);
        $("#dxForm").dxForm('instance').getEditor("family_history").option("dataSource", result.family_history);*/
    }

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
        //if rcd_id, show the record...
        get_details: function () {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting single record"
            });
            get_records.DBget("policy/getProposal?record_id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.policy_arr);
                    $("#dxForm").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    console.log(result.beneficiaries);
                    $("#dxForm").dxForm('instance').getEditor("beneficiaries").option("dataSource", result.beneficiaries);
                    $("#dxForm").dxForm('instance').getEditor("dependants").option("dataSource", result.dependants);
                    $("#dxForm").dxForm('instance').getEditor("riders").option("dataSource", result.riders);
                    $("#dxForm").dxForm('instance').getEditor("family_health").option("dataSource", result.family_health);
                    $("#dxForm").dxForm('instance').getEditor("family_history").option("dataSource", result.fm_health_intermediary);//qn
                    $("#dxForm").dxForm('instance').getEditor("qn").option("dataSource", result.qn_intermediary);
                    qn_intermediary = result.qn_intermediary;
                    //qn = result.qn;
                    fm_health_intermediary = result.fm_health_intermediary;//fm_health_intermediary
                    //family_history = result.family_history;
                    //let form_data_instance = $("#dxForm").dxForm('instance').option("formData");
                    //$("#dxForm").dxForm('instance').updateData(form_data_instance);
                    //console.log($("#dxForm").dxForm('instance').option("formData"));
                    //$("#dxForm").dxForm('instance').refresh();
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        viewShown: function () {
            viewModel.get_details();
        },

        /////////////dxFormDisease//////
        pop_disease_desc: ko.observable(false),
        hide_disease_desc: function (e) {
            //$("#dxFormDisease").dxForm('instance').resetValues(); 
            //viewModel.pop_disease_desc(false);
            //let data = { hi_disease_id: '',};
            //$("#dxFormDisease").dxForm('instance').updateData(formdata);
        },
        show_disease_desc: function (tmp_qn_intermediary, datasource, valexp, disexp) {
            console.log(tmp_qn_intermediary);
            viewModel.pop_disease_desc(true);
            $("#dxFormDisease").dxForm('instance').getEditor("hi_disease_id").option("dataSource", datasource);
            $("#dxFormDisease").dxForm('instance').getEditor("hi_disease_id").option("valueExpr", valexp);
            $("#dxFormDisease").dxForm('instance').getEditor("hi_disease_id").option("displayExpr", disexp);
            $("#dxFormDisease").dxForm({
                formData: tmp_qn_intermediary
            }).dxForm("instance");
        },
        dxFormDisease: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formDiseaseInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                {
                    label: {
                        text: "Question"
                    },
                    editorType: "dxLookup",
                    dataField: "hi_disease_id",
                    colSpan:2,
                    editorOptions: {
                        readOnly: true,
                        dataSource: SmartLife.Healthinfo,
                        displayExpr: 'description',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "Disease or Injured"
                    },
                    editorType: "dxTextBox",
                    dataField: "hi_disease_injury",
                    validationRules: [{
                        type: "required",
                        message: "Disease / Injury is required"
                    }]
                }, {
                    label: {
                        text: "Disease Date"
                    },
                    editorType: "dxDateBox",
                    dataField: "hi_disease_date",
                    validationRules: [{
                        type: "required",
                        message: "Disease Date is required"
                    }]
                }, {
                    label: {
                        text: "Disease Duration"
                    },
                    editorType: "dxTextBox",
                    dataField: "hi_disease_duration",
                    validationRules: [{
                        type: "required",
                        message: "Disease Duration is required"
                    }]
                }, {
                    label: {
                        text: "Disease Result"
                    },
                    editorType: "dxTextBox",
                    dataField: "hi_disease_result",
                    validationRules: [{
                        type: "required",
                        message: "Disease Result is required"
                    }]
                }, {
                    label: {
                        text: "Doctor or Hospital"
                    },
                    editorType: "dxTextBox",
                    dataField: "hi_disease_doc",
                    validationRules: [{
                        type: "required",
                        message: "Doctor or Hospital is required"
                    }]
                }, {
                colSpan:2,
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
                        text: "SAVE",
                        icon: "save",
                        type: "normal",
                        onClick: function (args) {
                            //alter the array depending on the form
                            //qn_intermediary, fm_health_intermediary;
                            var result = args.validationGroup.validate();
                            let data = $("#dxFormDisease").dxForm('instance').option("formData");
                            console.log(qn);
                            if (result.isValid) {
                                if (is_checklist) {
                                    for (let i = 0; i < qn_intermediary.length; i++) {
                                        if (qn_intermediary[i].qn_id == data.hi_disease_id.toString()) {
                                            qn_intermediary[i].hi_disease_id = data.hi_disease_id;
                                            qn_intermediary[i].hi_disease_injury = data.hi_disease_injury;
                                            qn_intermediary[i].hi_disease_date = data.hi_disease_date;
                                            qn_intermediary[i].hi_disease_duration = data.hi_disease_duration;
                                            qn_intermediary[i].hi_disease_result = data.hi_disease_result;
                                            qn_intermediary[i].hi_disease_doc = data.hi_disease_doc;
                                            qn_intermediary[i].ans = true;
                                        }
                                    }
                                    $("#dxForm").dxForm('instance').getEditor("qn").option("dataSource", qn_intermediary);
                                } else {
                                    for (let i = 0; i < fm_health_intermediary.length; i++) {
                                        if (fm_health_intermediary[i].qn_id == data.hi_disease_id.toString()) {
                                            fm_health_intermediary[i].hi_disease_id = data.hi_disease_id;
                                            fm_health_intermediary[i].hi_disease_injury = data.hi_disease_injury;
                                            fm_health_intermediary[i].hi_disease_date = data.hi_disease_date;
                                            fm_health_intermediary[i].hi_disease_duration = data.hi_disease_duration;
                                            fm_health_intermediary[i].hi_disease_result = data.hi_disease_result;
                                            fm_health_intermediary[i].hi_disease_doc = data.hi_disease_doc;
                                            fm_health_intermediary[i].ans = true;
                                        }
                                    }
                                    $("#dxForm").dxForm('instance').getEditor("family_history").option("dataSource", fm_health_intermediary);
                                }
                            }
                        }
                    }
                }]
        },
        ///////////end of dxFormDisease///


        plan_obj: ko.observableArray(),
        beneficiaries: ko.observableArray([{ id: 1, name: 'Kevin Gachomo', relationship: 'SON', perc_alloc: '100' }]),

        plan_changed: function (e, fn) {
            if (prev_val != e.value) {
                if (e.value == "14") {
                    prev_val = e.value;
                    let formdata = formInstance.option("formData");
                    //alert("here");
                    //console.log(viewModel.dxFormOptions.items[0].tabs[0].items[0]);
                    //viewModel.dxFormOptions.items[0].tabs[0].items[0].editorOptions.visible(ko.observable(false)); 
                    //viewModel.dxFormOptions.items[0].tabs[0].items[0].editorOptions.visible(false);  
                    //$("#dxForm").dxForm('instance').itemOption("PERSONAL DETAILS.surname", "visible", true);
                    //console.log(viewModel.dxFormOptions.items[0].tabs[0].items[0]);
                    
                    formInstance.itemOption("POLICY DETAILS.inv_premium", "visible", true);
                    formInstance.itemOption("POLICY DETAILS.life_premium", "visible", true);
                    formInstance.itemOption("POLICY DETAILS.rider_premium", "visible", true);
                    //formInstance.itemOption("POLICY DETAILS.dependants", "visible", true);
                    //formInstance.itemOption("POLICY DETAILS.riders", "visible", true);
                    formInstance.itemOption("POLICY DETAILS.total_premium", "visible", true);
                    formInstance.itemOption("POLICY DETAILS.edwa_nkoso_policy", "visible", true);
                    $("#dxForm").dxForm('instance').updateData(formdata);
                    tabsInstance.option("selectedIndex", 1);
                    //setformdata(formdata);
                    //$("#dxForm").dxForm("instance").itemOption("POLICY DETAILS.plan_code").focus();

                    //var editor = formInstance.getEditor("plan_code");
                    //formInstance.option("tabIndex", 2);
                    /*let tabpanel = formInstance.tabPanelOptions("selectedIndex", 1);
                    console.log(tabpanel);*/


                    //tabsInstance.tabPanelOptions("selectedIndex", 1);
                    //console.log(formInstance);
                    //editor.focus();
                    //$("#dxForm").dxForm('instance').getEditor("marital_status_code").focus(); 
                    //$("#dxForm").dxForm('instance').option("selectedIndex", 2);
                    //$("#dxForm").dxForm('instance').tabPanel.option("selectedIndex", 1);
                    fn(true);
                } else {
                    fn(true);
                }
            }
        },

        calc_anidaso_life_prem(e, fn) {
            //make a post 
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "calculating anidaso"
            });
            let data = {
                sum_assured: 200000,
                plan_code: "14",
                anb: 40
            };
            get_life.DBpost("calc/LifeAnidaso", data).done(function (result) {
                if (result.success == true) {
                    console.log(result.life_premium);
                    //formInstance.itemOption("life_premium", "value", result.life_premium);
                    formInstance.updateData("life_premium", result.life_premium);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
                fn(true);
            }).fail(function () {
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                fn(true);
            });
        },

        dxFormOptions: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            onOptionChanged: function (e) {
                /*e.component
                if () {

                }*/
            },


            items: [{
                itemType: "tabbed",
                colSpan: 2,
                tabPanelOptions: {
                    deferRendering: false,
                    onInitialized: function (e) {
                        tabsInstance = e.component;
                    },
                },
                tabs: [{
                    colCount: 2,
                    title: "PERSONAL DETAILS",
                    name: "personal_details",
                    items: [
                        {
                            label: {
                                text: "ID"
                            },
                            visible:false,
                            editorType: "dxTextBox",
                            dataField: "ID"
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
                                text: "Gender"
                            },
                            editorType: "dxLookup",
                            dataField: "gender_code",
                            editorOptions: {

                                dataSource: SmartLife.Genderinfo,
                                displayExpr: 'Desc',
                                valueExpr: 'Code'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Gender is required"
                            }]
                        }, {
                            label: {
                                text: "Marital Status"
                            },
                            editorType: "dxLookup",
                            dataField: "marital_status_code",
                            editorOptions: {

                                dataSource: SmartLife.Maritalinfo,
                                displayExpr: 'Description',
                                valueExpr: 'Code'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Marital is required"
                            }]
                        }, {
                            label: {
                                text: "Telephone"
                            },
                            editorType: "dxNumberBox",
                            dataField: "tel_no"
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
                                text: "Country"
                            },
                            editorType: "dxLookup",
                            dataField: "country_code",
                            editorOptions: {

                                dataSource: SmartLife.Countryinfo,
                                displayExpr: 'Name',
                                valueExpr: 'Code'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Country is required"
                            }]
                        }, {
                            label: {
                                text: "City"
                            },
                            editorType: "dxTextBox",
                            dataField: "city",
                        }, {
                            label: {
                                text: "Region"
                            },
                            editorType: "dxTextBox",
                            dataField: "region",
                        }, {
                            label: {
                                text: "Postal Address"
                            },
                            editorType: "dxTextBox",
                            dataField: "postal_address",
                            validationRules: [{
                                type: "required",
                                message: "Post Address is required"
                            }]
                        }, {
                            label: {
                                text: "Residential Address"
                            },
                            editorType: "dxTextBox",
                            dataField: "residential_address",
                            validationRules: [{
                                type: "required",
                                message: "Residential Address is required"
                            }]
                        }, {
                            label: {
                                text: "Occupation"
                            },
                            editorType: "dxLookup",
                            dataField: "occupation_code",
                            editorOptions: {

                                dataSource: SmartLife.Occupationinfo,
                                displayExpr: 'occupation_name',
                                valueExpr: 'occupation_code'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Occupation is required"
                            }]
                        }, {
                            label: {
                                text: "Business"
                            },
                            editorType: "dxTextBox",
                            dataField: "business_name"
                        }, {
                            label: {
                                text: "Business Location"
                            },
                            editorType: "dxTextBox",
                            dataField: "business_location"
                        }, {
                            label: {
                                text: "Residential Address"
                            },
                            editorType: "dxTextBox",
                            dataField: "residential_address"
                        }, {
                            label: {
                                text: "Is Politically Exposed?"
                            },
                            editorType: "dxLookup",
                            dataField: "has_politicaly_affiliated_person",
                            editorOptions: {

                                dataSource: SmartLife.Confirmations,
                                displayExpr: 'name',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Is Politically Exposed is required"
                            }]
                        }, {
                            label: {
                                text: "Politically Affiliated Person"
                            },
                            editorType: "dxTextBox",
                            dataField: "politicaly_affiliated_person"
                        }, {
                            label: {
                                text: "Secondary Income?"
                            },
                            editorType: "dxLookup",
                            dataField: "has_secondary_income",
                            editorOptions: {

                                dataSource: SmartLife.Confirmations,
                                displayExpr: 'name',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Secondary is required"
                            }]
                        }, {
                            label: {
                                text: "Secondary Income"
                            },
                            editorType: "dxTextBox",
                            dataField: "secondary_income"
                        }, {
                            label: {
                                text: "TIN"
                            },
                            editorType: "dxTextBox",
                            dataField: "tin_no",
                            validationRules: [{
                                type: "required",
                                message: "TIN is required"
                            }]
                        }, {
                            label: {
                                text: "Staff Number"
                            },
                            editorType: "dxTextBox",
                            dataField: "employer_no",
                            validationRules: [{
                                type: "required",
                                message: "TIN is required"
                            }]
                        }, {
                            label: {
                                text: "Hobbies / Pastimes"
                            },
                            editorType: "dxTextBox",
                            dataField: "hobbies_pastimes",
                            validationRules: [{
                                type: "required",
                                message: "Hobbies is required"
                            }]
                        }, {
                            label: {
                                text: "Home Town"
                            },
                            editorType: "dxTextBox",
                            dataField: "home_town"
                        }, {
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            colSpan: 2,
                            itemType: "button",
                            buttonOptions: {
                                text: "NEXT",
                                icon: "chevronnext",
                                type: "default",
                                onClick: function (args) {
                                    tabsInstance.option("selectedIndex", 1);
                                }
                            }
                        }],
                }, {
                    title: 'POLICY DETAILS',
                    colCount: 2,
                    name: "policy_details",
                    items: [
                        {
                            label: {
                                text: "Date of Birth"
                            },
                            dataField: "dob",
                            editorType: "dxDateBox",
                            editorOptions: {
                                width: '100%'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Date of Birth is required"
                            }]
                        }, {
                            label: {
                                text: "Age Next Birthday"
                            },
                            editorType: "dxNumberBox",
                            dataField: "anb",
                            validationRules: [{
                                type: "required",
                                message: "Age Next Birthday is required"
                            }]
                        }, {
                            label: {
                                text: "Plan"
                            },
                            editorType: "dxLookup",
                            dataField: "plan_code",
                            editorOptions: {

                                dataSource: SmartLife.planinfo,
                                displayExpr: 'description',
                                valueExpr: 'plan_code',
                                onValueChanged: function (e) {
                                    //viewModel.LoadPanelShown(true);
                                    viewModel.plan_changed(e, function (results) {
                                        //viewModel.LoadPanelShown(false);
                                    });

                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "Plan is required"
                            }]
                        }, {
                            label: {
                                text: "Term"
                            },
                            editorType: "dxNumberBox",
                            dataField: "term",
                            validationRules: [{
                                type: "required",
                                message: "Term is required"
                            }]
                        }, {
                            colspan: 2,
                            label: {
                                text: "Edwa Nkoso Policy No"
                            },
                            editorType: "dxTextBox",
                            dataField: "edwa_nkoso_policy",
                            visible: false
                        }, {
                            label: {
                                text: "Is It a Top up?"
                            },
                            editorType: "dxLookup",
                            dataField: "is_top_up",
                            editorOptions: {

                                dataSource: SmartLife.Confirmations,
                                displayExpr: 'name',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Is It a Top up is required"
                            }]
                        }, {
                            label: {
                                text: "Top up Policy No"
                            },
                            editorType: "dxTextBox",
                            dataField: "topup_policyno",
                        }, {
                            label: {
                                text: "Pay Source"
                            },
                            editorType: "dxLookup",
                            dataField: "employer_code",
                            editorOptions: {

                                dataSource: SmartLife.Employerinfo,
                                displayExpr: 'Name',
                                valueExpr: 'emp_code'
                            }
                        }, {
                            label: {
                                text: "Pay Source Branch"
                            },
                            editorType: "dxLookup",
                            dataField: "paysource_br_code",
                            editorOptions: {

                                dataSource: SmartLife.Paysourcebr,
                                displayExpr: 'Name',
                                valueExpr: 'emp_code'
                            }
                        }, {
                            label: {
                                text: "Sort Code"
                            },
                            editorType: "dxTextBox",
                            dataField: "sort_code"
                        }, {
                            label: {
                                text: "Class Code"
                            },
                            editorType: "dxLookup",
                            dataField: "client_class_code",
                            editorOptions: {

                                dataSource: SmartLife.Paclassinfo,
                                displayExpr: 'Description',
                                valueExpr: 'class_code'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Class Code is required"
                            }]
                        }, {
                            label: {
                                text: "Pay Mode"
                            },
                            editorType: "dxLookup",
                            dataField: "paymode_code",
                            editorOptions: {

                                dataSource: SmartLife.Paymentmode,
                                displayExpr: 'description',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Pay Mode is required"
                            }]
                        }, {
                            label: {
                                text: "Payment Method"
                            },
                            editorType: "dxLookup",
                            dataField: "pay_method_code",
                            editorOptions: {

                                dataSource: SmartLife.Paymentinfo,
                                displayExpr: 'decription',
                                valueExpr: 'payment_mode'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Payment Method is required"
                            }]
                        }, {
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            colSpan: 2,
                            dataField: "dependants",
                            editorType: "dxDataGrid",
                            visible: true,
                            editorOptions: {
                                dataSource: [],
                                wordWrapEnabled: true,
                                editing: {
                                    allowUpdating: true,
                                    mode: 'form',
                                    allowAdding: true,
                                    allowDeleting: true,
                                    form: {
                                        items: ["dp_fullname", "b_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium","dp_good_health"]
                                    }
                                },
                                onRowUpdating: function (e) {
                                    //e.cancel
                                    //var d = $.Deferred();

                                    //alert(e.data.dp_good_health);
                                    //alert("here");
                                    is_checklist = false;
                                    //viewModel.show_disease_desc(1);
                                    //return d.reject();
                                },
                                columns: [
                                    {
                                        dataField: 'dp_fullname',
                                        caption: 'Fullnames'
                                    }, {
                                        dataField: 'b_relationship',
                                        caption: 'Relationship',
                                        lookup: {
                                            dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                        }
                                    }, {
                                        dataField: 'dp_dob',
                                        caption: 'Date of Birth',
                                        dataType: 'date'
                                    }, {
                                        dataField: 'dp_anb',
                                        caption: 'Age',
                                        dataType: 'number'
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
                                        dataType: 'number'
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
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            label: {
                                text: "Sum Assured"
                            },
                            editorType: "dxNumberBox",
                            dataField: "sum_assured",
                            editorOptions: {
                                onValueChanged: function (e) {
                                    viewModel.LoadPanelShown(true);
                                    viewModel.calc_anidaso_life_prem(e, function (results) {
                                        viewModel.LoadPanelShown(false);
                                    });
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "Sum Assured is required"
                            }]
                        }, {
                            label: {
                                text: "Policy Fee"
                            },
                            editorType: "dxNumberBox",
                            dataField: "pol_fee",
                            validationRules: [{
                                type: "required",
                                message: "Policy Fee is required"
                            }]
                        }, {
                            label: {
                                text: "Investment Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "inv_premium",
                            visible: false
                        }, {
                            label: {
                                text: "CEPA"
                            },
                            editorType: "dxNumberBox",
                            dataField: "cepa",
                            visible: false
                        }, {

                            label: {
                                text: "Protection Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "rider_premium",
                            visible: false
                        }, {
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            colSpan: 2,
                            dataField: "riders",
                            editorType: "dxDataGrid",
                            visible: true,
                            editorOptions: {
                                dataSource: [],
                                wordWrapEnabled: true,
                                editing: {
                                    allowUpdating: true,
                                    mode: 'form',
                                    allowAdding: true,
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
                        }, {
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            label: {
                                text: "Life Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "life_premium",
                            visible: false
                        }, {
                            label: {
                                text: "Basic Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "basic_premium",
                            visible: false
                        }, {
                            label: {
                                text: "Modal Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "modal_premium",
                            visible: false,
                            validationRules: [{
                                type: "required",
                                message: "Modal Premium is required"
                            }]
                        }, {
                            label: {
                                text: "Total Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "total_premium",
                            visible: false
                        }, {
                            label: {
                                text: "Transfer Charge"
                            },
                            editorType: "dxNumberBox",
                            dataField: "transfer_charge",
                            visible: false
                        }, {
                            label: {
                                text: "First Deduction Date"
                            },
                            editorType: "dxDateBox",
                            dataField: "deduction_date",
                            validationRules: [{
                                type: "required",
                                message: "First Deduction Date is required"
                            }]
                        }, {
                            label: {
                                text: "Do you or have you ever had any assurance on your life ?"
                            },
                            editorType: "dxLookup",
                            dataField: "life_assuarance",
                            editorOptions: {

                                dataSource: SmartLife.Confirmations,
                                displayExpr: 'name',
                                valueExpr: 'id'
                            }
                        }, {
                            label: {
                                text: "Glico Policy No"
                            },
                            editorType: "dxTextBox",
                            dataField: "pol_no"
                        }, {
                            label: {
                                text: "Have you ever made a claim under any existing/previous Policy?"
                            },
                            editorType: "dxLookup",
                            dataField: "existing_policy",
                            editorOptions: {

                                dataSource: SmartLife.Confirmations,
                                displayExpr: 'name',
                                valueExpr: 'id'
                            }
                        }, {
                            label: {
                                text: "Claim Policy No"
                            },
                            editorType: "dxTextBox",
                            dataField: "claim_pol_no"
                        }, {
                            label: {
                                text: "Claim Type"
                            },
                            editorType: "dxTextBox",
                            dataField: "type_claim"
                        }, {
                            label: {
                                text: "Percentage Increase"
                            },
                            editorType: "dxLookup",
                            dataField: "percentage_increase",
                            editorOptions: {

                                dataSource: SmartLife.Percentage
                            }
                        }, {
                            label: {
                                text: "Do you require optional Anidaso Policy ?"
                            },
                            editorType: "dxLookup",
                            dataField: "anidaso_pol",
                            editorOptions: {

                                dataSource: SmartLife.Confirmations,
                                displayExpr: 'name',
                                valueExpr: 'id'
                            }
                        }, {
                            label: {
                                text: "Anidaso Premium Amount"
                            },
                            editorType: "dxTextBox",
                            dataField: "anidaso_premium_amount"
                        }, {
                            itemType: "empty",
                        }, {
                            itemType: "button",
                            horizontalAlignment: "left",
                            buttonOptions: {
                                text: "BACK",
                                horizontalAlignment: "left",
                                icon: "chevronprev",
                                type: "normal",
                                onClick: function (args) {
                                    tabsInstance.option("selectedIndex", 0);
                                }
                            }
                        }, {
                            itemType: "button",
                            buttonOptions: {
                                text: "NEXT",
                                icon: "chevronnext",
                                type: "default",
                                onClick: function (args) {

                                    //save and navigate next screen.
                                    tabsInstance.option("selectedIndex", 2);

                                }
                            }
                        }
                    ],
                }, {
                    title: 'HEALTH DETAILS',
                    colCount: 2,
                    name: "health_details",
                    items: [{
                        label: {
                            text: "Height"
                        },
                        editorType: "dxTextBox",
                        dataField: "pop_height",
                        validationRules: [{
                            type: "required",
                            message: "Height is required"
                        }]
                    }, {
                        label: {
                            text: "Weight"
                        },
                        editorType: "dxTextBox",
                        dataField: "pop_weight",
                        validationRules: [{
                            type: "required",
                            message: "Weight is required"
                        }]
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        colSpan: 2,
                        label: {
                            text: "HEALTH CHECKLIST"
                        },
                        dataField: "qn",
                        editorType: "dxDataGrid",
                        editorOptions: {
                            dataSource: [],//SmartLife.Healthinfo,
                            wordWrapEnabled: true,
                            onRowClick: function (e) {
                                let health_id = e.data.qn_id;
                                is_checklist = true;
                                let tmp_qn_intermediary = {
                                    hi_disease_id: health_id, hi_disease_injury: '',
                                    hi_disease_date: null, hi_disease_duration: '', hi_disease_result: '', hi_disease_doc: ''
                                };
                                console.log(qn_intermediary);
                                for (let i = 0; i < qn_intermediary.length; i++) {
                                    if (qn_intermediary[i]['hi_disease_id'] == health_id) {
                                        tmp_qn_intermediary = qn_intermediary[i];
                                    }
                                }
                                
                                viewModel.show_disease_desc(tmp_qn_intermediary, SmartLife.Healthinfo,'id','description');
                            },
                            editing: {
                                allowUpdating: false,
                                mode: 'cell',
                                allowAdding: false,
                                allowDeleting: false,
                            },
                            columns: [
                                {
                                    dataField: 'qn_id',
                                    visible: false
                                }, {
                                    dataField: 'qn_description',
                                    caption: 'Question',
                                    allowEditing: false,
                                }, {
                                    dataField: 'ans',
                                    caption: 'Answer',
                                    dataType: 'boolean',
                                    width: '180',
                                    allowEditing: false,
                                }
                            ]
                        }
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        label: {
                            text: "Are You In Good Health?"
                        },
                        editorType: "dxLookup",
                        dataField: "good_health",
                        editorOptions: {

                            dataSource: SmartLife.Confirmations,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        }
                    }, {
                        label: {
                            text: "Health Condition"
                        },
                        editorType: "dxLookup",
                        dataField: "health_condition",
                        editorOptions: {

                            dataSource: SmartLife.Confirmations,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        }
                    }, {
                        label: {
                            text: "Name and address of your regular Doctor and Hospital"
                        },
                        editorType: "dxTextBox",
                        dataField: "name_doctor"
                    }, {
                        label: {
                            text: "Give date you last consulted ?"
                        },
                        editorType: "dxDateBox",
                        dataField: "last_consult"
                    }, {
                        label: {
                            text: "Do you smoke ?"
                        },
                        editorType: "dxLookup",
                        dataField: "smoke_pol",
                        editorOptions: {

                            dataSource: SmartLife.Confirmations,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        }
                    }, {
                        label: {
                            text: "How many sticks of cigarettes do you smoke in a day?"
                        },
                        editorType: "dxNumberBox",
                        dataField: "cigarettes_day"
                    }, {
                        label: {
                            text: "When did you start smoking?"
                        },
                        editorType: "dxDateBox",
                        dataField: "start_smoking"
                    }, {
                        label: {
                            text: "Do you consume alcohol ?"
                        },
                        editorType: "dxLookup",
                        dataField: "alcohol_pol",
                        editorOptions: {

                            dataSource: SmartLife.Confirmations,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        }
                    }, {
                        label: {
                            text: "What is you averge consumption of alcohol?"
                        },
                        editorType: "dxNumberBox",
                        dataField: "average_alcohol"
                    }, {
                        label: {
                            text: "When did you start drinking?"
                        },
                        editorType: "dxDateBox",
                        dataField: "start_drinking"
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        colSpan: 2,
                        dataField: "family_health",
                        editorType: "dxDataGrid",
                        editorOptions: {
                            dataSource: [],
                            wordWrapEnabled: true,
                            editing: {
                                allowUpdating: true,
                                mode: 'form',
                                allowAdding: true,
                                allowDeleting: true,
                            },
                            columns: [
                                {
                                    dataField: 'fh_family',
                                    caption: 'Family',
                                    lookup: {
                                        dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                    }
                                }, {
                                    dataField: 'fh_state',
                                    caption: 'State',
                                    lookup: {
                                        dataSource: ['ALIVE', 'DEAD']
                                    }
                                }, {
                                    dataField: 'fh_age',
                                    caption: 'Age',
                                    dataType: 'number'
                                }, {
                                    dataField: 'fh_state_health',
                                    caption: 'Health status'
                                }
                            ]
                        }
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        label: {
                            width: '50%',
                            text: "Have you or any of the dependant proposed lives or any member of your family?"
                        },
                        colSpan: 2,
                        dataField: "family_history",
                        editorType: "dxDataGrid",
                        editorOptions: {
                            dataSource: [],//SmartLife.Healthinfo,
                            wordWrapEnabled: true,
                            onRowClick: function (e) {
                                let health_id = e.data.qn_id;
                                is_checklist = false;
                                let tmp_qn_intermediary = {
                                    hi_disease_id: health_id, hi_disease_injury: '',
                                    hi_disease_date: null, hi_disease_duration: '', hi_disease_result: '', hi_disease_doc: ''
                                };
                                for (let i = 0; i < fm_health_intermediary.length; i++) {
                                    if (fm_health_intermediary[i]['hi_disease_id'] == health_id) {
                                        tmp_qn_intermediary = fm_health_intermediary[i];
                                    }
                                }
                                viewModel.show_disease_desc(tmp_qn_intermediary, SmartLife.FamDisease,'disease_id','name');
                            },
                            editing: {
                                allowUpdating: false,
                                mode: 'cell',
                                allowAdding: false,
                                allowDeleting: false,
                            },
                            columns: [
                                {
                                    dataField: 'qn_id',
                                    visible: false
                                }, {
                                    dataField: 'qn_description',
                                    caption: 'Question',
                                    allowEditing: false,
                                }, {
                                    dataField: 'ans',
                                    caption: 'Answer',
                                    dataType: 'boolean',
                                    width: '180',
                                    allowEditing: false,
                                }
                            ]
                        }
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        itemType: "button",
                        horizontalAlignment: "left",
                        buttonOptions: {
                            text: "BACK",
                            horizontalAlignment: "left",
                            icon: "chevronprev",
                            type: "default",
                            onClick: function (args) {
                                //save and navigate next screen.
                                tabsInstance.option("selectedIndex", 1);
                            }
                        }
                    }, {
                        itemType: "button",
                        buttonOptions: {
                            text: "NEXT",
                            icon: "chevronnext",
                            type: "normal",
                            onClick: function (args) {
                                //save and navigate next screen.
                                tabsInstance.option("selectedIndex", 3);
                            }
                        }
                    }],
                }, {
                    title: 'SUBMIT',
                    colCount: 2,
                    name: "submit",
                    items: [{
                        label: {
                            text: "Document Delivery mode"
                        },
                        editorType: "dxLookup",
                        dataField: "doc_delivery_mode",
                        editorOptions: {

                            dataSource: SmartLife.doc_mode,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        },
                        validationRules: [{
                            type: "required",
                            message: "Document Delivery Mode is required"
                        }]
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        colSpan: 2,
                        label: {
                            text: "BENEFICIARIES / NEXT OF KIN"
                        },
                        dataField: "beneficiaries",
                        editorType: "dxDataGrid",
                        editorOptions: {
                            dataSource: [],
                            wordWrapEnabled: true,
                            editing: {
                                allowUpdating: true,
                                mode: 'form',
                                allowAdding: true,
                                allowDeleting: true,
                            },
                            columns: [
                                {
                                    dataField: 'b_name',
                                    caption: 'Fullnames'
                                }, {
                                    dataField: 'b_relationship',
                                    caption: 'Relationship',
                                    lookup: {
                                        dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                    }
                                }, {
                                    dataField: 'b_dob',
                                    caption: 'Date of Birth',
                                    dataType: 'date'
                                }, {
                                    dataField: 'b_percentage_allocated',
                                    caption: '% Allocated'
                                }, {
                                    dataField: 'b_mobile_no',
                                    caption: 'Mobile No'
                                }
                            ]
                        }
                    }, {
                        colSpan: 2,
                        itemType: "empty"
                    }, {
                        itemType: "button",
                        horizontalAlignment: "left",
                        buttonOptions: {
                            text: "BACK",
                            horizontalAlignment: "left",
                            icon: "chevronprev",
                            type: "normal",
                            onClick: function (args) {
                                tabsInstance.option("selectedIndex", 2);
                            }
                        }
                    }, {
                        itemType: "button",
                        buttonOptions: {
                            text: "SUBMIT TO PROCEED",
                            icon: "save",
                            type: "default",
                            onClick: function (args) {
                                //save and navigate next screen.
                                submit_form();
                            }
                        }
                    }],
                }]
            }]
        },

        

    };

    function submit_form(e) {
        ///post data form as it is
        viewModel.LoadPanelShown(true);
        let get_life = new DB({
            name: "submitting the form"
        });
        let data = $("#dxForm").dxForm('instance').option("formData");
        data['beneficiaries'] = JSON.stringify($("#dxForm").dxForm('instance').getEditor('beneficiaries').option('dataSource'));
        data['dependants'] = JSON.stringify($("#dxForm").dxForm('instance').getEditor('dependants').option('dataSource'));
        data['riders'] = JSON.stringify($("#dxForm").dxForm('instance').getEditor('riders').option('dataSource'));
        data['family_health'] = JSON.stringify($("#dxForm").dxForm('instance').getEditor('family_health').option('dataSource'));
        data['family_history'] = JSON.stringify($("#dxForm").dxForm('instance').getEditor('family_history').option('dataSource'));
        data['qn'] = JSON.stringify($("#dxForm").dxForm('instance').getEditor('qn').option('dataSource'));
        
        console.log(data);
        get_life.DBpost("sync/synProposal", data).done(function (result) {
            viewModel.LoadPanelShown(false);
            if (result.success == true) {
                console.log(result.record_id);
                //navigate to the my applications screen
                //viewModel.navigateForward("applications", "");
            } else {
                viewModel.show_test(result.msg, 'error');
            }
        }).fail(function () {
            viewModel.LoadPanelShown(false);
            viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
        });
    }

    return viewModel;
};