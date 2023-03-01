// NOTE object below must be a valid JSON
window.SmartLife = $.extend(true, window.SmartLife, {
    "config": {
        "layoutSet": "treeview",
        "animationSet": "default",
        "navigation": [
            {
                "title": "Home",
                "onExecute": "#home/0",
                "id": "home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "My Applications",
                "onExecute": "#applications/1",
                "id": "applications",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Buy Policy",
                "onExecute": "#get_quotation/2",
                "id": "get_quotation",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Capture Proposal",
                "onExecute": "#products_list/3",
                "id": "products_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Policy Enquiry",
                "onExecute": "#policy_enquiry/4",
                "id": "policy_enquiry",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Make Policy Payment",
                "onExecute": "#make_a_payment/5",
                "id": "make_a_payment",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Request Policy Endorsement",
                "onExecute": "#endorsement_list/6",
                "id": "endorsement_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Respond to client Messages",
                "onExecute": "#About/7",
                "icon": "info",
                "id": "About",
                visible: ko.observable(false)
            },
            {
                "title": "Claim Request",
                "onExecute": "#request_claim_list/8",
                "id": "request_claim_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "View Policy Statements",
                "onExecute": "#view_statement/9",
                "id": "view_statement",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "View Commissions",
                "onExecute": "#commissions/10",
                "id": "commissions",
                "icon": "info",
                visible: ko.observable(false)
            }
        ]
    }
});
