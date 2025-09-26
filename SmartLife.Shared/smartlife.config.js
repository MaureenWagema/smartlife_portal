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
                "title": "Enquiry",
                "onExecute": "#policy_enquiry/2",
                "id": "policy_enquiry",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "On Board",
                "onExecute": "#applications/3",
                "id": "applications",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Products",
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
                "title": "Claim Request(s)",
                "onExecute": "#request_claim_list/7",
                "id": "request_claim_list",
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
                "title": "Endorsement Request(s)",
                "onExecute": "#endorsement_list/9",
                "id": "endorsement_list",
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
            },
            {
                "title": "Contact Us",
                "onExecute": "#contact_us/12",
                "id": "contact_us",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "FAQ",
                "onExecute": "#FAQ/13",
                "id": "FAQ",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Request Loan",
                "onExecute": "#agent_loan_list/14",
                "id": "agent_loan_list",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Home",
                "onExecute": "#group_home/15",
                "id": "group_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Home",
                "onExecute": "#broker_home/16",
                "id": "group_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Quotations",
                "onExecute": "#quote_group_list/17",
                "id": "group_home",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Member Management",
                "onExecute": "#member_management/18",
                "id": "member_management",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "My Policies",
                "onExecute": "#AgentPolicies/19",
                "id": "AgentPolicies",
                "icon": "info",
                visible: ko.observable(false)
            },
            ///////////////////// Agents crap
            {
                "title": "Agents All Sale",
                "onExecute": "#AgentAllSale/20",
                "id": "AgentAllSale",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Agents Office Sales",
                "onExecute": "#AgentOfficeSales/21",
                "id": "AgentOfficeSales",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Agents Performance",
                "onExecute": "#AgentPerformance/22",
                "id": "AgentPerformance",
                "icon": "info",
                visible: ko.observable(false)
            },
            {
                "title": "Agents All Sales Grid",
                "onExecute": "#AgentsAllSaleGrid/23",
                "id": "AgentPerformance",
                "icon": "info",
                visible: ko.observable(false)
            }
        ]
    }
});
