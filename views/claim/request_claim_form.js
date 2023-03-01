SmartLife.request_claim_form = function (params) {
    //"use strict";
    var formClaimInstance;
    var ClaimAttachDataSource = [];

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

    claim_type_arr = [{ id: 'PWD', name: 'Partial Withdrawal' }, { id: 'SUR', name: 'Request for Surrender' }];

    var viewModel = {
        go_back: function () {
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

        //  Put the binding properties here
        formatDate: function (input) {
            if (input === undefined || input === '') {
                return "";
            } else {
                var yr = input.getFullYear();
                var temp_month = input.getMonth() + 1;
                var month = temp_month < 10 ? '0' + temp_month : temp_month;
                var temp_day = input.getDate();
                var day = temp_day < 10 ? '0' + temp_day : temp_day;
                //var inputs = yr + '-' + month + '-' + day;
                var inputs = month + '/' + day + '/' + yr;
                return inputs;
            }
        },

        formatDates: function (input) {
            if (input === undefined || input === '') {
                return "";
            } else {
                var yr = input.getFullYear();
                var temp_month = input.getMonth() + 1;
                var month = temp_month < 10 ? '0' + temp_month : temp_month;
                var temp_day = input.getDate();
                var day = temp_day < 10 ? '0' + temp_day : temp_day;
                var inputs = yr + '-' + month + '-' + day;
                //var inputs = month + '/' + day + '/' + yr;
                return inputs;
            }
        },
        LoadPanelShown: ko.observable(false),
        viewShown: function () {
            //viewModel.LoadPanelShown(true);
            
        },

        claimTypeChanged: function (e) {
            //to for partial first attachements
            if (e.value == "PWD" || e.value == "LON") {
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("RequestDate", "visible", true);
                formClaimInstance.itemOption("PartialWithdPurpose", "visible", true);
                formClaimInstance.itemOption("CurrentCashValue", "visible", true);
                formClaimInstance.itemOption("AmountAppliedFor", "visible", true);
                formClaimInstance.itemOption("attachements", "visible", true);
                //console.log(ClaimAttachDataSource);

                
                //PreviousloanAmount
                if (e.value == "LON") {
                    //assign docs manually here
                    ClaimAttachDataSource = [{ id: '14', description: 'POLICY DOCUMENTS' }, { id: '15', description: 'NOTIFICATION' }, { id: '16', description: 'DEATH CERTIFICATE'}];
                    formClaimInstance.itemOption("PreviousloanAmount", "visible", true);
                }
                formClaimInstance.getEditor("attachements").option("dataSource", ClaimAttachDataSource);
            }
            if (e.value == "DDF") {//
                formClaimInstance.itemOption("PolicyId", "visible", true);
                formClaimInstance.itemOption("dependants", "visible", true);
            }
        },

        default_values: function () {
            formClaimInstance.updateData("PolicyId", null);
            formClaimInstance.updateData("PartialWithdPurpose", null);
            formClaimInstance.updateData("CurrentCashValue", 0);
            formClaimInstance.updateData("AmountAppliedFor", 0);
            formClaimInstance.updateData("PreviousloanAmount", 0);
        },

        default_display: function () {
            formClaimInstance.itemOption("PolicyId", "visible", false);//
            formClaimInstance.itemOption("dependants", "visible", false);
            formClaimInstance.itemOption("RequestDate", "visible", false);
            formClaimInstance.itemOption("PartialWithdPurpose", "visible", false);
            formClaimInstance.itemOption("CurrentCashValue", "visible", false);
            formClaimInstance.itemOption("AmountAppliedFor", "visible", false);
            formClaimInstance.itemOption("attachements", "visible", false);
            formClaimInstance.itemOption("PreviousloanAmount", "visible", false);
        },

        policy_changed: function (val) {
            //get the sum_assured here
            for (let i = 0; i < SmartLife.ClientPolicies.length; i++) {
                if (SmartLife.ClientPolicies[i].id.toString() == val.toString()) {
                    let data = formClaimInstance.option("formData");
                    let sum_assured = SmartLife.ClientPolicies[i].sa;
                    let CurrentCashValue = parseFloat(sum_assured) * 0.05;
                    let PreviousloanAmount = parseFloat(sum_assured) * 0.01;
                    if (data['claim_type'] == 'PWD' || data['claim_type'] == "LON") formClaimInstance.updateData("CurrentCashValue", parseFloat(CurrentCashValue).toFixed(2));
                    if (data['claim_type'] == 'LON') formClaimInstance.updateData("PreviousloanAmount", parseFloat(PreviousloanAmount).toFixed(2));
                }
            }
        },

        dxFormDClaimRequest: {
            colCount: 2,
            //formData: [{ surname: "Wachira", other_name: "Kevin Gachomo" }],
            width: '100%',
            showColonAfterLabel: true,
            showValidationSummary: true,
            labelLocation: "top",
            scrollingEnabled: true,
            onInitialized: function (e) {
                formClaimInstance = e.component;
                viewModel.LoadPanelShown(false);
            },
            //
            items: [
                {
                    label: {
                        text: "Claim Type"
                    },
                    colSpan: 2,
                    editorType: "dxLookup",
                    dataField: "claim_type",
                    editorOptions: {
                        dataSource: SmartLife.ClaimType,
                        displayExpr: 'Description',
                        valueExpr: 'claim_type',
                        onValueChanged: function (e) {
                            //get the files first befor proceeding
                            viewModel.LoadPanelShown(true);
                            var get_form = new DB({
                                name: "get existings checklists"
                            });
                            get_form.DBget("claims/getClaimAttachments?claim_type=" + e.value).done(function (result) {
                                viewModel.LoadPanelShown(false);
                                if (result.success == true) {
                                    viewModel.default_display();
                                    viewModel.default_values();
                                    //assign datasource to files
                                    ClaimAttachDataSource = result.Attachments;
                                    console.log(ClaimAttachDataSource);
                                    viewModel.claimTypeChanged(e);
                                } else {
                                    viewModel.show_test(result.msg, 'error');
                                }
                            }).fail(function () {
                                viewModel.LoadPanelShown(false);
                                //alert_dialog("Server not accessible. Check internet connectivity");
                                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                            });

                            
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Claim Type is required"
                    }]
                }, {
                    label: {
                        text: "Policy Number"
                    },
                    colSpan: 2,
                    editorType: "dxLookup",
                    dataField: "PolicyId",
                    visible: false,
                    editorOptions: {
                        dataSource: SmartLife.ClientPolicies,
                        displayExpr: 'policy_no',
                        valueExpr: 'id',
                        onValueChanged: function (e) {
                            viewModel.policy_changed(e.value);
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "Policy Number is required"
                    }]
                }, {
                    label: {
                        text: "Dependant(s)"
                    },
                    colSpan: 2,
                    editorType: "dxTagBox",
                    dataField: "dependants",
                    visible: false,
                    editorOptions: {
                        dataSource: ["Kevin Wachira", "Wilfred Mongare"]
                    },
                    validationRules: [{
                        type: "required",
                        message: "Policy Number is required"
                    }]
                }/*, {
                    label: {
                        text: "Request Date"
                    },
                    editorType: "dxDateBox",
                    visible: false,
                    dataField: "RequestDate",
                    validationRules: [{
                        type: "required",
                        message: "Disease Date is required"
                    }]
                }*/, {
                    label: {
                        text: "Purpose"//Loan Reason 
                    },
                    editorType: "dxLookup",
                    dataField: "PartialWithdPurpose",
                    visible: false,
                    editorOptions: {
                        dataSource: SmartLife.PartialWithdrawalPurposes,
                        displayExpr: 'Description',
                        valueExpr: 'id'
                    }
                }, {//PreviousloanAmount
                    label: {
                        text: "Previous Loan Amount"
                    },
                    editorType: "dxNumberBox",
                    dataField: "PreviousloanAmount",
                    visible: false,
                    editorOptions: {
                        readOnly: true//change this to true later
                    },
                }, {//PreviousloanAmount
                    label: {
                        text: "Amount Available"
                    },
                    editorType: "dxNumberBox",
                    dataField: "CurrentCashValue",
                    visible: false,
                    editorOptions: {
                        readOnly: true//change this to true later
                    }
                }, {
                    label: {
                        text: "Use Percentage"
                    },
                    editorType: "dxCheckBox",
                    visible: false,
                    dataField: "UsePercentage",
                }, {
                    label: {
                        text: "Requested Amount"
                    },
                    editorType: "dxNumberBox",
                    visible: false,
                    dataField: "AmountAppliedFor",
                    validationRules: [{
                        type: "required",
                        message: "Amount Applied For is required"
                    }]
                }, {
                    label: {
                        text: "Percentage Applied"
                    },
                    editorType: "dxNumberBox",
                    visible: false,
                    dataField: "PercentageappliedFor",
                }, {
                    label: {
                        text: "Claim Cause"//death
                    },
                    editorType: "dxLookup",
                    visible:false,
                    dataField: "ClaimCause",
                    editorOptions: {
                        dataSource: SmartLife.ClaimCause,
                        displayExpr: 'Description',
                        valueExpr: 'claim_cause_code'
                    },
                }, {
                    label: {
                        text: "Premium Units"
                    },
                    editorType: "dxNumbertBox",
                    visible:false,
                    dataField: "PremUnits",
                    editorOptions: {
                        readOnly: true
                    },
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    colSpan: 2,
                    label: {
                        text: "FILE ATTACHMENTS"
                    },
                    visible: false,
                    dataField: "attachements",
                    editorType: "dxDataGrid",
                    editorOptions: {
                        dataSource: [],
                        wordWrapEnabled: true,
                        columns: [
                            {
                                dataField: 'id',
                                visible: false,
                            }, {
                                dataField: 'description',
                            }, {
                                caption: 'ACTION',
                                allowEditing: false,
                                cellTemplate: function (container, options) {
                                    $("<div />").appendTo(container).dxFileUploader({
                                        disabled: false,
                                        selectButtonText: 'ATTACH FILE',
                                        visible: true,
                                        accept: 'image/*',
                                        uploadMode: 'useButtons',
                                        multiple: false,
                                        name: 'myFile',
                                        uploadUrl: '',//upload_url_sig,
                                        //onUploadStarted: upload_started,
                                        //onValueChanged: get_uploadurl_sig,
                                        progress: 0,
                                        //onUploaded: sys_uploaded,
                                        showFileList: true,
                                        //validationError: file_uploaded_error
                                    }).appendTo(container);
                                }
                            }
                        ]
                    }
                }, {
                    colSpan: 2,
                    itemType: "empty"
                }, {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: "BACK",
                        horizontalAlignment: "left",
                        icon: "chevronprev",
                        type: "normal",
                        onClick: function (args) {
                            //save and navigate next screen.
                            //tabsInstance.option("selectedIndex", 1);
                        }
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: "SAVE",
                        icon: "save",
                        type: "normal",
                        onClick: function (args) {
                            //alter the array depending on the form
                            //qn_intermediary, fm_health_intermediary;
                            var result = args.validationGroup.validate();
                            let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                            //if (result.isValid) {
                                //post data here
                                ///post data form as it is
                                viewModel.LoadPanelShown(true);
                                let get_life = new DB({
                                    name: "submitting the form"
                                });
                                //let data = $("#dxFormClaimRequest").dxForm('instance').option("formData");
                                console.log(data);
                                get_life.DBpost("claims/insertClaimEntries", data).done(function (result) {
                                    viewModel.LoadPanelShown(false);
                                    if (result.success == true) {
                                        console.log(result.record_id);
                                        //navigate to the my applications screen
                                        SmartLife.app.back();
                                    } else {
                                        viewModel.show_test(result.msg, 'error');
                                    }
                                }).fail(function () {
                                    viewModel.LoadPanelShown(false);
                                    viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
                                });
                            //}
                        }
                    }
                }]
        },


        /////////initialize varibles////////
        /*claim_type, notification_date, claim_cause, claim_branch, event_date, doctors_name, member_name,
        policy_no, paydue_date, policy_status, prem_units, tot_proceeds, tot_ded, net_pay, claim_no*/
        policy_no_arr: ko.observableArray(),
        pol_changed: function (e) {
            for (var i = 0; i < viewModel.policy_no_arr().length; i++) {
                if (viewModel.policy_no_arr()[i].policy_no == e.value) {
                    alert(viewModel.policy_no_arr()[i].cacv);
                    viewModel.tot_proceeds(viewModel.policy_no_arr()[i].cacv);
                    var net_pay = parseFloat(parseFloat(viewModel.tot_proceeds()).toFixed(2) * 0.7).toFixed(2);
                    viewModel.net_pay(net_pay);
                }
            }
        },
        claim_changed: function (e) {
            if (e.value == "Request for Surrender") {
                viewModel.vs_partial(false);
            } else {
                viewModel.vs_partial(true);
            }
        },
        vs_partial: ko.observable(false),
        claim_type: ko.observable(''),
        amount_applied: ko.observable(''),
        claim_type_arr: ko.observableArray(claim_type_arr),
        notification_date: ko.observable(new Date()),
        claim_clause: ko.observable(''),
        claim_clause_arr: ko.observableArray(),
        claim_branch: ko.observable(''),
        claim_branch_arr: ko.observableArray(),
        event_date: ko.observable(),
        doctors_name: ko.observable(''),
        doctors_name_arr: ko.observableArray(),
        member_name: ko.observable(''),
        member_name_arr: ko.observableArray(),
        policy_no: ko.observable(),
        paydue_date: ko.observable(),
        policy_status: ko.observable(''),
        policy_status_arr: ko.observableArray(),
        prem_units: ko.observable(''),
        tot_proceeds: ko.observable(''),
        tot_ded: ko.observable(''),
        net_pay: ko.observable(''),
        claim_no: ko.observable(''),
        reason: ko.observable(''),
        vs_save: ko.observable(false),
        vs_edit: ko.observable(false),
        ////////end of initialize variables///

        /////validation///////
        polnoValidationRules: ko.observable({
            validationRules: [{
                type: "required",
                message: "Policy number is required"
            }]
        }),
        claimtypeValidationRules: ko.observable({
            validationRules: [{
                type: "required",
                message: "Claim Type is required"
            }]
        }),
        ////end of validation/////

        //handle dxfileuploader//
        upload_url: ko.observable("http://localhost/cassoa_portal_api/upload.php?"),
        upload_started: function (e) {
            viewModel.LoadPanelShown(true);
            //console.log(e);
            //console.log(e.file);
        },
        doc_file_value_changed: function (e) {
            //viewModel.upload_url(Portal.attach_url + 'record_id=' + record_id + '&n=3&usr_id=' + Portal.usr_id);

        },
        doc_uploaded: function () {
            viewModel.LoadPanelShown(false);
        },
        file_uploaded_error: function (error) {
            viewModel.LoadPanelShown(false);
            console.log(error);
        },
        file_upload_aborded: function (e) {
            viewModel.LoadPanelShown(false);
        },
        file_upload_error: function (e) {
            viewModel.LoadPanelShown(false);
        },
        ////end of dxfileuploader//
        edit_claim: function () {
            SmartLife.app.back();
        },
        save_claim: function () {
            //if (viewModel.policy_no() == '' || viewModel.claim_type() == '') {
            //var result = args.validationGroup.validate();
            //if (result.isValid) {
            var get_form = new DB({
                name: "post to mob_claims_info"
            });

            //policy_no, claim_type, request_date, tot_cash_value, amount_available, amount_applied, reason, status
            get_form.DBpost("claimRequest?",
                {
                    policy_no: viewModel.policy_no(),
                    clientno: SmartLife.clientno(),
                    claim_type: viewModel.claim_type(),
                    request_date: viewModel.formatDates(viewModel.notification_date()),
                    tot_cash_value: viewModel.tot_proceeds(),
                    amount_available: viewModel.net_pay(),
                    amount_applied: JSON.parse(viewModel.amount_applied()),
                    reason: viewModel.reason()
                }
            ).done(function (result) {
                if (result.status == true) {
                    viewModel.show_test("New Checklist Successfully Added", 'success');
                    SmartLife.app.back();
                } else {
                    viewModel.show_test(result.msg, 'error');
                }
            }).fail(function () {
                //alert_dialog("Server not accessible. Check internet connectivity");
                viewModel.show_test('Cannot connect to server check Internet connectivity', 'error');
            });
            //}
            /*} else {
                //SmartLife.captured_claims
                SmartLife.captured_claims.push({ policy_no: viewModel.policy_no(), claim_type: viewModel.claim_type(), notification_date: viewModel.formatDate(viewModel.notification_date()), tot_proceeds: viewModel.tot_proceeds(), net_pay: viewModel.net_pay(), reason: viewModel.reason(), amount_applied: viewModel.amount_applied() });
                console.log(SmartLife.captured_claims);
                SmartLife.app.back();
            }*/
        },

    };

    return viewModel;
};