SmartLife.member_management = function (params) {
    "use strict";

    //save fn

    //retreive fn

    var viewModel = {
        //  Put the binding properties here
        backButtonVisible: ko.observable(false),
        backButtonAction: function (e) {
            SmartLife.app.back();
        },
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
        formatDate: function (input) {
            if (input === undefined || input === '') {
                return "";
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
        lblmembers: ko.observable(''),//MEMBERS
        vs_members: ko.observable(true),
        viewShown: function () {
            viewModel.get_scheme_members();
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

        get_scheme_members: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings checklists"
            });
            get_form.DBget("group/getSchemeMembers?scheme_no=" + SmartLife.scheme_no).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.members_Store(result.Members);
                    if (viewModel.members_Store().length == 0 && result.class_code == "10") {
                        viewModel.vs_members(false);
                        //just display the report here...
                        //alert("display report");
                        //TODO-Make a post request - Daspymentslistsum

                        let url = 'reports/getGroupRpt?scheme_no=' + SmartLife.scheme_no + "&settings=15";
                        viewModel.get_report(url);

                    }
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

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

        LoadPanelShown: ko.observable(false),
        members_Store: ko.observableArray(),
        members_columns: [
            {
                dataField: 'SchemeID',
                visible: false
            },
            {
                dataField: 'MemberId',
                visible: false
            },
            {
                dataField: 'Names',
                visible: true
            }, {

                dataField: 'member_no',
                visible: true,
            }, {

                dataField: 'commence_date',
                dataType: 'date',
                visible: true,
            }, {

                dataField: 'status_name',
                visible: true,
            }, {

                dataField: 'telephone',
                visible: false,
            },  {
                caption: 'ACTION',
                visible: true,
                width: '120',
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxMenu({
                        width: '100%',
                        dataSource: [
                            {
                                id: 452,
                                name: "",
                                icon: "mdi mdi-dots-vertical mdi-36px",
                                items: [
                                    {
                                        "id": 1,
                                        "name": "Request Claim",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    },
                                    {
                                        "id": 2,
                                        "name": "Statement",
                                        "icon": "mdi mdi-eye",
                                    }
                                ]
                            }
                        ],
                        hideSubmenuOnMouseLeave: false,
                        displayExpr: "name",
                        icon: "icon",
                        onItemClick: function (data) {
                            var item = data.itemData;
                            console.log(item.id);
                            var dta = options.data;

                            if (item.id == 1) {
                                //view
                                var data = { member_no: dta.member_no, telephone: dta.telephone, Names: dta.Names, SchemeID: dta.SchemeID };
                                viewModel.navigateForward("request_claim_form", JSON.stringify(data));
                            }

                            if (item.id == 2) {
                                //view
                                //var data = { member_no: dta.member_no, telephone: dta.telephone, Names: dta.Names, SchemeID: dta.SchemeID };
                                //viewModel.navigateForward("member_statement", JSON.stringify(data));
                                //TODO-Display the various reports here.....

                                //let url = 'reports/getGroupRpt?scheme_no=' + SmartLife.scheme_no + "&settings=13&MemberId=" + dta.MemberId;
                                //viewModel.get_report(url);

                                var data = { MemberId: dta.MemberId, settings: 13 };
                                viewModel.navigateForward("reports", JSON.stringify(data));

                            }
                        }
                    }).appendTo(container);
                }
            }
        ],

        claim_click: function (e) {
            var data = [{ policy_no: e.itemData.policy_no, claim_type: e.itemData.claim_type, notification_date: e.itemData.notification_date, tot_proceeds: e.itemData.tot_proceeds, net_pay: e.itemData.net_pay, reason: e.itemData.reason, amount_applied: e.itemData.amount_applied }];
            viewModel.navigateForward("request_claim_form", JSON.stringify(data));
        },

        add_member: function () {
            viewModel.navigateForward("add_member", "0");
        }

    };

    return viewModel;
};