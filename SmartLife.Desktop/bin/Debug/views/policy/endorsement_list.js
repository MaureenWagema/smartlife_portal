SmartLife.endorsement_list = function (params) {
    "use strict";

    var viewModel = {
//  Put the binding properties here
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
        LoadPanelShown: ko.observable(false),
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        get_endorsements: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get existings endorsements"
            });
            get_form.DBget("policy/getRequestedEndorsements?client_no=" + SmartLife.clientno).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.endorsement_Store(result.Endorsements);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },
        vs_endorsement_claim: ko.observable(false),
        viewShown: function () {

            if (SmartLife.login_type == 1) {
                viewModel.vs_endorsement_claim(true);
            } else {
                viewModel.vs_endorsement_claim(false);
            }

            viewModel.get_endorsements();
            
        },
        add_endorsement: function () {
            //life_endorsement
            viewModel.navigateForward("endorsement", "");
        },
        endorsement_Store: ko.observableArray(),
        endorsement_columns: [
            {
                dataField: 'id',
                visible: false
            }, {

                dataField: 'policy_no',
                visible: true,
                width: '150'
            }, {
                dataField: 'EndorsementNumber',
                caption: 'Assigned No',
                visible: true,
            }, {
                dataField: 'Endorsementtype',
                visible: true,
                lookup: {
                    dataSource: SmartLife.EndorsementTypes, valueExpr: 'Id', displayExpr: 'Description'
                },
            }, {
                dataField: 'RequestDate',
                visible: true,
                dataType: 'datetime'
            }, {

                dataField: 'created_by',
                caption: 'Requested By',
                visible: true
            }, {

                dataField: 'created_on',
                dataType: 'datetime',
                visible: false
            }, {

                dataField: 'branch_name',
                caption: 'Branch',
                visible: true
            }, {
                dataField: 'StatusDescription',
                caption: 'Current Status',
                visible: true,
            }
        ],


    };

    return viewModel;
};