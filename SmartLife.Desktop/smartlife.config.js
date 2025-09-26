// NOTE object below must be a valid JSON
window.SmartLife = $.extend(true, window.SmartLife, {
    "config": {
        "layoutSet": "treeview",
        "animationSet": "default",
        "navigation": [
            {
                "title": "Home",
                "onExecute": "#agent_home/0",
                "id": "agent_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Home",
                "onExecute": "#home/1",
                "id": "home",
                "icon": "info",
                visible: ko.observable(false)
            },{
                "title": "Sales",
                "onExecute": "#sales/2",
                "id": "sales",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "My Activities",
                "onExecute": "#activities_list/3",
                "id": "activities_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Enquiry",
                "onExecute": "#policy_enquiry/4",
                "id": "policy_enquiry",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Claims Enquiry",
                "onExecute": "#claim_enquiries/5",
                "id": "claim_enquiries",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Loan Enquiry",
                "onExecute": "#loan_enquiry/6",
                "id": "loan_enquiry",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Premium Details",
                "onExecute": "#source_data/7",
                "id": "source_data",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Submitted Cases",
                "onExecute": "#applications/8",
                "id": "applications",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Products",
                "onExecute": "#get_quotation/9",
                "id": "get_quotation",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Capture Proposal",
                "onExecute": "#products_list/10",
                "id": "products_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Make Policy Payment",
                "onExecute": "#make_a_payment/11",
                "id": "make_a_payment",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Claim Report",
                "onExecute": "#request_claim_list/12",
                "id": "request_claim_list",
                "icon": "info",
                visible: ko.observable(false)
                
            },
            {
                "title": "Respond to client Messages",
                "onExecute": "#About/13",
                "icon": "info",
                "id": "About",
                visible: ko.observable(false)
            },
            {
                "title": "Endorsement Report",
                "onExecute": "#endorsement_list/14",
                "id": "endorsement_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Claims to Sign",
                "onExecute": "#signature_claims/15",
                "id": "signature_claims",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "View Policy Statements",
                "onExecute": "#view_statement/16",
                "id": "view_statement",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Incepted Cases",
                "onExecute": "#AgentPolicies/17",
                "id": "AgentPolicies",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Contact Us",
                "onExecute": "#contact_us/18",
                "id": "contact_us",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "FAQ",
                "onExecute": "#FAQ/19",
                "id": "FAQ",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Request Loan",
                "onExecute": "#agent_loan_list/20",
                "id": "agent_loan_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Home",
                "onExecute": "#group_home/21",
                "id": "group_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Home",
                "onExecute": "#broker_home/22",
                "id": "broker_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Quotations",
                "onExecute": "#quote_group_list/23",
                "id": "group_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Member Management",
                "onExecute": "#member_management/24",
                "id": "member_management",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Commissions",
                "onExecute": "#commissions/25",
                "id": "commissions",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Sources",
                "onExecute": "#premium_source/26",
                "id": "premium_source",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Micro Collections",
                "onExecute": "#micro_collections/27",
                "id": "micro_collections",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "My Account",
                "onExecute": "#AgentAccount/28",
                "id": "AgentAccount",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Claim Applications",
                "onExecute": "#group_claims/29",
                "id": "group_claims",
                "icon": "info",
                visible: ko.observable(false)
            },
            ///////////////////// Agents crap
            {
                "title": "Agents All Sale",
                "onExecute": "#AgentAllSale/30",
                "id": "AgentAllSale",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Agents Office Sales",
                "onExecute": "#AgentOfficeSales/31",
                "id": "AgentOfficeSales",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Agents Performance",
                "onExecute": "#AgentPerformance/32",
                "id": "AgentPerformance",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Agents All Sales Grid",
                "onExecute": "#AgentsAllSaleGrid/33",
                "id": "AgentPerformance",
                "icon": "info",
                visible: ko.observable(false)
            }
        ]
    }
});
