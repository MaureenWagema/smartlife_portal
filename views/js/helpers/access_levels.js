var Access = (function (window, $Access) {
    //"use strict";

    if (window[$Access] && !window.opera) return window[$Access];


    var
        AccessPrototype = Access.prototype
        ;

    var logged_user = new DevExpress.data.LocalStore({
        name: "logged_user",
        key: "id"
    });


    AccessPrototype.get_access_roles = get_access_roles;
    AccessPrototype.save_login = save_login;

    function Access(options) {
        if (!(this instanceof Access))
            return new Access(options);
        //TODO insert synced data
        var self = this;
        loadpanel = options.loadpanel;
        console.log(options.name);
        return self;
    }

    function get_default_roles() {
        SmartLife.config.navigation[0].visible(false);
        SmartLife.config.navigation[1].visible(false);
        SmartLife.config.navigation[2].visible(false);
        SmartLife.config.navigation[3].visible(false);
        SmartLife.config.navigation[4].visible(false);
        SmartLife.config.navigation[5].visible(false);
        SmartLife.config.navigation[6].visible(false);
        SmartLife.config.navigation[7].visible(false);
        SmartLife.config.navigation[8].visible(false);
        SmartLife.config.navigation[9].visible(false);
        SmartLife.config.navigation[10].visible(false);
        SmartLife.config.navigation[11].visible(false);
    }

    //return the access roles
    function get_access_roles(fn) {
        get_default_roles();

        //client
        if (SmartLife.login_type == 1) {
            SmartLife.config.navigation[0].visible(true);
            SmartLife.config.navigation[3].visible(true);
            SmartLife.config.navigation[4].visible(true);
            SmartLife.config.navigation[6].visible(true);
            SmartLife.config.navigation[9].visible(true);
            SmartLife.config.navigation[10].visible(true);
        }
        //agent
        else if (SmartLife.login_type == 2) {
            SmartLife.config.navigation[1].visible(true);
            SmartLife.config.navigation[3].visible(true);
            SmartLife.config.navigation[5].visible(true);
            SmartLife.config.navigation[11].visible(true);
        }
        //pos
        else if (SmartLife.login_type == 3) {
            SmartLife.config.navigation[2].visible(true);
            SmartLife.config.navigation[3].visible(true);
            SmartLife.config.navigation[4].visible(true);
            SmartLife.config.navigation[5].visible(true);
            SmartLife.config.navigation[7].visible(true);
            SmartLife.config.navigation[9].visible(true);
            SmartLife.config.navigation[10].visible(true);
        }
        fn(true);
    }

    function save_login(fn) {
        logged_user.byKey(1).done(function (dataItem) {
            //update the values
            logged_user.update(1, {
                is_logged: SmartLife.is_logged,
                is_admin: SmartLife.is_admin,
                clientno: SmartLife.clientno,
                client_name: SmartLife.client_name,
                agent_no: SmartLife.agent_no,
                agent_name: SmartLife.agent_name,
                pos: SmartLife.pos,
                pos_name: SmartLife.pos_name,
                channel: SmartLife.channel,
                login_type: SmartLife.login_type
            }).done(function (values, key) {
                //console.log(values);
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
                fn(true);
            }).fail(function (error) {
                console.log(error);
            });

        }).fail(function (error) {
            //console.log(error);
            //insert the value to the localstore
            logged_user.insert({
                id: 1,
                is_logged: SmartLife.is_logged,
                is_admin: SmartLife.is_admin,
                clientno: SmartLife.clientno,
                client_name: SmartLife.client_name,
                agent_no: SmartLife.agent_no,
                agent_name: SmartLife.agent_name,
                pos: SmartLife.pos,
                pos_name: SmartLife.pos_name,
                channel: SmartLife.channel,
                login_type: SmartLife.login_type
            }).done(function (values, key) {
                console.log(values);
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
                fn(true);
            }).fail(function (error) {
                console.log(error);
            });
        });

    }

    return Access;

}(this, "Access"));