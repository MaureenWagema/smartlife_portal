SmartLife.Endorsements = function (params) {
    //"use strict";
    var formSearchDetailsInstance;
    var params_url = "policy/getRequestedEndorsements?is_micro=0&is_dashboard=1";



    var viewModel = {
        //  Put the binding properties here
        toast_msg: ko.observable(''),
        toast_type: ko.observable(''),
        isToastVisible: ko.observable(false),
        show_test: function (msg, type) {
            viewModel.toast_msg(msg);
            viewModel.toast_type(type);
            viewModel.isToastVisible(true);
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
        viewShown: function () {
            viewModel.get_analysis();
        },

        /////////////search entry//////////
        refresh_list: function () {
            viewModel.viewShown();
        },
        dxFormSearchDetails: {
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formSearchDetailsInstance = e.component;
                //formSearchDetailsInstance
                //formSearchDetailsInstance.updateData("period_year", currentDate.getFullYear());
                //formSearchDetailsInstance.updateData("Period_month", currentDate.getMonth());
                viewModel.LoadPanelShown(false);
            },
            items: [{
                itemType: 'group',
                caption: 'Search',
                colCount: 5,
                items: [
                    {
                        label: {
                            text: "Source"
                        },
                        editorType: "dxLookup",
                        dataField: "SourceType",
                        editorOptions: {
                            searchEnabled: false,
                            showCancelButton: false,
                            closeOnOutsideClick: true,
                            dataSource: [{ id: 1, name: 'Individual Life' }, { id: 2, name: 'Micro' }],
                            displayExpr: 'name',
                            valueExpr: 'id',
                            value: 1
                        },
                    },
                    {
                        label: {
                            text: "Type"
                        },
                        editorType: "dxLookup",
                        dataField: "Type",
                        editorOptions: {
                            searchEnabled: false,
                            showCancelButton: false,
                            closeOnOutsideClick: true,
                            dataSource: [{ id: 1, name: 'POS Requests' }, { id: 2, name: 'Processed' }],
                            displayExpr: 'name',
                            valueExpr: 'id',
                            value: 1
                        },
                    },
                    {
                        label: {
                            text: "FROM"
                        },
                        editorType: "dxDateBox",
                        dataField: "date_from",
                        editorOptions: {
                            value: Date()
                        },
                        validationRules: [{
                            type: "required",
                            message: "FROM is required"
                        }]
                    }, {
                        label: {
                            text: "TO"
                        },
                        editorType: "dxDateBox",
                        editorOptions: {
                            value: Date()
                        },
                        dataField: "date_to",
                        validationRules: [{
                            type: "required",
                            message: "TO is required"
                        }]
                    },
                    {
                        label: {
                            text: "Action"
                        },
                        itemType: "button",
                        horizontalAlignment: "left",
                        verticalAlignment: "bottom",
                        buttonOptions: {
                            text: "Search",
                            horizontalAlignment: "left",
                            verticalAlignment: "bottom",
                            icon: "search",
                            type: "danger",
                            onClick: function (args) {
                                //tabsInstance.option("selectedIndex", 1);
                                var result = args.validationGroup.validate();
                                if (result.isValid) {
                                    //save
                                    let data = formSearchDetailsInstance.option("formData");
                                    let is_micro = 0;
                                    if (data['SourceType'] == 2) is_micro = 1;
                                    let type = "getRequestedEndorsements";
                                    if (data['Type'] == 2) type = "getHistoryClaims";
                                    //data['criteria'];data['search_entry'] 
                                    if (data['SourceType'] == 2) {
                                        params_url = "policy/getRequestedEndorsements?is_micro=" + is_micro +"&is_dashboard=1" +
                                            "&date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                            "&date_to=" + viewModel.formatDate(new Date(data['date_to']));
                                    } else {
                                        params_url = "policy/getRequestedEndorsements?is_micro=" + is_micro +"&is_dashboard=1" +
                                            "&date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                                            "&date_to=" + viewModel.formatDate(new Date(data['date_to']));
                                    }

                                    viewModel.get_analysis();
                                }
                            }
                        }
                    }
                ],
            }],

        },
        ///////////end of search entry/////
        get_analysis: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get all the proposals"
            });
            //"commissions.php?transactions=1&agent_no=
            get_form.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.analysis_store(result.Endorsements);
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

        analysis_store: ko.observableArray(),
        //id, name,period_year,period_month,basic_pay
        //policy_no, ReceiptNoOLD, received, BasicPay, OverrideComm, OverrideRate
        onrowPrepared: function (e) {
            if (e.data != undefined) {
                if (e.data.StatusDescription == "DRAFT")
                    e.rowElement.css('background', '#00ffff');// blue
                else if (e.data.StatusDescription == "SUBMITTED")
                    e.rowElement.css('background', '#ffff00');//yellow
                else if (e.data.StatusDescription == "APPROVED")
                    e.rowElement.css('background', '#bfff00');//green
                else if (e.data.StatusDescription == "CANCELLED") 
                    e.rowElement.css('background', '#ff4000');//red
                
            }
        },
        analysis_columns: [
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