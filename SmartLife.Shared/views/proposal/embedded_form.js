SmartLife.embedded_form = function (params) {
    //"use strict";

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
    function navnextPrev(next) {
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
        currentSection.css('transform', 'translateX(0)');
        currentSection.prevAll('section').css('transform', 'translateX(-100px)');
        currentSection.nextAll('section').css('transform', 'translateX(100px)');
        $('section').not(currentSection).hide();
    }



    (function ($) {
        var topics = {};
        $.publish = function (topic, args) {
            if (topics[topic]) {
                var currentTopic = topics[topic],
                    args = args || {};

                for (var i = 0, j = currentTopic.length; i < j; i++) {
                    11
                    currentTopic[i].call($, args);
                }
            }
        };
        $.subscribe = function (topic, callback) {
            if (!topics[topic]) {
                topics[topic] = [];
            }
            topics[topic].push(callback);
            return {
                "topic": topic,
                "callback": callback
            };
        };
        $.unsubscribe = function (handle) {
            var topic = handle.topic;
            if (topics[topic]) {
                var currentTopic = topics[topic];

                for (var i = 0, j = currentTopic.length; i < j; i++) {
                    if (currentTopic[i] === handle.callback) {
                        currentTopic.splice(i, 1);
                    }
                }
            }
        };
    })(jQuery);



    var formPolicyDetailsInstance;
    var formPolicyDetailsSubmitInstance;
    let rcd_id;// = params.item;
    var ClaimAttachDataSource = [
        { id: 'signature', name: "SIGNATURE", IsMandatory: 1 }
    ];
    var ViewClaimAttachDataSource = [];

    var get_data = JSON.parse(params.item);
    
    var plan_code = get_data['plan_code'];
    if (get_data['id'] != undefined) rcd_id = get_data['id'];
    var rd_form = get_data['rd_form'];

    var vsDependants = false;
    var DP_ = [];

    var Agents = [];
    var is_edit = false;

    var PolicyPayMode = SmartLife.Paymentmode.filter(pay_mode => (pay_mode.plan_code == plan_code));
    var bank_code = "NIB";
    if(plan_code == "52"){
        bank_code = "KINB";
        vsDependants = true;
		ClaimAttachDataSource = [
			{ id: 'signature', name: "SIGNATURE", IsMandatory: 1 },
			{ id: 'id_front', name: "ID FRONT", IsMandatory: 1 },
			{ id: 'id_back', name: "ID BACK", IsMandatory: 1 }
		];
    }
    var Bank = SmartLife.Banks.filter(bank => (bank.bank_code == bank_code));
   // var BanksBranches = SmartLife.BanksBranches;
    var BanksBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == bank_code));
    
    var IDTypes = SmartLife.IDTypes.filter(id => (id.ShowInMProposal == 1));
    var Agents = SmartLife.LifeAgents;//SmartLife.LifeAgents.filter(id => (id.BusinessChannel == 4 || id.BusinessChannel == "4"));
    
    var uploadUrl = SmartLife.url + "sync/syncImage";

    var viewModel = {
//  Put the binding properties here

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

        get_details: function () {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting single record"
            });
            get_records.DBget("policy/getProposal?record_id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    is_edit = true;
                    console.log(result.policy_arr);
                    $("#dxFormPolicy").dxForm({
                        formData: result.policy_arr[0]
                    }).dxForm("instance");
                    //format the dob date here
                    //formPolicyDetailsInstance.getEditor("beneficiaries").option("dataSource", result.beneficiaries);
                    is_edit = false;
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        InsuranceCoverTypes: ko.observableArray(),
        get_cover_types: function () {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting insurance covers"
            });
            get_records.DBget("params/getInsuranceCoverTypes?Plan_code=" + plan_code).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //format the dob date here
                    viewModel.InsuranceCoverTypes(result.InsuranceCoverTypes);
                    formPolicyDetailsInstance.getEditor("InsuranceType").option("dataSource", result.InsuranceCoverTypes);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        viewShown: function () {
            viewModel.get_cover_types();
            if (parseInt(rcd_id) > 0) {
                //get client details
                viewModel.get_details();
                viewModel.getAttachedFiles();
            }
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

            formPolicyDetailsInstance.updateData("anb", anb_age);

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
                        text: "ID"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "ID"
                }, {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    colSpan: 2,
                    label: {
                        text: "Second Agent"
                    },
                    editorType: "dxLookup",
                    dataField: "second_age",
                    editorOptions: {
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: Agents,
                        displayExpr: 'agent_no_name',
                        valueExpr: 'agent_no'
                    }
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
                        dataSource: IDTypes,
                        displayExpr: 'description',
                        valueExpr: 'id_type'
                    },
                    /*validationRules: [{
                        type: "required",
                        message: "Identity Type is required"
                    }]*/
                }, {
                    label: {
                        text: "Identity No"
                    },
                    editorType: "dxTextBox",
                    dataField: "IdNumber",
                    /*validationRules: [{
                        type: "required",
                        message: "Identity No is required"
                    }]*/
                }, {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxTextBox",
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
                        readOnly: true
                    },
                    dataField: "anb",
                    validationRules: [{
                        type: "required",
                        message: "Age Next Birthday is required"
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
                        text: "Pay Mode"
                    },
                    editorType: "dxLookup",
                    dataField: "paymode_code",
                    editorOptions: {
                        dataSource: PolicyPayMode,
                        closeOnOutsideClick: true,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            if (e.value != undefined && e.value != '') {
                                formPolicyDetailsInstance.updateData("InsuranceType", '');
                                formPolicyDetailsInstance.updateData("modal_premium", '');
                                let data = formPolicyDetailsInstance.option("formData");
                                if (data['InsuranceType'] != '' && data['InsuranceType'] != undefined && !is_edit) {

                                    let modal_premium = data['modal_premium'];
                                    //get the premium match
                                    for (var key in PolicyPayMode) {
                                        var obj = PolicyPayMode[key];
                                        console.log(obj);
                                        if (obj['id'] == e.value) {
                                            if (obj['IsYearly'] == 1) {
                                                modal_premium *= 12;
                                            } else if (obj['IsMonthly'] == 1) {
                                                modal_premium *= 1;
                                            } else if (obj['IsHalfYearly'] == 1) {
                                                modal_premium *= 6;
                                            } else if (obj['IsQuarterly'] == 1) {
                                                modal_premium *= 3;
                                            }
                                        }
                                    }
                                    formPolicyDetailsInstance.updateData("modal_premium", modal_premium);

                                }
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Pay Mode is required"
                    }]
                }, {
                    label: {
                        text: "Insuarance Cover"
                    },
                    editorType: "dxLookup",
                    dataField: "InsuranceType",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: [],
                        displayExpr: 'description',
                        valueExpr: 'InsuranceType',
                        onValueChanged: function (e) {
                            //formPolicyDetailsInstance.updateData("paymode_code", "");
                            formPolicyDetailsInstance.updateData("modal_premium", "");
                            let data = formPolicyDetailsInstance.option("formData");
                            //get the premium match
                            for (var key in viewModel.InsuranceCoverTypes()) {
                                var obj = viewModel.InsuranceCoverTypes()[key];
                                console.log(obj);
                                if (obj['InsuranceType'] == e.value) {

                                    let modal_premium = obj['PremiumAmount'];
                                    let paymode_code = data['paymode_code'];
                                    //get the premium match
                                    for (var key in PolicyPayMode) {
                                        var obj = PolicyPayMode[key];
                                        console.log(obj);
                                        if (obj['id'] == paymode_code) {
                                            if (obj['IsYearly'] == 1) {
                                                modal_premium *= 12;
                                            } else if (obj['IsMonthly'] == 1) {
                                                modal_premium *= 1;
                                            } else if (obj['IsHalfYearly'] == 1) {
                                                modal_premium *= 6;
                                            } else if (obj['IsQuarterly'] == 1) {
                                                modal_premium *= 3;
                                            }
                                        }
                                    }
                                    formPolicyDetailsInstance.updateData("modal_premium", modal_premium);
                                }
                            }
                        }
                    }
                }, {//SmartLife.
                    label: {
                        text: "Premium Amount"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        readOnly: true
                    },
                    dataField: "modal_premium",
                    validationRules: [{
                        type: "required",
                        message: "Premium Amount is required"
                    }]
                }, {
                    label: {
                        text: "Bank"
                    },
                    editorType: "dxLookup",
                    dataField: "bank_code",
                    editorOptions: {
                        value: bank_code,
                        readOnly:true,
                        closeOnOutsideClick: true,
                        dataSource: Bank,
                        displayExpr: 'description',
                        valueExpr: 'bank_code'
                    }
                }, {
                    label: {
                        text: "Bank Branch"
                    },
                    editorType: "dxLookup",
                    dataField: "bank_branch",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: BanksBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    }
                }, {//SmartLife.
                    label: {
                        text: "Account Number"
                    },
                    editorType: "dxTextBox",
                    dataField: "bank_account_no"
                }, {

                    label: {
                        text: "First Deduction Date"
                    },
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy',
                    },
                    visible: false,
                    dataField: "deduction_date",
                    validationRules: [{
                        type: "required",
                        message: "First Deduction Date is required"
                    }]
                },
                {
                    colSpan: 2,
                    itemType: "empty",

                },
                {
                    colSpan: 2,
                    itemType: "empty",

                }, /*{
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
                },*/ 
                {
                    colSpan: 2,
                    itemType: "empty",

                },
                {
                    colSpan: 2,
                    dataField: "dependants",
                    editorType: "dxDataGrid",
                    visible: vsDependants,
                    editorOptions: {
                        columnHidingEnabled: true,
                       dataSource: DP_,
                        wordWrapEnabled: true,
                        editing: {
                            allowUpdating: true,
                            mode: 'form',
                            allowAdding: true,
                            allowDeleting: true
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
                            }
                        ]
                    }
                }, {
                    colSpan: 2,
                    itemType: "empty",

                },
                {
                    colSpan: 2,
                    itemType: "empty",

                },
                {
                    colSpan: 2,
                    itemType: "empty",

                }, {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "NEXT →",
                        horizontalAlignment: "left",
                        // icon: "chevronnext",
                        // type: "default",
                        onClick: function (args) {
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                viewModel.save(1,0);
                            }
                        }
                    }
                }
            ],
        },
        save: function (HasBeenPicked, isWebCompleted) {

            //TODO-Save it and navigate to the my_applications view
            
            let get_life = new DB({
                name: "submitting the form"
            });
            let data = formPolicyDetailsInstance.option("formData");
            data['plan_code'] = plan_code;
            data['agent_code'] = SmartLife.agent_no;
            //format your dates here..
            data['dob'] = viewModel.formatDates(new Date(data['dob']));
            data['isWebCompleted'] = isWebCompleted;
            data['HasBeenPicked'] = HasBeenPicked;
            if (rcd_id != "" && rcd_id != undefined) {
                data['ID'] = rcd_id;
            }
            //data['beneficiaries'] = JSON.stringify(formPolicyDetailsInstance.getEditor('beneficiaries').option('dataSource'));
            if (formPolicyDetailsInstance.getEditor('dependants') != undefined) {
                data['dependants'] = JSON.stringify(formPolicyDetailsInstance.getEditor('dependants').option('dataSource'));
            }
            
            //navnextPrev(0);
            console.log(data);
            viewModel.LoadPanelShown(true);
            get_life.DBpost("sync/synProposal", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    //navigate to the my applications screen
                    //SmartLife.app.back();
                    //viewModel.navigateForward("applications", "");
                    if (rcd_id == undefined || rcd_id == '') {
                        rcd_id = result.record_id;
                    }
                    if (ClaimAttachDataSource.length > 0) {
                        //formClaimInstance.updateData("id", rcd_id);
                        let attachments_arr = ClaimAttachDataSource.map(obj => ({ ...obj, ['rcd_id']: rcd_id }));
                        formPolicyDetailsSubmitInstance.getEditor("attachements").option("dataSource", attachments_arr);
                    }
                    if (isWebCompleted == 0) {
                        navnextPrev(1);
                    } else {
                        viewModel.navigateForward("applications", "");
                    }
                    
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },


        dxFormPolicyDetailsSubmit: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: rd_form,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formPolicyDetailsSubmitInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            items: [
                {
                    colSpan: 2,
                    label: {
                        text: "FILE ATTACHMENTS"
                    },
                    visible: true,
                    dataField: "attachements",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: ClaimAttachDataSource,
                        columnHidingEnabled: true,
                        wordWrapEnabled: true,
                        columns: [
                            {
                                dataField: 'rcd_id',
                                visible: false,
                            },
                            {
                                dataField: 'req_code',
                                visible: false,
                            }, {
                                dataField: 'name',
                                //width:'150'
                            }, {
                                //IsMandatory
                                dataField: 'IsMandatory',
                                dataType: 'boolean',
                            }, {
                                caption: '',
                                allowEditing: false,
                                cellTemplate: function (container, options) {
                                    $("<div />").appendTo(container).dxFileUploader({
                                        disabled: false,
                                        selectButtonText: 'ATTACH FILE',
                                        visible: true,
                                        accept: '*',
                                        uploadMode: 'instantly',
                                        multiple: false,
                                        name: options.data.id,
                                        uploadUrl: uploadUrl + "?record_id=" + options.data.rcd_id,
                                        onUploadStarted: viewModel.upload_started(options),
                                        onValueChanged: viewModel.get_uploadurl_sig(options),
                                        progress: 0,
                                        onUploaded: function (options) {
                                            viewModel.getAttachedFiles();
                                        },
                                        showFileList: true,
                                        validationError: viewModel.file_uploaded_error(options)
                                    }).appendTo(container);
                                }
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
                    colSpan: 2,
                    label: {
                        text: "VIEW ATTACHED FILES"
                    },
                    visible: true,
                    dataField: "ViewAttachements",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: ViewClaimAttachDataSource,
                        columnHidingEnabled: true,
                        wordWrapEnabled: true,
                        onRowClick: function (e) {
                            if (window.location.host == "192.168.1.16:90") {
                                window.open('http://192.168.1.16:8088/ClaimsDocuments/' + e.data.Description, '_blank', 'hidden=no');
                            } else {
                                window.open('http://197.159.142.171:8088/ClaimsDocuments/' + e.data.Description, '_blank', 'hidden=no');
                            }
                        },
                        columns: [
                            {
                                dataField: 'id',
                                visible: false,
                            }, {
                                dataField: 'Endorsement',
                                visible: false,
                            },
                            /*{
                                dataField: 'code',
                                visible: false,
                            },*/
                            {
                                dataField: 'doc_id',
                                visible: true,
                            },
                            {
                                dataField: 'Description',
                                caption: 'File Name'
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
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "← BACK",
                        horizontalAlignment: "left",
                        width: '120',
                        // icon: "chevronprev",
                        //type: "normal",
                        type: "default",
                        onClick: function (args) {
                            navnextPrev(0);
                        }
                    }
                }, {
                    itemType: "button",
                    horizontalAlignment: "right",
                    dataField: "btncomplete",
                    buttonOptions: {
                        text: "COMPLETE ✓",
                        horizontalAlignment: "right",
                        width: '120',
                        type: 'danger',
                        onClick: function (args) {
                            if (viewModel.validate_attachments()) {
                                viewModel.save(0,1);
                            }
                        }
                    }
                }
            ],
        },

        validate_attachments: function () {
            for (let i = 0; i < ClaimAttachDataSource.length; i++) {
                const attachment1 = ClaimAttachDataSource[i];
                if (attachment1.IsMandatory == 1 || attachment1.IsMandatory == "1") {
                    //alert(attachment1.IsMandatory);
                    const found = ViewClaimAttachDataSource.some(attachment2 => (attachment2.doc_id === attachment1.id));

                    if (!found) {
                        DevExpress.ui.dialog.alert("Kindly attach " + attachment1.name, "ALERT!");
                        //console.log(`Attachment with id ${attachment1.id} not found in the second array. Terminating validation.`);
                        return false;
                    }
                    return true;
                }
            }
            return true;
        },

        //////file upload///
        getAttachedFiles: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get attached Files"
            });
            get_form.DBget("policy/getPolicyFiles?rcd_id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //assign datasource to files
                    ViewClaimAttachDataSource = result.Files;
                    formPolicyDetailsSubmitInstance.getEditor("ViewAttachements").option("dataSource", ViewClaimAttachDataSource);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        upload_started: function (e) {
            viewModel.LoadPanelShown(true);
            //console.log(e);
            //console.log(e.file);
        },
        //uploadUrl: ko.observable(SmartLife.url + "claims/syncClaimImage?req_code=" + req_code + "&eClaimId=" + rcd_id),
        get_uploadurl_sig: function (e) {
            //change the photo type here to pass as data....
            req_code = e.value;
            console.log(e.value);
            console.log(rcd_id);
            //viewModel.uploadUrl(SmartLife.url + "claims/syncClaimImage?req_code=" + req_code + "&eClaimId=" + rcd_id);
            console.log(uploadUrl);
        },
        sys_uploaded: function () {
            //Make a request to refresh the dxdatagrid
            //viewModel.get_ac_files();
            viewModel.getAttachedFiles();
        },
        file_uploaded_error: function (error) {
            console.log(error);
        },
        /////end of file upload
        //handle dxfileuploader//
        upload_url: ko.observable("http://localhost/cassoa_portal_api/upload.php?"),
        upload_started: function (e) {
            viewModel.LoadPanelShown(true);
            //console.log(e);
            //console.log(e.file);
        },
        doc_file_value_changed: function (e) {
            //viewModel.upload_url(Portal.attach_url + 'record_id=' + record_id + '&n=3&usr_id=' + Portal.usr_id);

        },
        doc_uploaded: function () {
            viewModel.LoadPanelShown(false);
        },
        file_uploaded_error: function (error) {
            viewModel.LoadPanelShown(false);
            console.log(error);
        },
        file_upload_aborded: function (e) {
            viewModel.LoadPanelShown(false);
        },
        file_upload_error: function (e) {
            viewModel.LoadPanelShown(false);
        },
        ////end of dxfileuploader//

    };

    return viewModel;
};