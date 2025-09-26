SmartLife.reports = function (params) {
    "use strict";

    let policy_no;// = params.item;
    let settings;
    var vs_toolbar = false;
    if (SmartLife.is_logged == 1) vs_toolbar = true;

    var get_data = JSON.parse(params.item);
    if (get_data['policy_no'] != undefined) policy_no = get_data['policy_no'];
    if (get_data['settings'] != undefined) settings = get_data['settings'];
    console.log(policy_no);

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
        formatDates: function (input) {
            if (input === undefined || input === '' || input === null) {
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
        go_back: function () {
            SmartLife.app.back();
        },
        LoadPanelShown: ko.observable(false),

        get_report: function (url) {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "fetching the rpt"
            });
            get_form.DBget(url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.pdf_viewer_object(result.base64Rpt);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        vs_toolbar: ko.observable(vs_toolbar),
        viewShown: function () {
            let url;
            if (settings == 1) {
                url = 'reports/getWorksheet?policy_no=' + policy_no + "&settings=" + settings;
            }
            if (settings > 1) {
                if (settings == 9) {
                    url = 'reports/getWorksheet?policy_no=' + policy_no + "&settings=" + 9;
                } else {
                    url = 'reports/getPremiumStatement?policy_no=' + policy_no + "&settings=" + settings;
                }
                
            }
            viewModel.get_report(url);
        },

        pdf_viewer_object: function (Base64PDF) {
            //var pdfBase64 = "JVBERi0xLjUKJbPjz9MK..."; // truncated for brevity
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);

            // Get a reference to the existing <div> element with an id of 'pdf-container'
            var container = document.getElementById('pdf-container');

            // Create a new <object> element to hold the PDF viewer
            var viewerObject = document.createElement('object');
            viewerObject.type = 'application/pdf';

            // Set the height and width of the viewer object
            viewerObject.style.width = '100%';
            viewerObject.style.height = '800px';

            // Set the data attribute of the viewer object to the base64-encoded string
            viewerObject.data = 'data:application/pdf;base64,' + pdfBase64;

            // Add the viewer object to the existing <div> container
            container.appendChild(viewerObject);
        },


    };

    return viewModel;
};