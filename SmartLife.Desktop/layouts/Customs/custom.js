"use strict";

(function(root, factory) {
    /* global define, DevExpress, jQuery */
    if (typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.customLayout = factory(
            jQuery,
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController
        );
        root.DevExpress.framework.html.customLayoutController = root.DevExpress.layouts.customLayout.customLayoutController;
    }
}(window, function($, layoutSets, DefaultLayoutController) {

    var exports = {};

    var customLayoutController = DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "custom";
            this.callBase(options);
        }
    });

    layoutSets["custom"] = layoutSets["custom"] || [];
    layoutSets["custom"].push({
        controller: new customLayoutController()
    });

    exports.customLayoutController = customLayoutController;

    return exports;

}));