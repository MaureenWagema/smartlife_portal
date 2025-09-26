SmartLife.get_quotation = function (params) {
    //"use strict";
    var tileViewDataSource = [
        {
            id: 1,
            name: "SOFTCLANS END – OF – SERVICE BENEFITS (ESB)",
            desc: "The ESB plan pays out cash benefits at your retirement from active service.",
            ImageSrc: "images/icons/esb.png"
        },
        {
            id: 2,
            name: "SOFTCLANS FUNERAL POLICY (GFP)",
            desc: "The GFP is designed for individuals to pay out cash to attend to the funeral of family members.",
            ImageSrc: "images/icons/funeral.png"
        },
        {
            id: 3,
            name: "SOFTCLANS ENDOWMENT EDUCATION PLAN (GEEP)",
            desc: "The GEEP is essentially an investment plan with insurance benefits designed for individuals to accumulate cash for use in financing a child’s and/ or policyholder’s education.",
            ImageSrc: "images/icons/education.png"
        },
        {
            id: 4,
            name: "SOFTCLANS CRITICAL ILLNESS PLAN (GCIP)",
            desc: "The GCIP is a health policy which pays out a lump sum to the policyholder if he/she is diagnosed by a medical specialist doctor from a registered hospital as having critical/dread diseases.",
            ImageSrc: "images/icons/critical_illness.png"
        },
        {
            id: 5,
            name: "SOFTCLANS LIFE GUARANTEED PLAN (LGP)",
            desc: "The LGP guarantees to provide the a lump sum payment  on condition that all premiums from the inception of the policy have been fully paid.",
            ImageSrc: "images/icons/life_guaranteed.png"
        },
        {
            id: 6,
            name: "SOFTCLANS LIFE SAVINGS PLAN",
            desc: "Guarantees a lump sum payment at the end of a policy period of 10 years, whether the life insured survives to complete payment of the premiums or not.",
            ImageSrc: "images/icons/savings.png"
        }/*,
        {
            id: 7,
            name: "SOFTCLANS TRAVEL INSURANCE PLAN",
            desc: "It’s a vital and worthy consideration for every traveler embarking on a journey to be adequately covered by insurance before the trip for ample protection against the unexpected and also enjoy peace of mind.",
            ImageSrc: "images/gallery/travel_plan.png"
        }*/

    ];

    var window_height = $(window).height();
    var window_width = $(window).width();

    var is_synced = new DevExpress.data.LocalStore({
        name: "is_synced",
        key: "id"
    });

    var viewModel = {
        go_back: function () {
            SmartLife.app.back();
        },
        //  Put the binding properties here
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
        about_SOFTCLANS: function () {
            viewModel.navigateForward("about", "");
        },

        //handle the toolbar items here
        vs_dxtoolbar: ko.observable(false),
        toolbarItems: [
            {
                widget: 'dxButton',
                options: {
                    type: 'back',
                    text: 'Back',
                    onClick: function () {
                        SmartLife.app.back();
                    },
                    //visible: SmartLife.is_logged
                },
                location: 'before'
            }/*,
            {
                locateInMenu: 'always',
                text: "About SOFTCLANS",
                icon:"info",
                onClick: function () {
                    viewModel.navigateForward("about", "");
                }
            },
            {
                locateInMenu: 'always',
                text: "Contact SOFTCLANS",
                icon: "message",
                onClick: function () {
                    viewModel.navigateForward("contact_us", "");
                }
            }*/
        ],
        ////////////end of toolbar

        //handle the tileview here
        dxtile_height: ko.observable(window_height * 0.76),
        dxtile_width: ko.observable(window_width),
        tile_height: ko.observable(window_height * 0.2),
        tile_width: ko.observable(window_width * 0.4),
        tileViewDataSource: tileViewDataSource,
        itemTemplate: function (itemData, itemIndex, itemElement) {
            itemElement.append("<div class=\"price\">" + itemData.name +
                "</div><div class=\"image\" style=\"background-image: url('" + itemData.ImageSrc + "')\"></div>");
        },
        onItemClick: function (e) {
            if (e.itemData.id == 1) {
                viewModel.navigateForward("policy_det", "1");
            } else if (e.itemData.id == 2) {
                viewModel.navigateForward("policy_det", "2");
            } else if (e.itemData.id == 3) {
                viewModel.navigateForward("policy_det", "3");
            } else if (e.itemData.id == 4) {
                viewModel.navigateForward("policy_det", "4");
            } else if (e.itemData.id == 5) {
                viewModel.navigateForward("policy_det", "5");
            } else if (e.itemData.id == 6) {
                viewModel.navigateForward("policy_det", "6");
            } else if (e.itemData.id == 7) {
                viewModel.navigateForward("policy_det", "7");
            } else if (e.itemData.id == 8) {
                viewModel.navigateForward("policy_det", "8");
            }
        },
        ///end of tileview

        client_name: ko.observable(),
        user: ko.observable(''),
        mail: ko.observable(''),
        clientno: ko.observable(''),
        LoadPanelShown: ko.observable(false),

        vs_sign_in: ko.observable(false),
        vs_sign_up: ko.observable(false),


        viewShown: function () {
        /*
            if (SmartLife.is_logged == 0) {
                viewModel.vs_dxtoolbar(true);
                viewModel.vs_sign_in(true);
                viewModel.vs_sign_up(true);
            } else if (SmartLife.is_logged == 1) {
                viewModel.vs_dxtoolbar(false);
                viewModel.vs_sign_in(false);
                viewModel.vs_sign_up(false);

                SmartLife.config.navigation[0].visible(true);
                SmartLife.config.navigation[1].visible(true);
                SmartLife.config.navigation[2].visible(true);
                SmartLife.config.navigation[3].visible(true);
                SmartLife.config.navigation[4].visible(true);
                //SmartLife.config.navigation[5].visible(true);
            }

            viewModel.user(SmartLife.names());
            viewModel.clientno(SmartLife.clientno());
            viewModel.mail(SmartLife.webemail());


            viewModel.check_synced();
            */

            //handle clicks for each produc
            $("#esb_prod").click(function () {
                viewModel.navigateForward("policy_det", "1");
            });
            $("#funeral_prod").click(function () {
                viewModel.navigateForward("policy_det", "2");
            });
            $("#edu_prod").click(function () {
                viewModel.navigateForward("policy_det", "3");
            });
            $("#illness_prod").click(function () {
                viewModel.navigateForward("policy_det", "4");
            });
            $("#life_prod").click(function () {
                viewModel.navigateForward("policy_det", "5");
            });
            $("#savings_prod").click(function () {
                viewModel.navigateForward("policy_det", "6");
            });
            //end of clicks for each products

        },
        buy_esb: function () {
            viewModel.navigateForward("policy_det", "1");
        },
        buy_gfp: function () {
            viewModel.navigateForward("policy_det", "2");
        },
        buy_geep: function () {
            viewModel.navigateForward("policy_det", "3");
        },
        buy_hci: function () {
            viewModel.navigateForward("policy_det", "8");
        },
        buy_gcip: function () {
            viewModel.navigateForward("policy_det", "4");
        },
        buy_lgp: function () {
            viewModel.navigateForward("policy_det", "5");
        },
        buy_glsp: function () {
            viewModel.navigateForward("policy_det", "6");
        },

        today_date: ko.observable(new Date()),
        check_synced: function () {
            is_synced.byKey(1).done(function (values) {
                //check if value for synced is 1 if not sync
                if (values.synced == 1) {
                    //just load the parameters
                    viewModel.loadParameters();
                } else {
                    //sync
                    viewModel.getParameters();
                }
            }).fail(function (error) {
                // handle error
                console.log(error);
                is_synced.insert({
                    id: 1,
                    synced: 0,
                    synced_date: viewModel.today_date()
                }).done(function (values, key) {
                    console.log(values);
                    viewModel.getParameters();
                }).fail(function (error) {
                    console.log(error);
                });

            });
        },

        loadParameters: function () {
            //viewModel.LoadPanelShown(true);
            var loadpanel = $('#loadpanel').dxLoadPanel('instance');
            //initialize sync class
            var load_data = new Load_params({
                name: "loading parameters",
                loadpanel: loadpanel
            });
            load_data.load_all_parameters(db, loadpanel);
        },

        getParameters: function () {
            //TODO read from the localstore if empty then sync else do nothing
            viewModel.LoadPanelShown(true);
            var loadpanel = $('#loadpanel').dxLoadPanel('instance');
            //initialize sync class
            var sync_data = new Sync({
                name: "syncing batches",
                loadpanel: loadpanel
            });
            //sync_data.sync_parameters(db, loadpanel, is_synced);
        },
        get_dxtile_height: function () {
            var heights = window_height * 0.8;
            if (SmartLife.is_logged == 0) {
                heights = window_height * 0.8;
            } else {
                heights = window_height * 0.95;
            }
            return heights;
        },

        /////links/////
        dologin: function () {
            viewModel.navigateForward("login", "");
            //SmartLife.app.navigate('login', { root: true });
        },
        dosignup: function () {
            viewModel.navigateForward("registration", "");
        },
        ///end links///
        gotoStatements: function () {
            viewModel.navigateForward("view_statement", "");
        },
        gotoPayment: function () {
            viewModel.navigateForward("make_a_payment", "");
        },
        gotoBuy: function () {
            viewModel.navigateForward("caputre_quotation", "");
        }


    };

    return viewModel;
};