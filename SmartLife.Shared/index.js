var startupView = "user_login";
function findController(name, controllers) {
    var result = $.grep(controllers, function (item, index) {
        return item.controller.name == name;
    });
    return result.length ? result[0].controller : null;
}//202200591

function getQueryParam(param) {
    const urlSearchParams = new URLSearchParams(window.location.href);
    return urlSearchParams.get(param);
}

function load_application() {
    $(function () {
        //var startupView = "register";
        //var startupView = "agent_login";//"main_dashboard";//"login";//"Layout";//
        //var startupView = "login";//client
        //var startupView = "creditLife";//client
        //var startupView = "bancassurance";
        //var startupView = "user_login";//pos  
        //var startupView = "group_login";//group life  //
        //var startupView = "brokers";
        //var startupView = "quote_group_list";
        //var startupView = "member_login";//group life  
        
        //var startupView = "MainDashboard";
        //if (SmartLife.is_logged != 1) startupView = "user_login";
        DevExpress.devices.current("desktop");

        /*var layoutSet = DevExpress.framework.html.layoutSets[SmartLife.config.layoutSet],
            navigation = SmartLife.config.navigation;*/

        var layoutSet = [];
        layoutSet.push.apply(layoutSet, DevExpress.framework.html.layoutSets[SmartLife.config.layoutSet]);
        layoutSet.push.apply(layoutSet, DevExpress.framework.html.layoutSets["empty"]);
        var navigation = SmartLife.config.navigation;


        SmartLife.app = new DevExpress.framework.html.HtmlApplication({
            namespace: SmartLife,
            layoutSet: layoutSet,
            animationSet: DevExpress.framework.html.animationSets[SmartLife.config.animationSet],
            mode: "webSite",
            navigation: navigation,
            commandMapping: SmartLife.config.commandMapping,
            navigateToRootViewMode: "keepHistory",
            useViewTitleAsBackText: true
        });

        SmartLife.app.on("viewShown", function (args) {
            document.title = ko.unwrap(args.viewInfo.model.title) || "SmartLife";
        });

        $(window).on("unload", function () {
            SmartLife.app.saveState();
        });

        SmartLife.app.router.register(":view/:id", { view: startupView, id: undefined });
        SmartLife.app.on("resolveLayoutController", function (args) {


            if (args.viewInfo.viewName == 'login') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'user_login') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'agent_login') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }//
            if (args.viewInfo.viewName == 'bancassurance') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'brokers') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'Layout') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'register') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'group_login') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'member_login') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            
            if (args.viewInfo.viewName == 'confrim_password') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'forgot_password') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'creditLife') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }//main_dashboard
            if (args.viewInfo.viewName == 'main_dashboard') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }

            //if not logged in, do the whole form capture thing
            if (args.viewInfo.viewName == 'get_quotation' && SmartLife.is_logged == 0) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'policy_det' && SmartLife.is_logged == 0) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'caputre_quotation' && SmartLife.is_logged == 0) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'proposal_form' && SmartLife.is_logged == 0 || SmartLife.is_logged == undefined) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'policy_det' && SmartLife.is_logged == 0 || SmartLife.is_logged == undefined) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'get_quotation' && SmartLife.is_logged == 0 || SmartLife.is_logged == undefined) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'reports' && (SmartLife.is_logged == 0 || SmartLife.is_logged == undefined)) {
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }

        });
        SmartLife.app.navigate();

        SmartLife.app.on("initialized", function () {

             //"http://" + Portal.ip_address + "/" + Portal.root_folder + "/cassoaPortalAPI/";
            

        });

        SmartLife.navigationState = new DevExpress.data.LocalStore({
            key: "id",
            name: "navigationState",


            // Other LocalStore options go here
        });

        SmartLife.app.on("navigating", function (e) {
            try {
                //startupView = "user_login";
                //check if param n is set
                let expose_n = getQueryParam('n');
                console.log("the value of n is: " + expose_n);
                if (expose_n != undefined && expose_n == 1) {
                    //do nothing
                } else {
                    if (SmartLife.is_logged != 1) {
                        if (e.uri == "login" || e.uri == "brokers" || e.uri == "bancassurance" || e.uri == "register" ||
                            e.uri == "user_login" || e.uri == "agent_login" || e.uri == "creditLife" || e.uri == "group_login" ||
                            e.uri == "member_login" || e.uri == "confrim_password" || e.uri == "forgot_password") {
                            //do nothing
                        } else {
                            e.uri = startupView;
                        }
                    }
                }
                let view = e.uri;
                let tmp_view = view.split("/");
                view = tmp_view[0];
                //(e.uri == "reports" && SmartLife.is_logged == 0)
                //,
                if (view == "login" || view == "brokers" || view == "bancassurance" || view == "register" || view == "user_login" || view == "agent_login" || view == "creditLife" || view == "group_login" || view == "member_login" || view == "confrim_password" || view == "forgot_password" || ((view == "reports" || view == "proposal_form" || view == "policy_det" || view == "get_quotation" ) && (SmartLife.is_logged == 0 || SmartLife.is_logged == undefined))) {

                    var link = document.getElementById('mySidenav');
                    link.style.display = 'none';
                    //link.style.visibility = 'hidden';
                }
                else {


                    var link = document.getElementById('mySidenav');



                    link.style.display = 'block';
                  //  link.style.visibility = 'hidden';

                   // document.getElementById("mySidenav").style.display = "block  !important";

                }

                //if small screen just hide the 
                if ($(window).width() < 768) {
                    hidenavigation();
                }
            } catch (Er) {

                console.log(Er);
            }

            SmartLife.navigationState.clear();
            SmartLife.navigationState.insert({
                id: 10254,
                prev: e.currentUri,

            })
                .done(function (values, key) {
                    //  DevExpress.ui.dialog.alert("Saved.")


                })
                .fail(function (error) {

                });


            console.log(e);

            SmartLife.previousViewName = e.currentUri;


            try {




                var lights = document.getElementsByClassName("active_link");
                while (lights.length)
                {

                    lights[0].classList.remove("active_link");
                }
              


                setTimeout(function () {

                    // Something you want delayed.

                    var currid = e.uri;

                    try {

                        const page_ = e.uri.split('/');
                        currid = page_[0];

                    } catch (ex) {

                       
                    }

                    var element = document.getElementById(currid);
                    element.classList.add("active_link");


                }, 500);

              




            } catch (Er) {

               /// alert(Er);
            }



            try {
                // document.getElementById("brockerMail").innerHTML = SmartLife.email;
                // document.getElementById("brockerno").innerHTML = SmartLife.AccountNo;
                //  document.getElementById("viewName").innerHTML = e.uri.toUppercase();



                var elem = document.getElementById('viewName');

                elem.innerHTML = e.uri;

                try{

                    const page_ = e.uri.split('/');
                    elem.innerHTML = page_[0];

                }catch(ex){

                    elem.innerHTML = e.uri;
                }





            }
            catch (Er) {

                console.log(Er);
            }

            // alert(portalMedical.previousViewName);
        });
    });
    
}

function hidenavigation() {
    view_nav.byKey(1).done(function (values) {
        //update the values
        //console.log(values);
        var val_i = values.i;
        var var_i = 0;
        if (val_i == 0) {
            var_i = 1;
        } else {
            var_i = 0;
        }

        /*if (var_i == 0) {
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
        } else if (var_i == 1) {*/
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
        //}

        view_nav.update(1, {
            i: var_i
        }).done(function (values, key) {
            //console.log(values);
        }).fail(function (error) {
            console.log(error);
        });

    }).fail(function (error) {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        view_nav.insert({
            id: 1,
            i: 1,
        }).done(function (values, key) {

        }).fail(function (error) {
            console.log(error);
        });
    });
}

function sync_autoload_params() {
    //load all params
    var loadPanel = $("#loadPanel").dxLoadPanel({
        visible: false, // Initially hidden
        message: "Loading......Please be Patient.....Thanks", // Message to be displayed
        shadingColor: "rgba(0,0,0,0.4)", // Shading color
        position: { at: "center", my: "center" }// Position relative to the container element
    }).dxLoadPanel("instance");
    console.log(loadPanel);
    loadPanel.option("visible", true);
    var sync_data = new Sync({
        name: "syncing general parameters"
    });
    sync_data.sync_parameters(function (result) {
        loadPanel.option("visible", false);
        if (result) {
            load_application();
        }
    });
}

function sign_in_usr() {
    //sync_autoload_params();
    logged_user.byKey(1).done(function (values) {
        //assign basic params for user
        SmartLife.is_logged = values.is_logged;
        SmartLife.is_admin = values.is_admin;
        SmartLife.clientno = values.clientno;
        SmartLife.client_name = values.client_name;
        SmartLife.agent_no = values.agent_no;
        SmartLife.agent_name = values.agent_name;
        SmartLife.pos = values.pos;
        SmartLife.pos_name = values.pos_name;
        SmartLife.channel = values.channel;
        SmartLife.login_type = values.login_type;
        SmartLife.pos_type = values.pos_type;

        SmartLife.scheme_no = values.scheme_no;
        SmartLife.scheme_name = values.scheme_name;
        SmartLife.member_no = '';

        SmartLife.broker_id = values.broker_id;
        SmartLife.broker_name = values.broker_name;

        var get_roles = new Access({
            name: "getting access roles"
        });
        get_roles.get_access_roles(function (status) {
            if (status) {
                sync_autoload_params();
            }
        });
        //TODO login
    }).fail(function (error) {
        // handle error
        console.log(error);
        //TODO load params
        sync_autoload_params();
    });
    
    
}

function getProtocolWithoutHostname() {
    const fullURL = window.location.href;
    const protocolIndex = fullURL.indexOf('://');
    if (protocolIndex !== -1) {
        return fullURL.substr(0, protocolIndex);
    }
    return null; // If protocol not found, return null or handle it according to your needs
}

//Sync params first...
$(function () {
    
    //Initialize other params here in the future..
	
	if (window.location.host == "smartlife.glicolife.com" && getProtocolWithoutHostname() == "https") {
        SmartLife.url = getProtocolWithoutHostname()+"://"+window.location.hostname+"/glico_api/public/";
        //SmartLife.rpt_url = window.location.protocol+"://197.159.142.171:85/api/Report/";
        SmartLife.rpt_url = "http://197.159.142.171:85/api/Report/";
        SmartLife.hutbtel_url = getProtocolWithoutHostname()+"://"+window.location.hostname+"/hubtel/";
    } else {
        SmartLife.url = getProtocolWithoutHostname()+"://"+window.location.hostname+":90/glico_api/public/";
		//SmartLife.rpt_url = "http://197.159.142.171:85/api/Report/";
		SmartLife.rpt_url = getProtocolWithoutHostname()+"://"+window.location.hostname+":85/api/Report/";
		SmartLife.hutbtel_url = getProtocolWithoutHostname()+"://"+window.location.hostname+":90/hubtel/";
    }
	
    //TODO Sign in User
    sign_in_usr();
});

