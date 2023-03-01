SmartLife.applications = function (params) {
    "use strict";

    function alert_dialog(title, msg, mobile, modal_premium, paymode, name, email, policy_no) {
        var myDialog = DevExpress.ui.dialog.custom({
            title: title,
            message: msg,
            buttons: [{
                text: "OK",
                onClick: function (e) {
                    //recurse...
                    //sync_autoload_params();
                    viewModel.send_payment_prompt(mobile, '0.1', paymode, name, email, policy_no);
                    myDialog.hide();
                }
            }, {
                    text: "CANCEL",
                    onClick: function (e) {
                        myDialog.hide();
                    }
                }]
        });
        myDialog.show();
    }

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
        LoadPanelShown: ko.observable(false),

        send_payment_prompt: function (mobile,modal_premium,paymode,name,email,policy_no) {
            viewModel.LoadPanelShown(true);
            let send_prompt = new DB({
                name: "getting applications"
            });
            send_prompt.DBhubtel("hubtel.php?mobile_no=" + mobile + "&modal_prem=" + modal_premium +
                "&paymentinterval=" + paymode + "&customerName=" + name + "&email=" + email + "&policyNo=" + policy_no)
                .done(function (result) {
                    viewModel.LoadPanelShown(false);
                    console.log(result);
                    if (result.ResponseCode == "0001") {
                        DevExpress.ui.dialog.alert('Payment Prompt sent Successfully', '');
                    } else {
                        viewModel.show_test(result.Message, 'error');
                    }
                }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        get_policy_applications: function () {
            viewModel.LoadPanelShown(true);
            let get_records = new DB({
                name: "getting applications"
            });
            get_records.DBget("policy/getProposal").done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.applications_store(result.policy_arr);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        refresh_list: function () {
            viewModel.viewShown();
        },
        viewShown: function () {
            //sync the data here..
            viewModel.get_policy_applications();
        },

        //applications grid
        applications_store: ko.observableArray(),
        //names, email, gender, plan, proposal_no
        applications_columns: [
            {
                dataField: 'ID',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'surname',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'other_name',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'email',
                visible: false
            },
            {
                allowEditing: false,
                dataField: 'name',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'mobile',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'modal_premium',
                caption: 'Premium',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'gender_code',
                lookup: {
                    dataSource: SmartLife.Genderinfo, valueExpr: 'Code', displayExpr: 'Desc'
                },
                visible: false,
            },
            {
                allowEditing: false,
                dataField: 'plan_code',
                lookup: {
                    dataSource: SmartLife.planinfo, valueExpr: 'plan_id', displayExpr: 'description'
                },
                visible: true//
            },
            {
                allowEditing: false,
                dataField: 'policy_no',
                visible: true
            },
            {
                allowEditing: false,
                dataField: 'isApproved',
				dataType: 'boolean',
                visible: true
            },{
                caption: 'ACTION',
                allowEditing: false,
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
                                        "name": "Enquire",
                                        "icon": "mdi mdi-eye",
                                        // visible: false,
                                    }, {
                                        "id": 2,
                                        "name": "Make a payment",
                                        "icon": "mdi mdi-cash",
                                        // visible: false,
                                    },
                                    {
                                        "id": 3,
                                        "name": "Make Top Up",
                                        "icon": "mdi mdi-eye"

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
                                //if (!dta.isApproved) {
                                var data = { plan_code: dta.plan_code, id: dta.ID, rd_form: false };
                                if (dta.plan_code == "45") {
                                    viewModel.navigateForward("embedded_form", JSON.stringify(data));//embeded
                                } else if (dta.plan_code == "9") {
                                    viewModel.navigateForward("application_form", JSON.stringify(data));
                                }else {
                                    viewModel.navigateForward("proposal_form", JSON.stringify(data));
                                }
                                /*} else {
                                    DevExpress.ui.dialog.alert("Proposal is appraised");
                                }*/
                            }
                            else if (item.id == 2) {
                                //add an alert dialog - Are you sure ...Prompting pay
                                alert_dialog("CONFIRM", "Sending prompt to: " + dta.mobile, dta.mobile, dta.modal_premium, "MONTHLY", dta.name, dta.email, dta.policy_no);
                            }
                            else if (item.id == 3) {

                            }
                        }
                    }).appendTo(container);
                }
            }
        ],
        
        
    };
    var menuItems = [{
        text: 'Upload',
        items: [
            { text: 'From your computer' },
            { text: 'From a cloud service' }
        ]
    }, {
        text: 'Share',
        items: [
            { text: 'Log in with Facebook' },
            { text: 'Log in with Twitter' }
        ]
        }];
    const menuData = [{
        id: '1',
        name: '',
        icon: 'menu',
        items: [{
            id: '1_1',
            name: 'Edit',
            icon: 'edit',
        }, {
            id: '1_2',
            name: 'Delete',
            icon: 'trash',
        }]
    }];
    return viewModel;
};