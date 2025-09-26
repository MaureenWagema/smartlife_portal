SmartLife.endorsement = function (params) {


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


    let default_url = "policy/getPolicyDetails";
    var policy_no;// = params.item;
    var rcd_id;
    var req_code;
    var PolicyBankBranches;

    ///defalt properties
    var ChangeofEffectiveDate = false;
    var IsClient = false;
    var ChangeOfPaymethod = false;
    var ChangeFirstPWDDate = false;
    var IsReinstatement = false;
    var IsPremiumEscallation = false;
    var AddittionalOfLives = false;
    var AlterationofSA = false;
    var AlterationofPremium = false;
    var ChangeOfpolicyStatus = false;
    var BeneficiaryEndorsement = false;
    var ChangeOfTravelDate = false;
    var PremiumTransfer = false;
    var LastWidthrawalDateChange = false;

    var AttachmentInstance;
    

    var get_data = JSON.parse(params.item);
    console.log(get_data);
    if (get_data['policy_no'] != undefined) policy_no = get_data['policy_no'];
    if (get_data['rcd_id'] != undefined) rcd_id = get_data['rcd_id'];

    var EndorsementTypes = SmartLife.EndorsementTypes;
    if (SmartLife.login_type == 3) {
        //pos 
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1; //claim.ShowInMicro == 1
            EndorsementTypes = SmartLife.EndorsementTypes.filter(claim => (claim.ShowInPortal == 1));
        } else {
            EndorsementTypes = SmartLife.EndorsementTypes.filter(claim => (claim.ShowInPortal == 1));
        }
    } else if (SmartLife.login_type == 2) {
        //client
        EndorsementTypes = SmartLife.EndorsementTypes.filter(claim => (claim.ShowInPortal == "1"));
    }

    var uploadUrl = SmartLife.url + "policy/syncEndorsementsImage?req_code=" + req_code + "&eEndorsementId=" + rcd_id;
    var imageURI;

    var is_micro = 0;
    if (SmartLife.pos_type == 2) is_micro = 1;
     

    var formEndorsementInstance;
    var formEndorsementSubmitInstance;
    var rowBenefIndex;
    var rowDPIndex;
    var formBeneficiaryInstance;
    var formDependantInstance;
    var ClientPolicies = [];
    var BeneficiariesStore = [];
    var BeneficiariesChangesStore = [];
    var DependantsStore = [];
    var DependantsChangesStore = [];
    var ClaimAttachDataSource = [
        { id: 1, description: 'ID FRONT' },
        { id: 2, description: 'ID BACK' },
        { id: 3, description: 'ENDORSEMENT LETTER' },
        { id: 4, description: 'GAZETTE' },];
    var ViewClaimAttachDataSource = [];
    var ClaimBankBranches = [];
    var employer_codeOLD = "";
    var endorsement_type = "";

    var PayMethods = SmartLife.Paymentinfo.filter(mode => (mode.payment_mode == "6" || mode.payment_mode == "7" || mode.payment_mode == "9"));

    var StatusesInfo = SmartLife.Statuses.filter(status => (status.AllowStatusChangeEndorsement == "1" || status.AllowStatusChangeEndorsement == 1));


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
        go_back: function () {
            SmartLife.app.back();
        },
        LoadPanelShown: ko.observable(false),
        policy_obj: ko.observableArray(),
        getClientPolicy: function (default_url) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get policy"
            });
            //client/getClientPolicies
            get_form.DBget(default_url+"?policy_no=" + policy_no).done(function (result) {

                if (result.success == true) {
                    formEndorsementInstance.getEditor("PolicyNumber").option("dataSource", result.PolicyDetails);
                    //sleep(2000);
                    viewModel.policy_obj(result.PolicyDetails[0]);
                    console.log(viewModel.policy_obj());
                    viewModel.LoadPanelShown(false);
                    ClientPolicies = result.PolicyDetails;
                    //console.log(result.ClientPolicies[0]['id']);
                    formEndorsementInstance.updateData("PolicyNumber", result.PolicyDetails[0]['id']);

                    if (rcd_id != undefined && parseInt(rcd_id) > 0) {
                        viewModel.get_endorsement();
                    }

                } else {
                    viewModel.LoadPanelShown(false);
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        //get endorsement 
        get_endorsement: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings endorsements"
            });
            let micro = false
            if (is_micro == 1) micro = true;
            get_form.DBget("policy/getRequestedEndorsements?id=" + rcd_id + "&is_micro=" + micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.changed_pay_method(result.Endorsements[0]['Endorsementtype']);
                    $("#formEndorsementOptions").dxForm({
                        formData: result.Endorsements[0]
                    }).dxForm("instance");
                    $("#formEndorsementSubmitInstance").dxForm({
                        formData: result.Endorsements[0]
                    }).dxForm("instance");
                    //make benef visible
                    //formEndorsementSubmitInstance.itemOption("beneficiaries", "visible", true);
                    //assign the datasource to it
                    //formEndorsementSubmitInstance.getEditor("beneficiaries").option("dataSource", result.Beneficiaries);
                    //viewModel.getClientPolicy(default_url);
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
            if (SmartLife.login_type == 3) {//POS
                //get policy details..
                //assign value to policy field
                //
                //viewModel.getClientPolicy();
                
                if (is_micro == 1) default_url = "policy/getMicroPolicyDetails";
                viewModel.getClientPolicy(default_url);
                
            } else if (SmartLife.login_type == 1) {//Client
                //get client policies using clientno

            }
        },

        default_pay_method: function () {
            //employer_code,paysource_br_code,bank,bank_acc_no,telco,momo_no,employer_no,deduction_date
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.emp_codeNEW", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.employee_noNEW", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.deduction_date", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.paysource_br_code", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.EFTBank_codeNEW", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.EFTBankBranchCodeNEW", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.EFTBank_accountNEW", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.telco", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.MobileWalletNEW", "visible", false);
        },
        changed_pay_method: function (val) {
            //alert(val);
            //TODO- make visible or not here
            let data = formEndorsementSubmitInstance.option("formData");
            viewModel.default_pay_method();
            if (val == "2") {//paysource, //employer_no
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.emp_codeNEW", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.employee_noNEW", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.deduction_date", "visible", true);
                //formEndorsementSubmitInstance.itemOption("paysource_br_code", "visible", true);
            }
            if (val == "3" || val == "4" || val == "5") {//standing order
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.EFTBank_codeNEW", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.EFTBankBranchCodeNEW", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.EFTBank_accountNEW", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.deduction_date", "visible", true);
            }
            if (val == "6") {//MOMO
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.telco", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.MobileWalletNEW", "visible", true);
            }

            //viewModel.refresh_dynamic_ds();
            formEndorsementSubmitInstance.updateData(data);
            //tabsInstance.option("selectedIndex", 1);
            viewModel.refresh_dataSources();
        },



        //TODO-Create a form with policy details --- baass

        get_payment_method: function () {

            viewModel.LoadPanelShown(true);
            let data = formEndorsementInstance.option("formData");
            let policyId = data['PolicyNumber'];
            var get_form = new DB({
                name: "get existings endorsements"
            });
            get_form.DBget("policy/getPolicyDetails?policyId=" + policyId).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //make benef visible
                    formEndorsementSubmitInstance.itemOption("POLICY DETAILS.pay_methodOLD", "visible", true);
                    formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.pay_methodNEW", "visible", true);
                    //assign the datasource to it
                    formEndorsementSubmitInstance.updateData("pay_methodOLD", result.PolicyDetails[0]['pay_method']);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        getPolicyDependants: function () {

            viewModel.LoadPanelShown(true);
            let data = formEndorsementInstance.option("formData");
            let policyId = data['PolicyNumber'];
            var get_form = new DB({
                name: "get existing policy dependants"
            });
            get_form.DBget("policy/getPolicyDependants?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    formEndorsementSubmitInstance.itemOption("POLICY DETAILS.dependant", "visible", true);
                    formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.dependant_change", "visible", true);
                    DependantsStore = result.FuneralMembers;
                    DependantsChangesStore = result.FuneralMembers;
                    //if (formEndorsementSubmitInstance.getEditor("dependant") != null)
                    formEndorsementSubmitInstance.getEditor("dependant").option("dataSource", DependantsStore);
                    formEndorsementSubmitInstance.getEditor("dependant_change").option("dataSource", DependantsChangesStore);
                    //fn(true);
                } else {
                    viewModel.show_test(result.msg, 'error');
                    //fn(false);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },

        get_beneficiaries: function () {
            viewModel.LoadPanelShown(true);
            let data = formEndorsementInstance.option("formData");
            let policyId = data['PolicyNumber'];
            var get_form = new DB({
                name: "get existings endorsements"
            });
            get_form.DBget("policy/getPolicyBeneficiaries?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //make benef visible
                    formEndorsementSubmitInstance.itemOption("POLICY DETAILS.beneficiaries", "visible", true);
                    formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.beneficiaries_change", "visible", true);
                    //assign the datasource to it
                    BeneficiariesStore = result.Beneficiaries;
                    BeneficiariesChangesStore = result.Beneficiaries;
                    formEndorsementSubmitInstance.getEditor("beneficiaries").option("dataSource", BeneficiariesStore);
                    formEndorsementSubmitInstance.getEditor("beneficiaries_change").option("dataSource", BeneficiariesChangesStore);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        default_visibility: function () {
            //POLICY DETAILS
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.beneficiaries", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.dependant", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.pay_methodOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.emp_codeOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.employee_noOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EFTBank_codeOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EFTBankBranchCodeOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EFTBank_accountOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EftBankaccountNameOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.MobileWalletOLD", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.StatusCode1", "visible", false);
            //LastWidthrawalDateChange,ChangeofEffectiveDate
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.LastWidthrawalDateChange", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.ChangeofEffectiveDate", "visible", false);

           
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.name", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.sex", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.mobile", "visible", false);
            formEndorsementSubmitInstance.itemOption("POLICY DETAILS.email", "visible", false);

            //ENDORSEMENT DETAILS,  
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.beneficiaries_change", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.pay_methodNEW", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.StatusCode2", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.LastWidthrawalDateChange", "visible", false);
            formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.ChangeofEffectiveDate", "visible", false);

            

            viewModel.default_pay_method();
        },

        refresh_dataSources: function () {
            if (formEndorsementSubmitInstance.getEditor("beneficiaries_change") != null)
                formEndorsementSubmitInstance.getEditor("beneficiaries_change").option("dataSource", BeneficiariesChangesStore);
            if (formEndorsementSubmitInstance.getEditor("beneficiaries") != null)
                formEndorsementSubmitInstance.getEditor("beneficiaries").option("dataSource", BeneficiariesStore);
            if (formEndorsementSubmitInstance.getEditor("PolicyNumber") != null)
                formEndorsementSubmitInstance.getEditor("PolicyNumber").option("dataSource", ClientPolicies);
            if (formEndorsementSubmitInstance.getEditor("dependant") != null)
                formEndorsementSubmitInstance.getEditor("dependant").option("dataSource", DependantsStore);
            if (formEndorsementSubmitInstance.getEditor("attachements") != null)
                formEndorsementSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
            if (formEndorsementSubmitInstance.getEditor("ViewAttachements") != null)
                formEndorsementSubmitInstance.getEditor("ViewAttachements").option("dataSource", ViewClaimAttachDataSource);
        },

        default_endorsement_type: function () {
            ChangeofEffectiveDate = false;
            ChangeOfPaymethod = false;
            ChangeFirstPWDDate = false;
            IsReinstatement = false;
            IsPremiumEscallation = false;
            AddittionalOfLives = false;
            AlterationofSA = false;
            AlterationofPremium = false;
            ChangeOfpolicyStatus = false;
            BeneficiaryEndorsement = false;
            ChangeOfTravelDate = false;
            PremiumTransfer = false;
            
            LastWidthrawalDateChange = false;
            ChangeofEffectiveDate = false;
            IsClient = false;
        },

        endorsement_type: function (endorsement_type) {
            //formEndorsementInstance ... default visibility
            viewModel.default_endorsement_type();

            if (endorsement_type == "1") {//dependants
                //display dependants
                AddittionalOfLives = true;
                viewModel.getPolicyDependants();
            }
            if (endorsement_type == "6") {//beneficiary alteration
                //display beneficiaries
                BeneficiaryEndorsement = true;
                viewModel.get_beneficiaries();
            }
            if (endorsement_type == "9") { // display payment method
                //display payment method
                ChangeOfPaymethod = true;
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.pay_methodOLD", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.pay_methodNEW", "visible", true);
                //assign the datasource to it
                console.log(viewModel.policy_obj());
                formEndorsementSubmitInstance.updateData("pay_methodOLD", viewModel.policy_obj()['pay_method']);
            }
            if (endorsement_type == "4") { // display payment method
                //display status code
                ChangeOfpolicyStatus = true;
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.StatusCode1", "visible", true);//
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.StatusCode2", "visible", true);
                //assign the datasource to it
                formEndorsementSubmitInstance.updateData("StatusCode1", viewModel.policy_obj()['status_code']);
            }
            
            if (endorsement_type == "8") { // LastWidthrawalDateChange
                //display LastWidthrawalDateChange
                LastWidthrawalDateChange = true;
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.PreviousWidthDate", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.NewPreviousWidthDate", "visible", true);
                //assign the datasource to it
                console.log(viewModel.policy_obj());
                formEndorsementSubmitInstance.updateData("PreviousWidthDate", viewModel.policy_obj()['PreviousWidthDate']);
            }
            if (endorsement_type == "7") { // ChangeofEffectiveDate
                //display ChangeofEffectiveDate
                ChangeofEffectiveDate = true;
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EffectiveDate", "visible", true);
                formEndorsementSubmitInstance.itemOption("ENDORSEMENT DETAILS.NewEffectiveDate", "visible", true);
                //assign the datasource to it
                console.log(viewModel.policy_obj());
                formEndorsementSubmitInstance.updateData("EffectiveDate", viewModel.policy_obj()['effective_date']);
            }

            if (endorsement_type == "19") { // IsClient
                //display IsClient
                IsClient = true;
                //name,sex,mobile,email,
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.name", "visible", true);
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.sex", "visible", true);
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.mobile", "visible", true);
                formEndorsementSubmitInstance.itemOption("POLICY DETAILS.email", "visible", true);

                formEndorsementSubmitInstance.updateData("name", viewModel.policy_obj()['name']);
                formEndorsementSubmitInstance.updateData("sex", viewModel.policy_obj()['sex']);
                formEndorsementSubmitInstance.updateData("mobile", viewModel.policy_obj()['mobile']);
                formEndorsementSubmitInstance.updateData("email", viewModel.policy_obj()['email']);
            }

            //formEndorsementInstance.itemOption("name", "visible", true);
            //formEndorsementInstance.itemOption("mobile", "visible", true);
            formEndorsementInstance.updateData("name", viewModel.policy_obj()['name']);
            formEndorsementInstance.updateData("mobile", viewModel.policy_obj()['mobile']);
        },

        //names,dob,mobile,email,anb, plan_code,premium,created_on
        formEndorsementOptions: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formEndorsementInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //names,dob,mobile,email,anb, plan_code,premium,created_on
            items: [
                {
                    label: {
                        text: "ID"
                    },
                    visible: false,
                    editorType: "dxTextBox",
                    dataField: "id"
                },
                {
                    label: {
                        text: "Policy Number"
                    },
                    editorType: "dxLookup",
                    dataField: "PolicyNumber",
                    editorOptions: {
                        dataSource: ClientPolicies,//SmartLife.ClientPolicies,
                        displayExpr: 'policy_no',
                        valueExpr: 'id',
                        closeOnOutsideClick: true,
                    },
                    validationRules: [{
                        type: "required",
                        message: "Policy Number is required"
                    }]
                }, {//Endorsementtype
                    label: {
                        text: "Endorsement"
                    },
                    editorType: "dxLookup",
                    dataField: "Endorsementtype",
                    editorOptions: {
                        fullScreen: true,
                        closeOnOutsideClick: true,
                        dataSource: EndorsementTypes,
                        displayExpr: 'Description',
                        valueExpr: 'Id',
                        onValueChanged: function (e) {
                            viewModel.default_visibility();
                            endorsement_type = e.value;
                            viewModel.endorsement_type(e.value);
                            viewModel.refresh_dataSources();
                            //if beneficiary display benef screen and populate the beneficiaries
                            
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Plan is required"
                    }]
                }, {//Full Names
                    label: {
                        text: "Policy Holder Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "name",
                    visible: true,
                    editorOptions: {
                        readOnly: true//change this to true later
                    }
                }, {//Contact details
                    label: {
                        text: "Policy Holder Mobile No"
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
                    visible: true,
                    editorOptions: {
                        readOnly: true//change this to true later
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
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "NEXT →",
                        width: '120',
                        horizontalAlignment: "right",
                        type: "default",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                viewModel.save_endorsement(1);
                            }
                            //navnextPrev(1);
                        }
                    }
                }]
        },

        save_endorsement: function (pg) {
            
            //if (result.isValid) {
            //post data here
            ///post data form as it is
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting endorsement"
            });
            let data = formEndorsementInstance.option("formData");
            if (data['name'] == undefined) data['name'] = viewModel.policy_obj()['name'];
            console.log(data);

            let dataSubmit = formEndorsementSubmitInstance.option("formData");
           // name, sex, mobile, email,
            delete dataSubmit.name;
            delete dataSubmit.sex;
            delete dataSubmit.mobile;
            delete dataSubmit.email;

            
            Object.assign(data, dataSubmit);
            console.log(data);
            if (is_micro == 1) {
                data['MicroPolicy'] = data['PolicyNumber'];
            }

            data['user_id'] = SmartLife.pos_name;
            data['signature'] = imageURI;
            if (pg == 2) data['StatusDescription'] = "SUBMITTED";
            
            var tableData = { tableData: JSON.stringify(data) };
            console.log(tableData);
            //BeneficiariesChangesStore
            if (endorsement_type == "6") {
                tableData = {
                    tableData: JSON.stringify(data),
                    beneficiaries: JSON.stringify(BeneficiariesChangesStore)
                };
            }
            console.log(tableData);
            get_life.DBpost("policy/saveEndorsement", tableData).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.record_id);
                    if (rcd_id == undefined || rcd_id == '') {
                        rcd_id = result.record_id;
                        viewModel.rcd_id(rcd_id);
                        console.log(viewModel.rcd_id());
                        formEndorsementInstance.updateData("id", rcd_id);
                        //TODO - when attachements are configured
                        viewModel.rcd_id(rcd_id);
                        console.log(viewModel.rcd_id());
                        /*if (ClaimAttachDataSource.length > 0) {
                            formEndorsementInstance.updateData("id", rcd_id);
                            let attachments_arr = ClaimAttachDataSource.map(obj => ({ ...obj, ['rcd_id']: rcd_id }));
                            formEndorsementSubmitInstance.getEditor("attachements").option("dataSource", attachments_arr);
                        }*/
                        if (ClaimAttachDataSource.length > 0) {
                            formEndorsementInstance.updateData("id", rcd_id);
                            ClaimAttachDataSource = ClaimAttachDataSource.map(obj => ({ ...obj, ['rcd_id']: rcd_id }));
                            console.log(ClaimAttachDataSource);
                            formEndorsementSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
                        }

                            //let attachments_arr = ClaimAttachDataSource.map(obj => ({ ...obj, ['rcd_id']: rcd_id }));
                            //formClaimSubmitInstance.getEditor("attachements").option("dataSource", attachments_arr);
                    }
                    viewModel.getAttachedFiles();
                    //navigate to the my applications screen
                    //SmartLife.app.back();
                    if (pg == 1) {
                        navnextPrev(1);
                    } else if (pg == 2) {
                        viewModel.popup_sig(false);
                        DevExpress.ui.dialog.alert("Endorsement Successfully Submited", "SUBMITED");
                        SmartLife.app.back();
                    }
                    
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
                            //}
        },


        rcd_id: ko.observable(rcd_id),

        formEndorsementSubmitOptions: {
            colCount: 1,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formEndorsementSubmitInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //
            /**/
            items: [
                {
                    itemType: 'group',
                    caption: 'POLICY DETAILS',
                    colCount: 4,
                    items: [
                        {
                            label: {
                                text: "Names"
                            },
                            dataField: "name",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        }, {
                            label: {
                                text: "Gender"
                            },
                            visible: false,
                            dataField: "sex",
                            editorType: "dxLookup",
                            editorOptions: {
                                readOnly: true,
                                dataSource: SmartLife.Genderinfo,
                                displayExpr: 'Desc',
                                valueExpr: 'Code'
                            }
                        }, {
                            label: {
                                text: "Mobile"
                            },
                            visible: false,
                            dataField: "mobile",
                            editorOptions: {
                                readOnly: true,
                            }
                        }, {
                            label: {
                                text: "Email"
                            },
                            visible: false,
                            dataField: "email",
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            colSpan: 4,
                            label: {
                                text: "BENEFICIARIES / NEXT OF KIN"
                            },
                            visible: false,
                            dataField: "beneficiaries",
                            editorType: "dxDataGrid",
                            editorOptions: {
                                dataSource: BeneficiariesStore,
                                wordWrapEnabled: true,
                                editing: {
                                    allowUpdating: true,
                                    mode: 'cell',
                                    allowAdding: false,
                                    allowDeleting: false,
                                },
                                columns: [
                                    {
                                        allowEditing: false,
                                        dataField: 'Names',
                                        caption: 'Fullnames'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'relationship',
                                        caption: 'Relationship',
                                        lookup: {
                                            dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                        }
                                    }, {
                                        allowEditing: false,
                                        dataField: 'birth_date',
                                        caption: 'Date of Birth',
                                        dataType: 'date'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'perc_alloc',
                                        caption: '% Allocated'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'MobileNumber',
                                        caption: 'Mobile No'
                                    }
                                ]
                            }
                        }, {
                            colSpan: 4,
                            label: {
                                text: "DEPENDANTS"
                            },
                            visible: false,
                            dataField: "dependant",
                            editorType: "dxDataGrid",
                            editorOptions: {
                                dataSource: DependantsStore,
                                columnHidingEnabled: true,
                                wordWrapEnabled: true,
                                editing: {
                                    allowUpdating: true,
                                    mode: 'cell',
                                    allowAdding: false,
                                    allowDeleting: false,
                                },
                                columns: [
                                    {
                                        allowEditing: false,
                                        dataField: 'Names',
                                        caption: 'Fullnames'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'Relationship',
                                        caption: 'Relationship',
                                        lookup: {
                                            dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                        },
                                        //displayIndex: 1
                                    }, {
                                        allowEditing: false,
                                        dataField: 'date_of_birth',
                                        caption: 'Date of Birth',
                                        dataType: 'date'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'sa',
                                        caption: 'Sum Assured',
                                        displayIndex: 3
                                    }, {
                                        allowEditing: false,
                                        dataField: 'premium',
                                        caption: 'Premium'
                                    }
                                ]
                            }
                        },
                        {
                            label: {
                                text: "Payment Method"
                            },
                            editorType: "dxLookup",
                            dataField: "pay_methodOLD",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Paymentinfo,
                                displayExpr: 'decription',
                                valueExpr: 'payment_mode',
                                onValueChanged: function (e) {
                                    if (e.value == '2') {
                                        //employer & staff_no
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.emp_codeOLD", "visible", true);
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.employee_noOLD", "visible", true);

                                        formEndorsementSubmitInstance.updateData("emp_codeOLD", viewModel.policy_obj()['employer_name']);
                                        //employer_codeOLD = viewModel.policy_obj()['employer_name'];
                                        formEndorsementSubmitInstance.updateData("employee_noOLD", viewModel.policy_obj()['employee_no']);
                                    } else if (e.value == '3' || e.value == '4' || e.value == '5') {
                                        //if bank, branch, account_no
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EFTBank_codeOLD", "visible", true);
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EFTBankBranchCodeOLD", "visible", true);
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EFTBank_accountOLD", "visible", true);
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.EftBankaccountNameOLD", "visible", true);

                                        formEndorsementSubmitInstance.updateData("EFTBank_codeOLD", viewModel.policy_obj()['bank_code']);
                                        formEndorsementSubmitInstance.updateData("EFTBankBranchCodeOLD", viewModel.policy_obj()['bank_branch_id']);
                                        formEndorsementSubmitInstance.updateData("EFTBank_accountOLD", viewModel.policy_obj()['EFTBank_account']);
                                        formEndorsementSubmitInstance.updateData("EftBankaccountNameOLD", viewModel.policy_obj()['EFTBankaccountName']);
                                    } else if (e.value == '6') {
                                        //momo - telco & momo_no
                                        //formEndorsementSubmitInstance.itemOption("POLICY DETAILS.emp_codeOLD", "label.text", "Telco");
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.emp_codeOLD", "visible", true);
                                        formEndorsementSubmitInstance.itemOption("POLICY DETAILS.MobileWalletOLD", "visible", true);
                                        //formEndorsementSubmitInstance.itemOption("POLICY DETAILS.detail_two", "label.text", "MOMO Number");

                                        formEndorsementSubmitInstance.updateData("emp_codeOLD", viewModel.policy_obj()['emp_code']);
                                        formEndorsementSubmitInstance.updateData("MobileWalletOLD", viewModel.policy_obj()['MobileWallet']);
                                    }
                                    viewModel.refresh_dataSources();
                                }
                            }
                        },
                        {
                            label: {
                                text: "Employer Name"
                            },
                            dataField: "emp_codeOLD",
                            visible: false,
                            editorType: "dxLookup",
                            editorOptions: {
                                readOnly: true,
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Employerinfo,
                                displayExpr: 'Name',
                                valueExpr: 'emp_code'
                            },
                        },
                        {
                            label: {
                                text: "Staff No"
                            },
                            dataField: "employee_noOLD",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "Bank Name"
                            },
                            dataField: "EFTBank_codeOLD",
                            visible: false,
                            editorOptions: {
                                readOnly:true,
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Banks,
                                displayExpr: 'description',
                                valueExpr: 'bank_code',
                            },
                        },
                        {
                            label: {
                                text: "Bank Branch"
                            },
                            dataField: "EFTBankBranchCodeOLD",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.BanksBranches,
                                displayExpr: 'bankBranchName',
                                valueExpr: 'id'
                            },
                        },
                        {
                            label: {
                                text: "Account No"
                            },
                            dataField: "EFTBank_accountOLD",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "Account Name"
                            },
                            dataField: "EftBankaccountNameOLD",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "MOMO No"
                            },
                            dataField: "MobileWalletOLD",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        }, {
                            label: {
                                text: "Current Policy Status"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "StatusCode1",
                            editorOptions: {
                                readOnly: true,
                                closeOnOutsideClick: true,
                                dataSource: StatusesInfo,
                                displayExpr: 'description',
                                valueExpr: 'status_code',
                            }
                        },
                        {
                            label: {
                                text: "Current Effective Date"
                            },
                            dataField: "EffectiveDate",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        },
                        {
                            label: {
                                text: "Withdrawal Date"
                            },
                            dataField: "PreviousWidthDate",
                            visible: false,
                            editorOptions: {
                                readOnly: true,
                            }
                        }
                    ]
                },
                {
                    itemType: 'group',
                    caption: 'ENDORSEMENT DETAILS',
                    colCount: 4,
                    items: [
                        {
                            //Names,Relationship,date_of_birth,age,Hci_sum,sa,premium
                            colSpan: 4,
                            label: {
                                text: "DEPENDANTS (Changes)"
                            },
                            visible: false,
                            dataField: "dependant_change",
                            editorType: "dxDataGrid",
                            editorOptions: {
                                dataSource: DependantsChangesStore,
                                wordWrapEnabled: true,
                                columnHidingEnabled: true,
                                editing: {
                                    allowUpdating: true,
                                    mode: 'cell',
                                    allowAdding: false,
                                    allowDeleting: false,
                                },
                                onRowClick: function (e) {
                                    viewModel.show_dependant(e);
                                },
                                columns: [
                                    {
                                        allowEditing: false,
                                        dataField: 'Names',
                                        caption: 'Fullnames'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'Relationship',
                                        caption: 'Relationship',
                                        lookup: {
                                            dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                        }
                                    }, {
                                        allowEditing: false,
                                        dataField: 'date_of_birth',
                                        caption: 'Date of Birth',
                                        dataType: 'date'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'age',
                                        caption: 'Age'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'Hci_sum',
                                        caption: 'HCI Sum Assured'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'sa',
                                        caption: 'Sum Assured'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'premium',
                                        caption: 'Premium'
                                    }, {//Reason,
                                        allowEditing: false,
                                        dataField: 'Reason',
                                        caption: 'Reason'
                                    }
                                ]
                            }
                        },
                        {
                            colSpan: 4,
                            label: {
                                text: "BENEFICIARIES / NEXT OF KIN (Changes)"
                            },
                            visible: false,
                            dataField: "beneficiaries_change",
                            editorType: "dxDataGrid",
                            editorOptions: {
                                dataSource: BeneficiariesChangesStore,
                                wordWrapEnabled: true,
                                editing: {
                                    allowUpdating: true,
                                    mode: 'cell',
                                    allowAdding: false,
                                    allowDeleting: false
                                },
                                onRowClick: function (e) {
                                    viewModel.show_beneficiary(e);
                                },
                                columns: [
                                    {
                                        allowEditing: false,
                                        dataField: 'Names',
                                        caption: 'Fullnames'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'relationship',
                                        caption: 'Relationship',
                                        lookup: {
                                            dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                        }
                                    }, {
                                        allowEditing: false,
                                        dataField: 'birth_date',
                                        caption: 'Date of Birth',
                                        dataType: 'date'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'perc_alloc',
                                        caption: '% Allocated'
                                    }, {
                                        allowEditing: false,
                                        dataField: 'MobileNumber',
                                        caption: 'Mobile No'
                                    }, {
                                        dataField: 'ClaimDefaultPay_method',
                                        visible: false
                                    }, {
                                        dataField: 'ClaimDefaultTelcoCompany',
                                        visible: false
                                    }, {
                                        dataField: 'ClaimDefaultMobileWallet',
                                        visible: false
                                    }, {
                                        dataField: 'ClaimDefaultEFTBank_code',
                                        visible: false
                                    }, {
                                        dataField: 'ClaimDefaultEFTBankBranchCode',
                                        visible: false
                                    }, {
                                        dataField: 'ClaimDefaultEFTBank_account',
                                        visible: false
                                    }, {
                                        dataField: 'ClaimDefaultEftBankaccountName',
                                        visible: false
                                    }, {
                                        dataField: 'GuardianSurname',
                                        visible: false
                                    }, {
                                        dataField: 'GuardianOtherNames',
                                        visible: false
                                    }, {
                                        dataField: 'GuardianTelephone',
                                        visible: false
                                    }, {
                                        dataField: 'GuardianEmail',
                                        visible: false
                                    }, {
                                        dataField: 'Reason',
                                        caption: 'Changes',
                                        allowEditing: false
                                    }
                                ]
                            }
                        },
                        {
                            label: {
                                text: "Payment Method Change"
                            },
                            editorType: "dxLookup",
                            dataField: "pay_methodNEW",
                            visible: false,
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Paymentinfo,
                                displayExpr: 'decription',
                                valueExpr: 'payment_mode',
                                onValueChanged: function (e) {
                                    console.log(SmartLife.Telcos);
                                    viewModel.changed_pay_method(e.value);
                                }
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Payment Method Change is required",
                                validationCallback: function (obj) {
                                    if (ChangeOfPaymethod) {
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
                            //employer_code,paysource_br_code,bank,bank_acc_no,telco,momo_no
                            label: {
                                text: "Pay Source"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "emp_codeNEW",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Employerinfo,
                                displayExpr: 'Name',
                                valueExpr: 'emp_code'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Pay Source is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '2') {
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
                                text: "Staff Number"
                            },
                            editorType: "dxTextBox",
                            visible: false,
                            dataField: "employee_noNEW",
                            validationRules: [{
                                type: "custom",
                                message: "Staff Number is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '2') {
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
                            dataField: "EFTBank_codeNEW",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Banks,
                                displayExpr: 'description',
                                valueExpr: 'bank_code',
                                onValueChanged: function (e) {
                                    //filter the bank branches ClaimBankBranches
                                    PolicyBankBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == e.value));
                                    //update dataSource
                                    formEndorsementSubmitInstance.getEditor("EFTBankBranchCodeNEW").option("dataSource", PolicyBankBranches);
                                }
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Bank is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '3' || data['pay_methodNEW'] == '4' || data['pay_methodNEW'] == '5') {
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
                                text: "Bank Branch"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "EFTBankBranchCodeNEW",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: PolicyBankBranches,
                                displayExpr: 'bankBranchName',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Bank Branch is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '3' || data['pay_methodNEW'] == '4' || data['pay_methodNEW'] == '5') {
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
                        }, {//SmartLife.
                            label: {
                                text: "Account Number"
                            },
                            editorType: "dxTextBox",
                            visible: false,
                            dataField: "EFTBank_accountNEW",
                            validationRules: [{
                                type: "custom",
                                message: "Bank Account is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '3' || data['pay_methodNEW'] == '4' || data['pay_methodNEW'] == '5') {
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
                                text: "Telco Company"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "telco",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Telcos,
                                displayExpr: 'Name',
                                valueExpr: 'emp_code'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Telco is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '6') {
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
                                text: "MOMO Number"
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
                            visible: false,
                            dataField: "MobileWalletNEW",
                            validationRules: [{
                                type: "custom",
                                message: "MOMO Number is required",
                                validationCallback: function (obj) {
                                    //check if Doyouhavesecondaryincome = 1
                                    let data = formEndorsementSubmitInstance.option("formData");
                                    if (data['pay_methodNEW'] == '6') {
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
                                text: "First Deduction Date"
                            },
                            editorType: "dxDateBox",

                            visible: false,
                            dataField: "CheckOffDate",
                        }, {
                            label: {
                                text: "New Policy Status"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "StatusCode2",
                            editorOptions: {
                                displayFormat: 'dd/MM/yyyy',
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.Statuses,
                                displayExpr: 'description',
                                valueExpr: 'status_code',
                            },
                            validationRules: [{
                                type: "custom",
                                message: "New Policy Status is required",
                                validationCallback: function (obj) {
                                    let data = formEndorsementInstance.option("formData");
                                    if (data['Endorsementtype'] == '4') {//change of policy status
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
                                text: "New Effective Date"
                            },
                            editorType: "dxDateBox",
                            editorOptions: {
                                displayFormat: 'dd/MM/yyyy'
                            },
                            visible: false,
                            dataField: "NewEffectiveDate",
                            validationCallback: function (obj) {
                                let data = formEndorsementInstance.option("formData");
                                if (data['Endorsementtype'] == '7') {
                                    //change of policy status
                                    if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    return true;//don't check validation
                                }
                            }
                        }, {
                            label: {
                                text: "New Withdrawal Date"
                            },
                            editorType: "dxDateBox",
                            editorOptions: {
                                displayFormat: 'dd/MM/yyyy'
                            },
                            visible: false,
                            dataField: "NewPreviousWidthDate",
                            alidationCallback: function (obj) {
                                let data = formEndorsementInstance.option("formData");
                                if (data['Endorsementtype'] == '8') {
                                    //change of policy status
                                    if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    return true;//don't check validation
                                }
                            }
                        }, {
                            colSpan: 4,
                            itemType: "empty"
                        }, {
                            colSpan: 4,
                            itemType: "empty"
                        }, {
                            colSpan: 4,
                            itemType: "empty"
                        }
                    ]
                }, {
                    label: {
                        text: "Effective Date"
                    },
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy'
                    },
                    dataField: "EffectiveDate",
                    validationRules: [{
                        type: "required",
                        message: "Effective Date is required"
                    }]
                }, {
                    label: {
                        text: "Diary"
                    },
                    editorType: "dxTextArea",
                    editorOptions: {
                        readOnly: false
                    },
                    dataField: "Reason",
                    validationRules: [{
                        type: "required",
                        message: "Diary / Narration is required"
                    }]
                }, {
                    label: {
                        text: "FILE ATTACHMENTS"
                    },
                    visible: true,
                    dataField: "attachements",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: ClaimAttachDataSource,
                        columnHidingEnabled: true,
                        onInitialized: function (e) {
                            AttachmentInstance = e.component;
                        },
                        wordWrapEnabled: true,
                        columns: [
                            {
                                dataField: 'rcd_id',
                                visible: false,
                            },
                            {
                                dataField: 'req_code',
                                visible: false,
                            },
                            {
                                dataField: 'id',
                                visible: false,
                            },
                            {
                                dataField: 'is_uploaded',
                                visible: false,
                            },
                            {
                                dataField: 'file_path',
                                visible: false,
                            }, {
                                dataField: 'description',
                            }, {
                                caption: 'ACTION',
                                allowEditing: false,
                                cellTemplate: function (container, options) {
                                    $("<div />").appendTo(container).dxFileUploader({
                                        disabled: false,
                                        selectButtonText: 'ATTACH FILE',
                                        visible: true,
                                        accept: '*',
                                        uploadMode: 'instantly',
                                        multiple: false,
                                        name: 'myFile',
                                        uploadUrl: SmartLife.url + "policy/syncEndorsementsImage?req_code=" + options.data.req_code + "&eEndorsementId=" + options.data.rcd_id + "&Description=" + options.data.description,//viewModel.uploadUrl(),//upload_url_sig,
                                        onUploadStarted: viewModel.upload_started(options),
                                        onValueChanged: function (e) {
                                            console.log(e.value);
                                            let files = e.value;
                                            let filepath = "";
                                            if (files.length > 0) {
                                                var file = files[0];
                                                //filepath = file.tmpPath;
                                                //console.log("Temporary file path: " + file.PostedFile.FileName);
                                            }
                                            //console.log()
                                            ClaimAttachDataSource[options.rowIndex]['is_uploaded'] = 1;
                                            AttachmentInstance.columnOption('is_uploaded', { value: 1 });
                                        },
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
                  
                            if (window.location.host == "192.168.1.24:90") {
                                window.open('http://192.168.1.24:90/SmartLifeDocuments/EndorsementDocuments/' + e.data.Description, '_blank', 'hidden=no');
                            } else {
                                window.open('http://197.159.142.171:90/SmartLifeDocuments/EndorsementDocuments/' + e.data.Description, '_blank', 'hidden=no');
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
                            },
                            {
                                dataField: 'file_desc',
                                visible: true,
                            },*/
                            {
                                dataField: 'Description',
                                caption: 'File Name'
                            }
                        ]
                    }
                }, {
                    itemType: "empty"
                }, {
                    itemType: "empty"
                }, {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "← BACK",
                        horizontalAlignment: "left",
                        width: '120',
                        // icon: "chevronprev",
                        type: "default",
                        onClick: function (args) {
                            navnextPrev(0);
                        }
                    }
                }, {
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: "SUBMIT ✓",
                        horizontalAlignment: "right",
                        width: '120',
                        type: 'danger',
                        onClick: function (args) {
                            //alter the array depending on the form
                            //qn_intermediary, fm_health_intermediary;
                            var result = args.validationGroup.validate();

                            if (result.isValid) {
                                //post data here
                                ///post data form as it is
                                //viewModel.save_endorsement(args, 2);
                                var result = args.validationGroup.validate();
                                viewModel.show_signature();
                            }
                        }
                    }
                }]
        },
        is_to_sign: ko.observable(false),
        is_to_sign_changed: function (e) {
            //check if letter is uploaded----baas
            if (e.value) {
                ClaimAttachDataSource.forEach(function (obj) {
                    if (obj['id'] == 3) {
                        if (obj['is_uploaded'] != 1) {
                            DevExpress.ui.dialog.alert("Kindly Upload Endorsement Letter", "Error!");
                            viewModel.is_to_sign(false);
                        }
                    }
                });
            }
        },

        //////file upload///
        getAttachedFiles: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get attached Files"
            });
            get_form.DBget("policy/getEndorsementFiles?rcd_id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //assign datasource to files
                    ViewClaimAttachDataSource = result.Files;
                    formEndorsementSubmitInstance.getEditor("ViewAttachements").option("dataSource", ViewClaimAttachDataSource);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        upload_started: function (e) {
            //viewModel.LoadPanelShown(true);
            //console.log(e);
            //console.log(e.file);
        },
        uploadUrl: ko.observable(SmartLife.url + "policy/syncEndorsementsImage?req_code=" + req_code + "&eEndorsementId=" + rcd_id +"&Description="),
        get_uploadurl_sig: function (e) {
            //change the photo type here to pass as data....
            req_code = e.value;
            console.log(e.value);
            console.log(rcd_id);
            viewModel.uploadUrl(SmartLife.url + "policy/syncEndorsementsImage?req_code=" + req_code + "&eEndorsementId=" + rcd_id + "&Description=");
            console.log(uploadUrl);
        },
        sys_uploaded: function () {
            //Make a request to refresh the dxdatagrid
            //viewModel.get_ac_files();
        },
        file_uploaded_error: function (error) {
            console.log(error);
        },
        /////end of file upload

        /////dependant popup/////
        pop_dependant: ko.observable(false),
        hide_dependant: function () {
            viewModel.pop_dependant(false);
        },
        show_dependant: function (e) {
            rowDPIndex = e.rowIndex;
            viewModel.pop_dependant(true);
            console.log(e.data);
            /*let age = viewModel.calc_age(e.data.birth_date);
            if (parseInt(age) < 18) {
                //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail
                formBeneficiaryInstance.itemOption("GuardianSurname", "visible", true);
                formBeneficiaryInstance.itemOption("GuardianOtherNames", "visible", true);
                formBeneficiaryInstance.itemOption("GuardianTelephone", "visible", true);
                formBeneficiaryInstance.itemOption("GuardianEmail", "visible", true);
            }*/
            //ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account,
            //ClaimDefaultEftBankaccountName
            //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail

            ////Names,Relationship,date_of_birth,age,Hci_sum,sa,premium
            let tmp_values = {
                id: e.data.id, Names: e.data.Names, Relationship: e.data.Relationship, date_of_birth: e.data.date_of_birth, age: e.data.age,
                Hci_sum: e.data.Hci_sum, sa: e.data.sa, premium: e.data.premium
            };
            $("#dxFormDependant").dxForm({
                formData: tmp_values
            }).dxForm("instance");

        },
        dxFormDependant: {
            colCount: 4,
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
            //Names,relationship,birth_date,perc_alloc,mobile
            items: [
                {
                    label: {
                        text: "id"
                    },
                    editorType: "dxNumberBox",
                    dataField: "id",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                        
                    },
                    validationRules: [{
                        type: "required",
                        message: "Name is required"
                    }]
                }, {
                    label: {
                        text: "FullNames"
                    },
                    editorType: "dxTextBox",
                    dataField: "Names",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    },
                }, {
                    label: {
                        text: "Relationship"
                    },
                    editorType: "dxLookup",
                    dataField: "Relationship",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Relationshipinfo,
                        displayExpr: 'description',
                        valueExpr: 'code',
                    },
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    editorType: "dxDateBox",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy'
                    },
                    dataField: "date_of_birth",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    }
                }, {
                    label: {
                        text: "Age"
                    },
                    editorType: "dxNumberBox",
                    dataField: "age",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    }
                }, {//,Hci_sum,sa,premium
                    label: {
                        text: "HCI sum Assured"
                    },
                    editorType: "dxNumberBox",
                    dataField: "Hci_sum",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                        format: "#,##0.00"
                    }
                }, {
                    label: {
                        text: "Sum Assured"
                    },
                    editorType: "dxNumberBox",
                    dataField: "sa",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                        format: "#,##0.00"
                    }
                }, {
                    label: {
                        text: "Premium"
                    },
                    editorType: "dxNumberBox",
                    dataField: "premium",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                        format: "#,##0.00"
                    }
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    label: {
                        text: "Diary"
                    },
                    editorType: "dxTextArea",
                    dataField: "Reason",
                    visible: true,
                },
                //save
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "CLOSE",
                        horizontalAlignment: "left",
                        icon: "close",
                        type: "normal",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                            viewModel.hide_dependant();
                        }
                    }
                }, {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "OK",
                        icon: "check",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            //var result = args.validationGroup.validate();
                            let dependants_data = formDependantInstance.option("formData");
                            DependantsChangesStore[rowDPIndex] = dependants_data;
                            formEndorsementSubmitInstance.getEditor("dependant_change").option("dataSource", DependantsChangesStore);
                            viewModel.hide_dependant();

                            //}

                        }
                    }
                }
            ]
        },
        ////end of dependant popup//

        //////beneficiary popup//////
        claim_changed_pay_method: function (type, val) {
            //alert(val);
            //TODO- make visible or not here
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            if (type == 0) {
                let data = formClaimSubmitInstance.option("formData");
                let attachements = formClaimSubmitInstance.getEditor('attachements').option('dataSource');

                viewModel.claim_default_pay_method();
                if (val == "7" || val == "9") {//standing order
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_code", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_account", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", true);
                }
                if (val == "6") {//MOMO
                    formClaimSubmitInstance.itemOption("ClaimDefaultTelcoCompany", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultMobileWallet", "visible", true);
                }

                formClaimSubmitInstance.updateData(data);
                formClaimSubmitInstance.getEditor("attachements").option("dataSource", attachements);
                //tabsInstance.option("selectedIndex", 1);
            } else if (type == 1) {
                let data = formBeneficiaryInstance.option("formData");
                viewModel.claim_default_benef_pay_method();
                if (val == "7" || val == "9") {//standing order
                    formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_code", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_account", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", true);
                }
                if (val == "6") {//MOMO
                    formBeneficiaryInstance.itemOption("ClaimDefaultTelcoCompany", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultMobileWallet", "visible", true);
                }
                formBeneficiaryInstance.updateData(data);
            }
        },
        calc_age: function (e) {
            if (e == null || e == undefined || e == '') return null;
            //insert the value of the ANB.
            var current_date = new Date();
            var current_yr = current_date.getFullYear();
            var current_month = current_date.getMonth() + 1;
            var current_day = current_date.getDate();
            var selected_date = new Date(e);
            var yr = selected_date.getFullYear();
            var month_yr = selected_date.getMonth() + 1;
            var date_yr = selected_date.getDate();
            var anb_age = (current_yr - yr);

            //if (DateTime.Now.Month < birthdate.Month || (DateTime.Now.Month == birthdate.Month && DateTime.Now.Day < birthdate.Day))

            //alert(current_day);
            if ((current_month <= month_yr) && (current_day < date_yr)) {
                anb_age = anb_age - 1;
            }
            return anb_age;
        },
        pop_beneficiary: ko.observable(false),
        hide_beneficiary: function () {
            viewModel.pop_beneficiary(false);
        },
        show_beneficiary: function (e) {
            rowBenefIndex = e.rowIndex;
            viewModel.pop_beneficiary(true);
            console.log(e.data);
            let age = viewModel.calc_age(e.data.birth_date);
            if (parseInt(age) < 18) {
                //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail
                formBeneficiaryInstance.itemOption("GuardianSurname", "visible", true);
                formBeneficiaryInstance.itemOption("GuardianOtherNames", "visible", true);
                formBeneficiaryInstance.itemOption("GuardianTelephone", "visible", true);
                formBeneficiaryInstance.itemOption("GuardianEmail", "visible", true);
            }
            let paymethod = e.data.ClaimDefaultPay_method;
            if (paymethod != null && paymethod != undefined && paymethod != '') {
                viewModel.claim_changed_pay_method(1, e.value);
            }
            //ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account,
            //ClaimDefaultEftBankaccountName
            //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail

            let tmp_values = {
                id: e.data.id, Names: e.data.Names, relationship: e.data.relationship, birth_date: e.data.birth_date, age: age,
                perc_alloc: e.data.perc_alloc, mobile: e.data.mobile,
                ClaimDefaultPay_method: e.data.ClaimDefaultPay_method, ClaimDefaultTelcoCompany: e.data.ClaimDefaultTelcoCompany,
                ClaimDefaultMobileWallet: e.data.ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code: e.data.ClaimDefaultEFTBank_code,
                ClaimDefaultEFTBankBranchCode: e.data.ClaimDefaultEFTBankBranchCode, ClaimDefaultEftBankaccountName: e.data.ClaimDefaultEftBankaccountName,
                GuardianSurname: e.data.GuardianSurname, GuardianOtherNames: e.data.GuardianOtherNames,
                GuardianTelephone: e.data.GuardianTelephone, GuardianEmail: e.data.GuardianEmail
            };
            $("#dxFormBeneficiary").dxForm({
                formData: tmp_values
            }).dxForm("instance");
            
        },
        dxFormBeneficiary: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formBeneficiaryInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //Names,relationship,birth_date,perc_alloc,mobile
            items: [
                {
                    label: {
                        text: "id"
                    },
                    editorType: "dxNumberBox",
                    dataField: "id",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    },
                    validationRules: [{
                        type: "required",
                        message: "Name is required"
                    }]
                }, {
                    label: {
                        text: "FullNames"
                    },
                    editorType: "dxTextBox",
                    dataField: "Names",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    },
                }, {
                    label: {
                        text: "Relationship"
                    },
                    editorType: "dxLookup",
                    dataField: "relationship",
                    visible: true,
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Relationshipinfo,
                        displayExpr: 'description',
                        valueExpr: 'code',
                    },
                }, {
                    label: {
                        text: "Date of Birth"
                    },
                    editorType: "dxDateBox",
                    dataField: "birth_date",
                    visible: true,
                    editorOptions: {
                            displayFormat: 'dd/MM/yyyy',
                        readOnly: true
                    }
                }, {
                    label: {
                        text: "Age"
                    },
                    editorType: "dxNumberBox",
                    dataField: "age",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    }
                }, {
                    label: {
                        text: "Percentage Allocated"
                    },
                    editorType: "dxNumberBox",
                    dataField: "perc_alloc",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    }
                }, {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "mobile",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    }
                },
                //payment details option
                //ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account,
                //ClaimDefaultEftBankaccountName
                {
                    label: {
                        text: "Claim Payment Method"
                    },
                    editorType: "dxLookup",
                    dataField: "ClaimDefaultPay_method",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: PayMethods,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            //viewModel.claim_changed_pay_method(1, e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Payment Method is required"
                    }]
                },//ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code,
                //ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
                {
                    label: {
                        text: "Claim DefaultBank"
                    },
                    editorType: "dxLookup",
                    visible: true,
                    dataField: "ClaimDefaultEFTBank_code",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //filter the bank branches ClaimBankBranches
                            // ClaimBankBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == e.value));
                            //update dataSource
                            //formPersonalDetailsInstance.getEditor("ClaimDefaultEFTBankBranchCode").option("dataSource", ClaimBankBranches);
                        }
                    },
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '7' || data['ClaimDefaultPay_method'] == '9') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                }, {
                    label: {
                        text: "Claim Default Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: true,
                    dataField: "ClaimDefaultEFTBankBranchCode",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: ClaimBankBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    },
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '7' || data['ClaimDefaultPay_method'] == '9') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                }, {//SmartLife.
                    label: {
                        text: "Claim Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: true,
                    editorOptions: {
                        readOnly: true
                    },
                    dataField: "ClaimDefaultEFTBank_account",
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank Account is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '7' || data['ClaimDefaultPay_method'] == '9') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                }, {
                    label: {
                        text: "Claim Default Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: true,
                    dataField: "ClaimDefaultTelcoCompany",
                    editorOptions: {
                        readOnly:true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    },
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default Telco Company is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '6') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                }, {
                    label: {
                        text: "Claim Default MOMO Number"
                    },
                    editorType: "dxTextBox",
                    visible: true,
                    dataField: "ClaimDefaultMobileWallet",
                    editorOptions: {
                        readOnly:true,
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
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default MOMO Number is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '6') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                },
                //guardian details
                //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail
                {
                    label: {
                        text: "Gurdians Surname"
                    },
                    editorType: "dxTextBox",
                    dataField: "GuardianSurname",
                    visible: false,
                    editorOptions: {
                        readOnly: true
                    }
                    /*validationRules: [{
                        type: "custom",
                        message: "Gurdians Surname is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['age'] < 18) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                },
                {
                    label: {
                        text: "Gurdians Other Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "GuardianOtherNames",
                    visible: false,
                    editorOptions: {
                        readOnly: true
                    }
                    /*validationRules: [{
                        type: "custom",
                        message: "Gurdians Other Name is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['age'] < 18) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                },
                {
                    label: {
                        text: "Gurdians Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "GuardianTelephone",
                    visible: false,
                    editorOptions: {
                        readOnly: true
                    }
                    /*validationRules: [{
                        type: "custom",
                        message: "Gurdians Mobile is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['age'] < 18) {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }
                    }]*/
                }, {
                    label: {
                        text: "Guardians Email"
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        readOnly: true
                    },
                    dataField: "GuardianEmail",
                    visible: false,
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    label: {
                        text: "Diary"
                    },
                    editorType: "dxTextArea",
                    dataField: "Reason",
                    visible: true,
                },
                //save
                {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                {
                    colSpan: 2,
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "CLOSE",
                        horizontalAlignment: "left",
                        icon: "close",
                        type: "normal",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                            viewModel.hide_beneficiary();
                        }
                    }
                }, {
                    colSpan: 2,
                    itemType: "button",
                    buttonOptions: {
                        text: "OK",
                        icon: "check",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            //var result = args.validationGroup.validate();
                            let beneficiaries_data = formBeneficiaryInstance.option("formData");
                            BeneficiariesChangesStore[rowBenefIndex] = beneficiaries_data;
                            formEndorsementSubmitInstance.getEditor("beneficiaries_change").option("dataSource", BeneficiariesChangesStore);
                            viewModel.hide_beneficiary();
                            //if (result.isValid) {
                                /*viewModel.LoadPanelShown(true);
                                const beneficiaries_data = formBeneficiaryInstance.option("formData");
                                //TODO.....save to smartlife first then if successfull edit the datasource
                                var get_form = new DB({
                                    name: "saving beneficiary"
                                });
                                
                                //policy_no, claim_type, request_date, tot_cash_value, amount_available, amount_applied, reason, status
                                get_form.DBpost("policy/UpdateBeneficiaries?",
                                    {
                                        id: beneficiaries_data['id'],
                                        beneficiaries: beneficiaries_data
                                    }
                                ).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        //format the beneficiaries list accordingly -  where id = .....
                                        //get the dataSource
                                        let data = formClaimInstance.getEditor('beneficiaries').option('dataSource');
                                        //add this to it 
                                        data[rowBenefIndex] = beneficiaries_data;
                                        //data.push(beneficiaries_data);
                                        //update the dataSource
                                        formClaimInstance.getEditor("beneficiaries").option("dataSource", data);
                                        //hide
                                        viewModel.hide_beneficiary();
                                        DevExpress.ui.dialog.alert("Beneficiary Successfully Saved", "SAVED");
                                    } else {
                                        viewModel.show_test(result.msg, 'error');
                                    }
                                }).fail(function () {
                                    viewModel.LoadPanelShown(false);
                                    //alert_dialog("Server not accessible. Check internet connectivity");
                                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                });*/

                            //}

                        }
                    }
                }
            ]
        },
        /////end of beneficiary popup///


        /////signature pad/////
        popup_sig: ko.observable(false),
        hide_popup_sig: function () {
            viewModel.popup_sig(false);
        },
        submit_endorsement: function () {
            //TODO - Submit the entire claim and flag it as submited bruv...
            var data = $sigdiv.jSignature('getData', 'image')
            var i = new Image()
            i.src = 'data:' + data[0] + ',' + data[1];
            imageURI = i.src;
            
            if (viewModel.is_to_sign()) {
                viewModel.save_endorsement(2);
            } else {
                console.log(imageURI);
                //alert(imageURI);

                if (imageURI == undefined || imageURI == "" || imageURI == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABRsAAAFHCAYAAAAhuJsvAAAAAXNSR0IArs4c6QAAIABJREFUeF7t21GNFVEQRdHGCHhACDKeqJaBEDyAEkzs5GQqawTUfb2qvnYy3x5/BAgQIECAAAECBAgQIECAAAECBAgQCAS+BTOMIECAAAECBAgQIECAAAECBAgQIECAwCM2OgICBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGxcXwDn8/n5/M8v8Y/w/MECBAgQIAAAQIECBAgQIAAgQsCv9/3/XPhQ77qN4iN4819Pp+/z/N8H/8MzxMgQIAAAQIECBAgQIAAAQIELgj8e9/3x4UP+arfIDaONyc2jhfgeQIECBAgQIAAAQIECBAgQOCSgNg43qbYOF6Af6MeL8DzBAgQIECAAAECBAgQIECAwCUB/0Y93qbYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXi9DXU8AAAA8UlEQVSeAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVgf+cBRVICIoJOQAAAABJRU5ErkJggg==") {
                    DevExpress.ui.dialog.alert("Kindly Sign In order to proceed");
                } else {

                    viewModel.save_endorsement(2);
                    /*var get_form = new DB({
                        name: "submitting signature"
                    });
    
                    //policy_no, claim_type, request_date, tot_cash_value, amount_available, amount_applied, reason, status
                    get_form.DBpost("policy/syncEndorsementsImage?",
                        {
                            req_code: '020',
                            eEndorsementId: rcd_id,
                            signature: imageURI,
                        }
                    ).done(function (result) {
                        if (result.success == true) {*/

                    /*} else {
                        viewModel.show_test(result.msg, 'error');
                    }
                }).fail(function () {
                    //alert_dialog("Server not accessible. Check internet connectivity");
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });*/
                }
            }

            
        },

        show_signature: function () {

            $('#signature').empty();

            viewModel.popup_sig(true);
            // This is the part where jSignature is initialized.
            $sigdiv = $("#signature").jSignature({ 'UndoButton': true })

                // All the code below is just code driving the demo. 
                , $tools = $('#tools')
                , $extraarea = $('#displayarea')
                , pubsubprefix = 'jSignature.demo.'

            var export_plugins = $sigdiv.jSignature('listPlugins', 'export')
                , chops = ['<span><b>Extract signature data as: </b></span><select>', '<option value="">(select export format)</option>']
                , name
            for (var i in export_plugins) {
                if (export_plugins.hasOwnProperty(i)) {
                    name = export_plugins[i]
                    chops.push('<option value="' + name + '">' + name + '</option>')
                }
            }
            chops.push('</select><span><b> or: </b></span>')

            $(chops.join('')).bind('change', function (e) {
                if (e.target.value !== '') {
                    //alert(e.target.value);
                    var data = $sigdiv.jSignature('getData', e.target.value)
                    $.publish(pubsubprefix + 'formatchanged')
                    if (typeof data === 'string') {
                        $('textarea', $tools).val(data)
                    } else if ($.isArray(data) && data.length === 2) {
                        $('textarea', $tools).val(data.join(','))
                        $.publish(pubsubprefix + data[0], data);
                    } else {
                        try {
                            $('textarea', $tools).val(JSON.stringify(data))
                            //imageURI = JSON.stringify(data)
                        } catch (ex) {
                            $('textarea', $tools).val('Not sure how to stringify this, likely binary, format.')
                        }
                    }
                }
            }).appendTo($tools)


            $('<input type="button" value="Reset">').bind('click', function (e) {
                $sigdiv.jSignature('reset')
            }).appendTo($tools)

            $('<div><textarea style="width:100%;height:7em;"></textarea></div>').appendTo($tools)

            $.subscribe(pubsubprefix + 'formatchanged', function () {
                $extraarea.html('')
            })

            $.subscribe(pubsubprefix + 'image/svg+xml', function (data) {

                try {
                    var i = new Image()
                    i.src = 'data:' + data[0] + ';base64,' + btoa(data[1])
                    //$(i).appendTo($extraarea)
                } catch (ex) {

                }

                var message = [
                    "If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
                    , "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
                    , "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
                ]
                $("<div>" + message.join("<br/>") + "</div>").appendTo($extraarea)
            });

            $.subscribe(pubsubprefix + 'image/svg+xml;base64', function (data) {
                var i = new Image()
                i.src = 'data:' + data[0] + ',' + data[1]

                $(i).appendTo($extraarea)

                var message = [
                    "If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
                    , "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
                    , "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
                ]
                $("<div>" + message.join("<br/>") + "</div>").appendTo($extraarea)
            });

            $.subscribe(pubsubprefix + 'image/png;base64', function (data) {
                i = new Image()
                i.src = 'data:' + data[0] + ',' + data[1]
                imageURI = i.src
                //alert(image_url)
                /*$('<span><b>As you can see, one of the problems of "image" extraction (besides not working on some old Androids, elsewhere) is that it extracts A LOT OF DATA and includes all the decoration that is not part of the signature.</b></span>').appendTo($extraarea)
                $(i).appendTo($extraarea)*/

                //$(i).appendTo("#show_signature")
            });

            $.subscribe(pubsubprefix + 'image/jsignature;base30', function (data) {
                $('<span><b>This is a vector format not natively render-able by browsers. Format is a compressed "movement coordinates arrays" structure tuned for use server-side. The bonus of this format is its tiny storage footprint and ease of deriving rendering instructions in programmatic, iterative manner.</b></span>').appendTo($extraarea)
            });

            if (Modernizr.touch) {
                $('#scrollgrabber').height($('#content').height())
            }


            //$('#show_signature').append('<p>Bubbling bubbling baby</p>');
            //$(i).appendTo($extraarea)
            //$('#displayarea').append(i);
            //viewModel.vs_crew_autograph(false);
        },

        /////end of signature pad////


    };

    return viewModel;
};