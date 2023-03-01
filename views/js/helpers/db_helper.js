var DB = (function (window, $DB) {
    //"use strict";

    if (window[$DB] && !window.opera) return window[$DB];


    var
        DBPrototype = DB.prototype
        ;

    DBPrototype.DBget = DBget;
    DBPrototype.DBpost = DBpost
    DBPrototype.DBhubtel = DBhubtel;

    function DB(options) {
        if (!(this instanceof DB))
            return new DB(options);
        //TODO insert synced data
        var self = this;
        loadpanel = options.loadpanel;
        console.log(options.name);
        return self;
    }

    //handle all GET requests. //DBhubtel
    function DBget(url) {
        return $.ajax({
            method: "GET",
            url: SmartLife.url + url,
            timeout: 1000000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                //DevExpress.ui.notify('User not allowed', error, 2000);
            }
        });
    }

    function DBhubtel(url) {
        return $.ajax({
            method: "GET",
            url: SmartLife.hutbtel_url + url,
            timeout: 1000000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                //DevExpress.ui.notify('User not allowed', error, 2000);
            }
        });
    }
    

    //handle all POST requests
    function DBpost(url, data) {
        return $.ajax({
            method: "POST",
            url: SmartLife.url + url,
            data: data,
            timeout: 10000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                //DevExpress.ui.notify('User not allowed', error, 2000);
            }
        });
    }
    return DB;

}(this, "DB"));