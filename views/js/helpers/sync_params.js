var Sync = (function (window, $Sync) {
    //"use strict";

    if (window[$Sync] && !window.opera) return window[$Sync];


    var
        SyncPrototype = Sync.prototype
        ;

    
    SyncPrototype.syncParams = syncParams;
    SyncPrototype.sync_parameters = sync_parameters;

    function Sync(options) {
        if (!(this instanceof Sync))
            return new Sync(options);
        //TODO insert synced data
        var self = this;
        loadpanel = options.loadpanel;
        console.log(options.name);
        return self;
    }

    

    function sync_parameters(fn) {
        // get the system parameters from remote server and save in the localstorage/db.
        //MedicalClass, CrewType, LicenseTypes
        syncParams().done(function (result) {

            ///////embedded insuarance params
            SmartLife.identityinfo = result.identityinfo;
            SmartLife.branchmasterinfo = result.branchmasterinfo;
            ////////end of embedded insuarance params///

            ///////////////////BaPackages/////////////
            SmartLife.BaPackages = result.BaPackages;
            ///////////////////FuneralCat/////////////
            SmartLife.FuneralCat = result.FuneralCat;
            ///////////////////planinfo/////////////
            SmartLife.planinfo = result.Planinfo;
            ///////////////////Riderinfo/////////////
            SmartLife.riderinfo = result.Riderinfo;
            ///////////////////plan_rider_config/////////////
            SmartLife.PlanRiderinfo = result.PlanRiderinfo;
            ///////////////////Relationshipinfo/////////////
            SmartLife.Relationshipinfo = result.Relationshipinfo;
            //create a relationship_depandants array
            //SmartLife.depantant_relationship.push(SmartLife.Relationshipinfo[i];
            SmartLife.Relationshipinfo = result.Relationshipinfo;
            //SmartLife.depantant_relationship.push(SmartLife.Relationshipinfo[i];
            ///////////////////Maritalinfo/////////////
            SmartLife.Maritalinfo = result.Maritalinfo;
            ///////////////////Genderinfo/////////////
            SmartLife.Genderinfo = result.Genderinfo;
            ///////////////////Employerinfo/////////////
            SmartLife.Employerinfo = result.Employerinfo;
            ///////////////////paclass/////////////
            SmartLife.Paclassinfo = result.Paclassinfo;
            ///////////////////occupationinfo/////////////
            SmartLife.Occupationinfo = result.Occupationinfo;
            ///////////////////Countryinfo/////////////
            SmartLife.Countryinfo = result.Countryinfo;
            ///////////////////Healthinfo/////////////
            SmartLife.Healthinfo = result.Healthinfo;
            ///////////////////LifeAgents/////////////
            SmartLife.LifeAgents = result.LifeAgents;
            ///////////////////Bankinfo/////////////
            SmartLife.Bankinfo = result.Bankinfo;
            ///////////////////Paymentinfo/////////////
            SmartLife.Paymentinfo = result.Paymentinfo;
            ///////////////////Paymentmode/////////////
            SmartLife.Paymentmode = result.Paymentmode;
            ///////////////////Paysourcebr/////////////
            SmartLife.Paysourcebr = result.Paysourcebr;
            ///////////////////Paymentmodeinfo/////////////
            SmartLife.Paymentmodeinfo = result.Paymentmodeinfo;
            ///////////////////Premdistribinfo/////////////
            SmartLife.Premdistribinfo = result.Premdistribinfo;
            ///////////////////Premrateinfo/////////////
            SmartLife.Premrateinfo = result.Premrateinfo;
            ///////////////////Defaultsinfo/////////////
            SmartLife.Defaultsinfo = result.Defaultsinfo;
            ///////////////////Riderpremuimrate/////////////
            SmartLife.Riderpremuimrate = result.Riderpremuimrate;
            ///////////////////Funeralratesinfo/////////////
            SmartLife.Funeralratesinfo = result.Funeralratesinfo;
            ///////////////////ParentsPrem/////////////
            SmartLife.ParentsPrem = result.ParentsPrem;

            SmartLife.FamDisease = result.FamDisease;

            SmartLife.ClientPolicies = result.ClientPolicies;
            SmartLife.ClaimType = result.ClaimType;
            SmartLife.PartialWithdrawalPurposes = result.PartialWithdrawalPurposes;
            SmartLife.ClaimCause = result.ClaimCause;
            SmartLife.EndorsementTypes = result.EndorsementTypes;
            SmartLife.Regions = result.Region;
            SmartLife.Banks = result.Banks;
            SmartLife.BanksBranches = result.BanksBranches;//
            SmartLife.Telcos = result.Telcos;
            SmartLife.IDTypes = result.IDTypes;
            SmartLife.titleInfo = result.titleInfo;
            /////////////Confirmations/////////////
            //SmartLife.confirmations
            SmartLife.Confirmations = [{ id: false, name: "NO" }, { id: true, name: "YES" }];
            SmartLife.doc_mode = [{ id: 1, name: "EMAIL" }, { id: 2, name: "PO BOX" }];
            /////////////Confirmations/////////////
            SmartLife.Percentage = result.PremiumIncrementPercentage;//[10,15,20,25,30];

            fn(true);
        }).fail(function (error) {
            console.log(error);
            //loadpanel.hide();
            //DevExpress.ui.dialog.alert("Server not accessible. Check internet connectivity. Unable to sync parameters");
            //TODO on press OK, do a recurssion.
            //alert_dialog("Server not accessible. Check internet connectivity", loadpanel);
        });

    }

    function syncParams() {
        //var url = SmartLife.url + "generalParams?n=0";
        //var url = "http://" + SmartLife.ip_address + "/" + SmartLife.root_folder + "/cassoaPortalAPI/generalParams?n=0";
        //var url = SmartLife.url + "parameter.php?is_micro=" + SmartLife.is_micro+"&n=1";
        var url = SmartLife.url + "params/getParams";
        //var url = SmartLife.root_folder + "/cassoaPortalAPI/generalParams?n=0";
        return $.ajax({
            method: "GET",
            url: url,
            timeout: 300000,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            error: function (xhr, status, error) { // flow always comes in error callback even url returns true and this is the issue.
                //DevExpress.ui.notify('User not allowed', error, 2000);
            }
        });
    }

    return Sync;

}(this, "Sync"));