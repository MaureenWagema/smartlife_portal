SmartLife.signature_claims = function (params) {
    //"use strict";
    var is_micro = 0;
    var imageURI;

    var rcd_id;
    if (SmartLife.login_type == 3) {
        if (SmartLife.pos_type == 2) {//micro
            is_micro = 1;
        } else {
            is_micro = 0;
        }
    }

    var viewModel = {
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
        LoadPanelShown: ko.observable(false),

        viewShown: function () {
            viewModel.fetchClaimsToSign();
        },

        refresh_list: function () {
            viewModel.fetchClaimsToSign();
        },

        fetchClaimsToSign: function () {
            viewModel.LoadPanelShown(true);
            var get_form = new DB({
                name: "get all claims that need signing"
            });
            get_form.DBget("claims/getClaimsToSign?is_micro=" + is_micro + "&created_by=" + SmartLife.pos_name).done(function (result) {
                viewModel.LoadPanelShown(false);
                if (result.success == true) {
                    viewModel.claimsStore(result.Claims);
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                viewModel.LoadPanelShown(false);
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
        },

        claimsStore: ko.observableArray([]),
        claims_columns: [
            {
                dataField: 'id',
                visible: false
            }, {
                allowEditing: false,
                dataField: 'policy_no',
                width: '120',
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'claim_type',
                width: '220',
                lookup: {
                    dataSource: SmartLife.ClaimType, valueExpr: 'claim_type', displayExpr: 'Description'
                },
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'ClaimantName',
                visible: true,
            }, {
                allowEditing: false,
                dataField: 'ClaimantMobile',
                visible: false,
            }, {
                allowEditing: false,
                caption: 'Notification Date',
                dataField: 'created_on',
                dataType: 'datetime',
                cellDisplayFormat: 'dd/MM/yyyy HH:mm',
                visible: true,
            }
        ],

        row_clicked: function (e) {
            rcd_id = e.data.id;
            viewModel.show_signature();
        },





        /////signature pad/////
        popup_sig: ko.observable(false),
        hide_popup_sig: function () {
            viewModel.popup_sig(false);
        },
        submit_claim: function () {
            //TODO - Submit the entire claim and flag it as submited bruv...
            var data = $sigdiv.jSignature('getData', 'image')
            var i = new Image()
            i.src = 'data:' + data[0] + ',' + data[1];
            imageURI = i.src;
            console.log(imageURI);

            //

            if (imageURI == undefined || imageURI == "" || imageURI == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABRsAAAFHCAYAAAAhuJsvAAAAAXNSR0IArs4c6QAAIABJREFUeF7t21GNFVEQRdHGCHhACDKeqJaBEDyAEkzs5GQqawTUfb2qvnYy3x5/BAgQIECAAAECBAgQIECAAAECBAgQCAS+BTOMIECAAAECBAgQIECAAAECBAgQIECAwCM2OgICBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGx0Q0QIECAAAECBAgQIECAAAECBAgQIJAIiI0JoyEECBAgQIAAAQIECBAgQIAAAQIECIiNboAAAQIECBAgQIAAAQIECBAgQIAAgURAbEwYDSFAgAABAgQIECBAgAABAgQIECBAQGx0AwQIECBAgAABAgQIECBAgAABAgQIJAJiY8JoCAECBAgQIECAAAECBAgQIECAAAECYqMbIECAAAECBAgQIECAAAECBAgQIEAgERAbE0ZDCBAgQIAAAQIECBAgQIAAAQIECBAQG90AAQIECBAgQIAAAQIECBAgQIAAAQKJgNiYMBpCgAABAgQIECBAgAABAgQIECBAgIDY6AYIECBAgAABAgQIECBAgAABAgQIEEgExMaE0RACBAgQIECAAAECBAgQIECAAAECBMRGN0CAAAECBAgQIECAAAECBAgQIECAQCIgNiaMhhAgQIAAAQIECBAgQIAAAQIECBAgIDa6AQIECBAgQIAAAQIECBAgQIAAAQIEEgGxMWE0hAABAgQIECBAgAABAgQIECBAgAABsdENECBAgAABAgQIECBAgAABAgQIECCQCIiNCaMhBAgQIECAAAECBAgQIECAAAECBAiIjW6AAAECBAgQIECAAAECBAgQIECAAIFEQGxMGA0hQIAAAQIECBAgQIAAAQIECBAgQEBsdAMECBAgQIAAAQIECBAgQIAAAQIECCQCYmPCaAgBAgQIECBAgAABAgQIECBAgAABAmKjGyBAgAABAgQIECBAgAABAgQIECBAIBEQGxNGQwgQIECAAAECBAgQIECAAAECBAgQEBvdAAECBAgQIECAAAECBAgQIECAAAECiYDYmDAaQoAAAQIECBAgQIAAAQIECBAgQICA2OgGCBAgQIAAAQIECBAgQIAAAQIECBBIBMTGhNEQAgQIECBAgAABAgQIECBAgAABAgTERjdAgAABAgQIECBAgAABAgQIECBAgEAiIDYmjIYQIECAAAECBAgQIECAAAECBAgQICA2ugECBAgQIECAAAECBAgQIECAAAECBBIBsTFhNIQAAQIECBAgQIAAAQIECBAgQIAAAbHRDRAgQIAAAQIECBAgQIAAAQIECBAgkAiIjQmjIQQIECBAgAABAgQIECBAgAABAgQIiI1ugAABAgQIECBAgAABAgQIECBAgACBREBsTBgNIUCAAAECBAgQIECAAAECBAgQIEBAbHQDBAgQIECAAAECBAgQIECAAAECBAgkAmJjwmgIAQIECBAgQIAAAQIECBAgQIAAAQJioxsgQIAAAQIECBAgQIAAAQIECBAgQCAREBsTRkMIECBAgAABAgQIECBAgAABAgQIEBAb3QABAgQIECBAgAABAgQIECBAgAABAomA2JgwGkKAAAECBAgQIECAAAECBAgQIECAgNjoBggQIECAAAECBAgQIECAAAECBAgQSATExoTREAIECBAgQIAAAQIECBAgQIAAAQIExEY3QIAAAQIECBAgQIAAAQIECBAgQIBAIiA2JoyGECBAgAABAgQIECBAgAABAgQIECAgNroBAgQIECBAgAABAgQIECBAgAABAgQSAbExYTSEAAECBAgQIECAAAECBAgQIECAAAGxcXwDn8/n5/M8v8Y/w/MECBAgQIAAAQIECBAgQIAAgQsCv9/3/XPhQ77qN4iN4819Pp+/z/N8H/8MzxMgQIAAAQIECBAgQIAAAQIELgj8e9/3x4UP+arfIDaONyc2jhfgeQIECBAgQIAAAQIECBAgQOCSgNg43qbYOF6Af6MeL8DzBAgQIECAAAECBAgQIECAwCUB/0Y93qbYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXieAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVAbHxyiZ9BwECBAgQIECAAAECBAgQIECAAIGxgNg4XoDnCRAgQIAAAQIECBAgQIAAAQIECFwREBuvbNJ3ECBAgAABAgQIECBAgAABAgQIEBgLiI3jBXi9DXU8AAAA8UlEQVSeAAECBAgQIECAAAECBAgQIECAwBUBsfHKJn0HAQIECBAgQIAAAQIECBAgQIAAgbGA2DhegOcJECBAgAABAgQIECBAgAABAgQIXBEQG69s0ncQIECAAAECBAgQIECAAAECBAgQGAuIjeMFeJ4AAQIECBAgQIAAAQIECBAgQIDAFQGx8comfQcBAgQIECBAgAABAgQIECBAgACBsYDYOF6A5wkQIECAAAECBAgQIECAAAECBAhcERAbr2zSdxAgQIAAAQIECBAgQIAAAQIECBAYC4iN4wV4ngABAgQIECBAgAABAgQIECBAgMAVgf+cBRVICIoJOQAAAABJRU5ErkJggg==") {
                DevExpress.ui.dialog.alert("Kindly Sign In order to proceed");
            } else {
                viewModel.LoadPanelShown(true);
                var get_form = new DB({
                    name: "submitting signature"
                });

                //policy_no, claim_type, request_date, tot_cash_value, amount_available, amount_applied, reason, status
                get_form.DBpost("claims/syncClaimImage?",
                    {
                        req_code: '162',
                        eClaimId: rcd_id,
                        signature: imageURI,
                        IsClientSigned: 1
                    }
                ).done(function (result) {
                    viewModel.LoadPanelShown(false);
                    if (result.success == true) {
                        viewModel.popup_sig(false);
                        DevExpress.ui.dialog.alert("Claim Successfully Submited", "SUBMITED");
                        viewModel.fetchClaimsToSign();
                    } else {
                        viewModel.show_test(result.message, 'error');
                    }
                }).fail(function () {
                    viewModel.LoadPanelShown(false);
                    //alert_dialog("Server not accessible. Check internet connectivity");
                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                });
            }
        },

        show_signature: function () {

            $('#signature').empty();

            viewModel.popup_sig(true);
            // This is the part where jSignature is initialized.
            $sigdiv = $("#signature").jSignature({ 'UndoButton': true })

                // All the code below is just code driving the demo. 
                , $tools = $('#tools')
                , $extraarea = $('#displayarea')
                , pubsubprefix = 'jSignature.demo.'

            var export_plugins = $sigdiv.jSignature('listPlugins', 'export')
                , chops = ['<span><b>Extract signature data as: </b></span><select>', '<option value="">(select export format)</option>']
                , name
            for (var i in export_plugins) {
                if (export_plugins.hasOwnProperty(i)) {
                    name = export_plugins[i]
                    chops.push('<option value="' + name + '">' + name + '</option>')
                }
            }
            chops.push('</select><span><b> or: </b></span>')

            $(chops.join('')).bind('change', function (e) {
                if (e.target.value !== '') {
                    //alert(e.target.value);
                    var data = $sigdiv.jSignature('getData', e.target.value)
                    $.publish(pubsubprefix + 'formatchanged')
                    if (typeof data === 'string') {
                        $('textarea', $tools).val(data)
                    } else if ($.isArray(data) && data.length === 2) {
                        $('textarea', $tools).val(data.join(','))
                        $.publish(pubsubprefix + data[0], data);
                    } else {
                        try {
                            $('textarea', $tools).val(JSON.stringify(data))
                            //imageURI = JSON.stringify(data)
                        } catch (ex) {
                            $('textarea', $tools).val('Not sure how to stringify this, likely binary, format.')
                        }
                    }
                }
            }).appendTo($tools)


            $('<input type="button" value="Reset">').bind('click', function (e) {
                $sigdiv.jSignature('reset')
            }).appendTo($tools)

            $('<div><textarea style="width:100%;height:7em;"></textarea></div>').appendTo($tools)

            $.subscribe(pubsubprefix + 'formatchanged', function () {
                $extraarea.html('')
            })

            $.subscribe(pubsubprefix + 'image/svg+xml', function (data) {

                try {
                    var i = new Image()
                    i.src = 'data:' + data[0] + ';base64,' + btoa(data[1])
                    //$(i).appendTo($extraarea)
                } catch (ex) {

                }

                var message = [
                    "If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
                    , "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
                    , "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
                ]
                $("<div>" + message.join("<br/>") + "</div>").appendTo($extraarea)
            });

            $.subscribe(pubsubprefix + 'image/svg+xml;base64', function (data) {
                var i = new Image()
                i.src = 'data:' + data[0] + ',' + data[1]

                $(i).appendTo($extraarea)

                var message = [
                    "If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
                    , "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
                    , "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
                ]
                $("<div>" + message.join("<br/>") + "</div>").appendTo($extraarea)
            });

            $.subscribe(pubsubprefix + 'image/png;base64', function (data) {
                i = new Image()
                i.src = 'data:' + data[0] + ',' + data[1]
                imageURI = i.src
                //alert(image_url)
                /*$('<span><b>As you can see, one of the problems of "image" extraction (besides not working on some old Androids, elsewhere) is that it extracts A LOT OF DATA and includes all the decoration that is not part of the signature.</b></span>').appendTo($extraarea)
                $(i).appendTo($extraarea)*/

                //$(i).appendTo("#show_signature")
            });

            $.subscribe(pubsubprefix + 'image/jsignature;base30', function (data) {
                $('<span><b>This is a vector format not natively render-able by browsers. Format is a compressed "movement coordinates arrays" structure tuned for use server-side. The bonus of this format is its tiny storage footprint and ease of deriving rendering instructions in programmatic, iterative manner.</b></span>').appendTo($extraarea)
            });

            if (Modernizr.touch) {
                $('#scrollgrabber').height($('#content').height())
            }


            //$('#show_signature').append('<p>Bubbling bubbling baby</p>');
            //$(i).appendTo($extraarea)
            //$('#displayarea').append(i);
            //viewModel.vs_crew_autograph(false);
        },

        /////end of signature pad////


    };

    function isEmptyString(str) {
        return str.trim() === '';
    }

    return viewModel;
};