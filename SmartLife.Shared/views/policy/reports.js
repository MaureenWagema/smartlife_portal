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
                    if (settings == 12) {
                        url = 'reports/getPremiumStatement?agent_no=' + get_data['agent_no'] + "&settings=" + get_data['settings'] +
                            "&FinancialAdvisorCategory=" + get_data['FinancialAdvisorCategory'] + "&PayrollCategory=" + get_data['PayrollCategory'] +
                            "&period_year=" + get_data['period_year'] + "&period_month=" + get_data['period_month'];
                    } else if (settings == 13) {
                        url = 'reports/getGroupRpt?scheme_no=' + SmartLife.scheme_no + "&settings=13&MemberId=" + get_data['MemberId'];

                    } else {
                        
                        url = 'reports/getPremiumStatement?policy_no=' + policy_no + "&settings=" + settings +
                            "&units=" + get_data['units'] + "&outstanding_premium=" + get_data['outstanding_premium'];
                    }
                }
            }
            viewModel.get_report(url);
        },

        /*pdf_viewer_object: function (Base64PDF) {
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
        },*/


        /*pdf_viewer_object: function (Base64PDF) {
            // Clean the Base64 string
            let cleanedBase64PDF = Base64PDF.trim(); // Remove any whitespace
            cleanedBase64PDF = cleanedBase64PDF.replace(/[\r\n]+/g, ''); // Remove line breaks

            // Fix URL-safe Base64 if needed
            cleanedBase64PDF = cleanedBase64PDF.replace(/-/g, '+').replace(/_/g, '/');

            try {
                // Decode the Base64 string to binary data
                //const pdfData = atob(cleanedBase64PDF);
                var pdfData = Base64PDF.substring(1, Base64PDF.length - 1);
                console.log(pdfData);

                // Get a reference to the existing <div> element with an id of 'pdf-container'
                const $container = $('#pdf-container');
                $container.empty(); // Clear any existing content

                // Create a <canvas> element for rendering the PDF
                const $canvas = $('<canvas></canvas>');
                $container.append($canvas);
                const canvas = $canvas[0];
                const context = canvas.getContext('2d');

                // Load the PDF using PDF.js
                pdfjsLib.getDocument({ data: pdfData }).promise
                    .then(function (pdf) {
                        // Render the first page of the PDF
                        return pdf.getPage(1);
                    })
                    .then(function (page) {
                        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        return page.render(renderContext).promise;
                    })
                    .catch(function (error) {
                        console.error('Error rendering PDF:', error);
                    });
            } catch (error) {
                console.error('Invalid Base64 string:', error);
            }
        },*/

        //previous iOS fix
        /*
        pdf_viewer_object: function (Base64PDF) {
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);
            // Convert Base64 string to binary data
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the binary data
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Generate a URL for the Blob
            const blobURL = URL.createObjectURL(blob);

            // Get a reference to the container element
            const container = document.getElementById('pdf-container');
            container.innerHTML = ''; // Clear existing content

            // Create an <object> element to display the PDF
            const viewerObject = document.createElement('object');
            viewerObject.type = 'application/pdf';
            viewerObject.data = blobURL;
            viewerObject.style.width = '100%';
            viewerObject.style.height = '800px';

            // Append the viewer object to the container
            container.appendChild(viewerObject);
        }
        */

        pdf_viewer_object: function (Base64PDF) {
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            const blobURL = URL.createObjectURL(blob);

            const container = document.getElementById('pdf-container');
            container.innerHTML = ''; // Clear existing content

            // Use an iframe instead of object
            const iframe = document.createElement('iframe');
            iframe.src = blobURL;
            iframe.style.width = '100%';
            iframe.style.height = '800px';

            container.appendChild(iframe);
            
            window.open(blobURL, '_blank');
        }
        /*
        pdf_viewer_object: function (Base64PDF) {
            var pdfBase64 = Base64PDF.substring(1, Base64PDF.length - 1);
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            const blobURL = URL.createObjectURL(blob);

            // Open PDF in a new tab
            window.open(blobURL, '_blank');

            */



    };

    return viewModel;
};