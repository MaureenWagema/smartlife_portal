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
                "title": "Home",
                "onExecute": "#agent_home/1",
                "id": "agent_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Policy Enquiry",
                "onExecute": "#policy_enquiry/2",
                "id": "policy_enquiry",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "My Applications",
                "onExecute": "#applications/3",
                "id": "applications",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Buy Policy",
                "onExecute": "#get_quotation/4",
                "id": "get_quotation",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Capture Proposal",
                "onExecute": "#products_list/5",
                "id": "products_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Make Policy Payment",
                "onExecute": "#make_a_payment/6",
                "id": "make_a_payment",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Request Policy Endorsement",
                "onExecute": "#endorsement_list/7",
                "id": "endorsement_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Respond to client Messages",
                "onExecute": "#About/8",
                "icon": "info",
                "id": "About",
                visible: ko.observable(false)
            },
            {
                "title": "Claim Request",
                "onExecute": "#request_claim_list/9",
                "id": "request_claim_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "View Policy Statements",
                "onExecute": "#view_statement/10",
                "id": "view_statement",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "View Commissions",
                "onExecute": "#commissions/11",
                "id": "commissions",
                "icon": "info",
                visible: ko.observable(false)
            }
        ]
    }
});
