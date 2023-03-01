SmartLife.view_statement = function (params) {
    // "use strict";

    getPolicy = function (type, client_no) {

        var url = SmartLife.url + type + "client_no=" + client_no;
        console.log(url);
        return $.ajax({
            method: "GET",
            url: url,
            //data: {  },
            timeout: 100000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                DevExpress.ui.notify('An Error Occured', error, 2000);
            }
        });

    };



    var viewModel = {
        //  Put the binding properties here
        backButtonAction: function (e) {
            SmartLife.app.back();
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

        policyDetailsVisible: ko.observable(false),
        backButtonVisible: ko.observable(false),
        PopupRange: ko.observable(false),
        dateFilterDisable: ko.observable(false),
        policy_store: ko.observableArray([]),

        policy_columns: [
            {

                dataField: 'basic_prem',
                visible: false
            }, {

                dataField: 'modal_prem',
                visible: false
            }, {

                dataField: 'description',
                visible: false
            }, {

                dataField: 'plan',
                visible: true,
            }, {

                dataField: 'modal_premium',
                visible: true
            }, {

                dataField: 'policy_fee',
                visible: false
            }, {

                dataField: 'agent_no',
                visible: false
            }, {

                dataField: 'policy_no',
                caption: 'Policy No',
                visible: true
            }, {
                allowEditing: false,
                dataField: 'sa',
                caption: 'Sum Assured',
                visible: false
            }, {
                caption: 'ACTION',
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
                                        "name": "Premium Summary Contribution",
                                        "icon": "mdi mdi-cash",
                                        // visible: false,
                                    }, {
                                        "id": 2,
                                        "name": "Investment Summary Contribution",
                                        "icon": "mdi mdi-cash",
                                        // visible: false,
                                    },
                                    {
                                        "id": 3,
                                        "name": "Details",
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
                                SmartLife.PolicyNo(dta.policy_no);
                                viewModel.PopupRange(true);
                            }
                            else if (item.id == 2) {
                                //view
                                if (dta.investment_plan == 1 || dta.investment_plan == "1") {
                                    SmartLife.PolicyNo(dta.policy_no);
                                    viewModel.navigateForward("inv_contributions", "");
                                } else {
                                    DevExpress.ui.dialog.alert("Policy does not include investment contributions");
                                }
                            }
                            else if (item.id == 3) {
                                //display popup
                                viewModel.polNumber(dta.policy_no);
                                viewModel.polDesc(dta.description);
                                viewModel.polfee(dta.policy_fee);
                                viewModel.polModal(dta.modal_prem);
                                viewModel.polSA(dta.sa);
                                viewModel.last_date(dta.last_date);
                                viewModel.prem_units(dta.prem_units);

                                viewModel.effective_date(dta.effective_date);
                                viewModel.coverperiod(dta.coverperiod);
                                var effective_prem = dta.expected_prem;
                                viewModel.effective_prem(dta.expected_prem);
                                viewModel.received(dta.received);
                                if (effective_prem > dta.received) {
                                    viewModel.missing_prem(effective_prem - dta.received);
                                } else {
                                    viewModel.missing_prem(0);
                                }
                                viewModel.missing_prem(viewModel.effective_prem() - dta.received);

                                viewModel.policyDetailsVisible(true);
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],

        effective_date: ko.observable(''),
        coverperiod: ko.observable(''),

        polNumber: ko.observable(''),
        polDesc: ko.observable(''),
        polfee: ko.observable(''),
        polSA: ko.observable(''),
        polModal: ko.observable(''),
        last_date: ko.observable(''),
        prem_units: ko.observable(''),
        missing_prem: ko.observable(''),
        effective_prem: ko.observable(''),
        received: ko.observable(''),

        LoadPanelShown: ko.observable(false),
        get_month: function (input) {
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
                return month;
            }
        },

        viewShown: function () {

            viewModel.LoadPanelShown(true);
            var type = "client/getClientPolicies?";
            getPolicy(type, SmartLife.clientno).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    console.log(result.ClientPolicies);
                    viewModel.policy_store(result.ClientPolicies);
                } else {
                    DevExpress.ui.dialog.alert(result.msg);
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                DevExpress.ui.dialog.alert("Server not accessible.Check internet connectivity...");
            });

        },


        ///variables for timeline of statements///
        approve_fn: function (obj) {
            if (viewModel.select_all() == false) {
                if (obj.value == '' || obj.value == undefined) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },
        fromValidationRules: ko.observable({
            validationRules: [{
                type: "custom",
                message: "Date From cannot be empty",
                validationCallback: function (obj) {
                    return viewModel.approve_fn(obj);
                }
            }]
        }),
        toValidationRules: ko.observable({
            validationRules: [{
                type: "custom",
                message: "Date To cannot be empty",
                validationCallback: function (obj) {
                    return viewModel.approve_fn(obj);
                }
            }]
        }),
        vs_date: ko.observable(false),
        select_all: ko.observable(false),
        date_from: ko.observable(),
        date_to: ko.observable(),
        showStatement: function () {
            try {
                if (viewModel.select_all() == false && (viewModel.date_from() == undefined || viewModel.date_to() == undefined)) {

                } else {
                    viewModel.PopupRange(false);
                    var data = [{ select_all: viewModel.select_all(), date_from: viewModel.formatDate(new Date(viewModel.date_from())), date_to: viewModel.formatDate(new Date(viewModel.date_to())) }];
                    viewModel.navigateForward("PaymentsView", JSON.stringify(data));
                }
            } catch (err) {
                console.log(err);
            }
        },
        CancelStatement: function () {
            try {
                viewModel.PopupRange(false);
            }
            catch (err) {
                console.log(err);
            }

        },
        /////end of popup timeline statements//
        hidePolicyDetalis: function () {
            viewModel.policyDetailsVisible(false);
        },


        menu_items: ([{
            text: "Premium Summary Contribution",
            action: function (e) {
                try {
                    // alert(e.itemData.id)
                    SmartLife.PolicyNo(e.itemData.policy_no);
                    viewModel.PopupRange(true);
                    viewModel.navigateForward("PaymentsView", e.itemData.policy_no);
                }
                catch (err) { }
            }
        }, {
            text: "Investment Summary Contribution",
            action: function (e) {
                try {
                    // alert(e.itemData.id)
                    if (e.itemData.investment_plan == 1 || e.itemData.investment_plan == "1") {
                        SmartLife.PolicyNo(e.itemData.policy_no);
                        viewModel.navigateForward("inv_contributions", "");
                    } else {
                        DevExpress.ui.dialog.alert("Policy does not include investment contributions");
                    }
                    //viewModel.navigateForward("PaymentsView", "");
                }
                catch (err) { }
            }
        }, {
            text: "Details",
            action: function (e) {
                //TODO
                viewModel.polNumber(e.itemData.policy_no);
                viewModel.polDesc(e.itemData.description);
                viewModel.polfee(e.itemData.policy_fee);
                viewModel.polModal(e.itemData.modal_prem);
                viewModel.polSA(e.itemData.sa);
                viewModel.last_date(e.itemData.last_date);
                viewModel.prem_units(e.itemData.prem_units);
                viewModel.effective_date(e.itemData.effective_date);
                viewModel.coverperiod(e.itemData.coverperiod);
                /*Expected premium = months(current - effective_date) * modal_prem * cover_period
                Current_premium
                missing*/
                //missing_prem,effective_prem,received
                //var effective_prem = parseInt(viewModel.get_month(new Date())) - parseInt(viewModel.get_month(new Date(e.itemData.effective_date))) * parseFloat(e.itemData.modal_prem) * parseFloat(e.itemData.coverperiod);
                var effective_prem = e.itemData.expected_prem;
                viewModel.effective_prem(e.itemData.expected_prem);
                viewModel.received(e.itemData.received);
                if (effective_prem > e.itemData.received) {
                    viewModel.missing_prem(effective_prem - e.itemData.received);
                } else {
                    viewModel.missing_prem(0);
                }
                viewModel.missing_prem(viewModel.effective_prem() - e.itemData.received);

                viewModel.policyDetailsVisible(true);



            }
        }]),

    };

    return viewModel;
};