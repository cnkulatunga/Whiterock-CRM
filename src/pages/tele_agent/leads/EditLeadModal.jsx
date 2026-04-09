import React, { useState, useEffect } from 'react';
import { IconCheck, IconClose } from '../../../components/DocumentManagement/Icons';

const BANKS = [
    'Santander', 'Metro Bank', 'HSBC', 'Lloyds Bank', 'NatWest',
    'Royal Bank of Scotland', 'Barclays', 'The Co-operative Bank',
    'The Cumberland', 'Tide', 'TSB', 'Ulster Bank', 'Unity Trust Bank',
    'Zempler', 'Starling'
];

const INDUSTRIES = [
    'Software', 'Hardware', 'IT Services', 'Telecommunications', 'E-commerce',
    'Digital Media', 'Robotics', 'Pharmaceuticals', 'Medical Devices', 'Hospitals',
    'Health Insurance', 'Biotechnology', 'Wellness', 'Banking', 'Insurance',
    'Investment Banking', 'Venture Capital', 'Accounting', 'Aerospace', 'Automotive',
    'Chemicals', 'Food & Beverage', 'Electronics', 'Textiles', 'Heavy Machinery',
    'Oil & Gas', 'Renewables', 'Utilities', 'Mining', 'Apparel', 'Food',
    'Luxury Goods', 'E-commerce Retail', 'Film', 'Music', 'Publishing', 'Gaming',
    'Advertising', 'Broadcast', 'Legal', 'Consulting', 'Marketing', 'Human Resources',
    'Real Estate', 'Airlines', 'Shipping', 'Rail', 'Trucking', 'Warehousing',
    'Hotels', 'Restaurants', 'Travel Agencies', 'Casinos', 'Recreation'
];

const LEAD_SOURCES = [
    'Advertisement', 'Cold Call', 'Employee Referral', 'External Referral',
    'Online Store', 'Partner', 'Public Relations', 'Sales Email Alias',
    'Seminar Partner', 'Internal Seminar', 'Trade Show', 'Web', 'Chat'
];

const IconPhone = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" width={size} height={size}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12 19.79 19.79 0 0 1 1.14 3.4 2 2 0 0 1 3.11 1.22h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconMail = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" width={size} height={size}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);

const EditLeadModal = ({ isOpen, onClose, lead, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        fullName: '',
        companyName: '',
        companyHouseNumber: '',
        businessAnnualTurnover: '',
        jobTitle: '',
        emailAddress: '',
        phoneNumber: '',
        preferredContactMethod: [],
        homeOwner: '',
        dob: '',
        nic: '',
        residentialAddress: '',
        timeAtCurrentAddress: '',
        previousAddress: '',
        loanAmount: '',
        loanPurpose: '',
        leadStatus: 'Warm',
        existingLoan: '',
        existingLoanLenderName: '',
        existingLoanAmount: '',
        existingLoanInterestRate: '',
        existingLoanMonthlyRepayment: '',
        existingLoanTerm: '',
        overdraftFacility: '',
        companyBank: '',
        leadSource: '',
        fundingTimeline: '',
        industry: '',
        previousAlphaFundingLoan: '',
        additionalComments: '',
        assignedAgent: ''
    });

    useEffect(() => {
        if (lead && isOpen) {
            setFormData({
                title: lead.title || '',
                fullName: lead.name || '',
                companyName: lead.businessName || '',
                companyHouseNumber: lead.companyHouseNumber || '',
                businessAnnualTurnover: lead.businessAnnualTurnover || '',
                jobTitle: lead.jobTitle || '',
                emailAddress: lead.email || '',
                phoneNumber: lead.phone || '',
                preferredContactMethod: lead.preferredContactMethod || ['Email', 'Phone'],
                homeOwner: lead.homeOwner || 'No',
                dob: lead.dob || '',
                nic: lead.nic || '',
                residentialAddress: lead.residentialAddress || '',
                timeAtCurrentAddress: lead.timeAtCurrentAddress || '',
                previousAddress: lead.previousAddress || '',
                loanAmount: lead.amount ? lead.amount.replace(/[^0-9.]/g, '') : (lead.loanAmount ? lead.loanAmount.replace(/[^0-9.]/g, '') : ''),
                loanPurpose: lead.loanPurpose || '',
                leadStatus: lead.leadStatus || 'Warm',
                existingLoan: lead.existingLoan || 'No',
                existingLoanLenderName: lead.existingLoanLenderName || '',
                existingLoanAmount: lead.existingLoanAmount || '',
                existingLoanInterestRate: lead.existingLoanInterestRate || '',
                existingLoanMonthlyRepayment: lead.existingLoanMonthlyRepayment || '',
                existingLoanTerm: lead.existingLoanTerm || '',
                overdraftFacility: lead.overdraftFacility || 'No',
                companyBank: lead.companyBank || '',
                leadSource: lead.leadSource || '',
                fundingTimeline: lead.fundingTimeline || '',
                industry: lead.industry || '',
                previousAlphaFundingLoan: lead.previousAlphaFundingLoan || 'No',
                additionalComments: lead.notes || '',
                assignedAgent: lead.staff || lead.agentName || 'Unassigned'
            });
        }
    }, [lead, isOpen]);

    if (!isOpen || !lead) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name, option) => {
        setFormData(prev => {
            const current = (prev[name] || []);
            return {
                ...prev,
                [name]: current.includes(option)
                    ? current.filter(v => v !== option)
                    : [...current, option]
            };
        });
    };

    const handleSubmit = () => {
        const updatedLead = {
            ...lead,
            title: formData.title,
            name: formData.fullName,
            businessName: formData.companyName,
            companyHouseNumber: formData.companyHouseNumber,
            nic: formData.nic || formData.companyHouseNumber,
            businessAnnualTurnover: formData.businessAnnualTurnover,
            jobTitle: formData.jobTitle,
            email: formData.emailAddress,
            phone: formData.phoneNumber,
            preferredContactMethod: formData.preferredContactMethod,
            homeOwner: formData.homeOwner,
            dob: formData.dob,
            residentialAddress: formData.residentialAddress,
            timeAtCurrentAddress: formData.timeAtCurrentAddress,
            previousAddress: formData.previousAddress,
            amount: formData.loanAmount ? `£${Number(formData.loanAmount).toLocaleString()}` : lead.amount,
            loanAmount: formData.loanAmount ? `£${Number(formData.loanAmount).toLocaleString()}` : lead.loanAmount,
            loanPurpose: formData.loanPurpose,
            leadStatus: formData.leadStatus,
            existingLoan: formData.existingLoan,
            existingLoanLenderName: formData.existingLoanLenderName,
            existingLoanAmount: formData.existingLoanAmount,
            existingLoanInterestRate: formData.existingLoanInterestRate,
            existingLoanMonthlyRepayment: formData.existingLoanMonthlyRepayment,
            existingLoanTerm: formData.existingLoanTerm,
            overdraftFacility: formData.overdraftFacility,
            companyBank: formData.companyBank,
            leadSource: formData.leadSource,
            source: formData.leadSource,
            fundingTimeline: formData.fundingTimeline,
            industry: formData.industry,
            previousAlphaFundingLoan: formData.previousAlphaFundingLoan,
            notes: formData.additionalComments,
            staff: formData.assignedAgent,
            agentName: formData.assignedAgent
        };
        onSave(updatedLead);
    };

    const inputCls = "bg-[#fdfdfd] border border-[#e2e8f0] p-3 sm:p-2.5 px-4 rounded-xl text-sm sm:text-xs outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full";
    const selectCls = `${inputCls} appearance-none cursor-pointer`;
    const labelCls = "text-[13px] sm:text-[11px] font-bold text-[#4a5568] leading-tight";
    const fieldCls = "flex flex-col gap-1.5";
    const sectionCls = "mb-8 sm:mb-6";
    const sectionHeadCls = "text-[11px] sm:text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-5 sm:mb-4 border-b border-[#f1f5f9] pb-2";
    const radioGroupCls = "flex flex-wrap gap-3 mt-1";
    const radioCls = (selected) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all select-none ${selected
            ? 'border-[#2447d7] bg-[#ebf0ff] text-[#2447d7]'
            : 'border-[#e2e8f0] bg-[#fdfdfd] text-[#4a5568] hover:border-[#2447d7]/40 hover:bg-[#f0f4ff]'
        }`;

    const RadioGroup = ({ name, options, value }) => (
        <div className={radioGroupCls}>
            {options.map(opt => (
                <label key={opt} className={radioCls(value === opt)}>
                    <input type="radio" name={name} value={opt} checked={value === opt} onChange={handleInputChange} className="sr-only" />
                    {value === opt && <IconCheck size={13} />}
                    {opt}
                </label>
            ))}
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 font-['Sora',sans-serif]"
            onMouseDown={onClose}
        >
            <div
                className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col"
                style={{ maxHeight: 'calc(100vh - 2rem)' }}
                onMouseDown={e => e.stopPropagation()}
            >
                {/* Header — fixed inside modal */}
                <div className="flex-shrink-0 bg-white border-b border-[#f1f5f9] p-5 sm:p-4 px-8 sm:px-4 rounded-t-2xl flex sm:flex-col justify-between items-start sm:items-stretch gap-4">
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-lg font-black text-[#1a202c] tracking-tight">Edit Lead Details</h2>
                        <p className="text-[11px] font-medium text-[#718096] mt-0.5 truncate uppercase tracking-wider">Update for {lead.name}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 shrink-0">
                        {/* Lead Status Dropdown */}
                        <div className="flex items-center gap-2 bg-[#f8fafc] dark:bg-white/5 px-2 py-1 rounded-lg border border-[#edf2f7] dark:border-white/10">
                            <span className="text-[9px] font-bold text-[#718096] uppercase tracking-wider whitespace-nowrap">Status:</span>
                            <div className="relative">
                                <select
                                    name="leadStatus"
                                    value={formData.leadStatus}
                                    onChange={handleInputChange}
                                    className="appearance-none pl-6 pr-7 py-1.5 rounded-lg text-[12px] font-bold outline-none cursor-pointer border transition-all"
                                    style={{
                                        borderColor: formData.leadStatus === 'Hot' ? '#fecaca' : formData.leadStatus === 'Warm' ? '#fed7aa' : '#bfdbfe',
                                        backgroundColor: formData.leadStatus === 'Hot' ? '#fef2f2' : formData.leadStatus === 'Warm' ? '#fff7ed' : '#eff6ff',
                                        color: formData.leadStatus === 'Hot' ? '#dc2626' : formData.leadStatus === 'Warm' ? '#ea580c' : '#2563eb',
                                    }}
                                >
                                    <option value="Hot">Hot</option>
                                    <option value="Warm">Warm</option>
                                    <option value="Cool">Cool</option>
                                </select>
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                                    style={{ backgroundColor: formData.leadStatus === 'Hot' ? '#ef4444' : formData.leadStatus === 'Warm' ? '#f97316' : '#3b82f6' }} />
                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="9" height="9"
                                    style={{ color: formData.leadStatus === 'Hot' ? '#dc2626' : formData.leadStatus === 'Warm' ? '#ea580c' : '#2563eb' }}>
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 sm:p-1.5 bg-[#f8fafc] text-[#64748b] rounded-xl hover:bg-[#e2e8f0] hover:text-[#0f172a] transition-all border border-[#edf2f7]">
                            <IconClose size={20} />
                        </button>
                    </div>
                </div>

                {/* Form Body — scrollable */}
                <div className="overflow-y-auto flex-1 p-8 sm:p-4">

                    {/* ── CONTACT INFORMATION ── */}
                    <div className={sectionCls}>
                        <h4 className={sectionHeadCls}>CONTACT INFORMATION</h4>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-6 sm:gap-4">

                            <div className={fieldCls}>
                                <label className={labelCls}>Title</label>
                                <input type="text" name="title" className={inputCls} placeholder="e.g. Mr, Mrs, Dr..." value={formData.title} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Full Name <span className="text-[#e11d48]">*</span></label>
                                <input type="text" name="fullName" className={inputCls} placeholder="e.g. Jonathan Doe" value={formData.fullName} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Company / Organization Name</label>
                                <input type="text" name="companyName" className={inputCls} placeholder="Enter company name..." value={formData.companyName} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Company House Number</label>
                                <input type="text" name="companyHouseNumber" className={inputCls} placeholder="e.g. 12345678" value={formData.companyHouseNumber} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Business Annual Turnover</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-sm font-bold text-[#a0aec0]">£</span>
                                    <input type="text" name="businessAnnualTurnover" className={`${inputCls} pl-8`} placeholder="0.00" value={formData.businessAnnualTurnover} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Job Title / Position</label>
                                <input type="text" name="jobTitle" className={inputCls} placeholder="e.g. Managing Director" value={formData.jobTitle} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Email Address <span className="text-[#e11d48]">*</span></label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-[#cbd5e0]"><IconMail /></div>
                                    <input type="email" name="emailAddress" className={`${inputCls} pl-11`} placeholder="client@example.com" value={formData.emailAddress} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Phone Number <span className="text-[#e11d48]">*</span></label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-[#cbd5e0]"><IconPhone /></div>
                                    <input type="text" name="phoneNumber" className={`${inputCls} pl-11`} placeholder="+44 7700 900000" value={formData.phoneNumber} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className={`${fieldCls} col-span-2 md:col-span-1`}>
                                <label className={labelCls}>Preferred Contact Method</label>
                                <div className={radioGroupCls}>
                                    {['Email', 'Phone', 'WhatsApp', 'Other'].map(opt => {
                                        const selected = formData.preferredContactMethod.includes(opt);
                                        return (
                                            <label key={opt} className={radioCls(selected)} onClick={() => handleCheckboxChange('preferredContactMethod', opt)}>
                                                {selected && <IconCheck size={13} />}
                                                {opt}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={`${fieldCls} col-span-2 md:col-span-1`}>
                                <label className={labelCls}>Home Owner</label>
                                <RadioGroup name="homeOwner" options={['Yes', 'No']} value={formData.homeOwner} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Date of Birth</label>
                                <input type="date" name="dob" className={inputCls} value={formData.dob} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>NIC / ID Number</label>
                                <input type="text" name="nic" className={inputCls} placeholder="Enter NIC or ID..." value={formData.nic} onChange={handleInputChange} />
                            </div>

                            <div className={`${fieldCls} col-span-2`}>
                                <label className={labelCls}>Residential Address</label>
                                <input type="text" name="residentialAddress" className={inputCls} placeholder="e.g. 99 Halbutt Street, Dagenham..." value={formData.residentialAddress} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Time at Current Address</label>
                                <input type="text" name="timeAtCurrentAddress" className={inputCls} placeholder="e.g. 3 years" value={formData.timeAtCurrentAddress} onChange={handleInputChange} />
                            </div>

                            <div className={`${fieldCls} col-span-2`}>
                                <label className={labelCls}>Previous Address</label>
                                <input type="text" name="previousAddress" className={inputCls} placeholder="Enter previous address if less than 3 years..." value={formData.previousAddress} onChange={handleInputChange} />
                            </div>

                        </div>
                    </div>

                    {/* ── LOAN DETAILS ── */}
                    <div className={sectionCls}>
                        <h4 className={sectionHeadCls}>LOAN DETAILS</h4>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-6 sm:gap-4">

                            <div className={fieldCls}>
                                <label className={labelCls}>Amount Needed <span className="text-[#e11d48]">*</span></label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-sm font-bold text-[#a0aec0]">£</span>
                                    <input type="text" name="loanAmount" className={`${inputCls} pl-8`} placeholder="0.00" value={formData.loanAmount} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Purpose of Taking Loan</label>
                                <input type="text" name="loanPurpose" className={inputCls} placeholder="e.g. Business expansion..." value={formData.loanPurpose} onChange={handleInputChange} />
                            </div>

                            <div className={`${fieldCls} col-span-2 md:col-span-1`}>
                                <label className={labelCls}>Existing Loan</label>
                                <RadioGroup name="existingLoan" options={['Yes', 'No']} value={formData.existingLoan} />
                            </div>

                            {formData.existingLoan === 'Yes' && (
                                <div className="col-span-2 bg-[#f8fafc] p-5 rounded-2xl border border-[#edf2f7] grid grid-cols-2 gap-4">
                                    <div className="col-span-2 text-[11px] font-bold text-[#2447d7] uppercase tracking-wider mb-2">Existing Loan Details</div>
                                    <div className={fieldCls}>
                                        <label className={labelCls}>Lender Name</label>
                                        <input type="text" name="existingLoanLenderName" className={inputCls} placeholder="e.g. Barclays" value={formData.existingLoanLenderName} onChange={handleInputChange} />
                                    </div>
                                    <div className={fieldCls}>
                                        <label className={labelCls}>Amount Taken</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-sm font-bold text-[#a0aec0]">£</span>
                                            <input type="text" name="existingLoanAmount" className={`${inputCls} pl-8`} placeholder="0.00" value={formData.existingLoanAmount} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className={fieldCls}>
                                        <label className={labelCls}>Interest Rate (%)</label>
                                        <input type="text" name="existingLoanInterestRate" className={inputCls} placeholder="e.g. 5.5" value={formData.existingLoanInterestRate} onChange={handleInputChange} />
                                    </div>
                                    <div className={fieldCls}>
                                        <label className={labelCls}>Monthly Repayment</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-sm font-bold text-[#a0aec0]">£</span>
                                            <input type="text" name="existingLoanMonthlyRepayment" className={`${inputCls} pl-8`} placeholder="0.00" value={formData.existingLoanMonthlyRepayment} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className={`${fieldCls} col-span-2`}>
                                        <label className={labelCls}>Loan Term</label>
                                        <input type="text" name="existingLoanTerm" className={inputCls} placeholder="e.g. 24 months" value={formData.existingLoanTerm} onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}

                            <div className={`${fieldCls} col-span-2 md:col-span-1`}>
                                <label className={labelCls}>Overdraft Facility</label>
                                <RadioGroup name="overdraftFacility" options={['Yes', 'No']} value={formData.overdraftFacility} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Which Bank is your Company with</label>
                                <select name="companyBank" className={selectCls} value={formData.companyBank} onChange={handleInputChange}>
                                    <option value="">Select a bank...</option>
                                    {BANKS.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Lead Source</label>
                                <select name="leadSource" className={selectCls} value={formData.leadSource} onChange={handleInputChange}>
                                    <option value="">Select lead source...</option>
                                    {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>How soon do you need this funding?</label>
                                <input type="text" name="fundingTimeline" className={inputCls} placeholder="e.g. Within 2 weeks, ASAP..." value={formData.fundingTimeline} onChange={handleInputChange} />
                            </div>

                            <div className={fieldCls}>
                                <label className={labelCls}>Industry</label>
                                <select name="industry" className={selectCls} value={formData.industry} onChange={handleInputChange}>
                                    <option value="">Select an industry...</option>
                                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                                </select>
                            </div>

                            <div className={`${fieldCls} col-span-2 md:col-span-1`}>
                                <label className={labelCls}>Have you taken any loans before from Alpha Funding?</label>
                                <RadioGroup name="previousAlphaFundingLoan" options={['Yes', 'No']} value={formData.previousAlphaFundingLoan} />
                            </div>

                        </div>
                    </div>

                    {/* ── ADDITIONAL COMMENTS ── */}
                    <div className={sectionCls}>
                        <h4 className={sectionHeadCls}>ADDITIONAL COMMENTS OR REQUIREMENTS</h4>
                        <div className={fieldCls}>
                            <label className={labelCls}>Comments & Notes</label>
                            <textarea
                                name="additionalComments"
                                className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full min-h-[100px] resize-y"
                                placeholder="Enter any additional requirements, special notes, or relevant context..."
                                value={formData.additionalComments}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 sm:p-4 px-8 sm:px-4 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-2xl flex justify-end gap-3">
                    <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-[#64748b] bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-all text-sm" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="flex-1 px-8 py-2.5 rounded-xl font-bold text-white bg-[#2447d7] shadow-[0_4px_12px_rgba(36,71,215,0.2)] hover:bg-[#1732a3] hover:-translate-y-0.5 transition-all text-sm" onClick={handleSubmit}>
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditLeadModal;
