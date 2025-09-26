(function ($, DX, undefined) {
    DX.framework.html.TreeViewController = DX.framework.html.DefaultLayoutController.inherit({
        ctor: function (options) {
            options = options || {};
            options.name = options.name || "custom";
            this.callBase(options)
        },
        _showViewImpl: function (viewInfo) {
            var that = this;
            return that.callBase.apply(that, arguments).done(function () {
                //var treeview = that._$mainLayout.find('#custom').dxTreeView('instance');
                //treeview.option('items', window.SmartLife.config.navigation);
                //handleExpandTree();
                //$("#user_fullnames").text(SmartLife.usr_fullnames());
                //SmartLife.usr_fullnames(that._$mainLayout.find('#treeView').dxTreeView('instance'));
            })
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["custom"] = layoutSets["custom"] || [];
    layoutSets["custom"].push({
        platform: "generic",
        controller: new DX.framework.html.TreeViewController
    });

    function handleExpandTree() {
        var treeView = $('#custom').dxTreeView('instance');
        var nodeItems = treeView.element().find(".dx-treeview-item");
        for (var i = 0; i < nodeItems.length; i++) {
            treeView.expandItem(nodeItems[i]);
        }
    }


})(jQuery, DevExpress);


var view_nav = new DevExpress.data.LocalStore({
    name: "view_nav",
    key: "id"
});


$(function () {
    var table = $('#logout_btn').children();
    table.find('p').click(function () {
        alert('heart');
    });
});

$(function () {
    $("#logoutbtn").dxButton({
        text: 'Log out',
        icon: 'user',
        onInitialized: function (e) {
            e.component.on("click", function () { alert('logout clicked'); });
        }
    });
});

var logged_user = new DevExpress.data.LocalStore({
    name: "logged_user",
    key: "id"
});

doLogout = function () {
    var usr_logout = new LogOut({
        name: "logging user out"
    });
    usr_logout.user_logout(function (result) {
        if (result == true) {
            SmartLife.app.navigate('dashboard', { root: true });
        }
    });
};
SmartLife.treeview = function (params) {

    var viewModel = {

        viewShown: function () {
            alert('here');
        },
        doLogout: function () {
            alert('logout');
        }

    };

    return viewModel;
};