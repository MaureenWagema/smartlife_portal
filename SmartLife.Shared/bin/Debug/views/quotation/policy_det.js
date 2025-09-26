SmartLife.policy_det = function (params) {
    "use strict";

    var pol_det = new Policy_det({
        name: "get policy details"
    });

    var plan_code;



    var viewModel = {
        //  Put the binding properties here
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
        backButtonVisible: ko.observable(false),
        backButtonAction: function (e) {
            SmartLife.app.back();
        },

        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        LoadPanelShown: ko.observable(false),

        toolbarItems: [
            {
                widget: 'dxButton',
                options: {
                    type: 'back',
                    text: 'Back',
                    onClick: function () {
                        SmartLife.app.back();
                    }
                },
                location: 'before'
            }
        ],

        display_details: function (item) {
            //$('#background_img').empty();
            if (item == "1") {
                plan_code = "2";
                //var img_path = ;
                //$("#background_img").css({ "background-image": "url('images/gallery/esb.png')", "opacity": "0.9", "background-repeat": "no-repeat", "object-fit": "fill" });
                $('#esb').empty();
                $('#esb').append(pol_det.get_esb());
            } else if (item == "2") {
                plan_code = "37";
                //$("#background_img").css({ "background-image": "url('images/gallery/funeral_plan.png')", "opacity": "0.9", "background-repeat": "no-repeat" });
                $('#gfp').empty();
                $('#gfp').append(pol_det.get_gfp());
            } else if (item == "3") {
                plan_code = "26";
                //$("#background_img").css({ "background-image": "url('images/gallery/endowment_ed_plan.png')", "opacity": "0.9", "background-repeat": "no-repeat" });
                $('#geep').empty();
                //$('#geep').append(pol_det.get_geep());
                viewModel.displayPDF('assets/tc/ENHANCED-GEEP.pdf');
            } else if (item == "4") {
                //$("#background_img").css({ "background-image": "url('images/gallery/gritical_illness_plan.png')", "opacity": "0.9", "background-repeat": "no-repeat" });
                $('#gcip').empty();
                $('#gcip').append(pol_det.get_gcip());
            } else if (item == "5") {
                //$("#background_img").css({ "background-image": "url('images/gallery/life_guaranteed_plan.png')", "opacity": "0.9", "background-repeat": "no-repeat" });
                $('#lgp').empty();
                $('#lgp').append(pol_det.get_lgp());
            } else if (item == "6") {
                //$("#background_img").css({ "background-image": "url('images/gallery/savings_plan.png')", "opacity": "0.9", "background-repeat": "no-repeat" });
                $('#saving').empty();
                //$('#saving').append(pol_det.get_saving());
                viewModel.displayPDF('assets/tc/ENHANCE-LS.pdf');
            } else if (item == "7") {
                //$("#background_img").css({ "background-image": "url('images/gallery/travel_plan.png')", "opacity": "0.9", "background-repeat": "no-repeat" });
                $('#travel').empty();
                $('#travel').append(pol_det.get_travel());
            }
        },
        viewShown: function () {
            //DevExpress.ui.dialog.alert(params.item);
            viewModel.display_details(params.item);

            if (SmartLife.login_type == 1) {
                viewModel.vs_client(false);
            } else {
                viewModel.vs_client(false);
            }

        },

        displayPDF: function (filePath) {
            var pdfViewer = $('#saving');
            pdfViewer.html('<embed src="' + filePath + '" type="application/pdf" width="100%" height="800px" />');
        },

        vs_client: ko.observable(false),
        isToastVisible: ko.observable(false),
        check_logged_in: function (e) {
            /*if (SmartLife.is_logged == 0) {
                //direct to login page
                viewModel.navigateForward("login", params.item);
                viewModel.isToastVisible(true);
            } else {
                //proceed to buy a policy page
                viewModel.navigateForward("buy_a_policy", params.item);
            }*/
            viewModel.navigateForward("caputre_quotation", params.item);
        },
        fill_form: function () {
            var data = { plan_code: plan_code };
            viewModel.navigateForward("proposal_form", JSON.stringify(data));
        },
        get_quote: function () {
            var data = { plan_code: plan_code };
            viewModel.navigateForward("caputre_quotation", JSON.stringify(data));
        },
        send_email: function () {
            viewModel.LoadPanelShown(true);
            let saveQuote = new DB({
                name: "saving quotation"
            });
            //dob,anb,plan_code,term,sum_assured,pol_fee,inv_premium,
            //cepa,rider_premium,life_premium,basic_premium,modal_premium,
            //total_premium,quotation_date
            let form_data = { client_no: SmartLife.clientno(), plan_code: plan_code };//client_no
            saveQuote.DBpost("quotation/saveQuote", form_data).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    //navigate to my applications...
                    //SmartLife.app.back();
                    DevExpress.ui.dialog.alert('Notification sent Successfully', '');
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        buy_policy: function () {
            //TODO
            //1. check if user is logged in, if not direct to login page
            viewModel.check_logged_in();
            //2. once logged in direct to buy_a_policy
        }

    };

    return viewModel;
};