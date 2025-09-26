$(function() {
    var startupView = "About";

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    if(DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }

    var isDeviceReady = false,
        isViewShown = false;

    function hideSplashScreen() {
        if(isDeviceReady && isViewShown) {
            navigator.splashscreen.hide();
        }
    }

	if(document.addEventListener) {
		document.addEventListener("deviceready", function () {
			isDeviceReady = true;
			hideSplashScreen();
			document.addEventListener("backbutton", function () {
				DevExpress.processHardwareBackButton();
			}, false);
		}, false);
	}

    function onViewShown() {
        isViewShown = true;
        hideSplashScreen();
        SmartLife.app.off("viewShown", onViewShown);
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !SmartLife.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    var layoutSet = DevExpress.framework.html.layoutSets[SmartLife.config.layoutSet],
        navigation = SmartLife.config.navigation;


    SmartLife.app = new DevExpress.framework.html.HtmlApplication({
        namespace: SmartLife,
        layoutSet: layoutSet,
        animationSet: DevExpress.framework.html.animationSets[SmartLife.config.animationSet],
        navigation: navigation,
        commandMapping: SmartLife.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    $(window).on("unload", function() {
        SmartLife.app.saveState();
    });

    SmartLife.app.router.register(":view/:id", { view: startupView, id: undefined });
    SmartLife.app.on("viewShown", onViewShown);
    SmartLife.app.on("navigatingBack", onNavigatingBack);
    SmartLife.app.navigate();
});