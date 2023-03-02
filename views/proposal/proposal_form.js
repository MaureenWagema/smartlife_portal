SmartLife.proposal_form = function (params) {


    var child;
    var length;
    var base_color = "rgb(230,230,230)";
    var active_color = "rgb(237, 40, 70)";


    $(document).ready(function () {
        var base_color = "rgb(230,230,230)";
        var active_color = "rgb(237, 40, 70)";



         child = 1;
         length = $("section").length - 1;
        $("#prev").addClass("disabled");
        $("#submit").addClass("disabled");

        $("section").not("section:nth-of-type(1)").hide();
        $("section").not("section:nth-of-type(1)").css('transform', 'translateX(100px)');

        var svgWidth = length * 200 + 24;
        $("#svg_wrap").html(
          '<svg version="1.1" id="svg_form_time" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ' +
            svgWidth +
            ' 24" xml:space="preserve"></svg>'
        );

        function makeSVG(tag, attrs) {
            var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
            for (var k in attrs) el.setAttribute(k, attrs[k]);
            return el;
        }

        for (i = 0; i < length; i++) {
            var positionX = 12 + i * 200;
            var rect = makeSVG("rect", { x: positionX, y: 9, width: 200, height: 6 });
            document.getElementById("svg_form_time").appendChild(rect);
            // <g><rect x="12" y="9" width="200" height="6"></rect></g>'
            var circle = makeSVG("circle", {
                cx: positionX,
                cy: 12,
                r: 12,
                width: positionX,
                height: 6
            });
            document.getElementById("svg_form_time").appendChild(circle);
        }

        var circle = makeSVG("circle", {
            cx: positionX + 200,
            cy: 12,
            r: 12,
            width: positionX,
            height: 6
        });
        document.getElementById("svg_form_time").appendChild(circle);

        $('#svg_form_time rect').css('fill', base_color);
        $('#svg_form_time circle').css('fill', base_color);
        $("circle:nth-of-type(1)").css("fill", active_color);


        $(".button").click(function () {
            $("#svg_form_time rect").css("fill", active_color);
            $("#svg_form_time circle").css("fill", active_color);
            var id = $(this).attr("id");
            if (id == "next") {
                $("#prev").removeClass("disabled");
                if (child >= length) {
                    $(this).addClass("disabled");
                    $('#submit').removeClass("disabled");
                }
                if (child <= length) {
                    child++;
                }
            } else if (id == "prev") {
                $("#next").removeClass("disabled");
                $('#submit').addClass("disabled");
                if (child <= 2) {
                    $(this).addClass("disabled");
                }
                if (child > 1) {
                    child--;
                }
            }
            var circle_child = child + 1;
            $("#svg_form_time rect:nth-of-type(n + " + child + ")").css(
              "fill",
              base_color
            );
            $("#svg_form_time circle:nth-of-type(n + " + circle_child + ")").css(
              "fill",
              base_color
            );
            var currentSection = $("section:nth-of-type(" + child + ")");
            currentSection.fadeIn();
            currentSection.css('transform', 'translateX(0)');
            currentSection.prevAll('section').css('transform', 'translateX(-100px)');
            currentSection.nextAll('section').css('transform', 'translateX(100px)');
            $('section').not(currentSection).hide();
        });

    });



    function navnextPrev (next) {
        $("#svg_form_time rect").css("fill", active_color);
        $("#svg_form_time circle").css("fill", active_color);
        var id = next;
        if (id == 1) {
            $("#prev").removeClass("disabled");
            if (child >= length) {
                $(this).addClass("disabled");
             
            }
            if (child <= length) {
                child++;
            }
        } else if (id == 0) {
            $("#next").removeClass("disabled");
         
            if (child <= 2) {
                $(this).addClass("disabled");
            }
            if (child > 1) {
                child--;
            }
        }
        var circle_child = child + 1;
        $("#svg_form_time rect:nth-of-type(n + " + child + ")").css(
          "fill",
          base_color
        );
        $("#svg_form_time circle:nth-of-type(n + " + circle_child + ")").css(
          "fill",
          base_color
        );
        var currentSection = $("section:nth-of-type(" + child + ")");
        currentSection.fadeIn();
        currentSection.css('transform','translateX(0)');
        currentSection.prevAll('section').css('transform','translateX(-100px)');
        currentSection.nextAll('section').css('transform','translateX(100px)');
        $('section').not(currentSection).hide();
    }


    //"use strict";
    let rcd_id;// = params.item;

    var get_data = JSON.parse(params.item);
    var plan_code = get_data['plan_code'];
    if (get_data['id'] != undefined) rcd_id = get_data['id'];
    var rd_form = get_data['rd_form'];

    var paymode_arr = [];

    var tabsInstance;
    var tabsInstancex;
    var formInstance;
    var formDependantInstance;
    var formPersonalDetailsInstance;
    var formPolicyDetailsInstance;
    var formHealthDetailsInstance;
    var formSubmitDetailsInstance;
    var formDiseaseInstance;
    var qn_intermediary;
    var qn;
    var fm_health_intermediary;
    var family_history;
    var is_checklist = false;

    const tabs = [
        {
            id: 1,
            text: 'PERSONAL DETAILS',
            icon: 'mdi mdi-account-edit',

        },
        {
            id: 2,
            text: 'POLICY DETAILS',
            icon: 'mdi mdi-airplane',

        },
        {
            id: 3,
            text: 'HEALTH DETAILS',
            icon: 'mdi mdi-stethoscope',

        },
        {
            id: 4,
            text: 'SUBMIT',
            icon: 'mdi mdi-test-tube',

        }
    ];

    function tabs_form() {
        
        var tabsInstance = $('.tabs-container').dxTabs({
            dataSource: tabs,
            scrollByContent: true,
            showNavButtons: true,
            width:'100%',
            selectedIndex: 0,
            onInitialized: function (e) {
                tabsInstancex = e.component;
            },

            onItemClick(e) {
                //
                //   alert(Lims.Currentpatient._array[0].id);
                //   alert(e.itemData.id);
            },

            onSelectionChanged(e) {
                try {
                    //  alert(e.component._options.selectedIndex);
                } catch (er) {
                    console.log(er);
                }
            }
            //
        }).dxTabs('instance');
    }

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
            let formdata = formPersonalDetailsInstance.option("formData");
            //alert("here");
            console.log(viewModel.dxFormOptions.items[0].tabs[0].items[0]);
            //viewModel.dxFormOptions.items[0].tabs[0].items[0].editorOptions.visible(ko.observable(false)); 
            //viewModel.dxFormOptions.items[0].tabs[0].items[0].editorOptions.visible(false);  
            formPersonalDetailsInstance.itemOption("surname", "visible", true);
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
                    $("#dxFormPersonal").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    $("#dxFormPolicy").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    //format the dob date here

                    $("#dxFormhealth").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    $("#dxFormSubmit").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    console.log(result.beneficiaries);
                    formSubmitDetailsInstance.getEditor("beneficiaries").option("dataSource", result.beneficiaries);
                    if (formPolicyDetailsInstance.getEditor("dependants") != null)
                        formPolicyDetailsInstance.getEditor("dependants").option("dataSource", result.dependants);
                    if (formPolicyDetailsInstance.getEditor("riders") != null)
                        formPolicyDetailsInstance.getEditor("riders").option("dataSource", result.riders);
                    formHealthDetailsInstance.getEditor("family_health").option("dataSource", result.family_health);
                    
                    
                    if (result.fm_health_intermediary.length > 0) {
                        formHealthDetailsInstance.getEditor("family_history").option("dataSource", result.fm_health_intermediary);//qn
                    } else {
                        formHealthDetailsInstance.getEditor("family_history").option("dataSource", SmartLife.FamDisease);
                    }
                    
                    //
                    if (result.qn_intermediary.length > 0) {
                        console.log(result.qn_intermediary);
                        formHealthDetailsInstance.getEditor("qn").option("dataSource", result.qn_intermediary);
                    } else {
                        formHealthDetailsInstance.getEditor("qn").option("dataSource", SmartLife.Healthinfo);
                    }
                    
                    qn_intermediary = result.qn_intermediary;
                    //qn = result.qn;
                    fm_health_intermediary = result.fm_health_intermediary;

                    //TODO-design the form first
                    viewModel.assign_plan();
                    //viewModel.plan_changed();
                    
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        assign_plan: function () {
            formPolicyDetailsInstance.updateData("plan_code", plan_code);
            if (plan_code == "37") {
                //funeral policy
                viewModel.get_paymode("37");//29
                //paymode_arr = [{ id: 90, description: 'MONTHLY' }];
                //formInstance.getEditor("paymode_code").option("dataSource", paymode_arr);
                formPolicyDetailsInstance.updateData("plan_code", "37");
            }
            if (plan_code == "2") {
                //esb
                viewModel.get_paymode("2");
                formPolicyDetailsInstance.updateData("plan_code", "2");
            }
            if (plan_code == "10") {
                //anidaso
                viewModel.get_paymode("10");
                formPolicyDetailsInstance.updateData("plan_code", "10");
            }
        },
        get_client_details: function () {
            viewModel.LoadPanelShown(true);
            let get_client = new DB({
                name: "get client details"
            });
            get_client.DBget("client/getClientDetails?client_no=" + SmartLife.clientno + "&is_micro=" + SmartLife.is_micro, {}).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success) {
                    console.log(result.client_no);
                    console.log(result.policy_arr);
                    $("#dxFormPersonal").dxForm({
                        formData: result.Client[0]
                    }).dxForm("instance");
                    $("#dxFormPolicy").dxForm({
                        formData: result.Client[0]
                    }).dxForm("instance");
                    if (formHealthDetailsInstance.getEditor("qn") != undefined) {
                        console.log("here healthinfo");
                        formHealthDetailsInstance.getEditor("qn").option("dataSource", SmartLife.Healthinfo);
                    }
                    qn_intermediary = SmartLife.Healthinfo;
                    if (formHealthDetailsInstance.getEditor("family_history") != undefined) {
                        console.log("here again famDisease");
                        formHealthDetailsInstance.getEditor("family_history").option("dataSource", SmartLife.FamDisease);
                    }
                    fm_health_intermediary = SmartLife.FamDisease;

                    //TODO-design the form first
                    viewModel.assign_plan();

                } else {
                    viewModel.show_test(result.msg, 'error');
                }
                
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        viewShown: function () {
            //tabs_form();
            //design the form
            if (parseInt(rcd_id) > 0) {
                //get client details
                viewModel.get_details();
            } else {
                //just display the client details only
                if (SmartLife.clientno != undefined && SmartLife.clientno != "") {
                    viewModel.get_client_details();
                } else {
                    viewModel.assign_plan();
                    if (formHealthDetailsInstance.getEditor("qn") != undefined) {
                        console.log("here healthinfo");
                        formHealthDetailsInstance.getEditor("qn").option("dataSource", SmartLife.Healthinfo);
                    }
                    qn_intermediary = SmartLife.Healthinfo;
                    if (formHealthDetailsInstance.getEditor("family_history") != undefined) {
                        console.log("here again famDisease");
                        formHealthDetailsInstance.getEditor("family_history").option("dataSource", SmartLife.FamDisease);
                    }
                    fm_health_intermediary = SmartLife.FamDisease;
                }
            }
            
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
                        text: "Name"
                    },
                    editorType: "dxTextBox",
                    dataField: "dp_fullname",
                    editorOptions: {
                        readOnly: false,

                    },
                    validationRules: [{
                        type: "required",
                        message: "Name is required"
                    }]
                },
                {
                    label: {
                        text: "Relationship"
                    },
                    editorType: "dxLookup",
                    dataField: "dp_relationship",
                    colSpan: 2,
                    editorOptions: {
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Relationshipinfo,
                        displayExpr: 'description',
                        valueExpr: 'code',
                        onValueChanged: function (e) {
                            if (e.value == "SF") {
                                let data = formPolicyDetailsInstance.option("formData");
                                let names = data['surname'] + ' ' + data['other_name'];
                                formDependantInstance.updateData("dp_fullname", names);
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
                        onValueChanged: function (e) {
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
                            
                            if ((current_month <= month_yr) && (current_day < date_yr)) {
                                anb_age = anb_age - 1;
                            }
                            formDependantInstance.updateData("anb", anb_age);
                        }
                    },
                    dataField: "dp_dob",
                    validationRules: [{
                        type: "required",
                        message: "DOB is required"
                    }]
                }, {
                    label: {
                        text: "ANB"
                    },
                    editorType: "dxNumberBox",
                    dataField: "dp_anb",
                    editorOptions: {
                        readOnly: true,
                        
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
                            let data = formPolicyDetailsInstance.option("formData");
                            if (plan_code == "37") {
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
                    label: {
                        text: "Are you in good Health?"
                    },
                    editorType: "dxLookup",
                    dataField: 'dp_good_health',
                    editorOptions: {
                        colSpan: 2,
                        closeOnOutsideClick: true,
                        readOnly: false,
                        dataSource: SmartLife.Confirmations,
                        displayExpr: 'name',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //display the health grid bruv
                            if (parseInt(e.value) == 0) {
                                is_checklist = false;
                                let tmp_qn_intermediary = {
                                    hi_disease_id: 'none', hi_disease_injury: '',
                                    hi_disease_date: null, hi_disease_duration: '', hi_disease_result: '', hi_disease_doc: ''
                                };
                                viewModel.show_disease_desc(tmp_qn_intermediary, SmartLife.FamDisease, 'disease_id', 'name');
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Health is required"
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
                            viewModel.hide_dependants();
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
                                let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                //add this to it 
                                data.push(dependants_data);
                                //update the dataSource
                                formPolicyDetailsInstance.getEditor("dependants").option("dataSource", data);
                                //hide
                                viewModel.hide_dependants();
                                viewModel.add_dependants_prem(dependants_data['dp_sa'], dependants_data['dp_premium']);
                            }
                        }
                    }
                }]
        },
        add_dependants_prem: function (sa, prem) {
            if (plan_code == "37") {
                //add sa
                let data = formPolicyDetailsInstance.option("formData");
                if (data['sum_assured'] == undefined) data['sum_assured'] = 0;
                let sum_assured = parseFloat(data['sum_assured']) + parseFloat(sa);
                if (data['basic_premium'] == undefined) data['basic_premium'] = 0;
                let basic_premium = data['basic_premium'] + parseFloat(prem);
                formPolicyDetailsInstance.updateData("sum_assured", sum_assured);
                formPolicyDetailsInstance.updateData("basic_premium", basic_premium);

                //calculate modal_premium
                let modal_premium = parseFloat(basic_premium) + parseInt(data['pol_fee']);
                formPolicyDetailsInstance.updateData("modal_premium", modal_premium);
            }
        },
        //////end of pop up dependants//

        /////////////dxFormDisease//////
        pop_disease_desc: ko.observable(false),
        hide_disease_desc: function (e) {
            //$("#dxFormDisease").dxForm('instance').resetValues(); 
            viewModel.pop_disease_desc(false);
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
                        readOnly: false,
                        closeOnOutsideClick: true,
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
                                    formHealthDetailsInstance.getEditor("qn").option("dataSource", qn_intermediary);
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
                                    formHealthDetailsInstance.getEditor("family_history").option("dataSource", fm_health_intermediary);
                                }
                                viewModel.pop_disease_desc(false);
                            }
                        }
                    }
                }]
        },
        ///////////end of dxFormDisease///


        plan_obj: ko.observableArray(),
        beneficiaries: ko.observableArray([{ id: 1, name: 'Kevin Gachomo', relationship: 'SON', perc_alloc: '100' }]),

        /*default_views: function () {
            formInstance.itemOption("POLICY DETAILS.inv_premium", "visible", true);
            formInstance.itemOption("POLICY DETAILS.life_premium", "visible", true);
            formInstance.itemOption("POLICY DETAILS.rider_premium", "visible", true);
            formInstance.itemOption("POLICY DETAILS.dependants", "visible", true);
            formInstance.itemOption("POLICY DETAILS.riders", "visible", true);
            formInstance.itemOption("POLICY DETAILS.total_premium", "visible", true);
            formInstance.itemOption("POLICY DETAILS.edwa_nkoso_policy", "visible", true);
        },*/
        hide_for_micro: function () {
            formPolicyDetailsInstance.itemOption("inv_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("life_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("rider_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("riders", "visible", true);
            formPolicyDetailsInstance.itemOption("total_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("edwa_nkoso_policy", "visible", true);
        },

        plan_changed: function () {
            //if (prev_val != e.value) {
            if (plan_code == "10") {
                //prev_val = e.value;
                formPolicyDetailsInstance.itemOption("inv_premium", "visible", true);
                formPolicyDetailsInstance.itemOption("life_premium", "visible", true);
                formPolicyDetailsInstance.itemOption("rider_premium", "visible", true);
                formPolicyDetailsInstance.itemOption("dependants", "visible", true);
                formPolicyDetailsInstance.itemOption("riders", "visible", true);
                formPolicyDetailsInstance.itemOption("total_premium", "visible", true);
                formPolicyDetailsInstance.itemOption("edwa_nkoso_policy", "visible", true);
                //$("#dxForm").dxForm('instance').updateData(formdata);
                //tabsInstance.option("selectedIndex", 1);
                //fn(true);
            } else {
                //fn(true);
            }
            //}
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
                    formPolicyDetailsInstance.updateData("life_premium", result.life_premium);
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
                formPolicyDetailsInstance.updateData("term", term);
                formPolicyDetailsInstance.getEditor("term").option("readOnly", true);
            }


            formPolicyDetailsInstance.updateData("anb", anb_age);
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
                    formPolicyDetailsInstance.updateData("sum_assured", result.sum_assured);
                    //formInstance.updateData("policy_fee", result.policy_fee);
                    formPolicyDetailsInstance.updateData("inv_premium", result.inv_prem);
                    formPolicyDetailsInstance.updateData("rider_premium", result.rider_prem);
                    console.log(result.riders);
                    formPolicyDetailsInstance.getEditor("riders").option("dataSource", result.riders);

                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        default_vs_premiums: function () {
            formPolicyDetailsInstance.itemOption("inv_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("life_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("rider_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("cepa", "visible", false);
            formPolicyDetailsInstance.itemOption("basic_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("modal_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("total_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("transfer_charge", "visible", false);
            formPolicyDetailsInstance.itemOption("dependants", "visible", false);//btndependants
            formPolicyDetailsInstance.itemOption("btndependants", "visible", false);
            formPolicyDetailsInstance.itemOption("riders", "visible", false);
        },
        display_vs_anidaso: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("inv_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("life_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("rider_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("riders", "visible", true);
            formPolicyDetailsInstance.itemOption("total_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("edwa_nkoso_policy", "visible", true);
        },
        display_vs_funeral_premium: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("basic_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("basic_premium", "readOnly", true);
            formPolicyDetailsInstance.itemOption("pol_fee", "readOnly", true);
            formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);
        },
        display_vs_esb: function () {
            //inv_prem, rider_prem, transfer_charge, riders
            //viewModel.show_second_life();
            formPolicyDetailsInstance.itemOption("inv_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("rider_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("transfer_charge", "visible", true);
            formPolicyDetailsInstance.itemOption("riders", "visible", true);
            formPolicyDetailsInstance.itemOption("modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("total_premium", "visible", true);
        },

        get_paymode: function (plan_id) {
            let paymode_arr = [];
            for (let i = 0; i < SmartLife.Paymentmode.length; i++) {
                if (SmartLife.Paymentmode[i]['plan_code'] == plan_id) {
                    paymode_arr.push(SmartLife.Paymentmode[i]);
                }
            }
            console.log(paymode_arr);
            formPolicyDetailsInstance.getEditor("paymode_code").option("dataSource", paymode_arr);
        },


        default_pay_method: function () {
        //employer_code,paysource_br_code,bank,bank_acc_no,telco,momo_no,employer_no,deduction_date
            formPolicyDetailsInstance.itemOption("employer_code", "visible", false);
            formPolicyDetailsInstance.itemOption("employer_no", "visible", false);
            formPolicyDetailsInstance.itemOption("deduction_date", "visible", false);
            formPolicyDetailsInstance.itemOption("paysource_br_code", "visible", false);
            formPolicyDetailsInstance.itemOption("bank_code", "visible", false);
            formPolicyDetailsInstance.itemOption("bank_branch", "visible", false);
            formPolicyDetailsInstance.itemOption("bank_account_no", "visible", false);
            formPolicyDetailsInstance.itemOption("telco", "visible", false);
            formPolicyDetailsInstance.itemOption("momo_no", "visible", false);
        },
        changed_pay_method: function (val) {
            //alert(val);
            //TODO- make visible or not here
            let data = formPolicyDetailsInstance.option("formData");
            viewModel.default_pay_method();
            if (val == "2") {//paysource, //employer_no
                formPolicyDetailsInstance.itemOption("employer_code", "visible", true);
                formPolicyDetailsInstance.itemOption("employer_no", "visible", true);
                formPolicyDetailsInstance.itemOption("deduction_date", "visible", true);
                //formPolicyDetailsInstance.itemOption("paysource_br_code", "visible", true);
            }
            if (val == "3" || val == "4" || val == "5") {//standing order
                formPolicyDetailsInstance.itemOption("bank_code", "visible", true);
                formPolicyDetailsInstance.itemOption("bank_branch", "visible", true);
                formPolicyDetailsInstance.itemOption("bank_account_no", "visible", true);
                formPolicyDetailsInstance.itemOption("deduction_date", "visible", true);
            }
            if (val == "6") {//MOMO
                formPolicyDetailsInstance.itemOption("telco", "visible", true);
                formPolicyDetailsInstance.itemOption("momo_no", "visible", true);
            }
            
            formPolicyDetailsInstance.updateData(data);
            //tabsInstance.option("selectedIndex", 1);
        },
        hide_second_life: function () {
            viewModel.vs_second_life(false);
            formPolicyDetailsInstance.itemOption("second_l_name", "visible", false);
            formPolicyDetailsInstance.itemOption("second_l_address", "visible", false);
            formPolicyDetailsInstance.itemOption("second_gender_code", "visible", false);
            formPolicyDetailsInstance.itemOption("second_dob", "visible", false);
            formPolicyDetailsInstance.itemOption("second_age", "visible", false);
        },
        vs_second_life: ko.observable(false),
        show_second_life: function () {
            viewModel.vs_second_life(true);
            //second_l_name, second_l_address, second_gender_code, second_dob, second_age
            formPolicyDetailsInstance.itemOption("second_l_name", "visible", true);
            formPolicyDetailsInstance.itemOption("second_l_address", "visible", true);
            formPolicyDetailsInstance.itemOption("second_gender_code", "visible", true);
            formPolicyDetailsInstance.itemOption("second_dob", "visible", true);
            formPolicyDetailsInstance.itemOption("second_age", "visible", true);
        },

        
        //form for personal details
        dxFormPersonalDetails: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: rd_form,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formPersonalDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
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
                        text: "Identity Type"
                    },
                    editorType: "dxLookup",
                    dataField: "id_type",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.IDTypes,
                        displayExpr: 'description',
                        valueExpr: 'id_type'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Identity Type is required"
                    }]
                }, {
                    label: {
                        text: "Identity No"
                    },
                    editorType: "dxTextBox",
                    dataField: "IdNumber",
                    validationRules: [{
                        type: "required",
                        message: "Identity No is required"
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
                        text: "Title"
                    },
                    editorType: "dxLookup",
                    dataField: "title",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: SmartLife.titleInfo,
                        displayExpr: 'description',
                        valueExpr: 'Code'
                    },
                    validationRules: [{
                        type: "required",
                        message: "Title is required"
                    }]
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
                        closeOnOutsideClick: true,
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
                        closeOnOutsideClick: true,
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
                        text: "Secondary Contact"
                    },
                    editorType: "dxNumberBox",
                    dataField: "MobileSecondary"
                }, {
                    label: {
                        text: "Email"
                    },
                    editorType: "dxTextBox",
                    dataField: "email"
                }, {
                    label: {
                        text: "Country"
                    },
                    editorType: "dxLookup",
                    dataField: "country_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
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
                        text: "Region"
                    },
                    editorType: "dxLookup",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Regions,
                        displayExpr: 'Description',
                        valueExpr: 'id'
                    },
                    dataField: "region",
                    validationRules: [{
                        type: "required",
                        message: "Post Address is required"
                    }]
                }, {//SmartLife.Regions
                    label: {
                        text: "City"
                    },
                    editorType: "dxTextBox",
                    dataField: "city",
                    validationRules: [{
                        type: "required",
                        message: "Post Address is required"
                    }]
                }, {
                    label: {
                        text: "Home Town"
                    },
                    editorType: "dxTextBox",
                    dataField: "home_town",
                    validationRules: [{
                        type: "required",
                        message: "Post Address is required"
                    }]
                }, {
                    label: {
                        text: "Postal Address"
                    },
                    editorType: "dxTextBox",
                    dataField: "postal_address",
                }, {
                    label: {
                        text: "Residential Address"
                    },
                    editorType: "dxTextBox",
                    dataField: "residential_address"
                }, {
                    label: {
                        text: "Occupation"
                    },
                    editorType: "dxLookup",
                    dataField: "occupation_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
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
                        text: "Is Politically Exposed?"
                    },
                    editorType: "dxLookup",
                    dataField: "IsPep",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Confirmations,
                        displayExpr: 'name',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            if (e.value == 1) {
                                //display
                                formPersonalDetailsInstance.itemOption("politicaly_affiliated_person", "visible", true);
                            } else {
                                //don't display
                                formPersonalDetailsInstance.itemOption("politicaly_affiliated_person", "visible", false);
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Is Politically Exposed is required"
                    }]
                }, {
                    label: {
                        text: "Politically Affiliated Person"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "politicaly_affiliated_person"
                }, {
                    label: {
                        text: "Secondary Income?"
                    },
                    editorType: "dxLookup",
                    dataField: "Doyouhavesecondaryincome",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Confirmations,
                        displayExpr: 'name',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            if (e.value == 1) {
                                //display
                                formPersonalDetailsInstance.itemOption("secondary_income", "visible", true);
                            } else {
                                //don't display
                                formPersonalDetailsInstance.itemOption("secondary_income", "visible", false);
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Secondary is required"
                    }]
                }, {
                    label: {
                        text: "Secondary Income"
                    },
                    visible:false,
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
                        text: "Hobbies / Pastimes"
                    },
                    editorType: "dxTextBox",
                    dataField: "hobbies_pastimes",
                    validationRules: [{
                        type: "required",
                        message: "Hobbies is required"
                    }]
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    itemType: "button",
                    buttonOptions: {
                        text: "Next →",
                      //  icon: "chevronnext",
                       // type: "default",
                        elementAttr: {
                          
                            class: "buttonPrimary"
                        },
                        onClick: function (args) {

                            navnextPrev(1);
                            //tabsInstance.option("selectedIndex", 1);

                        }
                    }
                }],
        },

        //form for policy details
        dxFormPolicyDetails: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: rd_form,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formPolicyDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                {
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
                        text: "Age Next Birthday"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly: false
                    },
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
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.planinfo,
                        displayExpr: 'description',
                        valueExpr: 'plan_id',
                        onValueChanged: function (e) {
                            //viewModel.LoadPanelShown(true);
                            /*viewModel.plan_changed(e, function (results) {
                                //viewModel.LoadPanelShown(false);
                            });*/
                            viewModel.default_vs_premiums();
                            formPolicyDetailsInstance.updateData("pol_fee", 1);
                            if (plan_code == "10") {//Anidaso
                                viewModel.get_paymode("14");
                                console.log("filtering anidason");
                                viewModel.display_vs_anidaso();
                            }
                            if (plan_code == "37") {//Funeral
                                viewModel.get_paymode("29");
                                viewModel.display_vs_funeral_premium();
                            }
                            if (plan_code == "2") {//ESB
                                viewModel.get_paymode("2");
                                viewModel.display_vs_esb();
                            }

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
                    label: {
                        text: "Edwa Nkoso Policy No"
                    },
                    editorType: "dxTextBox",
                    dataField: "edwa_nkoso_policy",
                    visible: false
                }, /*{
                    label: {
                        text: "Is It a Top up?"
                    },
                    editorType: "dxLookup",
                    dataField: "is_top_up",
                    editorOptions: {
                        closeOnOutsideClick: true,
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
                        text: "Sort Code"
                    },
                    editorType: "dxTextBox",
                    dataField: "sort_code"
                },*/ {
                    label: {
                        text: "Class Code"
                    },
                    editorType: "dxLookup",
                    dataField: "client_class_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
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
                        dataSource: [],
                        closeOnOutsideClick: true,
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
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Paymentinfo,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.changed_pay_method(e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Payment Method is required"
                    }]
                }, {
                    //employer_code,paysource_br_code,bank,bank_acc_no,telco,momo_no
                    label: {
                        text: "Pay Source"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "employer_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Employerinfo,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    }
                }, {
                    label: {
                        text: "Staff Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "employer_no",
                }/*, {
                    label: {
                        text: "Pay Source Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "paysource_br_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Paysourcebr,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    }
                }*/, {
                    label: {
                        text: "Bank"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "bank_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'bank_code'
                    }
                }, {
                    label: {
                        text: "Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "bank_branch",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.BanksBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    }
                }, {//SmartLife.
                    label: {
                        text: "Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "bank_account_no"
                }, {
                    label: {
                        text: "Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "telco",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: [{ id: 1, description: 'Airtel' }, { id: 2, description: 'MTN' }, { id: 3, description: 'Vodaphone' }],
                        displayExpr: 'description',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "MOMO Number"
                    },
                    editorType: "dxNumberBox",
                    visible: false,
                    dataField: "momo_no"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "button",
                    dataField: "btndependants",
                    buttonOptions: {
                        text: "ADD DEPENDANTS",
                        icon: "plus",
                        type: "danger",
                        onClick: function () {
                            viewModel.show_dependants();
                        }
                    }
                }, {

                    label: {
                        text: "First Deduction Date"
                    },
                    editorType: "dxDateBox",
                    visible: false,
                    dataField: "deduction_date",
                    validationRules: [{
                        type: "required",
                        message: "First Deduction Date is required"
                    }]
                },
                {
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
                            allowAdding: false,
                            allowDeleting: true,
                            form: {
                                items: ["dp_fullname", "dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium", "dp_good_health"]
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
                                dataField: 'dp_relationship',
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
                    label: {
                        text: "Total Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "total_premium",
                    editorOptions: {
                        onValueChanged: function (e) {
                            // if (viewModel.plan_code() == "02") {
                            //total_premium, anb, term, fn
                            let data = formPolicyDetailsInstance.option("formData");
                            //let height = data['pop_height'];
                            viewModel.calculate_esb(e.value, data['anb'], data['term'], function () {
                                console.log("esb calculation done");
                            });
                            //}
                        }
                    },
                    visible: false
                },
                {
                    label: {
                        text: "Sum Assured"
                    },
                    editorType: "dxNumberBox",
                    dataField: "sum_assured",
                    editorOptions: {
                        onValueChanged: function (e) {
                            if (plan_code == '10') {
                                //anidaso
                                viewModel.LoadPanelShown(true);
                                viewModel.calc_anidaso_life_prem(e, function (results) {
                                    viewModel.LoadPanelShown(false);
                                });
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Sum Assured is required"
                    }]
                },
                {

                    
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
                        text: "Transfer Charge"
                    },
                    editorType: "dxNumberBox",
                    dataField: "transfer_charge",
                    visible: false
                }, {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    colSpan: 2,
                    dataField: "riders",
                    editorType: "dxDataGrid",
                    visible: true,
                    editorOptions: {
                        dataSource: [],
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: false,
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
                //second life details...
                //second_l_name, second_l_address, second_gender_code, second_dob, second_age
                {
                    label: {
                        text: "2nd Life Name"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "second_l_name",
                    validationRules: [{
                        type: "custom",
                        message: "2nd Life Name is required",
                        validationCallback: function (obj) {
                            //check if FLIC.is_micro 
                            //alert(viewModel.plan_code());
                            if (!viewModel.vs_second_life()) {
                                return true;//don't check validation
                            } else {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }]
                }, {
                    label: {
                        text: "2nd Life Address"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "second_l_address",
                    validationRules: [{
                        type: "custom",
                        message: "2nd Life Address is required",
                        validationCallback: function (obj) {
                            //check if FLIC.is_micro 
                            //alert(viewModel.plan_code());
                            if (!viewModel.vs_second_life()) {
                                return true;//don't check validation
                            } else {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }]
                }, {
                    label: {
                        text: "2nd Life Date of Birth"
                    },
                    editorType: "dxDateBox",
                    visible: false,
                    dataField: "second_dob",
                    validationRules: [{
                        type: "custom",
                        message: "2nd Life Date of Birth is required",
                        validationCallback: function (obj) {
                            //check if FLIC.is_micro 
                            //alert(viewModel.plan_code());
                            if (!viewModel.vs_second_life()) {
                                return true;//don't check validation
                            } else {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }]
                }, {
                    label: {
                        text: "2nd Life ANB"
                    },
                    editorType: "dxNumberBox",
                    visible: false,
                    dataField: "second_age",
                    editorOptions: {
                        readOnly: true,
                    },
                    validationRules: [{
                        type: "custom",
                        message: "2nd Life ANB is required",
                        validationCallback: function (obj) {
                            //check if FLIC.is_micro 
                            //alert(viewModel.plan_code());
                            if (!viewModel.vs_second_life()) {
                                return true;//don't check validation
                            } else {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }]
                }, {

                    label: {
                        text: "2nd Life Gender"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "second_gender_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Genderinfo,
                        displayExpr: 'Desc',
                        valueExpr: 'Code'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "2nd Life Gender is required",
                        validationCallback: function (obj) {
                            //check if FLIC.is_micro 
                            //alert(viewModel.plan_code());
                            if (!viewModel.vs_second_life()) {
                                return true;//don't check validation
                            } else {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }]
                }, {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                
                    label: {
                        text: "Do you or have you ever had any assurance on your life ?"
                    },
                    editorType: "dxLookup",
                    dataField: "life_assuarance",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Confirmations,
                        displayExpr: 'name',
                        valueExpr: 'id'
                    }
                },
                {
                    label: {
                        text: "Glico Policy No"
                    },
                    editorType: "dxTextBox",
                    dataField: "pol_no"
                }/*,
                {
                    colSpan: 2,
                    label: {
                        text: "Have you ever made a claim under any existing/previous Policy?"
                    },
                    editorType: "dxLookup",
                    dataField: "previousClaimCheck",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Confirmations,
                        displayExpr: 'name',
                        valueExpr: 'id'
                    }
                }, {
                    colSpan: 2,
                    label: {
                        text: "Claim Policy No"
                    },
                    editorType: "dxTextBox",
                    dataField: "claim_pol_no"
                }, {
                    colSpan: 2,
                    label: {
                        text: "Claim Type"
                    },
                    editorType: "dxTextBox",
                    dataField: "type_claim"
                }*/, {
                    label: {
                        text: "Percentage Increase"
                    },
                    editorType: "dxLookup",
                    dataField: "percentage_increase",//
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Percentage,
                        displayExpr: 'PercentageValue',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "Do you require optional Anidaso Policy ?"
                    },
                    editorType: "dxLookup",
                    dataField: "anidaso_pol",
                    editorOptions: {
                        closeOnOutsideClick: true,
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
                    colSpan: 2,
                    itemType: "empty",
                    
                },
                {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "← BACK",
                        horizontalAlignment: "left",
                       // icon: "chevronprev",
                        //  type: "normal",
                        elementAttr: {

                            class: "buttonSecondary"
                        },
                        onClick: function (args) {
                            navnextPrev(0);
                        }
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "NEXT →",
                        horizontalAlignment: "right",
                        elementAttr: {
                            class: "buttonPrimary"
                        },
                       // icon: "chevronnext",
                       // type: "default",
                        onClick: function (args) {
                            var result = args.validationGroup.validate();
                            //if (result.isValid) {
                                //save and navigate next screen.
                                navnextPrev(1);
                           // }
                        }
                    }
                }
            ],
        },

        //form for health checklist
        dxFormHealthDetails: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: rd_form,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formHealthDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                label: {
                    text: "Height (meters)"
                },
                editorType: "dxNumberBox",
                dataField: "pop_height",
                validationRules: [{
                    type: "required",
                    message: "Height is required"
                }]
            }, {
                label: {
                    text: "Weight (kg)"
                },
                editorType: "dxNumberBox",
                dataField: "pop_weight",
                editorOptions: {
                    onValueChanged: function (e) {
                        //calculate the BMI
                        let data = formHealthDetailsInstance.option("formData");
                        let height = data['pop_height'];
                        let bmi = parseFloat(e.value) / (parseFloat(height) * parseFloat(height));
                        formHealthDetailsInstance.updateData("bmi", bmi);
                    }
                },
                validationRules: [{
                    type: "required",
                    message: "Weight is required"
                }]
            }, {
                label: {
                    text: "BMI"
                },
                colSpan: 2,
                editorType: "dxNumberBox",
                dataField: "bmi",
            }, {
                colSpan: 4,
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

                        viewModel.show_disease_desc(tmp_qn_intermediary, SmartLife.Healthinfo, 'id', 'description');
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
                label: {
                    text: "Are You In Good Health?"
                },
                editorType: "dxLookup",
                dataField: "good_health",
                editorOptions: {
                    closeOnOutsideClick: true,
                    dataSource: SmartLife.Confirmations,
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            }, {
                colSpan: 2,
                label: {
                    text: "Health Condition"
                },
                editorType: "dxLookup",
                dataField: "health_condition",
                editorOptions: {
                    closeOnOutsideClick: true,
                    dataSource: SmartLife.Confirmations,
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            }, {
                colSpan: 2,
                label: {
                    text: "Name and address of your regular Doctor and Hospital"
                },
                editorType: "dxTextBox",
                dataField: "name_doctor"
            }, {
                colSpan: 2,
                label: {
                    text: "Give date you last consulted ?"
                },
                editorType: "dxDateBox",
                dataField: "last_consult"
            }, {
                colSpan: 2,
                label: {
                    text: "Do you smoke ?"
                },
                editorType: "dxLookup",
                dataField: "smoke_pol",
                editorOptions: {
                    closeOnOutsideClick: true,
                    dataSource: SmartLife.Confirmations,
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            }, {
                colSpan: 2,
                label: {
                    text: "How many sticks of cigarettes do you smoke in a day?"
                },
                editorType: "dxNumberBox",
                dataField: "cigarettes_day"
            }, {
                colSpan: 2,
                label: {
                    text: "When did you start smoking?"
                },
                editorType: "dxDateBox",
                dataField: "start_smoking"
            }, {
                colSpan: 2,
                label: {
                    text: "Do you consume alcohol ?"
                },
                editorType: "dxLookup",
                dataField: "alcohol_pol",
                editorOptions: {
                    closeOnOutsideClick: true,
                    dataSource: SmartLife.Confirmations,
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            }, {
                colSpan: 2,
                label: {
                    text: "What is you averge consumption of alcohol?"
                },
                editorType: "dxNumberBox",
                dataField: "average_alcohol"
            }, {
                colSpan: 2,
                label: {
                    text: "When did you start drinking?"
                },
                editorType: "dxDateBox",
                dataField: "start_drinking",
                width: '100%',
            }, {
                colSpan: 4,
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
                colSpan: 4,
                itemType: "empty"
            }, {
                label: {
                    width: '50%',
                    text: "Have you or any of the dependant proposed lives or any member of your family?"
                },
                colSpan: 4,
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
                        viewModel.show_disease_desc(tmp_qn_intermediary, SmartLife.FamDisease, 'disease_id', 'name');
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
               
                itemType: "empty"
            },



         {
             itemType: "button",
             horizontalAlignment: "left",
             buttonOptions: {
                 text: "← BACK",
                 horizontalAlignment: "right",
                 // icon: "chevronprev",
                 //  type: "normal",
                 elementAttr: {

                     class: "buttonSecondary"
                 },
                 onClick: function (args) {
                     navnextPrev(0);
                 }
             }
         }, {
             itemType: "button",
             buttonOptions: {
                 text: "NEXT →",
                 horizontalAlignment: "left",
                 elementAttr: {

                     class: "buttonPrimary"
                 },
                 // icon: "chevronnext",
                 // type: "default",
                 onClick: function (args) {

                     //save and navigate next screen.
                     navnextPrev(1);

                 }
             }
         }



            ],
        },

        //form for submitting
        dxFormSubmitDetails: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: rd_form,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSubmitDetailsInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [{
                colSpan: 2,
                label: {
                    text: "Document Delivery mode"
                },
                editorType: "dxLookup",
                dataField: "doc_delivery_mode",
                editorOptions: {
                    closeOnOutsideClick: true,
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
                colSpan: 4,
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
                colSpan: 4,
                itemType: "empty"
            }, {
                colSpan: 4,
                label: {
                    text: "FILE ATTACHMENTS"
                },
                dataField: "attachements",
                editorType: "dxDataGrid",
                editorOptions: {
                    dataSource: [{ id: 1, name: "ID FRONT" }, { id: 2, name: "ID BACK" }, { id: 3, name: "MEDICAL RPT" }],
                    wordWrapEnabled: true,
                    columns: [
                        {
                            dataField: 'id',
                            visible: false,
                        }, {
                            dataField: 'name',
                        }, {
                            caption: 'ACTION',
                            allowEditing: false,
                            cellTemplate: function (container, options) {
                                $("<div />").appendTo(container).dxFileUploader({
                                    disabled: false,
                                    selectButtonText: 'ATTACH FILE',
                                    visible: true,
                                    accept: 'image/*',
                                    uploadMode: 'useButtons',
                                    multiple: false,
                                    name: 'myFile',
                                    uploadUrl: '',//upload_url_sig,
                                    //onUploadStarted: upload_started,
                                    //onValueChanged: get_uploadurl_sig,
                                    progress: 0,
                                    //onUploaded: sys_uploaded,
                                    showFileList: true,
                                    //validationError: file_uploaded_error
                                }).appendTo(container);
                            }
                        }
                    ]
                }
            },


             {
                 
                 itemType: "empty"
             },
            {
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: "← BACK",
                    horizontalAlignment: "right",
                    // icon: "chevronprev",
                    //  type: "normal",
                    elementAttr: {

                        class: "buttonSecondary"
                    },
                    onClick: function (args) {
                        navnextPrev(0);
                    }
                }
            }, {
                itemType: "button",
                buttonOptions: {
                    text: "Submit ✓",
                    horizontalAlignment: "left",
                    elementAttr: {

                        class: "buttonPrimary"
                    },
                    // icon: "chevronnext",
                    // type: "default",
                    onClick: function (args) {

                        //save and navigate next screen.
                        submit_form();

                    }
                }
            },
            ],
        },

        

    };

    function submit_form(e) {
        ///post data form as it is
        viewModel.LoadPanelShown(true);
        let get_life = new DB({
            name: "submitting the form"
        });
        let data = formPersonalDetailsInstance.option("formData");
        Object.assign(data, formPolicyDetailsInstance.option("formData"));
        Object.assign(data, formHealthDetailsInstance.option("formData"));
        Object.assign(data, formSubmitDetailsInstance.option("formData"));
        data['plan_code'] = plan_code;
        data['agent_code'] = SmartLife.agent_no();
        //format your dates here..
        data['dob'] = viewModel.formatDates(new Date(data['dob']));
        data['last_consult'] = viewModel.formatDates(new Date(data['last_consult']));
        data['deduction_date'] = viewModel.formatDates(new Date(data['deduction_date']));
        data['start_drinking'] = viewModel.formatDates(new Date(data['start_drinking']));
        data['start_smoking'] = viewModel.formatDates(new Date(data['start_smoking']));
        data['beneficiaries'] = JSON.stringify(formSubmitDetailsInstance.getEditor('beneficiaries').option('dataSource'));

        if (formPolicyDetailsInstance.getEditor('dependants') != undefined) {
            data['dependants'] = JSON.stringify(formPolicyDetailsInstance.getEditor('dependants').option('dataSource'));
        }

        if (formPolicyDetailsInstance.getEditor('riders') != undefined) {
            data['riders'] = JSON.stringify(formPolicyDetailsInstance.getEditor('riders').option('dataSource'));
        }
        
        data['family_health'] = JSON.stringify(formHealthDetailsInstance.getEditor('family_health').option('dataSource'));
        data['family_history'] = JSON.stringify(formHealthDetailsInstance.getEditor('family_history').option('dataSource'));
        data['qn'] = JSON.stringify(formHealthDetailsInstance.getEditor('qn').option('dataSource'));
        
        console.log(data);
        get_life.DBpost("sync/synProposal", data).done(function (result) {
            viewModel.LoadPanelShown(false);
            if (result.success == true) {
                console.log(result.record_id);
                //navigate to the my applications screen
                SmartLife.app.back();
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