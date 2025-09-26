SmartLife.request_claim_form = function (params) {

    var default_url = "policy/getPolicyDetails";
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

    var policy_no;// = params.item;
    var rcd_id;
    var req_code;
    var is_micro = 0;
    var is_group = 0;
    var member_no = "";
    var telephone = "";
    var Names = "";
    var claim_type = "";
    var GlifeLoanTypesinfo = [];
    var SchemeID = "";
    var status_code;
    var prem_units = 0;
    var submitOTP = '';
    var SubmitData;


    var get_data = JSON.parse(params.item);
    console.log(get_data);
    if (get_data['policy_no'] != undefined) policy_no = get_data['policy_no'];
    if (get_data['rcd_id'] != undefined) {
        rcd_id = get_data['rcd_id'];
        //alert(rcd_id);
        console.log(rcd_id);
    }
    if (get_data['status_code'] != undefined) {
        status_code = get_data['status_code'];
        //alert(rcd_id);
        console.log(status_code);
    }
    if (get_data['member_no'] != undefined) {
        member_no = get_data['member_no'];
        telephone = get_data['telephone'];
        Names = get_data['Names'];
        SchemeID = get_data['SchemeID'];
        is_group = 1;
    }
    if (get_data['prem_units'] != undefined) {
        prem_units = get_data['prem_units'];
        //alert(prem_units);
        console.log(prem_units);
    }

    var ClaimType = SmartLife.ClaimType;
    if (SmartLife.login_type == 3) {
        //pos 
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1;
            //ClaimType = SmartLife.ClaimType.filter(claim => ((claim.AffectGroupLife == "0") && claim.ShowInMicro == 1));
            ClaimType = SmartLife.ClaimType.filter(claim => (claim.ShowInMicro == 1));
            //filter the loanApplicable  investment

        } else {//life
            
            //ClaimType = SmartLife.ClaimType.filter(claim => (claim.AffectGroupLife == "0"));
            ClaimType = SmartLife.ClaimType.filter(claim => (claim.AffectGroupLife == "0" || claim.AffectAll == "1"));
        }

        

    } else if (SmartLife.login_type == 1) {
        //client
        ClaimType = SmartLife.ClaimType.filter(claim => (claim.ShowInClientPortal == "1"));
    } else if (SmartLife.login_type == 4) {
        //group
        ClaimType = SmartLife.ClaimType.filter(claim => (claim.AffectGroupLife == "1" || claim.AffectAll == "1"));
        is_group = 1;
    }

    var fileController = "claims/syncClaimImage";
    if (is_group == 1) {
        fileController = "group/syncClaimGroupImage";
    }
    var uploadUrl = SmartLife.url + fileController + "?req_code=" + req_code + "&eClaimId=" + rcd_id;
    if (is_group == 1) {
        uploadUrl = SmartLife.url + fileController +  "?req_code=" + req_code + "&eClaimId=" + rcd_id;
    }
    var imageURI;

    var is_send_OTP = true;

    //"use strict";
    var formBeneficiaryInstance;
    var formNewBeneficiaryInstance;
    var dxFormOTPInstance;
    var formClaimInstance;
    var formClaimSubmitInstance;
    var ClaimAttachDataSource = [];
    var ViewClaimAttachDataSource = [];
    var BeneficiariesStore = [];
    var is_new_form = true;
    var rowBenefIndex;
    var ClaimBankBranches = [];
    var DependantsStore = [];
    var ClientPolicies = [];

    //vs_matured,vs_death,vs_surrender,vs_loan,vs_partial
    var vs_matured = false;
    var vs_death = false;
    var vs_death_dp = false;
    var vs_surrender = false;
    var vs_loan = false;
    var vs_partial = false;
    var vs_refund = false;



    //mode.payment_mode == "2" || 
    var PayMethods = SmartLife.Paymentinfo.filter(mode => (mode.payment_mode == "4" || mode.payment_mode == "6" || mode.payment_mode == "7" || mode.payment_mode == "9"));

    getPolicy = function (type, client_no) {

        var url = SmartLife.url + type + "client_no=" + client_no;
        console.log(url);
        return $.ajax({
            method: "GET",
            url: url,
            //data: {  },
            timeout: 100000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                DevExpress.ui.notify('An Error Occured', error, 2000);
            }
        });

    };

    claim_type_arr = [{ id: 'PWD', name: 'Partial Withdrawal' }, { id: 'SUR', name: 'Request for Surrender' }];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var viewModel = {
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

        //  Put the binding properties here
        formatDate: function (input) {
            if (input === undefined || input === '') {
                return "";
            } else {
                var yr = input.getFullYear();
                var temp_month = input.getMonth() + 1;
                var month = temp_month < 10 ? '0' + temp_month : temp_month;
                var temp_day = input.getDate();
                var day = temp_day < 10 ? '0' + temp_day : temp_day;
                //var inputs = yr + '-' + month + '-' + day;
                var inputs = month + '/' + day + '/' + yr;
                return inputs;
            }
        },

        formatDates: function (input) {
            if (input === undefined || input === '') {
                return "";
            } else {
                var yr = input.getFullYear();
                var temp_month = input.getMonth() + 1;
                var month = temp_month < 10 ? '0' + temp_month : temp_month;
                var temp_day = input.getDate();
                var day = temp_day < 10 ? '0' + temp_day : temp_day;
                var inputs = yr + '-' + month + '-' + day;
                //var inputs = month + '/' + day + '/' + yr;
                return inputs;
            }
        },
        LoadPanelShown: ko.observable(false),

        //TODO - Get policy details 
        getClientPolicy: function (show_policy) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get client policy"
            });
            get_form.DBget(default_url + "?policy_no=" + policy_no).done(function (result) {

                if (result.success == true) {
                    viewModel.policy_obj(result.PolicyDetails);
                    //if 
                    var index = SmartLife.planinfo.findIndex(function (item) {
                        return item.plan_id === result.PolicyDetails[0]['plan_code'];
                    });

                    if (SmartLife.planinfo[index]['Funeral_cover'] == 1) {
                        //alert("here");
                        //remove PWD and LON
                        let tmpClaimType = SmartLife.ClaimType.filter(claim => (claim.isLoan != "1" && claim.IsPwd != "1"));
                        ClaimType = tmpClaimType;
                        console.log(ClaimType);
                        formClaimInstance.getEditor("claim_type").option("dataSource", ClaimType);
                    }

                    console.log(viewModel.policy_obj());
                    viewModel.LoadPanelShown(false);
                    console.log(result.PolicyDetails[0]['id']);
                    //prem_units = result.PolicyDetails[0]['prem_units'];
                    ////surname,other_name,employee_no,mobile,address,Address2
                    ClientPolicies = result.PolicyDetails;
                    //if (show_policy) { if (SmartLife.login_type==1) 
                    if (formClaimInstance.getEditor("PolicyId") != null)
                        formClaimInstance.getEditor("PolicyId").option("dataSource", ClientPolicies);
                    formClaimInstance.updateData("PolicyId", result.PolicyDetails[0]['id']);
                    formClaimInstance.updateData("name", result.PolicyDetails[0]['name']);
                    formClaimInstance.updateData("mobile", result.PolicyDetails[0]['mobile']);
                    

                    

                    if (formClaimInstance.getEditor("CurrentCashValue") != null && claim_type == "PWD") {
                        //alert(result.PolicyDetails[0]["cashvalue"]);
                        if (is_micro == 1) {
                            formClaimInstance.updateData("CurrentCashValue", parseFloat(result.PolicyDetails[0]["cashvalue"]).toFixed(2));
                            formClaimInstance.updateData("TotalCashValue", parseFloat(result.PolicyDetails[0]["cashvalue"]).toFixed(2));
                        }
                    }



                    if (claim_type != "DTH") {
                        //alert("here");
                        //ClaimantName, ClaimantMobile
                        formClaimInstance.updateData("ClaimantName", result.PolicyDetails[0]['name']);
                        formClaimInstance.updateData("ClaimantMobile", result.PolicyDetails[0]['mobile']);
                        formClaimInstance.updateData("id_type", result.PolicyDetails[0]['id_type']);
                        formClaimInstance.updateData("IdNumber", result.PolicyDetails[0]['IdNumber']);

                        //claim payment details
                        formClaimSubmitInstance.updateData("ClaimDefaultPay_methodD", result.PolicyDetails[0]['ClaimDefaultPay_method']);
                        viewModel.claim_changed_pay_methodD(0, result.PolicyDetails[0]['ClaimDefaultPay_method']);
                        if (formClaimSubmitInstance.getEditor("ClaimDefaultTelcoCompanyD") != null)
                            formClaimSubmitInstance.updateData("ClaimDefaultTelcoCompanyD", result.PolicyDetails[0]['ClaimDefaultTelcoCompany']);
                        if (formClaimSubmitInstance.getEditor("ClaimDefaultMobileWalletD") != null)
                            formClaimSubmitInstance.updateData("ClaimDefaultMobileWalletD", result.PolicyDetails[0]['ClaimDefaultMobileWallet']);
                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBank_codeD") != null)
                            formClaimSubmitInstance.updateData("ClaimDefaultEFTBank_codeD", result.PolicyDetails[0]['ClaimDefaultEFTBank_code']);
                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBankBranchCodeD") != null)
                            formClaimSubmitInstance.updateData("ClaimDefaultEFTBankBranchCodeD", result.PolicyDetails[0]['ClaimDefaultEFTBankBranchCode']);
                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBank_accountD") != null)
                            formClaimSubmitInstance.updateData("ClaimDefaultEFTBank_accountD", result.PolicyDetails[0]['ClaimDefaultEFTBank_account']);
                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEftBankaccountNameD") != null)
                            formClaimSubmitInstance.updateData("ClaimDefaultEftBankaccountNameD", result.PolicyDetails[0]['ClaimDefaultEftBankaccountName']);
                        //formClaimInstance.updateData("other_name", result.ClientPolicies[0]['other_name']);
                        //formClaimInstance.updateData("employee_no", result.ClientPolicies[0]['employee_no']);
                    }
                    //formClaimInstance.updateData("address", result.ClientPolicies[0]['address']);
                    //formClaimInstance.updateData("Address2", result.ClientPolicies[0]['Address2']);
                    //}
                    //alert("here");
                    let data = formClaimInstance.option("formData");
                    //alert("am here");
                    if (data['claim_type'] == "DTH") {
                        //alert(SmartLife.planinfo[index]['HasFuneralMembers']);
                        if (SmartLife.planinfo[index]['HasFuneralMembers'] == 1 || SmartLife.planinfo[index]['HasFuneralMembers'] == "1") {
                            //alert("here");
                            vs_death_dp = true;
                            formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", true);
                            viewModel.refresh_dataSources();
                            //TODO - get the funeral members here...
                            viewModel.getPolicyDependants(result.PolicyDetails[0]['id'], function (result) {
                                formClaimInstance.updateData(data);
                            });
                            //formClaimInstance.updateData("PolicyId", ClientPolicies[0]['id']);
                        } else {
                            //display beneficiaries 
                            //formClaimInstance.getEditor("PolicyId").option("dataSource", ClientPolicies);
                            formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", false);
                            formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", true);
                            formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", true);
                            viewModel.refresh_dataSources();
                            viewModel.getPolicyBeneficiaries(result.PolicyDetails[0]['id'], function (result) {
                                formClaimInstance.updateData(data);
                            });
                            //formClaimInstance.updateData("PolicyId", ClientPolicies[0]['id']);
                        }
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

        //get claim details 
        get_claim: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings claim"
            });
            let is_micro = 0;
            if (SmartLife.pos_type == 2) is_micro = 1;
            get_form.DBget("claims/getClientClaims?id=" + rcd_id + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    var ClaimResult = result;

                    //get claim attachements first
                    viewModel.LoadPanelShown(true);
                    var get_form = new DB({
                        name: "get existings checklists"
                    });
                    get_form.DBget("claims/getClaimAttachments?claim_type=" + ClaimResult.Claims[0].claim_type).done(function (resultA) {
                        viewModel.LoadPanelShown(false);
                        if (result.success == true) {

                            ClaimAttachDataSource = resultA.Attachments;
                            console.log(ClaimAttachDataSource);
                            viewModel.default_form();
                            viewModel.claimTypeChanged(ClaimResult.Claims[0].claim_type);

                            formClaimInstance.getEditor("PolicyId").option("dataSource", ClientPolicies);

                            //claim_changed_pay_method(0, ClaimResult.Claims[0]['ClaimDefaultPay_method']);

                            $("#dxFormClaimRequest").dxForm({
                                formData: ClaimResult.Claims[0]
                            }).dxForm("instance");
                            $("#dxFormDClaimSubmit").dxForm({
                                formData: ClaimResult.Claims[0]
                            }).dxForm("instance");


                            formClaimInstance.updateData("PolicyId", ClientPolicies[0]['id']);
                            formClaimInstance.updateData("name", viewModel.policy_obj()[0]['name']);
                            formClaimInstance.updateData("mobile", viewModel.policy_obj()[0]['mobile']);

                            if (claim_type != "DTH") {
                                //ClaimantName, ClaimantMobile
                                formClaimInstance.updateData("ClaimantName", result.PolicyDetails[0]['name']);
                                formClaimInstance.updateData("ClaimantMobile", result.PolicyDetails[0]['mobile']);
                                formClaimInstance.updateData("id_type", result.PolicyDetails[0]['id_type']);
                                formClaimInstance.updateData("IdNumber", result.PolicyDetails[0]['IdNumber']);

                                //claim payment details
                                ///formClaimSubmitInstance.updateData("ClaimDefaultPay_methodD", result.PolicyDetails[0]['ClaimDefaultPay_method']);
                                formClaimSubmitInstance.updateData("ClaimDefaultPay_methodD", viewModel.policy_obj()[0]['ClaimDefaultPay_method']);
                                viewModel.claim_changed_pay_methodD(0, viewModel.policy_obj()[0]['ClaimDefaultPay_method']);
                                if (formClaimSubmitInstance.getEditor("ClaimDefaultTelcoCompanyD") != null)
                                    formClaimSubmitInstance.updateData("ClaimDefaultTelcoCompanyD", viewModel.policy_obj()[0]['ClaimDefaultTelcoCompany']);
                                if (formClaimSubmitInstance.getEditor("ClaimDefaultMobileWalletD") != null)
                                    formClaimSubmitInstance.updateData("ClaimDefaultMobileWalletD", viewModel.policy_obj()[0]['ClaimDefaultMobileWallet']);
                                if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBank_codeD") != null)
                                    formClaimSubmitInstance.updateData("ClaimDefaultEFTBank_codeD", viewModel.policy_obj()[0]['ClaimDefaultEFTBank_code']);
                                if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBankBranchCodeD") != null)
                                    formClaimSubmitInstance.updateData("ClaimDefaultEFTBankBranchCodeD", viewModel.policy_obj()[0]['ClaimDefaultEFTBankBranchCode']);
                                if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBank_accountD") != null)
                                    formClaimSubmitInstance.updateData("ClaimDefaultEFTBank_accountD", viewModel.policy_obj()[0]['ClaimDefaultEFTBank_account']);
                                if (formClaimSubmitInstance.getEditor("ClaimDefaultEftBankaccountNameD") != null)
                                    formClaimSubmitInstance.updateData("ClaimDefaultEftBankaccountNameD", viewModel.policy_obj()[0]['ClaimDefaultEftBankaccountName']);
                            }
                        } else {
                            viewModel.show_test(result.msg, 'error');
                        }
                    }).fail(function () {
                        viewModel.LoadPanelShown(false);
                        //alert_dialog("Server not accessible. Check internet connectivity");
                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                    });


                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        policy_obj: ko.observableArray(),
        refresh_btn: function () {
            viewModel.viewShown();
        },
        viewShown: function () {
            //viewModel.LoadPanelShown(true);
            if (SmartLife.login_type == 3) {//POS
                //get policy details..
                //assign value to policy field
                //
                //viewModel.getClientPolicy();

                if (SmartLife.pos_type == 2) default_url = "policy/getMicroPolicyDetails";
                //viewModel.insured_show();
                viewModel.getClientPolicy(false);
                if (rcd_id != undefined && parseInt(rcd_id) > 0) {
                    is_new_form = false;
                    viewModel.get_claim();
                }
            } else if (SmartLife.login_type == 1) {//Client
                //get client policies using clientno
                if (rcd_id != undefined && parseInt(rcd_id) > 0) {
                    is_new_form = false;
                    viewModel.get_claim();
                }
            }
        },

        fetch_client_policies: function () {
            viewModel.LoadPanelShown(true);
            var type = "policy/getPolicyDetails?";
            getPolicy(type, SmartLife.clientno).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.PolicyDetails);
                    ClientPolicies = result.PolicyDetails;
                    //if (show_policy) {
                    formClaimInstance.getEditor("PolicyId").option("dataSource", ClientPolicies);
                    //viewModel.policy_store(result.ClientPolicies);
                } else {
                    DevExpress.ui.dialog.alert(result.msg);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                DevExpress.ui.dialog.alert("Server not accessible.Check internet connectivity...");
            });
        },

        getLoanAmountAvailable: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get the amount available"
            });
            let url = "policy/getMicroLoanAvailable?policy_no=" + policy_no;
            if (is_micro == 1 || vs_partial) {
                url = "policy/getMicroLoanAvailable?policy_no=" + policy_no;
            }
            else if (is_micro == 0 && vs_loan) {
                url = "policy/getClientLifeLoan?policy_no=" + policy_no;
            }
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    let AmountAvailable = result.AmountAvailable;
                    if (formClaimInstance.getEditor("CurrentCashValue") != null)
                        formClaimInstance.updateData("CurrentCashValue", AmountAvailable);
                    if (formClaimInstance.getEditor("TotalCashValue") != null)
                        formClaimInstance.updateData("TotalCashValue", AmountAvailable);
                    if (formClaimInstance.getEditor("TotalLoanValue") != null)
                        formClaimInstance.updateData("TotalLoanValue", AmountAvailable);
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

        rcd_id: ko.observable(rcd_id),

        default_form: function () {
            is_send_OTP = true;
            formClaimInstance.itemOption("PolicyId", "visible", false);//
            formClaimInstance.itemOption("LoanType", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);

            formClaimInstance.itemOption("INSURED DETAILS.name", "visible", true);
            formClaimInstance.itemOption("INSURED DETAILS.mobile", "visible", true);
            formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", false);

            //ClaimCause, event_date, PartialWithdPurpose, PreviousloanAmount, CurrentCashValue, UsePercentage, AmountAppliedFor, 
            //PercentageappliedFor, ClaimCause, PremUnits, PaymentOptions, 

            formClaimInstance.itemOption("CLAIM DETAILS.RequestDate", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PartialWithdPurpose", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.TotalCashValue", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.TotalLoanValue", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.CurrentCashValue", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.UsePercentage", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PercentageappliedFor", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PremUnits", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.AmountAppliedFor", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PreviousloanAmount", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.isPolicyHolderDeath", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.dependants", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.ClaimCause", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.event_date", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.DoctorName", "visible", false);

            formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
            formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
            if (is_group == 1) {
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", false);//the only true ones
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", false);//the only true ones
            }

            formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", true);
            formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", true);
            if (is_group == 1) {
                formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", false);
                formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", false);
            }

            formClaimInstance.itemOption("CLAIM DETAILS.TermInMonths", "visible", false);

            formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", true);
            formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", true);
            formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultPay_method", "visible", false);
            formClaimSubmitInstance.itemOption("LoanStartDate", "visible", false);
            formClaimSubmitInstance.itemOption("Reason", "visible", true);
            

            if (is_group == 1) {
                formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", false);
                formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", false);
                formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                formClaimSubmitInstance.itemOption("Reason", "visible", false);
            }

            formClaimSubmitInstance.itemOption("PayMethod", "visible", false);

            //formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
            //formClaimSubmitInstance.itemOption("attachements", "visible", false);
        },

        refresh_dataSources: function () {
            //ClientPolicies
            if (formClaimInstance.getEditor("beneficiaries") != null)
                formClaimInstance.getEditor("beneficiaries").option("dataSource", BeneficiariesStore);
            if (formClaimInstance.getEditor("PolicyId") != null)
                formClaimInstance.getEditor("PolicyId").option("dataSource", ClientPolicies);
            if (formClaimInstance.getEditor("dependant") != null)
                formClaimInstance.getEditor("dependant").option("dataSource", DependantsStore);
            if (formClaimSubmitInstance.getEditor("attachements") != null)
                formClaimSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
            if (formClaimSubmitInstance.getEditor("ViewAttachements") != null)
                formClaimSubmitInstance.getEditor("ViewAttachements").option("dataSource", ViewClaimAttachDataSource);
            if (formClaimInstance.getEditor("LoanType") != null)
                formClaimInstance.getEditor("LoanType").option("dataSource", GlifeLoanTypesinfo);
        },

        default_vs: function () {
            //vs_matured,vs_death,vs_surrender,vs_loan,vs_partial,vs_refund
            vs_matured = false;
            vs_death = false;
            vs_surrender = false;
            vs_loan = false;
            vs_partial = false;
            vs_refund = false;
        },

        claimTypeChanged: function (value) {
            //vs_matured,vs_death,vs_surrender,vs_loan,vs_partial
            //to for partial first attachements
            viewModel.default_vs();
            if (value == "PWD" || value == "LON") {//partial and loan

                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.RequestDate", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PartialWithdPurpose", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.CurrentCashValue", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.AmountAppliedFor", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);//
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //console.log(ClaimAttachDataSource);


                //PreviousloanAmount
                if (value == "LON") {
                    vs_loan = true;
                    formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", false);
                    //assign docs manually here
                    //ClaimAttachDataSource = [{ id: '14', description: 'POLICY DOCUMENTS' }, { id: '15', description: 'NOTIFICATION' }, { id: '16', description: 'DEATH CERTIFICATE' }];
                    formClaimInstance.itemOption("CLAIM DETAILS.TotalLoanValue", "visible", true);
                    formClaimInstance.itemOption("CLAIM DETAILS.PreviousloanAmount", "visible", true);
                    formClaimInstance.itemOption("CLAIM DETAILS.TermInMonths", "visible", true);
                    formClaimSubmitInstance.itemOption("LoanDefaultPay_method", "visible", true);
                    formClaimSubmitInstance.itemOption("LoanStartDate", "visible", true);
                    viewModel.getLoanAmountAvailable();
                } else {
                    formClaimInstance.itemOption("CLAIM DETAILS.TotalCashValue", "visible", true);
                    vs_partial = true;
                    if (is_micro == 0 && is_group == 0) {
                        viewModel.getLoanAmountAvailable();
                    }
                }
                //formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", true);
                //formClaimSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
            }
            if (value == "DDF") {//
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.dependants", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
            }
            //death claim
            if (value == "DTH") {//death
                is_send_OTP = false;
                vs_death = true;
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                formClaimInstance.itemOption("PolicyId", "visible", true);
                //ClaimantName,ClaimantMobile
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
                formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", false);

                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
                //formClaimSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
                formClaimInstance.itemOption("CLAIM DETAILS.dependants", "visible", true);
                formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", false);
                //
                formClaimInstance.itemOption("INSURED DETAILS.isPolicyHolderDeath", "visible", true);
                formClaimInstance.itemOption("INSURED DETAILS.dependants", "visible", false);
                formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimCause", "visible", true);//
                formClaimInstance.itemOption("CLAIM DETAILS.DoctorName", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.event_date", "visible", true);
                formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", false);

                formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", false);
                formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", false);

                //formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", true);
                //formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", true);
                //formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
                //formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
                //formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", true);
                //formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", true);
                //formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", true);
                //formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", false);
                //formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);

                //ClaimantName, ClaimantMobile
                formClaimInstance.updateData("ClaimantName", '');
                formClaimInstance.updateData("ClaimantMobile", '');
                formClaimInstance.updateData("id_type", '');
                formClaimInstance.updateData("IdNumber", '');
                
            }

            //matured MAT, surrender SUR, refund, REF, REP, RFD, RFE, RFU
            if (value == "CBK") {//CASH IN CLAIMS
                vs_matured = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "HCI") {//HOSPITAL CASH INCOME
                vs_matured = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "PA") {//PERSONAL ACCIDENT
                vs_matured = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "PTD") {//PERMANENT TOTAL DISABILITY
                vs_matured = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "MAT") {//matured
                vs_matured = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "SUR") {//surrender
                vs_surrender = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "REF") {//refund
                vs_refund = true;
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "REP") {//REFUND - SUSPENSE ACCOUNT(PROPOSAL)
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "RFD") {//WRONGFUL REFUND (FROM BANKS)
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "RFE") {//CANCELLATION (WITHING COOL OFF PERIOD)
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
            if (value == "RFU") {//WRONGFUL REFUND (FROM EMPLOYER)
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                //formClaimSubmitInstance.itemOption("attachements", "visible", true);
            }
        },

        default_values: function () {
            formClaimInstance.updateData("PolicyId", null);
            formClaimInstance.updateData("PartialWithdPurpose", null);
            formClaimInstance.updateData("TotalCashValue", 0);
            formClaimInstance.updateData("TotalLoanValue", 0);
            formClaimInstance.updateData("CurrentCashValue", 0);
            formClaimInstance.updateData("AmountAppliedFor", 0);
            formClaimInstance.updateData("PreviousloanAmount", 0);
        },

        default_display: function () {
            formClaimInstance.itemOption("PolicyId", "visible", false);//
            formClaimInstance.itemOption("LoanType", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.name", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.mobile", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);
            formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", false);


            formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
            formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
            if (is_group == 1) {
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", false);
                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", false);
            }

            formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", true);
            formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", true);
            if (is_group == 1) {
                formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", false);
                formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", false);
            }


            formClaimInstance.itemOption("CLAIM DETAILS.dependants", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.RequestDate", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PartialWithdPurpose", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.TotalCashValue", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.TotalLoanValue", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.CurrentCashValue", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.AmountAppliedFor", "visible", false);
            //formClaimSubmitInstance.itemOption("attachements", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.PreviousloanAmount", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.TermInMonths", "visible", false);
            formClaimInstance.itemOption("CLAIM DETAILS.DoctorName", "visible", false);

            formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultPay_method", "visible", false);
            formClaimSubmitInstance.itemOption("LoanStartDate", "visible", false);
            formClaimSubmitInstance.itemOption("Reason", "visible", true);
            if (is_group == 1) {
                formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                formClaimSubmitInstance.itemOption("Reason", "visible", false);
            }


        },
        //surname,other_name,employee_no,mobile,address,Address2
        insured_show: function () {
            //formClaimInstance.itemOption("INSURED DETAILS.surname", "visible", true);//
            formClaimInstance.itemOption("INSURED DETAILS.name", "visible", true);
            //formClaimInstance.itemOption("INSURED DETAILS.employee_no", "visible", true);
            formClaimInstance.itemOption("INSURED DETAILS.mobile", "visible", true);
            //formClaimInstance.itemOption("INSURED DETAILS.address", "visible", true);
            //formClaimInstance.itemOption("INSURED DETAILS.Address2", "visible", true);
        },

        policy_changed: function (val) {
            //get the sum_assured here
            if (SmartLife.login_type == 1) {//client
                for (let i = 0; i < ClientPolicies.length; i++) {
                    if (ClientPolicies[i].id.toString() == val.toString()) {
                        let data = formClaimInstance.option("formData");
                        let sum_assured = ClientPolicies[i].sa;
                        let CurrentCashValue = viewModel.policy_obj()['cashvalue'];//parseFloat(sum_assured) * 0.05;
                        let PreviousloanAmount = 0;//parseFloat(sum_assured) * 0.01;
                        if (data['claim_type'] == 'PWD' || data['claim_type'] == "LON") formClaimInstance.updateData("CurrentCashValue", parseFloat(CurrentCashValue).toFixed(2));
                        if (data['claim_type'] == 'LON') formClaimInstance.updateData("PreviousloanAmount", parseFloat(PreviousloanAmount).toFixed(2));
                        //show the insured details
                        formClaimInstance.updateData("name", ClientPolicies[i]['name']);
                        formClaimInstance.updateData("mobile", ClientPolicies[i]['mobile']);
                    }
                }
            } else if (SmartLife.login_type == 3) {
                let data = formClaimInstance.option("formData");
                console.log(viewModel.policy_obj());
                //alert("alert I am here");
                //alert(viewModel.policy_obj()[0]['sa']);
                let sum_assured = viewModel.policy_obj()[0]['sa'];
                let CurrentCashValue = viewModel.policy_obj()['cashvalue'];
                let PreviousloanAmount = 0;//parseFloat(sum_assured) * 0.01;
                if (data['claim_type'] == 'PWD' || data['claim_type'] == "LON") {
                    if (data['claim_type'] == "LON") {
                        viewModel.getLoanAmountAvailable();
                    } else {
                        if (is_micro == 1) {
                            formClaimInstance.updateData("CurrentCashValue", parseFloat(CurrentCashValue).toFixed(2));
                        } else {
                            viewModel.getLoanAmountAvailable();
                        }
                    }
                }
                if (data['claim_type'] == 'LON') formClaimInstance.updateData("PreviousloanAmount", parseFloat(PreviousloanAmount).toFixed(2));
            }

        },

        getPolicyBeneficiaries: function (policyId, fn) {

            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing policy beneficiaries"
            });
            get_form.DBget("policy/getPolicyBeneficiaries?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    BeneficiariesStore = result.Beneficiaries;
                    if (formClaimInstance.getEditor("beneficiaries") != null)
                        formClaimInstance.getEditor("beneficiaries").option("dataSource", BeneficiariesStore);
                    fn(true);
                } else {
                    viewModel.show_test(result.msg, 'error');
                    fn(false);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },

        getPolicyDependants: function (policyId, fn) {

            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existing policy dependants"
            });
            get_form.DBget("policy/getPolicyDependants?policyId=" + policyId + "&is_micro=" + is_micro).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    DependantsStore = result.FuneralMembers;
                    if (formClaimInstance.getEditor("dependant") != null)
                        formClaimInstance.getEditor("dependant").option("dataSource", DependantsStore);
                    fn(true);
                } else {
                    viewModel.show_test(result.msg, 'error');
                    fn(false);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });

        },

        claim_type_changed: function (e) {
            //get the files first befor proceeding
            //if (is_new_form) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings checklists"
            });
            get_form.DBget("claims/getClaimAttachments?claim_type=" + e.value).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //viewModel.default_display();
                    //viewModel.default_values();
                    //assign datasource to files
                    ClaimAttachDataSource = result.Attachments;

                    if (ClaimAttachDataSource.length > 0) {
                        formClaimSubmitInstance.itemOption("attachements", "visible", true);
                        formClaimSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
                    }
                    viewModel.default_form();
                    viewModel.claimTypeChanged(e.value);

                    if (SmartLife.login_type == 3) {//POS
                        //get policy details..
                        //assign value to policy field
                        viewModel.insured_show();
                        viewModel.getClientPolicy(true);
                    } else if (SmartLife.login_type == 1) {//Client
                        //get client policies using clientno
                        viewModel.insured_show();
                        viewModel.fetch_client_policies();
                    }

                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        dxFormDClaimRequest: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formClaimInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //
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
                        text: "Claim Type"
                    },
                    colSpan: 2,
                    editorType: "dxLookup",
                    dataField: "claim_type",
                    editorOptions: {
                        fullScreen: true,
                        closeOnOutsideClick: true,
                        dataSource: ClaimType,
                        displayExpr: 'Description',
                        valueExpr: 'claim_type',
                        onValueChanged: function (e) {
                            if(e.value != undefined && e.value != null && e.value != ''){
                                claim_type = e.value;
                                if (is_group == 0) {

                                    if (status_code == "10") {
                                        if (is_micro == 0 && e.value == "SUR" && parseInt(prem_units) < 24) {
                                            formClaimInstance.resetValues();
                                            DevExpress.ui.dialog.alert("Premium units are less than 24. Cannot Proceed with selected Claim Type", "");
                                            return;
                                        }
                                        //proceed with any type
                                        viewModel.claim_type_changed(e);
                                    } else {
                                        if (e.value == "REF" && status_code != "10") {
                                            viewModel.claim_type_changed(e);
                                        } else if (e.value == "MAT" && status_code == "16") {
                                            viewModel.claim_type_changed(e);
                                        }else {
                                            formClaimInstance.resetValues();
                                            DevExpress.ui.dialog.alert("Cannot Proceed with selected Claim Type", "");
                                            return;
                                        }
                                    }

                                } else {
                                    viewModel.default_form();
                                    //formClaimInstance.itemOption("INSURED DETAILS.name", "visible", true);
                                    //formClaimInstance.itemOption("INSURED DETAILS.mobile", "visible", true);

                                    formClaimInstance.updateData("name", Names);
                                    formClaimInstance.updateData("mobile", telephone);


                                    ///////////////claim attachment////////
                                    viewModel.LoadPanelShown(true);
                                    var get_form = new DB({
                                        name: "get existings checklists"
                                    });
                                    get_form.DBget("claims/getClaimAttachments?claim_type=" + e.value).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            //assign datasource to files
                                            ClaimAttachDataSource = result.Attachments;

                                            if (ClaimAttachDataSource.length > 0) {
                                                formClaimSubmitInstance.itemOption("attachements", "visible", true);
                                                formClaimSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
                                            }


                                            //death claim
                                            if (e.value == "DTH") {//death
                                                //vs_death = true;
                                                /*formClaimInstance.itemOption("CLAIM DETAILS.PaymentOptions", "visible", true);
                                                formClaimInstance.itemOption("PolicyId", "visible", true);
                                                //ClaimantName,ClaimantMobile
                                                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
                                                formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
                                                formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                                                
            
                                                formClaimInstance.itemOption("INSURED DETAILS.dependants", "visible", false);
                                                formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);
                                                formClaimInstance.itemOption("CLAIM DETAILS.ClaimCause", "visible", true);*/
                                                formClaimInstance.itemOption("CLAIM DETAILS.event_date", "visible", true);
                                            } else if (e.value == "LON") {
                                                vs_loan = true;
                                                //alert(SchemeID);
                                                formClaimInstance.itemOption("LoanType", "visible", true);
                                                GlifeLoanTypesinfo = SmartLife.GlifeLoanTypesinfo.filter(loan => (loan.Scheme == SchemeID));
                                                viewModel.refresh_dataSources();
                                            } else {
                                                formClaimSubmitInstance.itemOption("PayMethod", "visible", true);
                                            }


                                        } else {
                                            viewModel.show_test(result.msg, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                                    ///////////////end of claim attachments////



                                }
                            }
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Claim Type is required"
                    }]
                },//if group life display loan type....
                {
                    colSpan: 2,
                    label: {
                        text: "Loan Type"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "LoanType",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        showClearButton: true,
                        clearButtonText: 'Clear',
                        dataSource: GlifeLoanTypesinfo,
                        displayExpr: 'LoanTypeDesc',
                        valueExpr: 'ID'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Loan Type is required",
                        validationCallback: function (obj) {
                            if (is_group == 1 && vs_loan) {
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
                },
                {
                    label: {
                        text: "Policy Number"
                    },
                    colSpan: 2,
                    editorType: "dxLookup",
                    dataField: "PolicyId",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: ClientPolicies,//SmartLife.ClientPolicies,
                        displayExpr: 'policy_no',
                        valueExpr: 'id',
                        /*onValueChanged: function (e) {
                            //alert("here I am");
                            //viewModel.policy_changed(e.value);
                            //check if policy obj has funeral members -- HasFuneralMembers
                            alert("changed");
                            let data = formClaimInstance.option("formData");
                            //alert("am here");
                            if (data['claim_type'] == "DTH") {
                                if (viewModel.policy_obj()[0].HasFuneralMembers == 1 || viewModel.policy_obj()[0].HasFuneralMembers == "1") {
                                    vs_death_dp = true;
                                    formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", true);
                                    //TODO - get the funeral members here...
                                    viewModel.getPolicyDependants(e.value, function (result) {
                                        viewModel.refresh_dataSources();
                                        formClaimInstance.updateData(data);
                                    });
                                    //formClaimInstance.updateData("PolicyId", ClientPolicies[0]['id']);
                                } else {
                                    //display beneficiaries 
                                    //formClaimInstance.getEditor("PolicyId").option("dataSource", ClientPolicies);
                                    formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", true);
                                    viewModel.getPolicyBeneficiaries(e.value, function (result) {
                                        viewModel.refresh_dataSources();
                                        formClaimInstance.updateData(data);
                                    });
                                    // formClaimInstance.updateData("PolicyId", ClientPolicies[0]['id']);
                                }
                            }

                        }*/
                    },
                    /*validationRules: [{
                        type: "required",
                        message: "Policy Number is required"
                    }]*/
                    validationRules: [{
                        type: "custom",
                        message: "Policy Number is required",
                        validationCallback: function (obj) {
                            if (is_group != 1) {
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
                },
                /////////////////////////personal details of the insured
                //surname,other_name,employee_no,mobile,address,Address2
                {
                    colSpan: 2,
                    itemType: 'group',
                    caption: 'INSURED DETAILS',
                    colCount: 2,
                    items: [
                    /*{//Full Names
                        label: {
                            text: "Surname"
                        },
                        editorType: "dxTextBox",
                        dataField: "surname",
                        visible: false,
                        editorOptions: {
                            readOnly: true//change this to true later
                        }
                    }, {//Full Names
                        label: {
                            text: "Other Names"
                        },
                        editorType: "dxTextBox",
                        dataField: "other_name",
                        visible: false,
                        editorOptions: {
                            readOnly: true//change this to true later
                        }
                    },*/ {//Full Names
                            label: {
                                text: "Policyholder Names"
                            },
                            editorType: "dxTextBox",
                            dataField: "name",
                            visible: false,
                            editorOptions: {
                                readOnly: true//change this to true later
                            }
                        }, /*{//Staff No - (If applicable)
                        label: {
                            text: "Staff No"
                        },
                        editorType: "dxTextBox",
                        dataField: "employee_no",
                        visible: false,
                        editorOptions: {
                            readOnly: true//change this to true later
                        }
                    },*/ {//Contact details
                            label: {
                                text: "Policyholder Mobile No(SMS Number)"
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
                            visible: false,
                            editorOptions: {
                                readOnly: true//change this to true later
                            }
                        }, {
                            label: {
                                text: "Death on Policy Holder"
                            },
                            editorType: "dxCheckBox",
                            visible: false,
                            dataField: "isPolicyHolderDeath",
                            editorOptions: {
                                onValueChanged: function (e) {
                                    //display the form to change the Claim PayMethods
                                    if (e.value == 1) {
                                        is_send_OTP = false;
                                        formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", false);
                                        formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", false);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", false);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                                        formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", true);
                                        formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", false);
                                        formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", false);
                                        let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                        viewModel.getPolicyBeneficiaries(data['PolicyId'], function (result) {
                                            viewModel.refresh_dataSources();
                                            formClaimInstance.updateData(data);
                                        });

                                        formClaimInstance.updateData("dependant", '');
                                        formClaimInstance.updateData("ClaimantName", '');
                                        formClaimInstance.updateData("ClaimantMobile", '');
                                        formClaimInstance.updateData("id_type", '');
                                        formClaimInstance.updateData("IdNumber", '');

                                        //formClaimInstance.updateData("ClaimantName", viewModel.policy_obj()[0]['name']);

                                    } else {
                                        formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", true);

                                        formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", true);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", true);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", true);
                                        formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", false);
                                        formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);
                                    }
                                    viewModel.refresh_dataSources();
                                }
                            }
                        }, {
                            label: {
                                text: "Dependant"
                            },
                            colSpan: 2,
                            editorType: "dxLookup",
                            dataField: "dependant",
                            visible: false,
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: DependantsStore,
                                displayExpr: 'NameRelationship',
                                valueExpr: 'id',
                                onValueChanged: function (e) {
                                    //check if relationship is self - to display beneficiaries
                                    let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                    var Dependant = DependantsStore.filter(dependant => (dependant.id == e.value));
                                    if (Dependant[0]['Relationship'] == 'SF') {
                                        //display beneficiaries
                                        is_send_OTP = false;
                                        formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", false);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", false);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                                        formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", true);
                                        formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", false);
                                        formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", false);
                                        
                                        viewModel.getPolicyBeneficiaries(e.value, function (result) {
                                            viewModel.refresh_dataSources();
                                            formClaimInstance.updateData(data);
                                        });

                                        formClaimInstance.updateData("dependant", '');
                                        formClaimInstance.updateData("ClaimantName", '');
                                        formClaimInstance.updateData("ClaimantMobile", '');
                                        formClaimInstance.updateData("id_type", '');
                                        formClaimInstance.updateData("IdNumber", '');
                                    } else {
                                        //is_send_OTP = true;

                                        /*formClaimInstance.itemOption("INSURED DETAILS.dependant", "visible", true);

                                        formClaimSubmitInstance.itemOption("isClaimPayChange", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.ClaimantName", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.ClaimantMobile", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.id_type", "visible", true);
                                        formClaimInstance.itemOption("CLAIM DETAILS.IdNumber", "visible", true);
                                        formClaimSubmitInstance.itemOption("ClaimDefaultPay_methodD", "visible", true);
                                        formClaimInstance.itemOption("INSURED DETAILS.btnbeneficiaries", "visible", false);
                                        formClaimInstance.itemOption("INSURED DETAILS.beneficiaries", "visible", false);*/

                                        viewModel.refresh_dataSources();
                                        //formClaimInstance.updateData(data);

                                        console.log(data);
                                        //update the normal details as well
                                        formClaimInstance.updateData("ClaimantName", viewModel.policy_obj()[0]['name']);
                                        formClaimInstance.updateData("ClaimantMobile", viewModel.policy_obj()[0]['mobile']);
                                        formClaimInstance.updateData("id_type", viewModel.policy_obj()[0]['id_type']);
                                        formClaimInstance.updateData("IdNumber", viewModel.policy_obj()[0]['IdNumber']);
                                        formClaimSubmitInstance.updateData("ClaimDefaultPay_methodD", viewModel.policy_obj()[0]['ClaimDefaultPay_method']);
                                        viewModel.claim_changed_pay_methodD(0, viewModel.policy_obj()[0]['ClaimDefaultPay_method']);
                                        if (formClaimSubmitInstance.getEditor("ClaimDefaultTelcoCompanyD") != null)
                                            formClaimSubmitInstance.updateData("ClaimDefaultTelcoCompanyD", viewModel.policy_obj()[0]['ClaimDefaultTelcoCompany']);
                                        if (formClaimSubmitInstance.getEditor("ClaimDefaultMobileWalletD") != null)
                                            formClaimSubmitInstance.updateData("ClaimDefaultMobileWalletD", viewModel.policy_obj()[0]['ClaimDefaultMobileWallet']);
                                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBank_codeD") != null)
                                            formClaimSubmitInstance.updateData("ClaimDefaultEFTBank_codeD", viewModel.policy_obj()[0]['ClaimDefaultEFTBank_code']);
                                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBankBranchCodeD") != null)
                                            formClaimSubmitInstance.updateData("ClaimDefaultEFTBankBranchCodeD", viewModel.policy_obj()[0]['ClaimDefaultEFTBankBranchCode']);
                                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEFTBank_accountD") != null)
                                            formClaimSubmitInstance.updateData("ClaimDefaultEFTBank_accountD", viewModel.policy_obj()[0]['ClaimDefaultEFTBank_account']);
                                        if (formClaimSubmitInstance.getEditor("ClaimDefaultEftBankaccountNameD") != null)
                                            formClaimSubmitInstance.updateData("ClaimDefaultEftBankaccountNameD", viewModel.policy_obj()[0]['ClaimDefaultEftBankaccountName']);
                                    }
                                    //INSURED DETAILS
                                    //formClaimInstance.updateData("dependant", e.value);
                                }
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Dependant is required",
                                validationCallback: function (obj) {
                                    if (vs_death && vs_death_dp) {
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
                            colSpan: 2,
                            itemType: "button",
                            dataField: "btnbeneficiaries",
                            visible:false,
                            buttonOptions: {
                                text: "ADD NEW BENEFECIARY",
                                icon: "plus",
                                type: "danger",
                                onClick: function () {
                                    viewModel.show_new_beneficiary();
                                    //viewModel.pop_beneficiary(true);
                                    //DevExpress.ui.dialog.alert("Feature in Development", "ALERT!");
                                }
                            }
                        }, {
                            colSpan: 2,
                            label: {
                                text: "BENEFICIARIES / NEXT OF KIN (Click Beneficiary to View)"
                            },
                            dataField: "beneficiaries",
                            editorType: "dxDataGrid",
                            visible: false,
                            editorOptions: {
                                dataSource: BeneficiariesStore,
                                readOnly: true,
                                wordWrapEnabled: true,
                                columnHidingEnabled: true,
                                editing: {
                                    allowUpdating: false,
                                    mode: 'form',
                                    allowAdding: false,
                                    allowDeleting: false,
                                },
                                onRowClick: function (e) {
                                    viewModel.show_beneficiary(e);
                                },
                                //Names,relationship,birth_date,perc_alloc,mobile
                                columns: [
                                    {
                                        dataField: 'id',
                                        visible: false
                                    },
                                    {
                                        dataField: 'Names',
                                        caption: 'Fullnames'
                                    }, {
                                        dataField: 'relationship',
                                        caption: 'Relationship',
                                        lookup: {
                                            dataSource: SmartLife.Relationshipinfo, valueExpr: 'code', displayExpr: 'description'
                                        }
                                    }, {
                                        dataField: 'birth_date',
                                        caption: 'Date of Birth',
                                        dataType: 'date'
                                    }, {
                                        dataField: 'perc_alloc',
                                        caption: '% Allocated'
                                    }, {
                                        dataField: 'mobile',
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
                                    },{
                                        dataField: 'Reason',
                                        caption: 'Changes',
                                        allowEditing: false
                                    }
                                    //ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account,
                                    //ClaimDefaultEftBankaccountName
                                    //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail
                                ]
                            }
                        }, /*{//Postal Address
                        label: {
                            text: "Postal Address"
                        },
                        editorType: "dxTextBox",
                        dataField: "address",
                        visible: false,
                        editorOptions: {
                            readOnly: true//change this to true later
                        }
                    }, {//Residential Address
                        label: {
                            text: "Residential Address"
                        },
                        editorType: "dxTextBox",
                        dataField: "Address2",
                        visible: false,
                        editorOptions: {
                            readOnly: true//change this to true later
                        }
                    }*/]
                },
                //////////////////////end of insured details
                {
                    colSpan: 2,
                    itemType: 'group',
                    caption: 'CLAIM DETAILS',
                    colCount: 2,
                    //ClaimantName,ClaimantMobile
                    items: [
                        {//PreviousloanAmount
                            label: {
                                text: "Claimant Name",
                                style: {
                                    color: "red", // Set the font color to dark blue
                                    // Add any other desired styles here
                                }
                            },
                            editorType: "dxTextBox",
                            dataField: "ClaimantName",
                            visible: false,
                            editorOptions: {
                                readOnly: false//change this to true later
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Claimant Name is required",
                                validationCallback: function (obj) {
                                    if (vs_death) {
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
                        }, {//PreviousloanAmount
                            label: {
                                text: "Claimant Mobile No",
                            },
                            editorType: "dxTextBox",
                            dataField: "ClaimantMobile",
                            visible: false,
                            editorOptions: {
                                attr: { style: "background-color: red" },
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
                                type: "custom",
                                message: "Claimant Mobile No is required",
                                validationCallback: function (obj) {
                                    if (vs_death) {
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
                                text: "Identity Type"
                            },
                            editorType: "dxLookup",
                            dataField: "id_type",
                            visible: false,
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
                            visible: false,
                            dataField: "IdNumber",
                            validationRules: [{
                                type: "required",
                                message: "Identity No is required"
                            }]
                        }, {
                            label: {
                                text: "Claim Cause"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "ClaimCause",
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.ClaimCause,
                                displayExpr: 'Description',
                                valueExpr: 'claim_cause_code'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Claim Cause is required",
                                validationCallback: function (obj) {
                                    if (vs_death) {
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
                                text: "Date of Death"
                            },
                            editorType: "dxDateBox",
                            visible: false,
                            dataField: "event_date",
                            editorOptions: {
                                displayFormat: 'dd/MM/yyyy',
                                onValueChanged: function (e) {
                                    var selectedDate = e.value;
                                    var currentDate = new Date();

                                    // Compare the selected date with the current date
                                    if (selectedDate > currentDate) {
                                        // Show an error message or handle the situation as needed
                                        //alert("Future dates are not allowed.");
                                        DevExpress.ui.dialog.alert("Future dates are not allowed", "ALERT!");
                                        e.component.option("value", null); // Reset the value
                                    }
                                }
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Date of Death is required",
                                validationCallback: function (obj) {
                                    if (vs_death) {
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
                                text: "Hospital / Doctor"
                            },
                            editorType: "dxTextBox",
                            visible: false,
                            dataField: "DoctorName",
                            editorOptions: {
                                /*closeOnOutsideClick: true,
                                dataSource: SmartLife.Doctors,
                                displayExpr: 'name',
                                valueExpr: 'doctor_code'*/
                            },
                            /*validationRules: [{
                                type: "custom",
                                message: "Doctor is required",
                                validationCallback: function (obj) {
                                    if (vs_death) {
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
                        }//
/*, {
                    label: {
                        text: "Request Date"
                    },
                    editorType: "dxDateBox",
                    visible: false,
                    dataField: "RequestDate",
                    validationRules: [{
                        type: "required",
                        message: "Disease Date is required"
                    }]
                }*/, {
                            label: {
                                text: "Purpose"//Loan Reason 
                            },

                            editorType: "dxLookup",
                            dataField: "PartialWithdPurpose",
                            visible: false,
                            editorOptions: {
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.PartialWithdrawalPurposes,
                                displayExpr: 'Description',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Purpose is required",
                                validationCallback: function (obj) {
                                    if (vs_loan || vs_partial) {
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
                        }, {//PreviousloanAmount
                            label: {
                                text: "Previous Loan Amount"
                            },
                            editorType: "dxNumberBox",
                            dataField: "PreviousloanAmount",
                            visible: false,
                            editorOptions: {
                                readOnly: true//change this to true later
                            },
                            /*validationRules: [{
                                type: "custom",
                                message: "Previous Loan Amount is required",
                                validationCallback: function (obj) {
                                    if (vs_loan) {
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
                        }, {//PreviousloanAmount
                            label: {
                                text: "Total Cash Value"
                            },
                            editorType: "dxNumberBox",
                            dataField: "TotalCashValue",
                            visible: false,
                            editorOptions: {
                                readOnly: true,//change this to true later
                                format: "#,##0.00"
                            },
                            /*validationRules: [{
                                type: "custom",
                                message: "Total Cash Value is required",
                                validationCallback: function (obj) {
                                    if (vs_partial) {
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
                        }, {//PreviousloanAmount
                            label: {
                                text: "Total Loan Value"
                            },
                            editorType: "dxNumberBox",
                            dataField: "TotalLoanValue",
                            visible: false,
                            editorOptions: {
                                readOnly: true,//change this to true later
                                format: "#,##0.00"
                            },
                            /*validationRules: [{
                                type: "custom",
                                message: "Total Loan Value is required",
                                validationCallback: function (obj) {
                                    if (vs_loan) {
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
                        }, {//PreviousloanAmount
                            label: {
                                text: "Amount Available"
                            },
                            editorType: "dxNumberBox",
                            dataField: "CurrentCashValue",
                            visible: false,
                            editorOptions: {
                                readOnly: true,//change this to true later
                                format: "#,##0.00"
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Amount Available is required",
                                validationCallback: function (obj) {
                                    if (vs_loan || vs_partial) {
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
                        },
                        {
                            label: {
                                text: "Use Percentage"
                            },
                            editorType: "dxCheckBox",
                            visible: false,
                            dataField: "UsePercentage",
                        }, {
                            label: {
                                text: "Requested Amount"
                            },
                            editorType: "dxNumberBox",
                            visible: false,
                            dataField: "AmountAppliedFor",
                            editorOptions: {
                                onValueChanged: function (e) {
                                    //check if the value is less than equal to amountavaliable(currentcashvalue);
                                    let data = formClaimInstance.option("formData");
                                    if (parseFloat(e.value) > data['CurrentCashValue']) {
                                        //clear the value and alert
                                        formClaimInstance.updateData("AmountAppliedFor", 0);
                                        DevExpress.ui.dialog.alert("Amount Applied for should be less than Amount Available", "SAVED");
                                    }
                                }
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Requested Amount is required",
                                validationCallback: function (obj) {
                                    if (vs_loan || vs_partial) {
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
                                text: "Percentage Applied"
                            },
                            editorType: "dxNumberBox",
                            visible: false,
                            dataField: "PercentageappliedFor",
                        }, {
                            label: {
                                text: "Premium Units"
                            },
                            editorType: "dxNumbertBox",
                            visible: false,
                            dataField: "PremUnits",
                            editorOptions: {
                                readOnly: true
                            },
                        }, {//PreviousloanAmount
                            label: {
                                text: "Term of Loan (Months)"
                            },
                            editorType: "dxNumberBox",
                            dataField: "TermInMonths",
                            visible: false,
                            editorOptions: {
                                readOnly: false//change this to true later
                            }
                        }, {
                            label: {
                                text: "Payment Option"
                            },
                            editorType: "dxLookup",
                            visible: false,
                            dataField: "PaymentOptions",
                            editorOptions: {
                                value: '3',
                                closeOnOutsideClick: true,
                                dataSource: SmartLife.ClaimPaymentOptions,
                                displayExpr: 'description',
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "custom",
                                message: "Payment Option is required",
                                validationCallback: function (obj) {
                                    if (!vs_death) {
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
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            colSpan: 2,
                            itemType: "empty"
                        }, {
                            itemType: "empty"
                        }, {
                            itemType: "button",
                            buttonOptions: {
                                text: "NEXT →",
                                width: '120',
                                horizontalAlignment: "right",
                                type: "default",
                                onClick: function (args) {

                                    if (is_group == 1) {

                                        //navnextPrev(1);


                                        //data['user_id'] = SmartLife.pos_name;
                                        let data = formClaimInstance.option("formData");
                                        Object.assign(data, formClaimSubmitInstance.option("formData"));
                                        data['member_no'] = member_no;
                                        if (data['event_date'] != undefined && data['event_date'] != '' && data['event_date'] != null) data['event_date'] = viewModel.formatDates(new Date(data['event_date']));
                                        //if (result.isValid) {
                                        //post data here
                                        ///post data form as it is
                                        viewModel.LoadPanelShown(true);
                                        let get_life = new DB({
                                            name: "submitting the form"
                                        });
                                        //let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                        console.log(data);
                                        get_life.DBpost("claims/insertGroupClaimEntries", data).done(function (result) {
                                            viewModel.LoadPanelShown(false);
                                            if (result.success == true) {
                                                console.log(result.claim_id);
                                                if (rcd_id == undefined || rcd_id == '') {
                                                    rcd_id = result.claim_id;
                                                    viewModel.rcd_id(rcd_id);
                                                    console.log(viewModel.rcd_id());
                                                    if (ClaimAttachDataSource.length > 0) {
                                                        formClaimInstance.updateData("id", rcd_id);
                                                        let attachments_arr = ClaimAttachDataSource.map(obj => ({ ...obj, ['rcd_id']: rcd_id }));
                                                        formClaimSubmitInstance.getEditor("attachements").option("dataSource", attachments_arr);
                                                    }
                                                }
                                                //navigate to the my applications screen
                                                //SmartLife.app.back();
                                                navnextPrev(1);
                                            } else {
                                                viewModel.show_test(result.msg, 'error');
                                            }
                                        }).fail(function () {
                                            viewModel.LoadPanelShown(false);
                                            viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                        });

                                    } else {

                                        //alter the array depending on the form
                                        //qn_intermediary, fm_health_intermediary;
                                        
                                        var result = args.validationGroup.validate();
                                        let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                        var PolicyId = data['PolicyId'];
                                        if (is_micro == 1) {
                                            data['MicroPolicy'] = data['PolicyId'];
                                            //data['PolicyId'] = null;
                                        }
                                        data['user_id'] = SmartLife.pos_name;
                                        if (data['event_date'] != undefined && data['event_date'] != '' && data['event_date'] != null) data['event_date'] = viewModel.formatDates(new Date(data['event_date']));
                                        if (result.isValid) {
                                            //post data here
                                            ///post data form as it is
                                            viewModel.LoadPanelShown(true);
                                            let get_life = new DB({
                                                name: "submitting the form"
                                            });
                                            //let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                            console.log(data);
                                            get_life.DBpost("claims/insertClaimEntries", data).done(function (result) {
                                                viewModel.LoadPanelShown(false);
                                                if (result.success == true) {
                                                    console.log(result.claim_id);
                                                    if (rcd_id == undefined || rcd_id == '') {
                                                        rcd_id = result.claim_id;
                                                        viewModel.rcd_id(rcd_id);
                                                        console.log(viewModel.rcd_id());
                                                        if (ClaimAttachDataSource.length > 0) {
                                                            formClaimInstance.updateData("id", rcd_id);
                                                            ClaimAttachDataSource = ClaimAttachDataSource.map(obj => ({ ...obj, ['rcd_id']: rcd_id }));
                                                            console.log(ClaimAttachDataSource);
                                                            formClaimSubmitInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
                                                            //viewModel.getAttachedFiles();
                                                        }
                                                    } 

                                                    viewModel.getAttachedFiles();

                                                    //if death claim and beneficiaries is not null then perform the endorsement
                                                    if (claim_type == "DTH" && formClaimInstance.getEditor("beneficiaries") != null) {
                                                        var endorsement_data = { id: rcd_id, PolicyNumber: PolicyId, is_from_claims:1 };
                                                        if (is_micro == 1) {
                                                            endorsement_data = { id: rcd_id, MicroPolicy: PolicyId, is_from_claims: 1 };
                                                        }
                                                        let BeneficiariesStore = formClaimInstance.getEditor('beneficiaries').option('dataSource');
                                                        tableData = {
                                                            tableData: JSON.stringify(endorsement_data),
                                                            beneficiaries: JSON.stringify(BeneficiariesStore)
                                                        };
                                                        viewModel.LoadPanelShown(true);
                                                        let get_life = new DB({
                                                            name: "submitting endorsement"
                                                        });

                                                        console.log(tableData);
                                                        get_life.DBpost("policy/saveEndorsement", tableData).done(function (result) {
                                                            viewModel.LoadPanelShown(false);
                                                            if (result.success == true) {
                                                                navnextPrev(1);
                                                            } else {
                                                                viewModel.show_test(result.msg, 'error');
                                                            }
                                                        }).fail(function () {
                                                            viewModel.LoadPanelShown(false);
                                                            viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                                        });
                                                    } else {
                                                        navnextPrev(1);
                                                    }
                                                            

                                                    //navigate to the my applications screen
                                                    //SmartLife.app.back();
                                                    
                                                } else {
                                                    viewModel.show_test(result.msg, 'error');
                                                }
                                            }).fail(function () {
                                                viewModel.LoadPanelShown(false);
                                                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                            });
                                        }

                                    }


                                }
                            }
                        }]
                }]
        },

        getAttachedFiles: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get attached Files"
            });
            get_form.DBget("claims/getClaimFiles?rcd_id=" + rcd_id).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //assign datasource to files
                    ViewClaimAttachDataSource = result.Files;
                    formClaimSubmitInstance.getEditor("ViewAttachements").option("dataSource", ViewClaimAttachDataSource);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        claim_default_pay_method: function () {
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_code", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_account", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultTelcoCompany", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultMobileWallet", "visible", false);
        },

        claim_default_pay_methodD: function () {
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_codeD", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultEFTBankBranchCodeD", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_accountD", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultEftBankaccountNameD", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultTelcoCompanyD", "visible", false);
            formClaimSubmitInstance.itemOption("ClaimDefaultMobileWalletD", "visible", false);
        },

        loan_default_pay_method: function () {
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            //LoanPaySource, LoanStaffNo
            formClaimSubmitInstance.itemOption("LoanPaySource", "visible", false);
            formClaimSubmitInstance.itemOption("LoanStaffNo", "visible", false);

            formClaimSubmitInstance.itemOption("LoanDefaultEFTBank_code", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultEFTBankBranchCode", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultEFTBank_account", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultEftBankaccountName", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultTelcoCompany", "visible", false);
            formClaimSubmitInstance.itemOption("LoanDefaultMobileWallet", "visible", false);
        },

        loan_changed_pay_method: function (val) {
            let data = formClaimSubmitInstance.option("formData");
            viewModel.loan_default_pay_method();
            if (val == "7" || val == "9") {//standing order
                formClaimSubmitInstance.itemOption("LoanDefaultEFTBank_code", "visible", true);
                formClaimSubmitInstance.itemOption("LoanDefaultEFTBankBranchCode", "visible", true);
                formClaimSubmitInstance.itemOption("LoanDefaultEFTBank_account", "visible", true);
                formClaimSubmitInstance.itemOption("LoanDefaultEftBankaccountName", "visible", true);
            }
            if (val == "2") {//PaySource
                formClaimSubmitInstance.itemOption("LoanPaySource", "visible", true);
                formClaimSubmitInstance.itemOption("LoanStaffNo", "visible", true);
            }
            if (val == "6") {//MOMO
                formClaimSubmitInstance.itemOption("LoanDefaultTelcoCompany", "visible", true);
                formClaimSubmitInstance.itemOption("LoanDefaultMobileWallet", "visible", true);
            }

            viewModel.refresh_dataSources();
            formClaimSubmitInstance.updateData(data);
        },

        claim_default_benef_pay_method: function () {
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_code", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_account", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultTelcoCompany", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultMobileWallet", "visible", false);
        },
        claim_default_benef_pay_methodD: function () {
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_codeD", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultEFTBankBranchCodeD", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_accountD", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultEftBankaccountNameD", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultTelcoCompanyD", "visible", false);
            formBeneficiaryInstance.itemOption("ClaimDefaultMobileWalletD", "visible", false);
        },

        claim_default_new_benef_pay_method: function () {
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            formNewBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_code", "visible", false);
            formNewBeneficiaryInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", false);
            formNewBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_account", "visible", false);
            formNewBeneficiaryInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", false);
            formNewBeneficiaryInstance.itemOption("ClaimDefaultTelcoCompany", "visible", false);
            formNewBeneficiaryInstance.itemOption("ClaimDefaultMobileWallet", "visible", false);
        },

        claim_changed_pay_method: function (type, val) {
            //alert(val);
            //TODO- make visible or not here
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            if (type == 0) {
                let data = formClaimSubmitInstance.option("formData");
                viewModel.claim_default_pay_method();
                if (val == "7" || val == "9" || val == "4") {//standing order
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_code", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_account", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", true);
                }
                if (val == "6") {//MOMO
                    formClaimSubmitInstance.itemOption("ClaimDefaultTelcoCompany", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultMobileWallet", "visible", true);
                }

                viewModel.refresh_dataSources();
                formClaimSubmitInstance.updateData(data);

                //tabsInstance.option("selectedIndex", 1);
            } else if (type == 1) {
                let data = formBeneficiaryInstance.option("formData");
                viewModel.claim_default_benef_pay_method();
                if (val == "7" || val == "9" || val == "4") {//standing order
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
            } else if (type == 2) {
                let data = formNewBeneficiaryInstance.option("formData");
                viewModel.claim_default_new_benef_pay_method();
                if (val == "7" || val == "9" || val == "4") {//standing order
                    formNewBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_code", "visible", true);
                    formNewBeneficiaryInstance.itemOption("ClaimDefaultEFTBankBranchCode", "visible", true);
                    formNewBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_account", "visible", true);
                    formNewBeneficiaryInstance.itemOption("ClaimDefaultEftBankaccountName", "visible", true);
                }
                if (val == "6") {//MOMO
                    formNewBeneficiaryInstance.itemOption("ClaimDefaultTelcoCompany", "visible", true);
                    formNewBeneficiaryInstance.itemOption("ClaimDefaultMobileWallet", "visible", true);
                }
                formNewBeneficiaryInstance.updateData(data);
            }
        },

        claim_changed_pay_methodD: function (type, val) {
            //alert(val);
            //TODO- make visible or not here
            //ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, 
            //ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
            if (type == 0) {
                let data = formClaimSubmitInstance.option("formData");
                viewModel.claim_default_pay_methodD();
                if (val == "7" || val == "9" || val == "4") {//standing order
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_codeD", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBankBranchCodeD", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEFTBank_accountD", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultEftBankaccountNameD", "visible", true);
                }
                if (val == "6") {//MOMO
                    formClaimSubmitInstance.itemOption("ClaimDefaultTelcoCompanyD", "visible", true);
                    formClaimSubmitInstance.itemOption("ClaimDefaultMobileWalletD", "visible", true);
                }

                viewModel.refresh_dataSources();
                formClaimSubmitInstance.updateData(data);

                //tabsInstance.option("selectedIndex", 1);
            } else if (type == 1) {
                let data = formBeneficiaryInstance.option("formData");
                viewModel.claim_default_benef_pay_methodD();
                if (val == "7" || val == "9" || val == "4") {//standing order
                    formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_codeD", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultEFTBankBranchCodeD", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultEFTBank_accountD", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultEftBankaccountNameD", "visible", true);
                }
                if (val == "6") {//MOMO
                    formBeneficiaryInstance.itemOption("ClaimDefaultTelcoCompanyD", "visible", true);
                    formBeneficiaryInstance.itemOption("ClaimDefaultMobileWalletD", "visible", true);
                }
                viewModel.refresh_dataSources();
                formBeneficiaryInstance.updateData(data);
            }
        },


        dxFormDClaimSubmit: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formClaimSubmitInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //
            items: [
                {
                    label: {
                        text: "Claim Payment Method"
                    },
                    editorType: "dxLookup",
                    dataField: "PayMethod",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: [{ id: 1, name: 'Pay Scheme' }, { id: 2, name: 'Pay Beneficiary' }, { id: 3, name: 'Pay Member' }],
                        displayExpr: 'name',
                        value: 3,
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //viewModel.claim_changed_pay_method(0, e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Payment Method is required"
                    }]
                },
            ////display the default paymethods..
                {
                    label: {
                        text: "Claim Payment Method"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultPay_methodD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: PayMethods,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.claim_changed_pay_methodD(0, e.value);
                        }
                    }
                },//ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code,
                //ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
                {
                    label: {
                        text: "Claim DefaultBank"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_codeD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "Claim Default Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultEFTBankBranchCodeD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.BanksBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    }
                }, {//SmartLife.
                    label: {
                        text: "Claim Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_accountD",
                    editorOptions: {
                        readOnly: true
                    }
                }, {
                    label: {
                        text: "Claim Default Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultTelcoCompanyD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    }
                }, {
                    label: {
                        text: "Claim Default MOMO Number"
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        readOnly: true,
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
                    dataField: "ClaimDefaultMobileWalletD"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },
            /////end of display of default paymethods..
                {
                    label: {
                        text: "Change Claim PayMethod"
                    },
                    editorType: "dxCheckBox",
                    visible: true,
                    dataField: "isClaimPayChange",
                    editorOptions: {
                        onValueChanged: function (e) {
                            //display the form to change the Claim PayMethods
                            if (e.value == 1) {
                                formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", true);
                            } else {
                                formClaimSubmitInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                            }
                            viewModel.refresh_dataSources();
                        }
                    }
                },{
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },
                {
                    label: {
                        text: "Claim Payment Method"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultPay_method",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: PayMethods,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.claim_changed_pay_method(0, e.value);
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
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "Claim Default Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultEFTBankBranchCode",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.BanksBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    }
                }, {//SmartLife.
                    label: {
                        text: "Claim Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_account"
                }, {
                    label: {
                        text: "Claim Default Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultTelcoCompany",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    }
                }, {
                    label: {
                        text: "Claim Default MOMO Number"
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
                    dataField: "ClaimDefaultMobileWallet"
                },
                
                {
                    label: {
                        text: "Claim Payment Method"
                    },
                    editorType: "dxLookup",
                    dataField: "PayMethod",
                    visible: false,
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: [{ id: 1, name: 'Pay Scheme' }, { id: 2, name: 'Pay Beneficiary' }, { id: 3, name: 'Pay Member' }],
                        displayExpr: 'name',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //viewModel.claim_changed_pay_method(0, e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Payment Method is required"
                    }]
                },
                ////////////////////Loan Repayment///////////////////////////
                {
                    label: {
                        text: "Loan Re-Payment Method"
                    },
                    editorType: "dxLookup",
                    dataField: "LoanDefaultPay_method",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Paymentinfo,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.loan_changed_pay_method(e.value);
                        }
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Loan Re-Payment Method is required",
                        validationCallback: function (obj) {
                            if (vs_loan) {
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
                    dataField: "LoanPaySource",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Employerinfo,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    },
                }, {
                    label: {
                        text: "Staff Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "LoanStaffNo"
                },//ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code,
                //ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account, ClaimDefaultEftBankaccountName, 
                
                {
                    label: {
                        text: "Loan DefaultBank"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "LoanDefaultEFTBank_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id'
                    }
                }, {
                    label: {
                        text: "Loan Default Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "LoanDefaultEFTBankBranchCode",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.BanksBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    }
                }, {//SmartLife.
                    label: {
                        text: "Loan Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "LoanDefaultEFTBank_account"
                }, {
                    label: {
                        text: "Loan Default Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "LoanDefaultTelcoCompany",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    }
                }, {
                    label: {
                        text: "Loan Default MOMO Number"
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
                    dataField: "LoanDefaultMobileWallet"
                }
                //////////////////////////////////Loan Repayment////////////
                , {
                    label: {
                        text: "Loan Repayment Start Date"
                    },
                    editorType: "dxDateBox",
                    visible: false,
                    dataField: "LoanStartDate",
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Loan Repayment Start Date is required",
                        validationCallback: function (obj) {
                            if (vs_loan) {
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
                }
                , {
                    colSpan: 2,
                    label: {
                        text: "Diary"
                    },
                    editorType: "dxTextArea",
                    editorOptions: {
                        readOnly: false
                    },
                    dataField: "Reason",
                    /*validationRules: [{
                        type: "required",
                        message: "Diary / Narration is required"
                    }]*/
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
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
                                dataField: 'description',
                                //width:'150'
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
                                        name: 'myFile',
                                        uploadUrl: SmartLife.url + fileController + "?req_code=" + options.data.req_code + "&eClaimId=" + options.data.rcd_id,//viewModel.uploadUrl(),//upload_url_sig,
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
                        text: "ATTACHED FILES"
                    },
                    visible: true,
                    dataField: "ViewAttachements",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: ViewClaimAttachDataSource,
                        columnHidingEnabled: true,
                        wordWrapEnabled: true,
                        /*onRowClick: function(e) {
                            window.open(Portal.file_url + 'assets/files/' + e.data.savedname, '_blank', 'hidden=no');
                        },*/
                        columns: [
                            {
                                dataField: 'id',
                                visible: false,
                            }, {
                                dataField: 'eClaimNumber',
                                visible: false,
                            },
                            {
                                dataField: 'code',
                                visible: false,
                            },
                            {
                                dataField: 'file_desc',
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
                        type: "normal",
                        onClick: function (args) {
                            navnextPrev(0);
                        }
                    }
                }, {
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: "COMPLETE ✓",
                        horizontalAlignment: "right",
                        width: '120',
                        type: 'danger',
                        onClick: function (args) {

                            if (is_group == 1) {
                                if (viewModel.validate_attachments()) {
                                    //data['user_id'] = SmartLife.pos_name;
                                    let data = formClaimInstance.option("formData");
                                    Object.assign(data, formClaimSubmitInstance.option("formData"));
                                    data['member_no'] = member_no;
                                    if (data['event_date'] != undefined && data['event_date'] != '' && data['event_date'] != null) data['event_date'] = viewModel.formatDates(new Date(data['event_date']));
                                    //if (result.isValid) {
                                    //post data here
                                    ///post data form as it is
                                    viewModel.LoadPanelShown(true);
                                    let get_life = new DB({
                                        name: "submitting the form"
                                    });
                                    //let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                    console.log(data);
                                    get_life.DBpost("claims/insertGroupClaimEntries", data).done(function (result) {
                                        viewModel.LoadPanelShown(false);
                                        if (result.success == true) {
                                            console.log(result.claim_id);
                                            //navigate to the my applications screen
                                            DevExpress.ui.dialog.alert("Claim Successfully Submitted", "SUBMITTED");
                                            SmartLife.app.back();
                                            //viewModel.show_signature();
                                        } else {
                                            viewModel.show_test(result.msg, 'error');
                                        }
                                    }).fail(function () {
                                        viewModel.LoadPanelShown(false);
                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                    });
                                    //}
                                }
                            } else {
                                //alter the array depending on the form
                                //qn_intermediary, fm_health_intermediary;
                                if (viewModel.validate_attachments()) {
                                    var result = args.validationGroup.validate();
                                    let data = formClaimInstance.option("formData");
                                    Object.assign(data, formClaimSubmitInstance.option("formData"));
                                    if (is_micro == 1) {
                                        data['MicroPolicy'] = data['PolicyId'];
                                        //data['PolicyId'] = null;
                                    }
                                    data['user_id'] = SmartLife.pos_name;
                                    if (data['event_date'] != undefined && data['event_date'] != '' && data['event_date'] != null) data['event_date'] = viewModel.formatDates(new Date(data['event_date']));
                                    let isClaimPayChange = data['isClaimPayChange'];
                                    let ClaimDefaultPay_method = data['ClaimDefaultPay_method'];
                                    SubmitData = data;
                                    if (result.isValid) {
                                        if (isClaimPayChange == 1 && is_send_OTP && ClaimDefaultPay_method == "6") {

                                            let mobile_no = data['mobile'];

                                            if (mobile_no == undefined || mobile_no == "") {
                                                DevExpress.ui.dialog.alert("Contact information missing Kindly do an endorsement to add the contact number","");
                                            } else {
                                                submitOTP = '';
                                                //send OTP first before submitting
                                                viewModel.LoadPanelShown(true);
                                                let get_life = new DB({
                                                    name: "Sending OTP"
                                                });
                                                //let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                                console.log(data);
                                                get_life.DBpost("collections/sendOTP",
                                                    {
                                                        msg: 'Claim Received. ',
                                                        mobile_no: mobile_no
                                                    }).done(function (result) {
                                                        viewModel.LoadPanelShown(false);
                                                        if (result.success == true) {
                                                            submitOTP = result.otp;
                                                            viewModel.show_OTP();
                                                        } else {
                                                            viewModel.show_test(result.msg, 'error');
                                                        }
                                                    }).fail(function () {
                                                        viewModel.LoadPanelShown(false);
                                                        viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                                    });
                                            }
                                        } else {
                                            viewModel.submit_form(data);
                                        }


                                    }
                                }
                                
                            }


                        }
                    }
                }]
        },

        validate_attachments: function () {
            for (let i = 0; i < ClaimAttachDataSource.length; i++) {
                const attachment1 = ClaimAttachDataSource[i];
                const found = ViewClaimAttachDataSource.some(attachment2 => attachment2.code === attachment1.req_code);

                if (!found) {
                    DevExpress.ui.dialog.alert("Kindly attach " + attachment1.description, "ALERT!");
                    //console.log(`Attachment with id ${attachment1.id} not found in the second array. Terminating validation.`);
                    return false;
                }
                return true;
            }
        },


        submit_form: function (data) {
            //post data here
            ///post data form as it is
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "submitting the form"
            });
            //let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
            console.log(data);
            get_life.DBpost("claims/insertClaimEntries", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.claim_id);
                    //navigate to the my applications screen
                    //SmartLife.app.back();
                    viewModel.show_signature();
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        }, 


        //////file upload///
        upload_started: function (e) {
            viewModel.LoadPanelShown(true);
            //console.log(e);
            //console.log(e.file);
        },
        uploadUrl: ko.observable(SmartLife.url + "claims/syncClaimImage?req_code=" + req_code + "&eClaimId=" + rcd_id),
        get_uploadurl_sig: function (e) {
            //change the photo type here to pass as data....
            req_code = e.value;
            console.log(e.value);
            console.log(rcd_id);
            viewModel.uploadUrl(SmartLife.url + "claims/syncClaimImage?req_code=" + req_code + "&eClaimId=" + rcd_id);
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

        /////////initialize varibles////////
        /*claim_type, notification_date, claim_cause, claim_branch, event_date, doctors_name, member_name,
        policy_no, paydue_date, policy_status, prem_units, tot_proceeds, tot_ded, net_pay, claim_no*/
        policy_no_arr: ko.observableArray(),
        pol_changed: function (e) {
            for (var i = 0; i < viewModel.policy_no_arr().length; i++) {
                if (viewModel.policy_no_arr()[i].policy_no == e.value) {
                    alert(viewModel.policy_no_arr()[i].cacv);
                    viewModel.tot_proceeds(viewModel.policy_no_arr()[i].cacv);
                    var net_pay = parseFloat(parseFloat(viewModel.tot_proceeds()).toFixed(2) * 0.7).toFixed(2);
                    viewModel.net_pay(net_pay);
                }
            }
        },
        claim_changed: function (e) {
            if (e.value == "Request for Surrender") {
                viewModel.vs_partial(false);
            } else {
                viewModel.vs_partial(true);
            }
        },
        vs_partial: ko.observable(false),
        claim_type: ko.observable(''),
        amount_applied: ko.observable(''),
        claim_type_arr: ko.observableArray(claim_type_arr),
        notification_date: ko.observable(new Date()),
        claim_clause: ko.observable(''),
        claim_clause_arr: ko.observableArray(),
        claim_branch: ko.observable(''),
        claim_branch_arr: ko.observableArray(),
        event_date: ko.observable(),
        doctors_name: ko.observable(''),
        doctors_name_arr: ko.observableArray(),
        member_name: ko.observable(''),
        member_name_arr: ko.observableArray(),
        policy_no: ko.observable(),
        paydue_date: ko.observable(),
        policy_status: ko.observable(''),
        policy_status_arr: ko.observableArray(),
        prem_units: ko.observable(''),
        tot_proceeds: ko.observable(''),
        tot_ded: ko.observable(''),
        net_pay: ko.observable(''),
        claim_no: ko.observable(''),
        reason: ko.observable(''),
        vs_save: ko.observable(false),
        vs_edit: ko.observable(false),
        ////////end of initialize variables///

        /////validation///////
        polnoValidationRules: ko.observable({
            validationRules: [{
                type: "required",
                message: "Policy number is required"
            }]
        }),
        claimtypeValidationRules: ko.observable({
            validationRules: [{
                type: "required",
                message: "Claim Type is required"
            }]
        }),
        ////end of validation/////

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
        edit_claim: function () {
            SmartLife.app.back();
        },
        save_claim: function () {
            //if (viewModel.policy_no() == '' || viewModel.claim_type() == '') {
            //var result = args.validationGroup.validate();
            //if (result.isValid) {
            var get_form = new DB({
                name: "post to mob_claims_info"
            });

            //policy_no, claim_type, request_date, tot_cash_value, amount_available, amount_applied, reason, status
            get_form.DBpost("claimRequest?",
                {
                    policy_no: viewModel.policy_no(),
                    clientno: SmartLife.clientno(),
                    claim_type: viewModel.claim_type(),
                    request_date: viewModel.formatDates(viewModel.notification_date()),
                    tot_cash_value: viewModel.tot_proceeds(),
                    amount_available: viewModel.net_pay(),
                    amount_applied: JSON.parse(viewModel.amount_applied()),
                    reason: viewModel.reason()
                }
            ).done(function (result) {
                if (result.status == true) {
                    viewModel.show_test("New Checklist Successfully Added", 'success');
                    SmartLife.app.back();
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
            //}
            /*} else {
                //SmartLife.captured_claims
                SmartLife.captured_claims.push({ policy_no: viewModel.policy_no(), claim_type: viewModel.claim_type(), notification_date: viewModel.formatDate(viewModel.notification_date()), tot_proceeds: viewModel.tot_proceeds(), net_pay: viewModel.net_pay(), reason: viewModel.reason(), amount_applied: viewModel.amount_applied() });
                console.log(SmartLife.captured_claims);
                SmartLife.app.back();
            }*/
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

        //////beneficiary popup//////
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
                viewModel.claim_changed_pay_methodD(1, e.value);
            }
            //ClaimDefaultPay_method, ClaimDefaultTelcoCompany, ClaimDefaultMobileWallet, ClaimDefaultEFTBank_code, ClaimDefaultEFTBankBranchCode, ClaimDefaultEFTBank_account,
            //ClaimDefaultEftBankaccountName
            //GuardianSurname, GuardianOtherNames, GuardianTelephone, GuardianEmail

            let tmp_values = {
                id: e.data.id, Names: e.data.Names, relationship: e.data.relationship, birth_date: e.data.birth_date, age: age,
                perc_alloc: e.data.perc_alloc, mobile: e.data.mobile,
                ClaimDefaultPay_methodD: e.data.ClaimDefaultPay_method, ClaimDefaultTelcoCompanyD: e.data.ClaimDefaultTelcoCompany,
                ClaimDefaultMobileWalletD: e.data.ClaimDefaultMobileWallet, ClaimDefaultEFTBank_codeD: e.data.ClaimDefaultEFTBank_code,
                ClaimDefaultEFTBankBranchCodeD: e.data.ClaimDefaultEFTBankBranchCode, ClaimDefaultEftBankaccountNameD: e.data.ClaimDefaultEftBankaccountName,
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
                    editorOptions: {
                        displayFormat: 'dd/MM/yyyy'
                    },
                    dataField: "birth_date",
                    visible: true,
                    editorOptions: {
                        readOnly: false
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
                    dataField: "ClaimDefaultPay_methodD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: PayMethods,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.claim_changed_pay_methodD(1, e.value);
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
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_codeD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //filter the bank branches ClaimBankBranches
                            ClaimBankBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == e.value));
                            //update dataSource
                            formPersonalDetailsInstance.getEditor("ClaimDefaultEFTBankBranchCodeD").option("dataSource", ClaimBankBranches);
                        }
                    },
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_methodD'] == '7' || data['ClaimDefaultPay_methodD'] == '9') {
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
                    visible: false,
                    dataField: "ClaimDefaultEFTBankBranchCodeD",
                    editorOptions: {
                        readOnly: true,
                        closeOnOutsideClick: true,
                        dataSource: ClaimBankBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank is required",
                        /*validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_methodD'] == '7' || data['ClaimDefaultPay_methodD'] == '9') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }*/
                    }]
                }, {//SmartLife.
                    label: {
                        text: "Claim Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_accountD",
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank Account is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_methodD'] == '7' || data['ClaimDefaultPay_methodD'] == '9') {
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
                    visible: false,
                    dataField: "ClaimDefaultTelcoCompanyD",
                    editorOptions: {
                        readOnly: true,
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
                            if (data['ClaimDefaultPay_methodD'] == '6') {
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
                    editorType: "dxNumberBox",
                    visible: false,
                    editorOptions: {
                        readOnly: true
                    },
                    dataField: "ClaimDefaultMobileWalletD",
                    /*validationRules: [{
                        type: "custom",
                        message: "Claim Default MOMO Number is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_methodD'] == '6') {
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
                    },
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
                    },
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
                    },
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
                    dataField: "GuardianEmail",
                    visible: false,
                    editorOptions: {
                        readOnly: true
                    }
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
                    colSpan: 4,
                    label: {
                        text: "Change Claim PayMethod"
                    },
                    editorType: "dxCheckBox",
                    visible: true,
                    dataField: "isClaimPayChange",
                    editorOptions: {
                        onValueChanged: function (e) {
                            //display the form to change the Claim PayMethods
                            if (e.value == 1) {
                                formBeneficiaryInstance.itemOption("ClaimDefaultPay_method", "visible", true);
                            } else {
                                formBeneficiaryInstance.itemOption("ClaimDefaultPay_method", "visible", false);
                            }
                        }
                    }
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                //change payment details
                {
                    label: {
                        text: "Claim Payment Method"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultPay_method",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: PayMethods,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.claim_changed_pay_method(1, e.value);
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
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_code",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //filter the bank branches ClaimBankBranches
                            ClaimBankBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == e.value));
                            //update dataSource
                            formBeneficiaryInstance.getEditor("ClaimDefaultEFTBankBranchCode").option("dataSource", ClaimBankBranches);
                        }
                    },
                    validationRules: [{
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
                    }]
                }, {
                    label: {
                        text: "Claim Default Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultEFTBankBranchCode",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: ClaimBankBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    },
                    validationRules: [{
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
                    }]
                }, {//SmartLife.
                    label: {
                        text: "Claim Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_account",
                    validationRules: [{
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
                    }]
                }, {
                    label: {
                        text: "Claim Default Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultTelcoCompany",
                    editorOptions: {
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    },
                    validationRules: [{
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
                    }]
                }, {
                    label: {
                        text: "Claim Default MOMO Number"
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
                    dataField: "ClaimDefaultMobileWallet",
                    validationRules: [{
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
                    }]
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                }, {
                    colSpan: 4,
                    itemType: "empty"
                },
                /////end of change of payment details
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
                            /*var result = args.validationGroup.validate();
                            if (result.isValid) {
                                viewModel.LoadPanelShown(true);
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
                                });

                            }*/

                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //let tableData = { PolicyNumber: policy_no, beneficiaries };
                                const beneficiaries_data = formBeneficiaryInstance.option("formData");
                                let data = formClaimInstance.getEditor('beneficiaries').option('dataSource');
                                //add this to it 
                                data[rowBenefIndex] = beneficiaries_data;
                                formClaimInstance.getEditor("beneficiaries").option("dataSource", data);
                                viewModel.hide_beneficiary();
                            }
                        }
                    }
                }
            ]
        },
        /////end of beneficiary popup///

        /////pop up for new benefeciary///
        pop_new_beneficiary: ko.observable(false),
        hide_pop_new_beneficiary: function () {
            viewModel.pop_new_beneficiary(false);
        },
        show_new_beneficiary: function () {

            let tmp_values = {
                Names: '', relationship: '', birth_date: null, age: '', perc_alloc: '', mobile: '', ClaimDefaultPay_method: '',
                ClaimDefaultTelcoCompany: '', ClaimDefaultMobileWallet: '', ClaimDefaultEFTBank_code: '', ClaimDefaultEFTBankBranchCode: '',
                ClaimDefaultEftBankaccountName: '', GuardianSurname: '', GuardianOtherNames: '',
                GuardianTelephone: '', GuardianEmail: ''
            };
            $("#dxFormNewBeneficiary").dxForm({
                formData: tmp_values
            }).dxForm("instance");
            viewModel.pop_new_beneficiary(true);
            
        },
        dxFormNewBeneficiary: {
            colCount: 4,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formNewBeneficiaryInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //Names,relationship,birth_date,perc_alloc,mobile
            items: [
                {
                    label: {
                        text: "FullNames"
                    },
                    editorType: "dxTextBox",
                    dataField: "Names",
                    visible: true,
                    editorOptions: {
                        readOnly: false
                    },
                }, {
                    label: {
                        text: "Relationship"
                    },
                    editorType: "dxLookup",
                    dataField: "relationship",
                    visible: true,
                    editorOptions: {
                        readOnly: false,
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
                    dataField: "birth_date",
                    visible: true,
                    editorOptions: {
                        readOnly: false,
                        onValueChanged: function (e) {
                            let age = viewModel.calc_age(e.value);
                            formNewBeneficiaryInstance.updateData("age", age);
                        }
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
                        readOnly: false
                    }
                }, {
                    label: {
                        text: "Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "mobile",
                    visible: true,
                    editorOptions: {
                        readOnly: false
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
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: PayMethods,
                        displayExpr: 'decription',
                        valueExpr: 'payment_mode',
                        onValueChanged: function (e) {
                            viewModel.claim_changed_pay_method(2, e.value);
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
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_code",
                    editorOptions: {
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Banks,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //filter the bank branches ClaimBankBranches
                            ClaimBankBranches = SmartLife.BanksBranches.filter(bank => (bank.bank_code == e.value));
                            //update dataSource
                            formNewBeneficiaryInstance.getEditor("ClaimDefaultEFTBankBranchCode").option("dataSource", ClaimBankBranches);
                        }
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '4' || data['ClaimDefaultPay_method'] == '7' || data['ClaimDefaultPay_method'] == '9') {
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
                        text: "Claim Default Bank Branch"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultEFTBankBranchCode",
                    editorOptions: {
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: ClaimBankBranches,
                        displayExpr: 'bankBranchName',
                        valueExpr: 'id'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank is required",
                        /*validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_methodD'] == '7' || data['ClaimDefaultPay_methodD'] == '9') {
                                if (obj.value == '' || obj.value == undefined || obj.value == null) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;//don't check validation
                            }
                        }*/
                    }]
                }, {//SmartLife.
                    label: {
                        text: "Claim Default Account Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    dataField: "ClaimDefaultEFTBank_account",
                    validationRules: [{
                        type: "custom",
                        message: "Claim Default Bank Account is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
                            if (data['ClaimDefaultPay_method'] == '4' || data['ClaimDefaultPay_method'] == '7' || data['ClaimDefaultPay_method'] == '9') {
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
                        text: "Claim Default Telco Company"
                    },
                    editorType: "dxLookup",
                    visible: false,
                    dataField: "ClaimDefaultTelcoCompany",
                    editorOptions: {
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: SmartLife.Telcos,
                        displayExpr: 'Name',
                        valueExpr: 'emp_code'
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Claim Default Telco Company is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
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
                    }]
                }, {
                    label: {
                        text: "Claim Default MOMO Number"
                    },
                    editorType: "dxTextBox",
                    visible: false,
                    editorOptions: {
                        readOnly: false,
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
                    dataField: "ClaimDefaultMobileWallet",
                    validationRules: [{
                        type: "custom",
                        message: "Claim Default MOMO Number is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
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
                    }]
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
                        readOnly: false
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Gurdians Surname is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
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
                    }]
                },
                {
                    label: {
                        text: "Gurdians Other Names"
                    },
                    editorType: "dxTextBox",
                    dataField: "GuardianOtherNames",
                    visible: false,
                    editorOptions: {
                        readOnly: false
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Gurdians Other Name is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
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
                    }]
                },
                {
                    label: {
                        text: "Gurdians Mobile"
                    },
                    editorType: "dxTextBox",
                    dataField: "GuardianTelephone",
                    visible: false,
                    editorOptions: {
                        readOnly: false
                    },
                    validationRules: [{
                        type: "custom",
                        message: "Gurdians Mobile is required",
                        validationCallback: function (obj) {
                            //check if Doyouhavesecondaryincome = 1
                            let data = formNewBeneficiaryInstance.option("formData");
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
                    }]
                }, {
                    label: {
                        text: "Guardians Email"
                    },
                    editorType: "dxTextBox",
                    dataField: "GuardianEmail",
                    visible: false,
                    editorOptions: {
                        readOnly: false
                    }
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
                },{
                    colSpan: 4,
                    itemType: "empty"
                },
                /////end of change of payment details
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
                            viewModel.hide_new_beneficiary();
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
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //TODO - Just add to it


                                /*//let tableData = { PolicyNumber: policy_no, beneficiaries };
                                const beneficiaries_data = formNewBeneficiaryInstance.option("formData");
                                let data = formClaimInstance.getEditor('beneficiaries').option('dataSource');
                                //add this to it 
                                data[rowBenefIndex] = beneficiaries_data;
                                formClaimInstance.getEditor("beneficiaries").option("dataSource", data);
                                viewModel.hide_beneficiary();*/
                            }
                        }
                    }
                }
            ]
        },
        /////end of pop up for new beneficiary///


        /////pop up for OTP////
        pop_OTP: ko.observable(false),
        hide_pop_OTP: function () {
            viewModel.pop_OTP(false);
        },
        show_OTP: function () {

            let tmp_values = {
                OTP: ''
            };
            $("#dxFormOTP").dxForm({
                formData: tmp_values
            }).dxForm("instance");
            viewModel.pop_OTP(true);

        },
        dxFormOTP: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                dxFormOTPInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //Names,relationship,birth_date,perc_alloc,mobile
            items: [
                {
                    colSpan: 2,
                    label: {
                        text: "OTP"
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        readOnly: false,
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
                    dataField: "OTP",
                    validationRules: [{
                        type: "required",
                        message: "OTP is required"
                    }]
                },
                //save
                {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    itemType: "empty"
                },
                /////end of change of payment details
                {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "CLOSE",
                        horizontalAlignment: "left",
                        icon: "close",
                        type: "normal",
                        onClick: function () {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                            viewModel.hide_pop_OTP();
                        }
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "OK",
                        icon: "check",
                        type: "default",
                        onClick: function (args) {
                            //alter the array depending on the form
                            var result = args.validationGroup.validate();
                            if (result.isValid) {
                                //TODO - Just add to it
                                let data = dxFormOTPInstance.option("formData");
                                if (submitOTP != '' && (submitOTP == data['OTP'])) {
                                    viewModel.hide_pop_OTP();
                                    is_send_OTP = false;
                                    viewModel.submit_form(SubmitData);
                                } else {
                                    DevExpress.ui.dialog.alert("Wrong OTP Entered", "ALERT!");
                                }
                            }
                        }
                    }
                }
            ]
        },
        //////end of pop up for OTP////


        /////signature pad/////
        popup_sig: ko.observable(false),
        hide_popup_sig: function () {
            viewModel.popup_sig(false);
        },
        submit_claim: function () {
            //TODO - Submit the entire claim and flag it as submited bruv...
            var data = $sigdiv.jSignature('getData', 'image')
            var i = new Image()
            i.src = 'data:' + data[0] + ',' + data[1];
            imageURI = i.src;

            if (imageURI == undefined || imageURI == "" || imageURI == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABRsAAAFHCAYAAAAhuJsvAAAAAXNSR0IArs4c6QAAIABJREFUeF7t21GNFVEQRdHGCHhACDKeqJaBEDyAEkzs5GQqawTUfb2qvnYy3x5/BAgQIECAAAECBAgQIECAAAECBAgQCAS+BTOMIECAAAECBAgQIECAAAECBAgQIECAwCM2OgICBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGxcXwDn8/n5/M8v8Y/w/MECBAgQIAAAQIECBAgQIAAgQsCv9/3/XPhQ77qN4iN4819Pp+/z/N8H/8MzxMgQIAAAQIECBAgQIAAAQIELgj8e9/3x4UP+arfIDaONyc2jhfgeQIECBAgQIAAAQIECBAgQOCSgNg43qbYOF6Af6MeL8DzBAgQIECAAAECBAgQIECAwCUB/0Y93qbYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXi9DXU8AAAA8UlEQVSeAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVgf+cBRVICIoJOQAAAABJRU5ErkJggg==") {
                DevExpress.ui.dialog.alert("Kindly Sign In order to proceed");
            } else {
                viewModel.LoadPanelShown(true);
                var get_form = new DB({
                    name: "submitting signature"
                });
                
                //policy_no, claim_type, request_date, tot_cash_value, amount_available, amount_applied, reason, status
                get_form.DBpost("claims/syncClaimImage?",
                    {
                        req_code: '020',
                        eClaimId: rcd_id,
                        signature: imageURI,
                    }
                ).done(function (result) {
                    viewModel.LoadPanelShown(false);
                    if (result.success == true) {
                        viewModel.popup_sig(false);
                        DevExpress.ui.dialog.alert("Claim Successfully Submited", "SUBMITED");
                        SmartLife.app.back();
                    } else {
                        viewModel.show_test(result.msg, 'error');
                    }
                    }).fail(function () {
                        viewModel.LoadPanelShown(false);
                    //alert_dialog("Server not accessible. Check internet connectivity");
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });
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