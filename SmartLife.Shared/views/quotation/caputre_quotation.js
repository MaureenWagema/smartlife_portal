SmartLife.caputre_quotation = function (params) {
    "use strict";
    var formQuoteInstance;
    var formPolicyDetailsInstance;
    var formDependantsInstance;
    var formDependantInstance;
    var get_data = JSON.parse(params.item);
    var plan_code = get_data['plan_code'];
    console.log(plan_code);
    var has_loaded = 0;
    var tmp_transfer_charge = 0;
    var rd_plan = true;
    var PlanInfo = SmartLife.planinfo;


    var DependantsRelationships = SmartLife.Relationshipinfo.filter(telco => (telco.CategoryCode != null));
    var vs_hci_plan = false;

    var BaPackages = [];

    var PolicyPayMode = SmartLife.Paymentmode.filter(pay_mode => (pay_mode.plan_code == plan_code));
    var DP_ = [];
    var Riders_ = [];
    var dependants_form = ["dp_fullname", "dp_relationship", "dp_dob", "dp_anb", "dp_sa", "dp_premium", "dp_good_health"];

    if (plan_code == "35") {
        BaPackages = SmartLife.BaPackages.filter(item => (item.Plan_code == "35" || item.Plan_code == 35));
        vs_hci_plan = true;
        dependants_form = ["dp_fullname", "dp_relationship", "dp_dob", "dp_anb", "dp_bapackage", "dp_hci_sum", "dp_duration", "dp_sa", "dp_premium", "dp_good_health"];
        
    }
    if (plan_code == "36") {
        rd_plan = false;
        PlanInfo = SmartLife.planinfo.filter(plan => (plan.plan_id == "36" || plan.plan_id == "37"));
    }



   /*var is_bancassurance = false;
    

    
    
    

    if (SmartLife.login_type == 3) {//POS
        vs_second_agent = true;
    } else if (SmartLife.login_type == 2) {//agent
        vs_second_agent = true;
    }

   

    if (SmartLife.channel == 4) {
        is_bancassurance = true;
    }

    var PolicyPament = SmartLife.Paymentinfo.filter(telco => (telco.payment_mode != "7" && telco.payment_mode != "8" && telco.payment_mode != "9"));
    var PolicyBankBranches;
    */


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

        viewShown: function () {
            viewModel.assign_plan();
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
            if (plan_code == "13") {
                //anidaso
                viewModel.get_paymode("13");
                formPolicyDetailsInstance.updateData("plan_code", "13");
            }
            if (plan_code == "10") {
                //anidaso
                viewModel.get_paymode("10");
                formPolicyDetailsInstance.updateData("plan_code", "10");
            }
            if (plan_code == "36") {//Funeral-Ideal
                viewModel.get_paymode("36");
                formPolicyDetailsInstance.updateData("plan_code", "36");
            }
            if (plan_code == "35") {//HCI
                viewModel.get_paymode("35");
                formPolicyDetailsInstance.updateData("plan_code", "35");
            }
            if (plan_code == "34") {//GEEP
                viewModel.get_paymode("34");
                formPolicyDetailsInstance.updateData("plan_code", "34");
            }
            if (plan_code == "31") {//ELS
                viewModel.get_paymode("31");
                formPolicyDetailsInstance.updateData("plan_code", "31");
            }
        },

        //////////////////starter///////////
        calc_anidaso_life_prem(basic_premium, term, anb) {
            //make a post 
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "calculating anidaso"
            });

            let data = {
                total_premium: basic_premium,
                term: term,
                plan_code: "10",
                anb: anb
            };
            get_life.DBpost("calc/LifeAnidaso", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //console.log(result.life_premium);
                    //formInstance.itemOption("life_premium", "value", result.life_premium);
                    formPolicyDetailsInstance.updateData("sum_assured", result.sum_assured);
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    formPolicyDetailsInstance.updateData("inv_premium", result.inv_prem);
                    formPolicyDetailsInstance.updateData("rider_premium", result.rider_prem);
                    let data = formPolicyDetailsInstance.option("formData");
                    if (data['DependantPremium'] == undefined || data['DependantPremium'] == null) data['DependantPremium'] = 0;
                    let modal_premium = parseFloat(data['DependantPremium']) + parseFloat(result.total_premium);
                    formPolicyDetailsInstance.updateData("modal_premium", parseFloat(modal_premium).toFixed(2));
                    Riders_ = result.riders;
                    formPolicyDetailsInstance.getEditor("riders").option("dataSource", Riders_);

                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calculate_dp_anidaso(sa, CategoryCode, fn) {
            viewModel.LoadPanelShown(true);
            let calc = new DB({
                name: "calculating anidaso dependant"
            });
            let data = {
                plan_code: "10",
                sum_assured: sa,
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/DepAnidaso", data).done(function (result) {
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
            var anb_age = (current_yr - yr) + 1;
            let term = 0;

            //if (DateTime.Now.Month < birthdate.Month || (DateTime.Now.Month == birthdate.Month && DateTime.Now.Day < birthdate.Day))

            //alert(current_day);
            if ((current_month <= month_yr) && (current_day < date_yr)) {
                anb_age = anb_age - 1;
            }

            if (!is_dp) {
                if (plan_code == "36" || plan_code == "37") {//funeral plan
                    //calculate the term
                    term = 100 - anb_age;
                    formPolicyDetailsInstance.updateData("term", term);
                    formPolicyDetailsInstance.getEditor("term").option("readOnly", true);
                }


                formPolicyDetailsInstance.updateData("anb", anb_age);
            } else {
                formDependantInstance.updateData("dp_anb", anb_age);
            }

        },

        calc_age: function (e) {
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
            let term = 0;

            //if (DateTime.Now.Month < birthdate.Month || (DateTime.Now.Month == birthdate.Month && DateTime.Now.Day < birthdate.Day))

            //alert(current_day);
            if ((current_month <= month_yr) && (current_day < date_yr)) {
                anb_age = anb_age - 1;
            }


            return anb_age;
        },

        calculate_funeral_premium(sa, anb, term, CategoryCode, paymode_code, fn) {
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;

            let calc = new DB({
                name: "calculating premium funeral policy"
            });
            let data = {
                plan_code: "37",
                sum_assured: sa,
                anb: anb,
                term: term,
                paymode: paymode,
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/PremiumFuneralPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    tmp_transfer_charge = result.transfer_charge;
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calculate_hci(PackageCode, anb, term, CategoryCode, paymode_code, fn) {
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;

            let calc = new DB({
                name: "calculating hci"
            });
            let data = {
                plan_code: "35",
                PackageCode: PackageCode,
                anb: anb,
                term: term,
                paymode: paymode,
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/HCIPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    tmp_transfer_charge = result.transfer_charge;
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },


        calculate_pa(sa, anb, term, CategoryCode, paymode_code, fn) {
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;

            let calc = new DB({
                name: "calculating ideal funeral policy"
            });
            let data = {
                plan_code: "38",
                sum_assured: sa,
                anb: anb,
                term: term,
                paymode: paymode,
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/PersonalAccidentPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    tmp_transfer_charge = result.transfer_charge;
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calculate_family_comprehension(sa, anb, term, CategoryCode, paymode_code, fn) {
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;

            let calc = new DB({
                name: "calculating ideal funeral policy"
            });
            let data = {
                plan_code: "33",
                sum_assured: sa,
                anb: anb,
                term: term,
                paymode: paymode,
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/FamilyComprehensionPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    tmp_transfer_charge = result.transfer_charge;
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },


        calculate_funeral_ideal(sa, anb, term, CategoryCode, paymode_code, fn) {
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;

            let calc = new DB({
                name: "calculating ideal funeral policy"
            });
            let data = {
                plan_code: "36",
                sum_assured: sa,
                anb: anb,
                term: term,
                paymode: paymode,
                relationship_code: CategoryCode
            };
            calc.DBpost("calc/IdealFuneralPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    tmp_transfer_charge = result.transfer_charge;
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calculate_esb(total_premium, anb, term, gender, class_code, fn) {
            viewModel.LoadPanelShown(true);


            let calc = new DB({
                name: "calculating esb"
            });
            let data = {
                PlanCode: "2",
                total_premium: total_premium,
                anb: anb,
                term: term,
                gender: gender,
                class_code: class_code
            };
            calc.DBpost("calc/ESB", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result);
                    //assign all here
                    //sum_assured,policy_fee,inv_prem,rider_prem,transfer_charge,riders
                    formPolicyDetailsInstance.updateData("sum_assured", result.sum_assured);
                    //formInstance.updateData("policy_fee", result.policy_fee); //transfer_charge
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);
                    formPolicyDetailsInstance.updateData("inv_premium", result.inv_prem);
                    formPolicyDetailsInstance.updateData("rider_premium", result.rider_prem);
                    formPolicyDetailsInstance.updateData("transfer_charge", result.transfer_charge);
                    formPolicyDetailsInstance.updateData("modal_premium", total_premium);
                    console.log(result.riders);
                    Riders_ = result.riders;
                    formPolicyDetailsInstance.getEditor("riders").option("dataSource", Riders_);

                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calculate_geep(total_premium, anb, term, paymode_code, fn) {
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;


            let calc = new DB({
                name: "calculating premium geep"
            });
            let data = {
                plan_code: "34",
                monthly_premium: total_premium,
                anb: anb,
                term: term,
                paymode: paymode,
            };
            calc.DBpost("calc/GEEP", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result);
                    //assign all here
                    //sum_assured,policy_fee,inv_prem,rider_prem,transfer_charge,riders
                    formPolicyDetailsInstance.updateData("sum_assured", result.sum_assured);
                    //formInstance.updateData("policy_fee", result.policy_fee);
                    formPolicyDetailsInstance.updateData("inv_premium", result.Inv_prem);
                    formPolicyDetailsInstance.updateData("modal_premium", result.Total_Premium);
                    formPolicyDetailsInstance.updateData("rider_premium", result.Protection_premium);
                    formPolicyDetailsInstance.updateData("cepa", result.Cepa_prem);
                    formPolicyDetailsInstance.updateData("transfer_charge", result.Transfer_charge);
                    formPolicyDetailsInstance.updateData("sum_assured", result.Sum_Assured);
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);

                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        calc_els(sum_assured, anb, term, paymode_code, fn) {
            //make a post 
            viewModel.LoadPanelShown(true);

            let index = PolicyPayMode.findIndex(obj => (obj.id == paymode_code));
            let paymode = PolicyPayMode[index].OldPayMode;

            let get_life = new DB({
                name: "calculating els"
            });
            let data = {
                sum_assured: sum_assured,
                plan_code: "31",
                anb: anb,
                term: term,
                paymode: paymode
            };
            get_life.DBpost("calc/lifeSavingsPlan", data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.life_premium);
                    //formInstance.itemOption("life_premium", "value", result.life_premium);
                    formPolicyDetailsInstance.updateData("basic_premium", result.basic_premium);
                    formPolicyDetailsInstance.updateData("modal_premium", result.modal_prem);
                    formPolicyDetailsInstance.updateData("pol_fee", result.policy_fee);

                    fn(result);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
                fn(true);
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                fn(true);
            });
        },

        hide_second_life: function () {

        },

        default_vs_premiums: function () {
            formPolicyDetailsInstance.itemOption("Policy Details.inv_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.life_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.rider_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.cepa", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.basic_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.total_premium", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.transfer_charge", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", false);//btndependants
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.riders", "visible", false);
        },
        display_vs_edwa_nkosuo: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.sum_assured", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "visible", false);
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
        },
        display_vs_anidaso: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.inv_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.DependantPremium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.rider_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.riders", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.basic_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.add_edwa_nkosuo", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.edwa_nkoso_policy", "visible", true);

            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.rider_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.inv_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.DependantPremium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
        },
        display_vs_funeral_premium: function () {
            //viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.DependantPremium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "readOnly", true);
            formPolicyDetailsInstance.itemOption("Policy Details.sum_assured", "readOnly", true);
            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'visible', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'visible', true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.DependantPremium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
        },
        display_vs_pa: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.DependantPremium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "readOnly", true);
            formPolicyDetailsInstance.itemOption("Policy Details.sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'visible', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'visible', true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'disabled', true);

            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.DependantPremium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
        },
        display_vs_family_comprehension: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.DependantPremium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "readOnly", true);
            formPolicyDetailsInstance.itemOption("Policy Details.sum_assured", "readOnly", true);
            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'visible', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'visible', true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.DependantPremium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
        },
        display_vs_esb: function () {
            //inv_prem, rider_prem, transfer_charge, riders
            //viewModel.show_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.inv_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.rider_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.transfer_charge", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.riders", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.basic_premium", "visible", true);
            //formPolicyDetailsInstance.itemOption("total_premium", "visible", true);
            //.getEditor("complaint_form_no").option("readOnly", true);
            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.rider_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.inv_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
            //formPolicyDetailsInstance.getEditor("POLICY DETAILS.modal_premium").editorOptions("readOnly", true);

        },

        //TODO
        //1. display gfp-ideal
        display_vs_funeral_ideal: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.DependantPremium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "readOnly", true);
            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'visible', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'visible', true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.DependantPremium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
        },

        display_vs_hci: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.DependantPremium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.dependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.btndependants", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.pol_fee", "readOnly", true);
            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'visible', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'visible', true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.total_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.DependantPremium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
        },

        //2. display geep
        display_vs_geep: function () {
            viewModel.show_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.basic_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.rider_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.cepa", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.transfer_charge", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.inv_premium", "visible", true);
            //formPolicyDetailsInstance.itemOption("pol_fee", "readOnly", true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);

            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            //formPolicyDetailsInstance.itemOption('basic_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.rider_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.cepa', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.transfer_charge', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.sum_assured', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.inv_premium', 'disabled', true);
        },
        //3. display els
        display_vs_els: function () {
            viewModel.hide_second_life();
            formPolicyDetailsInstance.itemOption("Policy Details.modal_premium", "visible", true);
            formPolicyDetailsInstance.itemOption("Policy Details.basic_premium", "visible", true);
            //formPolicyDetailsInstance.itemOption("modal_premium", "readOnly", true);
            //formPolicyDetailsInstance.itemOption("basic_premium", "readOnly", true);
            //formPolicyDetailsInstance.itemOption("pol_fee", "readOnly", true);
            //formPolicyDetailsInstance.itemOption("sum_assured", "readOnly", true);
            //$("#dxFormPolicy").dxForm('instance').getEditor("dob").option("readOnly", true);
            //console.log($("#dxFormPolicy").dxForm('instance').getEditor("modal_premium"));
            //$("#dxFormPolicy").dxForm('instance').repaint();
            formPolicyDetailsInstance.itemOption('Policy Details.modal_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.basic_premium', 'disabled', true);
            formPolicyDetailsInstance.itemOption('Policy Details.pol_fee', 'disabled', true);
            //formPolicyDetailsInstance.itemOption('sum_assured', 'disabled', true);
        },

        refresh_dynamic_ds: function () {
            //policy bank branches
            if (formPolicyDetailsInstance.getEditor("bank_branch") != null)
                formPolicyDetailsInstance.getEditor("bank_branch").option("dataSource", PolicyBankBranches);
            //paymode
            if (formPolicyDetailsInstance.getEditor("paymode_code") != null)
                formPolicyDetailsInstance.getEditor("paymode_code").option("dataSource", PolicyPayMode);
            //riders
            if (formPolicyDetailsInstance.getEditor("riders") != null)
                formPolicyDetailsInstance.getEditor("riders").option("dataSource", Riders_);
            //dependants
            if (formPolicyDetailsInstance.getEditor("dependants") != null)
                formPolicyDetailsInstance.getEditor("dependants").option("dataSource", DP_);
        },

        get_paymode: function (plan_id) {
            /*let paymode_arr = [];
            for (let i = 0; i < SmartLife.Paymentmode.length; i++) {
                if (SmartLife.Paymentmode[i]['plan_code'] == plan_id) {
                    paymode_arr.push(SmartLife.Paymentmode[i]);
                }
            }
            console.log("paymodes are: ")
            console.log(paymode_arr);*/
            PolicyPayMode = SmartLife.Paymentmode.filter(pay_mode => (pay_mode.plan_code == plan_id));
            console.log("getting paymode");
            console.log(PolicyPayMode);
            formPolicyDetailsInstance.getEditor("paymode_code").option("dataSource", PolicyPayMode);
        },
        /////////////////end of starter////



        //////pop up dependants////
        pop_hiding: function () {
            formDependantInstance.resetValues();
        },
        pop_dependants: ko.observable(false),
        hide_dependants: function () {
            //do the cumulative additions here.
            viewModel.pop_dependants(false);
        },
        show_dependants: function () {
            let tmp_values = {
                dp_fullname: '', dp_relationship: '', dp_dob: '', dp_anb: '', dp_sa: '', dp_premium: '',
                dp_bapackage: null, dp_hci_sum: '', dp_duration: '', dp_good_health: null
            };
            $("#dxFormDependant").dxForm({
                formData: tmp_values
            }).dxForm("instance");
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
                        dataSource: DependantsRelationships,
                        displayExpr: 'description',
                        valueExpr: 'code',
                        onValueChanged: function (e) {
                            if (e.value == "SF") {
                                let data = formPolicyDetailsInstance.option("formData");
                                //let dataPersonal = formPersonalDetailsInstance.option("formData");
                                let names = data['surname'] + ' ' + data['other_name'];
                                formDependantInstance.updateData("dp_fullname", names);
                                formDependantInstance.updateData("dp_dob", data['dob']);
                                formDependantInstance.updateData("dp_anb", data['anb']);
                            }
                            if (plan_code == "10") {
                                formDependantInstance.itemOption('dp_sa', 'disabled', true);
                                formDependantInstance.itemOption('dp_premium', 'disabled', true);
                                viewModel.refresh_dynamic_ds();
                                let data = formPolicyDetailsInstance.option("formData");
                                viewModel.calculate_dp_anidaso(data['sum_assured'], e.value, function (result) {
                                    //console.log(result.premium);
                                    //newData.dp_premium = parseFloat(result.premium);
                                    formDependantInstance.updateData("dp_sa", result.dp_sum_assured);
                                    formDependantInstance.updateData("dp_premium", result.dp_premium);
                                    //console.log(newData);
                                });
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
                        displayFormat: 'dd/MM/yyyy',
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
                            formDependantInstance.updateData("dp_anb", anb_age);
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
                        text: "Packages"
                    },
                    editorType: "dxLookup",
                    dataField: "dp_bapackage",
                    colSpan: 2,
                    visible: vs_hci_plan,
                    editorOptions: {
                        readOnly: false,
                        closeOnOutsideClick: true,
                        dataSource: BaPackages,
                        displayExpr: 'description',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            //calculate the premium from here
                            let dependants_data = formDependantInstance.option("formData");
                            let data = formPolicyDetailsInstance.option("formData");

                            let index = SmartLife.Relationshipinfo.findIndex(obj => (obj.code == dependants_data['dp_relationship']));
                            let CategoryCode = SmartLife.Relationshipinfo[index].CategoryCode;

                            if (plan_code == "35") {
                                viewModel.calculate_hci(e.value, dependants_data['dp_anb'], data['term'], CategoryCode, data['paymode_code'],
                                    function (result) {
                                        console.log(result.premium);
                                        //newData.dp_premium = parseFloat(result.premium);
                                        formDependantInstance.updateData("dp_hci_sum", result.hci_sum_assured);
                                        formDependantInstance.updateData("dp_duration", result.days_covered);
                                        formDependantInstance.updateData("dp_sa", result.sum_assured);
                                        formDependantInstance.updateData("dp_premium", result.premium);
                                        //console.log(newData);
                                    });
                            }
                        }
                    },
                }, {
                    label: {
                        text: "HCI Sum Assured"
                    },
                    editorType: "dxNumberBox",
                    dataField: "dp_hci_sum",
                    visible: vs_hci_plan,
                    editorOptions: {
                        readOnly: true,

                    },
                }, {
                    label: {
                        text: "Days Covered"
                    },
                    editorType: "dxNumberBox",
                    dataField: "dp_duration",
                    visible: vs_hci_plan,
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    label: {
                        text: "Sum Assured"
                    },
                    editorType: "dxNumberBox",
                    editorOptions: {
                        onValueChanged: function (e) {

                            if (e.value != undefined && e.value != null && e.value != '') {
                                //funeral policy - premium
                                let dependants_data = formDependantInstance.option("formData");
                                let data = formPolicyDetailsInstance.option("formData");
                                //alert(dependants_data['dp_relationship']);
                                //get the CategoryCode
                                let index = SmartLife.Relationshipinfo.findIndex(obj => (obj.code == dependants_data['dp_relationship']));
                                let CategoryCode = SmartLife.Relationshipinfo[index].CategoryCode;

                                if (plan_code == "37") {
                                    viewModel.calculate_funeral_premium(e.value, dependants_data['dp_anb'], data['term'], CategoryCode, data['paymode_code'], function (result) {
                                        console.log(result.premium);
                                        //newData.dp_premium = parseFloat(result.premium);
                                        formDependantInstance.updateData("dp_premium", result.premium);
                                        //console.log(newData);
                                    });
                                }
                                if (plan_code == "36") {
                                    viewModel.calculate_funeral_ideal(e.value, dependants_data['dp_anb'], data['term'], CategoryCode, data['paymode_code'], function (result) {
                                        console.log(result.premium);
                                        //newData.dp_premium = parseFloat(result.premium);
                                        formDependantInstance.updateData("dp_premium", result.premium);
                                        //console.log(newData);
                                    });
                                }
                                if (plan_code == "38") {//personal accident
                                    viewModel.calculate_pa(e.value, dependants_data['dp_anb'], data['term'], CategoryCode, data['paymode_code'], function (result) {
                                        console.log(result.premium);
                                        //newData.dp_premium = parseFloat(result.premium);
                                        formDependantInstance.updateData("dp_premium", result.premium);
                                        //console.log(newData);
                                    });
                                }
                                if (plan_code == "33") {//family comprehension
                                    viewModel.calculate_family_comprehension(e.value, dependants_data['dp_anb'], data['term'], CategoryCode, data['paymode_code'], function (result) {
                                        console.log(result.premium);
                                        //newData.dp_premium = parseFloat(result.premium);
                                        formDependantInstance.updateData("dp_premium", result.premium);
                                        //console.log(newData);
                                    });
                                }
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
                        text: "CLOSE",
                        horizontalAlignment: "left",
                        icon: "close",
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
                                const dependants_data = formDependantInstance.option("formData");
                                let data = formPolicyDetailsInstance.getEditor('dependants').option('dataSource');
                                //add this to it 
                                data.push(dependants_data);
                                DP_ = data;
                                //update the dataSource
                                formPolicyDetailsInstance.getEditor("dependants").option("dataSource", data);
                                //hide
                                viewModel.hide_dependants();
                                viewModel.add_dependants_prem(dependants_data['dp_sa'], dependants_data['dp_premium']);
                                //formDependantInstance.resetValues();
                            }
                        }
                    }
                }]
        },
        add_dependants_prem: function (sa, prem) {
            let data = formPolicyDetailsInstance.option("formData");
            if (plan_code == "37" || plan_code == "36" || plan_code == "38" || plan_code == "33" || plan_code == "35") {
                //add sa
                if (data['sum_assured'] == undefined) data['sum_assured'] = 0;
                let sum_assured = parseFloat(data['sum_assured']) + parseFloat(sa);
                if (data['DependantPremium'] == undefined) data['DependantPremium'] = 0;
                let DependantPremium = parseFloat(data['DependantPremium']) + parseFloat(prem);
                formPolicyDetailsInstance.updateData("sum_assured", sum_assured);
                formPolicyDetailsInstance.updateData("DependantPremium", DependantPremium);//policy_fee

                //calculate modal_premium
                let modal_premium = parseFloat(DependantPremium) + parseInt(data['pol_fee']);
                formPolicyDetailsInstance.updateData("modal_premium", modal_premium);

                //TODO - Include transfer charge & TotalPremium...
                if (data['transfer_charge'] == undefined) data['transfer_charge'] = 0;
                let transfer_charge = parseFloat(data['transfer_charge']) + parseFloat(tmp_transfer_charge);
                formPolicyDetailsInstance.updateData("transfer_charge", transfer_charge);


                let total_premium = parseFloat(transfer_charge) + parseFloat(DependantPremium) + parseInt(data['pol_fee']);
                formPolicyDetailsInstance.updateData("total_premium", total_premium);
            }
            if (plan_code == "10") {
                if (data['DependantPremium'] == undefined) data['DependantPremium'] = 0;
                let DependantPremium = parseFloat(data['DependantPremium']) + parseFloat(prem);
                console.log(DependantPremium);
                if (data['basic_premium'] == undefined) data['basic_premium'] = 0;
                let modal_premium = parseFloat(data['basic_premium']) + parseFloat(prem);

                formPolicyDetailsInstance.updateData("DependantPremium", parseFloat(DependantPremium).toFixed(2));
                //let modal_premium = parseFloat(DependantPremium) + parseInt(basic_premium);
                formPolicyDetailsInstance.updateData("modal_premium", parseFloat(modal_premium).toFixed(2));
            }
        },
        //////end of pop up dependants//



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
                formPolicyDetailsInstance = e.component;
                has_loaded = 1;
                viewModel.LoadPanelShown(false);
            },

            items: [

                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: 'Personal Details',
                    visible: true,
                    colCount: 4,
                    items: [
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
                            editorType: "dxTextBox",
                            dataField: "mobile",
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
                        },
                    ],
                },
                {
                    colSpan: 4,
                    itemType: 'group',
                    caption: 'Policy Details',
                    visible: true,
                    colCount: 4,
                    items: [
                        {
                            label: {
                                text: "Date of Birth"
                            },
                            dataField: "dob",
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
                                readOnly: rd_plan,
                                closeOnOutsideClick: true,
                                dataSource: PlanInfo,
                                displayExpr: 'description',
                                valueExpr: 'plan_id',
                                onValueChanged: function (e) {

                                    viewModel.default_vs_premiums();
                                    
                                    if (plan_code == "10") {//Anidaso
                                        viewModel.get_paymode("10");
                                        viewModel.display_vs_anidaso();
                                    }
                                    if (plan_code == "13") {//Anidaso
                                        viewModel.get_paymode("13");
                                        viewModel.display_vs_edwa_nkosuo();
                                    }
                                    if (plan_code == "37") {//Funeral-Premium
                                        viewModel.get_paymode("37");
                                        viewModel.display_vs_funeral_premium();
                                    }
                                    if (plan_code == "38") {//personal accident
                                        viewModel.get_paymode("38");
                                        viewModel.display_vs_pa();
                                    }
                                    if (plan_code == "33") {//family comprehension
                                        viewModel.get_paymode("33");
                                        viewModel.display_vs_family_comprehension();
                                    }
                                    if (plan_code == "2") {//ESB
                                        viewModel.get_paymode("2");
                                        viewModel.display_vs_esb();
                                    }
                                    if (plan_code == "36") {//Funeral-Ideal
                                        viewModel.get_paymode("36");
                                        viewModel.display_vs_funeral_ideal();
                                    }
                                    if (plan_code == "35") {//Funeral-Ideal
                                        viewModel.get_paymode("35");
                                        viewModel.display_vs_hci();
                                    }
                                    if (plan_code == "34") {//GEEP
                                        viewModel.get_paymode("34");
                                        viewModel.display_vs_geep();
                                    }
                                    if (plan_code == "31") {//ELS
                                        viewModel.get_paymode("31");
                                        viewModel.display_vs_els();
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
                                message: "Pay Mode is required"
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
                                valueExpr: 'id'
                            },
                            validationRules: [{
                                type: "required",
                                message: "Pay Mode is required"
                            }]
                        }, {
                            label: {
                                text: "Basic Premium"
                            },
                            editorType: "dxNumberBox",
                            editorOptions: {
                                onValueChanged: function (e) {
                                    if (plan_code == "2") {
                                        //total_premium, anb, term, fn
                                        let data = formPolicyDetailsInstance.option("formData");
                                        //let data_personal = formPersonalDetailsInstance.option("formData");
                                        //let height = data['pop_height'];
                                        viewModel.calculate_esb(e.value, data['anb'], data['term'], "M", data['client_class_code'], function () {
                                            console.log("esb calculation done");
                                        });
                                    }
                                    if (plan_code == "10") {//Anidaso
                                        //total_premium, anb, term, fn
                                        let data = formPolicyDetailsInstance.option("formData");
                                        //let height = data['pop_height'];
                                        viewModel.calc_anidaso_life_prem(e.value, data['term'], data['anb']);
                                    }
                                    if (plan_code == "34") {//GEEP
                                        //total_premium, anb, term, fn
                                        let data = formPolicyDetailsInstance.option("formData");
                                        //let height = data['pop_height'];
                                        viewModel.calculate_geep(e.value, data['anb'], data['term'], data['paymode_code'], function () {
                                            console.log("geep calculation done");
                                        });
                                    }
                                }
                            },
                            dataField: "basic_premium",
                            visible: false
                        }, {
                            label: {
                                text: "Total Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "total_premium",
                            editorOptions: {
                                onValueChanged: function (e) {//
                                    if (plan_code == "2") {
                                        //total_premium, anb, term, fn
                                        let data = formPolicyDetailsInstance.option("formData");
                                        //let height = data['pop_height'];
                                        viewModel.calculate_esb(e.value, data['anb'], data['term'], function () {
                                            console.log("esb calculation done");
                                        });
                                    }
                                    if (plan_code == "34") {//GEEP
                                        //total_premium, anb, term, fn
                                        let data = formPolicyDetailsInstance.option("formData");
                                        //let height = data['pop_height'];
                                        viewModel.calculate_geep(e.value, data['anb'], data['term'], function () {
                                            console.log("geep calculation done");
                                        });
                                    }
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
                                onValueChanged: function (e) {//
                                    if (has_loaded == 1) {
                                        let data = formPolicyDetailsInstance.option("formData");
                                        if (plan_code == '31') {
                                            //els
                                            viewModel.calc_els(data['sum_assured'], data['anb'], data['term'], data['paymode_code'], function (results) {
                                                viewModel.LoadPanelShown(false);
                                            });
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "Sum Assured is required"
                            }]
                        },//
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
                                text: "Transfer Charge"
                            },
                            editorType: "dxNumberBox",
                            dataField: "transfer_charge",
                            visible: false
                        }, {
                            colSpan: 4,
                            itemType: "empty",

                        }, {
                            colSpan: 4,
                            dataField: "riders",
                            editorType: "dxDataGrid",
                            visible: true,
                            editorOptions: {
                                columnHidingEnabled: true,
                                dataSource: Riders_,
                                wordWrapEnabled: true,
                                editing: {
                                    allowUpdating: false,
                                    mode: 'form',
                                    allowAdding: false,
                                    allowDeleting: false,
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
                            colSpan: 4,
                            itemType: "empty",

                        }, {
                            colSpan: 4,
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
                        },
                        {
                            colSpan: 4,
                            dataField: "dependants",
                            editorType: "dxDataGrid",
                            visible: true,
                            editorOptions: {
                                columnHidingEnabled: true,
                                dataSource: DP_,
                                wordWrapEnabled: true,
                                onRowRemoving: function (e) {
                                    if (plan_code == "10") {

                                        let dp_prem = e.data.dp_premium;

                                        let data = formPolicyDetailsInstance.option("formData");
                                        //subract from dependatspremium and modal premium
                                        let DependantPremium = data['DependantPremium'];

                                        let modal_premium = data['modal_premium'];

                                        DependantPremium = parseFloat(DependantPremium) - parseFloat(dp_prem);
                                        modal_premium = parseFloat(modal_premium) - parseFloat(dp_prem);

                                        formPolicyDetailsInstance.updateData("DependantPremium", parseFloat(DependantPremium).toFixed(2));
                                        formPolicyDetailsInstance.updateData("modal_premium", parseFloat(modal_premium).toFixed(2));
                                    }
                                },
                                editing: {
                                    allowUpdating: false,
                                    mode: 'form',
                                    allowAdding: false,
                                    allowDeleting: false,

                                    form: {
                                        items: dependants_form
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
                                        visible: vs_hci_plan,
                                        lookup: {
                                            dataSource: BaPackages, valueExpr: 'id', displayExpr: 'description'
                                        }
                                    }, {
                                        dataField: 'dp_hci_sum',
                                        caption: 'HCI Sum Assured',
                                        visible: vs_hci_plan,
                                        dataType: 'number',
                                        allowEditing: false,
                                    }, {
                                        dataField: 'dp_duration',
                                        caption: 'Days Covered',
                                        visible: vs_hci_plan,
                                        dataType: 'number',
                                        allowEditing: false,
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
                            colSpan: 4,
                            itemType: "empty",

                        }, {
                            label: {
                                text: "Dependants Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "DependantPremium",
                            visible: false
                        }, {
                            label: {
                                text: "Modal Premium"
                            },
                            editorType: "dxNumberBox",
                            dataField: "modal_premium",
                            visible: true,
                            validationRules: [{
                                type: "required",
                                message: "Modal Premium is required"
                            }]
                        },

                        {
                            colSpan: 4,
                            itemType: "empty"
                        }, {
                            colSpan: 4,
                            itemType: "empty"
                        },
                    ]
                },
                
                {
                    colSpan: 4,
                    itemType: "button",
                    buttonOptions: {
                        text: "SUBMIT ✓",
                        
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
            let form_data = formPolicyDetailsInstance.option("formData");//client_no
            //form_data['client_no'] = SmartLife.clientno();
            form_data['dob'] = viewModel.formatDate(new Date(form_data['dob']));
            //if (plan_code == "29") {
                //form_data['dependants'] = JSON.stringify(formPolicyDetailsInstance.getEditor('dependants').option('dataSource'));
            //}
            if (formPolicyDetailsInstance.getEditor('dependants') != undefined) {
                form_data['dependants'] = JSON.stringify(formPolicyDetailsInstance.getEditor('dependants').option('dataSource'));
            }
            if (formPolicyDetailsInstance.getEditor('riders') != undefined) {
                form_data['riders'] = JSON.stringify(formPolicyDetailsInstance.getEditor('riders').option('dataSource'));
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