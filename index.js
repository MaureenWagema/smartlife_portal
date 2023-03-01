function findController(name, controllers) {
    var result = $.grep(controllers, function (item, index) {
        return item.controller.name == name;
    });
    return result.length ? result[0].controller : null;
}
function load_application() {
    $(function () {
        var startupView = "agent_login";//"main_dashboard";//"login";//"Layout";//
        //var startupView = "login";//client
        //var startupView = "user_login";//pos
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
            }
            if (args.viewInfo.viewName == 'Layout') {
                //alert("hererev");
                args.layoutController = findController('empty', args.availableLayoutControllers);
            }
            if (args.viewInfo.viewName == 'register') {
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
            if (args.viewInfo.viewName == 'proposal_form' && SmartLife.is_logged == 0) {
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



            try{

                if (e.uri == "login" || e.uri == "register" || e.uri == "user_login" || e.uri == "agent_login") {

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

function sync_autoload_params() {
    //load all params
    var sync_data = new Sync({
        name: "syncing general parameters"
    });
    sync_data.sync_parameters(function (result) {
        if (result) {
            load_application();
        }
    });
}

function sign_in_usr() {
    //sync_autoload_params();
    /*logged_user.byKey(1).done(function (values) {
        //assign basic params for user
        //Portal.section(values.portal_section);
        
        //TODO login

    }).fail(function (error) {
        // handle error
        console.log(error);
        //TODO load params
        sync_autoload_params();
        });
    */
    


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

//Sync params first...
$(function () {
    SmartLife.url = "http://"+window.location.hostname+":90/glico_api/public/";
    SmartLife.hutbtel_url = "http://197.159.142.163:90/hubtel/";
    //SmartLife.url = "http://149.102.141.123:90/glico_api/public/";
    /*SmartLife.is_logged = 0;
    SmartLife.is_admin = 0;
    SmartLife.clientno = '';////K661141   C00300142
    SmartLife.client_name = '';
    SmartLife.agent_no = '';///NYA0001
    SmartLife.agent_name = '';
    SmartLife.pos = '';
    SmartLife.pos_name = '';
    SmartLife.channel = 1;
    SmartLife.login_type = 1;*///1.client,2.agent(bancassuarance,credit_life),3.pos
    //Initialize other params here in the future..
    //TODO Sign in User
    sign_in_usr();
});