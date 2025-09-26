//TODO load parameters from local database.
var Policy_det = (function (window, $Policy_det) {
    "use strict";

    if (window[$Policy_det] && !window.opera) return window[$Policy_det];


    var
        undefined,
        db2 = null,
        Policy_detPrototype = Policy_det.prototype
        ;

    Policy_detPrototype.get_esb = get_esb;
    Policy_detPrototype.get_geep = get_geep;
    Policy_detPrototype.get_gfp = get_gfp;
    Policy_detPrototype.get_gcip = get_gcip;
    Policy_detPrototype.get_lgp = get_lgp;
    Policy_detPrototype.get_saving = get_saving;
    Policy_detPrototype.get_travel = get_travel;
    Policy_detPrototype.errCallback = errCallback;
    Policy_detPrototype.successCallback = successCallback;


    function Policy_det(options) {
        //TODO insert Policy_deted data
        var self = this;
        console.log(options.name);
        //TODO 
        //1. call instance of Policy_det_params
        /*self.db2 = new Database({
            name: kgs_Mobile.db_name,
            description: kgs_Mobile.db_description,
            size: kgs_Mobile.db_size
        });*/
        //2. get params from remote server
        //params_type(self.db2);
        return self;
    }

    function errCallback() {
        this.loadpanel.hide();
        console.log("datamabase error!");
    }

    function successCallback(results) {
        console.log('db operation successfull.');
    }

    function get_esb() {
    //ENHANCED LIFE SAVINGS BENEFIT PLAN
        var esb_content = `<p>The <strong>GLICO END &#8211; OF &#8211; SERVICE BENEFITS (ESB) </strong>plan pays out cash benefits at your retirement from active service.<br />
        The ESB is essentially an additional pension plan an individual takes in addition to his or her statutory pensions. It has investment and protection benefits put together to provide cash benefit at maturity or to a named beneficiary when death occurs before maturity.<br />
        &nbsp;<br />
        The investment aspect of the plan is specially packaged to provide a hedge against inflation. This ensures that the value of money invested is maintained.<br />
        &nbsp;<br />
        <strong>How much premium do I pay on this policy? </strong><br />
        The minimum monthly contribution is GHC 50.00 and is available for individuals who earn regular income between the ages of 18-55years.</p>
        <p><strong> How do I Benefit on this policy?</strong><br />
        A policyholder may choose any of the benefits upon leaving or retiring from service:</p>
        <p><strong>Gratuity:</strong> A lump sum of money is payable outright upon maturity of the policy</p>
        <p><strong>Annuity:</strong> Income payable for life at scheduled intervals such as quarterly, bi- annually or annually guaranteed for 5years.</p>
        <p><strong>Hybrid:</strong>  A combination of (gratuity and annuity) with 50% of the principal sum payable as ESB and the remaining part payable as annuity for life and guaranteed for a period of 5 years.<br />
        &nbsp;<br />
        <strong> Any Additional Benefits I can enjoy?</strong><br />
        Additional benefits to be enjoyed from the sixth month of inception of the policy are follows:</p>
        <p><strong>Death:</strong> If the policyholder passes on during the term of the PLAN, the sum assured payable under the <em>Term Insurance Benefit</em> shall be paid to his/her beneficiaries.</p>
        <p><strong>Hospitalization Cash Income:</strong> if the policyholder is hospitalized, an amount of money (based on the sum assured) shall be paid daily as <em>In-Hospital Cash Income Benefit </em>for the number of days the policyholder spent in the hospital for a maximum period of 365days. If hospitalization is due to an accident, benefits shall be paid from the second day. If the hospitalization is not due to an accident, benefits shall be paid on the third day after the accident.</p>
        <p><strong>Accident Indemnity:</strong> if the policyholder sustains bodily injuries in an accident, GLICO LIFE shall pay the amount of money payable under the <em>Accident Indemnity benefit.</em></p>
        <p>If the accident renders the policyholder permanently disabled, the lump sum is paid. However if the accident causes temporal disablement, monthly benefits are paid instead.</p>
        `;

        return esb_content;
    }

    function get_geep() {
        var geep_content = `<p>The <strong>GLICO EDUCATION endowment PLAN (GEEP)</strong> is essentially an investment plan with insurance benefits designed for individuals to accumulate cash for use in financing a child’s and/ or policyholder’s education. The premiums paid by policyholders are invested in profit-yielding ventures to offer maximum returns at the time most needed.</p>
            <p>GEEP primarily provides insurance protection for the premium-paying parent. This way, should the parent pass on or become permanently disabled before maturity of the policy, the child’s education is still fully guaranteed (in proportion to premium outlay).</p>
            <p><strong>What is unique about this policy? </strong></p>
            <p>In instances, where the premium-paying parent passes on or is permanent disabled, GLICO LIFE takes over the monthly premium payment until maturity to pay the full expected benefits under the policy, as if the premium paying parent has paid all premiums to its maturity.</p>
            <p><strong>How much premium do I pay on this policy?  </strong></p>
            <p>The minimum monthly premium is GHC 50.00 and is available for individuals between the ages of 18-65. The maximum age at entry is set at 59 years with the maximum child’s age set at 13.</p>
            <p><strong>What other Benefits does GEEP provide?<br />
            </strong>The GEEP policy provides the following additional benefits:</p>
            <p><strong>Accident Indemnity:</strong> In the event that the premium paying parent is involved in an accident and becomes permanently disabled from carrying on with his normal work, the rider shall pay the amount of benefit applicable under the Accident indemnity Benefit. The payment shall include total and permanently disability, dismemberment and accident monthly benefits.</p>
            <p><strong>Hospitalization Cash Income:</strong> in the event that the premium paying parent is hospitalized during the period this policy is in force, the rider shall pay the amount of benefit applicable as Daily Hospital Cash Income Benefit for the number of days that the insured shall be admitted in the hospital up to the maximum period of 365 days.</p>
            <p><strong> Death:</strong> If the policyholder passes on during the term of the PLAN, the sum assured payable under the <em>Term Insurance Benefit</em> shall be paid to his/her beneficiaries.”</p>
            `;
        return geep_content;
    }

    function get_gfp() {
        var gfp_content = `<strong>How much premium am I required to pay?</strong></p>
            <p>The minimum premium payable annually starts from GHC 50.00 depending on the category of insured. This amount may be paid in lump sum or by regular installment as may be agreed with the insured.</p>
            <p><strong>What Optional Benefits do I enjoy?</strong></p>
            <p>optional/additional benefits on the funeral policy are as follows:</p>
            <p><em><u>Insurance on Family:</u></em> This benefit allows the policy owner to purchase insurance on any member of his/her extended family (spouse, children, parents, parent-in-laws). Each of the nominated members except the nominated child(ren) will be covered under a separate whole life insurance rider; the children will be covered under a term-to-age 25 temporary insurance rider.</p>
            <p><em><u>Waiver of Premium on Disability:</u></em><strong>  </strong>This benefit allows the life  cover benefit on the primary insured as well as his/her nominated lives under the policy to still continue if the primary insured becomes permanently disabled before his or her 65<sup>th</sup> birthday.<br />
            &nbsp;<br />
            <em><u>Savings Plus:</u></em><strong>  </strong>The “Savings Plus” rider allows the primary insured to accrue savings on the side through payment of additional monthly contributions (to be agreed at the inception of policy) whilst the policy is in force.  The Savings Plus account will be credited with a rate of interest not less than 5% per annum.  The Savings Plus account is accessible to the primary insured only at the end of every policy anniversary.</p>
            <p><em><u>Term Conversions:</u></em> The insurance on the primary insured as well as on a nominated life is convertible to a separate Universal Life policy during the term of the insurance. However, this arrangement does not go beyond the age of 65 of the person covered under the insurance.<br />
            &nbsp;<br />`;
        return gfp_content;
    }
    function get_gcip() {
        var gcip_content = `<p>The <strong>GLICO CRITICAL ILLNESS PLAN (GCIP</strong>) is a health policy which pays out a lump sum to the policyholder if he/she is diagnosed by a medical specialist doctor from a registered hospital as having critical/dread diseases.</p>
            <p>It is a pure term policy specially designed to provide insurance protection for individuals and their families in the event of the diagnosis of a critical illness.</p>
            <p><strong>What are Critical Illnesses?</strong></p>
            <p>Critical illnesses or dread diseases are serious and life threatening diseases such as heart attack, cancer, stroke, Alzheimer&#8217;s, Parkinson&#8217;s, Coronary Heart Disease requiring surgery; Cancer; Coma; Paralysis; Kidney Failure; Major Burns; Blindness among others.</p>
            <p><strong>Do I need medical examination before taking this policy?</strong>The GSIP does not necessarily require a medical examination before commencement. Applicants are required to disclose all medical conditions on the proposal form when applying for the policy. Depending on the information disclosed, GLICO LIFE may request for a medical examination at a recommended health centre from any applicant if deemed necessary to assist with determining levels of insurance.</p>
            <p><strong>What is the minimum age set to take this policy?<br />
            </strong>The minimum entry age is 18 years and the maximum entry age is 59 years. Children below 18 can however be insured as dependants.</p>
            <p><strong>How much premium do I pay on the GCIP?</strong><br />
            Depending on the age of the applicant, the minimum premium is GHC 25.00.</p>`;
        return gcip_content;
    }
    function get_lgp() {
        var lgp_content = `<p>The <strong>GLICO LIFE GUARANTEED PLAN</strong> (LGP) guarantees to provide the a lump sum payment  on condition that all premiums from the inception of the policy have been fully paid.</p>
                <p>The Life Guaranteed Plan is a special cluster of insurance and pure investment policy specifically designed to provide payment of a lump sum, usually a portion of the sum assured, every five years, on the earlier death of the assured before maturity of the policy.</p>
                <p><strong>What are the Unique features about this policy?</strong></p>
                <p>The unique feature about this policy is that, in case the policyholder does not exercise the Cash-in-option (explained below), the amount due the policyholder may be transferred to a separate fund. The net interest earned on the amount shall be credited and advised each year to the policyholder at the end of each accounting year or every three years.</p>
                <p>In the event of death during the policy term, the Sum Insured (plus bonuses)  plus accumulated retained amount, irrespective of amount paid under Cash-in-Option, if any, would become payable to the policyholder.</p>
                <p>&nbsp;</p>
                <p><strong>What is the minimum age of taking this policy?</strong></p>
                <p>The minimum and maximum entry ages for policyholders and spouse is eighteen (18) and fifty-five (55) years respectively.</p>
                <p>&nbsp;</p>
                <p><strong>What is the minimum period  for which I can take this policy?</strong></p>
                <p>The minimum period for which this policy can be purchased is ten (10) years and the minimum Sum Assured is GHC 5,000.00</p>
                <p><strong>What are the benefits one enjoys on this policy?</strong></p>
                <p>Upon maturity, the Life assured enjoys two options of benefit:</p>
                <ol>
                <li><strong>Cash- In-Option:</strong> the amount due the assured is paid immediately.</li>
                <li><strong>Retention Option: </strong>The amount due to the assured may be transferred to a separate fund and net interest earned on the amount may be credited each year to the assured. The amount to be credited is advised to the assured at the end of each accounting year. Any amount retained under this option would be credited with interest for settlement of claim on death or maturity.</li>
                </ol>
                <p>&nbsp;</p>
                <p><em>In the case that the assured does not choose any of the options of benefit, the retention option will automatically apply to the policy.</em></p>
                <p>&nbsp;</p>
                <p><strong> What Optional Benefits do I enjoy?</strong></p>
                <p>Optional benefits to be enjoyed are the following:</p>
                <p><strong>Death:</strong> If the policyholder passes on during the term of the PLAN, the sum assured payable under the <em>Term Insurance Benefit</em> shall be paid to his/her beneficiaries.</p>
                <p><strong>Permanent and Total Disability (PTD):</strong></p>
                <p>If the assured sustains injuries and is permanently disabled, GLICO LIFE shall pay the amount of money payable under the <em>Permanent and Total disability Benefit.</em> This is dependent on the fact that all regular premiums due from the commencement of the policy have been paid.</p>
                <p>&nbsp;</p>
                <p><strong>Hospitalization Income:</strong></p>
                <p>If the assured is confined as an in-patient in a government or licensed hospital, GLICO LIFE, upon receiving due proof, shall pay  a daily  amount <em>In–hospital Income Benefit</em> to the assured for the number of days spent in hospital not exceeding a maximum  period of 180 days to be changed to 360days.</p>
                <p>&nbsp;</p>
                <p><strong>Dreaded Disease/Critical Illness:</strong></p>
                <p>If the assured suffers a dread disease/critical illness, GLICO LIFE shall pay the amount of money payable under the dread disease/critical illness benefit, upon proof, from a certified doctor within three month of the onset of disease/illness.</p>
                <p>&nbsp;</p>
                <p><strong>“Dread Disease”</strong> means any disease that has adverse effect on the assured such as Stroke; Heart Attack; Coronary Heart Disease requiring surgery; Cancer; Coma; Paralysis; Kidney Failure; Major Burns; Blindness among others.</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>`;
        return lgp_content;
    }

    function get_saving() {
        var saving_content = `<p>The<strong> GLICO LIFE SAVINGS PLAN (GLSP) </strong>guarantees a lump sum payment at the end of a policy period of 10 years, whether the life insured survives to complete payment of the premiums or not.</p>
            <p>GLSP is a form of endowment or personal savings for individuals, designed to provide a lump sum after an agreed number of years (minimum five (5) years) or on the earlier death of the life assured.</p>
            <p><strong>At what age can I take the life Savings policy?</strong></p>
            <p>The minimum and maximum entry ages for policyholders and spouse is eighteen (18) to fifty- (50) years respectively.</p>
            <p><strong>What is the minimum period this policy can be taken?</strong></p>
            <p>The minimum period for which this policy can be purchased is fifteen (15) years and the minimum Sum Assured is GHC 1,000.00.</p>
            <p>&nbsp;</p>
            <p><strong> What Optional Benefits do I enjoy?</strong></p>
            <p>GLICO Life Saving Plan offers the following additional/optional benefits:</p>
            <p><strong>Death:</strong> If the policyholder passes on during the term of the PLAN, the sum assured payable under the <em>Term Insurance Benefit</em> shall be paid to his/her beneficiaries.</p>
            <p><strong>Permanent and Total Disability (PTD):</strong></p>
            <p>If the assured sustains injuries and is permanently disabled, GLICO LIFE shall pay the amount of money payable under the <em>Permanent and Total disability benefit</em>. This is dependent on the fact that all regular premiums due from the commencement of the policy have been paid.</p>
            <p><strong>Retrenchment:</strong> &#8220;Retrenchment” means the forced lay-off of the assured by his/her primary employer. This forced lay-off should be due to the downscaling on the part of the employer and the assured should have been gainfully employed for a period of not less than 26 weeks. In such instance, GLICO LIFE shall pay the amount of money payable under the <em>Retrenchment Benefit.</em></p>
            <p><em> </em></p>
            <p><strong>Hospitalization Income:</strong></p>
            <p>If the assured is confined as an in-patient in a government or licensed hospital, GLICO LIFE, upon receiving due proof, shall pay  a daily  amount <em>In–hospital Income Benefit </em>to the assured for the number of days spent in hospital not exceeding a maximum  period of 180 days.</p>
            <p>&nbsp;</p>
            <p><strong>Dreaded Disease/Critical Illness:</strong></p>
            <p>If the assured suffers a dread disease/critical illness, GLICO LIFE shall pay the amount of money payable under the <em>Dread disease/Critical Illness Benefit</em>, upon proof, from a certified doctor within three month of the onset of disease/illness.</p>
            <p>&nbsp;</p>
            <p><strong>“Dread Disease”</strong> means any disease that has adverse effect on the assured such as Stroke; Heart Attack; Coronary Heart Disease requiring surgery; Cancer; Coma; Paralysis; Kidney Failure; Major Burns; Blindness among others.</p>
            <p>&nbsp; </p>`;
        return saving_content;
    }

    function get_travel() {
        var travel_content = `<p><strong>GLICO TRAVEL INSURANCE POLICY</strong></p>
            <p>It’s a vital and worthy consideration for every traveler embarking on a journey to be adequately covered by insurance before the trip for ample protection against the unexpected and also enjoy peace of mind.</p>
            <p><strong>THE PLAN</strong></p>
            <p>The GLICO-Mapfre Asistencia Travel Insurance provides adequate cover to relieve our client financially (cost of treatment) if any of the listed assured events occur.</p>
            <p>The GLICO-Mapfre Asistencia travel insurance policy satisfies all the Schengen and Non-Schengen states’ visa requirements.</p>
            <p><strong>FEATURES OF THE PLAN</strong></p>
            <p>Cover can be taken for persons from the ages of 3months and above. Cover commences on the effective date of the policy but only when the insured departs his home country.</p>
            <p>The GLICO-Mapfre Asistencia Travel Policy is well suited to cater for more specific coverage such as Schengen package, Student package, Family package and the Traveler package all of which meets the exact requirement by Embassies.</p>
            <p><strong>MAIN BENEFITS *</strong></p>
            <p><strong>Medical and Emergency Assistance </strong></p>
            <ul>
            <li>Under this, medical and hospital expenses incurred would be payable but to a stated policy limit. Other benefits under this include;</li>
            <li>Emergency Medical Evacuation</li>
            <li>Emergency Dental Care</li>
            <li>Repatriation of Mortal Remains</li>
            <li>Repatriation of Mortal Remains</li>
            <li>Repatriation of family member travelling with the insured</li>
            <li>Emergency Return Home following Death of a Close Relative</li>
            <li>Travel of One Immediate Family Member</li>
            </ul>
            <p><strong>Personal Assistance Service</strong></p>
            <ul>
            <li>The traveler is assured of 24 hours Assistance Services Hijacking in means of public transport</li>
            <li>Hijacking in means of public transport</li>
            </ul>
            <p><strong>Baggage</strong></p>
            <ul>
            <li>Compensation for delay in the arrival of luggage</li>
            <li>Compensation (expense for replacement) for loss of passport, driving license, national identity card abroad.</li>
            <li>Compensation for in-flight loss of checked in luggage</li>
            <li>Location and forwarding of personal effects.</li>
            </ul>
            <p><strong>Personal Accident in means of Public Transport</strong></p>
            <ul>
            <li>Accidental death occurring in means of public transport</li>
            <li>Permanent disability</li>
            <li>Permanent total disability</li>
            </ul>
            <p><strong>Personal Liability</strong></p>
            <ul>
            <li>Advance of Bail Bond</li>
            <li>Personal Civil Liability</li>
            <li>Legal Defense Abroad</li>
            </ul>
            <p><strong>Trip Cancellation or Curtailment Expenses</strong></p>
            <p><strong>Delayed Departure</strong></p>
            <p><em>*NB: The benefit cover is subject to provided by the referred plan.</em></p>
            <p><strong>POLICY ACCEPTANCE</strong></p>
            <p>The geographical scope of this policy is worldwide and is widely accepted by Embassies (both Schengen and non-Schengen).</p>
            <p><strong>PROCESSES AND CLAIM</strong></p>
            <p>The Travel Insurance Policy is processed under 10minutes upon receipt of required information and payment.</p>
            <p>Claims are paid after dutifully reporting incident on time and after necessary investigations are carried out</p>
            <p><strong>PREMIUM PAYMENT</strong></p>
            <p>The premium payable is dependent on the destination of travel, duration of cover and the age of the applicant. Premium is in Ghana Cedis.</p>`;
        return travel_content;
    }

    return Policy_det;

}(this, "Policy_det"));