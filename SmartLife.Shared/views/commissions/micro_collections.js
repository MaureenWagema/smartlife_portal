SmartLife.micro_collections = function (params) {
    "use strict";
    
    var formSearchDetailsInstance;
    var currentYear = new Date().getFullYear();

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
        vsToolBar: ko.observable(false),
        go_back: function () {
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
        formatSummary: function (value) {
            const formattedValue = value.toFixed(2);
            return Number(formattedValue).toLocaleString();
        },
        LoadPanelShown: ko.observable(false),
        viewShown: function () {
        
        },

        fetch_data: function () {
            //save
            let data = formSearchDetailsInstance.option("formData");

            //data['criteria'];data['search_entry']
            let params_url = "collections/getAgentPrompts?date_from=" + viewModel.formatDate(new Date(data['date_from'])) +
                "&date_to=" + viewModel.formatDate(new Date(data['date_to'])) + "&agent_no=" + SmartLife.agent_no;
            viewModel.LoadPanelShown(true);
            let get_life = new DB({
                name: "fetching premiums"
            });
            get_life.DBget(params_url).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.PremiumStore(result.Premiums);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        VsGroupLife: ko.observable(false),
        VsIndividualLife: ko.observable(true),

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
                colCount: 3,
                items: [
                    {
                        label: {
                            text: "FROM"
                        },
                        visible: true,
                        editorType: "dxDateBox",
                        dataField: "date_from",
                        editorOptions: {
                            displayFormat: "dd/MM/yyyy"
                        },
                        validationRules: [{
                            type: "required",
                            message: "FROM is required"
                        }]
                    }, {
                        label: {
                            text: "TO"
                        },
                        visible: true,
                        editorType: "dxDateBox",
                        dataField: "date_to",
                        editorOptions: {
                            displayFormat: "dd/MM/yyyy"
                        },
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

                                    viewModel.fetch_data();

                                }
                            }
                        }
                    }
                ],
            }],

        },
        ///////////end of search entry/////

        PremiumStore: ko.observableArray([]),
        PremiumColumns: [
            {
                dataField: 'PolicyNumber',
            },
            {
                dataField: 'name',
            },
            {
                dataField: 'Received',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    if (typeof cellInfo.value === 'number') {
                        const formattedValue = cellInfo.value.toFixed(2);
                        return Number(formattedValue).toLocaleString();
                    }
                    return '';
                },
                visible: true
            },
            {
                dataField: 'Reference',
            },
            {

                dataField: 'PaymentDate',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true
            }
        ]


    };

    return viewModel;
};