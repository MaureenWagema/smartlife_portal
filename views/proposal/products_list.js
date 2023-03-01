SmartLife.products_list = function (params) {
    "use strict";

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
        LoadPanelShown: ko.observable(false),
        navigateForward: function (dxview, data) {

            SmartLife.app.navigate({

                view: dxview,
                item: data,
                id: 1

            });

        },
        viewShown: function () {

        },
        products_Store: ko.observableArray(SmartLife.planinfo),
        products_columns: [
            //columns and add list to Apply --- microassurance,isBancAssurance
            {
                dataField: 'plan_code',
                visible: false
            },
            {
                dataField: 'plan_id',
                visible: false
            },
            {
                dataField: 'microassurance',
                visible: false
            },
            {
                dataField: 'isBancAssurance',
                visible: false
            },
            {
                dataField: 'description',
                caption: 'Description'
            },
            {
                caption: '',
                width: '120',
                allowEditing: false,
                cellTemplate: function (container, options) {
                    $("<div />").appendTo(container).dxButton({
                        text: 'APPLY',
                        type: 'default',
                        onClick: function () {
                            //go to the next screen
                            var data = { plan_code: options.data.plan_id, rd_form:0 };
                            //for embedded navigate to the embedded form
                            if (options.data.plan_id == "45") {
                                viewModel.navigateForward("embedded_form", JSON.stringify(data));//embeded
                            } else if (options.data.plan_id == "9") {
                                viewModel.navigateForward("application_form", JSON.stringify(data));
                            } else {
                                viewModel.navigateForward("proposal_form", JSON.stringify(data));//normal
                            }
                        }
                    }).appendTo(container);
                }
            }
        ],
    };

    return viewModel;
};