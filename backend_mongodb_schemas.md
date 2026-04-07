# MongoDB Mongoose Schemas for Whiterock CRM

Based on the frontend dummy data (`src/data/dummyData.js`), here are the recommended MongoDB (Mongoose) schemas for the backend developer to build out the database architecture. 

These represent the exact data fields ("fills") the React frontend expects and currently uses.

---

### 1. User Schema (`User`)
Represents the system users (Super Admin, Team Leaders, Tele Agents, Accounts Managers).

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  initials: { type: String },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Team Leader', 'Tele Agent', 'Accounts Manager'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
  
  // Optional: Used mostly in UI out of the DB, but could be stored
  color: { type: String },
  textColor: { type: String },
  roleColor: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
```

---

### 2. Lead Schema (`Lead`)
The central entity for the CRM, containing all gathered lead intelligence and dynamic stage information.

```javascript
const documentSchema = new mongoose.Schema({
  type: { type: String }, // e.g., 'Bank Statement', 'ID Document', 'Payslip'
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Missing'],
    default: 'Pending'
  },
  note: { type: String }, // Review notes (e.g. 'Unclear scan')
  date: { type: Date, default: Date.now },
  fileUrl: { type: String } // To store the AWS S3 or GridFS link
});

const leadSchema = new mongoose.Schema({
  leadId: { type: String, unique: true }, // e.g., 'AF-001'
  
  // Hierarchy & Ownership (Can use Ref to User ObjectId for strict relationships)
  assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agentName: { type: String }, 
  tl: { type: String }, // Team Leader Name
  manager: { type: String }, // Accounts Manager Name

  // Workflow tracking
  submissionDate: { type: Date, default: Date.now },
  status: { type: String }, 
  stage: { 
    type: String, 
    enum: [
      'Document Collection', 
      'Document Verification Done', 
      'Document Rejected', 
      'Lender Selection', 
      'Completed', 
      'Rejected'
    ],
    default: 'Document Collection'
  },
  progress: { type: Number, default: 0 }, // 0 to 100
  lastContact: { type: String }, // e.g., "Just now" or Date object

  // Personal Information
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  dob: { type: Date },
  nic: { type: String }, // Identification Number

  // Business Information
  businessName: { type: String },
  industry: { type: String },
  jobTitle: { type: String },
  companyBank: { type: String },
  businessAnnualTurnover: { type: String }, // Stored as String or Number depends on currency handling

  // Address
  residentialAddress: { type: String },
  timeAtCurrentAddress: { type: String },
  previousAddress: { type: String },

  // Loan Request Details
  loanAmount: { type: String },
  loanPurpose: { type: String },
  fundingTimeline: { type: String },
  homeOwner: { type: String }, // 'Yes' or 'No'
  overdraftFacility: { type: String }, // 'Yes' or 'No'
  source: { type: String }, // e.g., 'Website Form', 'Direct Call'

  // Existing Liabilities / Existing Loan Details
  existingLoan: { type: String }, // 'Yes' or 'No'
  existingLoanLenderName: { type: String },
  existingLoanAmount: { type: String },
  existingLoanInterestRate: { type: String }, // e.g., '4.5'
  existingLoanMonthlyRepayment: { type: String },
  existingLoanTerm: { type: String }, // e.g., '36 months'

  notes: { type: String }, // Additional comments/notes from the agent

  // Document array sub-schema
  documents: [documentSchema]
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
```

---

### 3. Lender Schema (`Lender`)
Managed by Accounts Managers / Super Admin and mapped to Leads.

```javascript
const lenderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Major Bank', 'Non-Bank', 'Credit Union', 'Building Society', 'Specialist']
  },
  interestRate: { type: String }, // e.g., '5.89%'
  maxLoan: { type: String }, // e.g., '$2,000,000'
  minDeposit: { type: String }, // e.g., '10%'
  contact: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  
  // Qualification Flags
  commercial: { type: Boolean, default: false },
  secured: { type: Boolean, default: false },
  unsecured: { type: Boolean, default: false },
  refinance: { type: Boolean, default: false }
}, { timestamps: true });

const Lender = mongoose.model('Lender', lenderSchema);
```

---

### 4. Task / Follow-up Schema (`Task`)
Used across all Dashboards to track meetings, calls, reviews, etc.

```javascript
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lead: { type: String }, // e.g. "Robert Miller" - optionally make this a Ref to Lead ObjectId
  email: { type: String },
  phone: { type: String },
  
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  
  date: { type: String }, // 'YYYY-MM-DD' OR Date
  time: { type: String }, // 'HH:MM'
  
  type: { 
    type: String, 
    enum: ['Call', 'Email', 'Meeting', 'Document', 'Review', 'Administrative'],
    default: 'Call'
  },
  
  reminder: { 
    type: String, 
    enum: ['none', '15m', '1h', '1d'], 
    default: 'none' 
  },
  
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // User ID
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
```

---

### Key Takeaways for the Backend Developer:
1. **The Lead Object is Large:** Almost all logic relies heavily on the `Lead` object containing personal info, business financials, current debt load, and the documents array. No matter what dashboard the user is on, it essentially pulls heavily from the `Lead` structure.
2. **References:** The frontend expects IDs to relate to one another (e.g., `assignedStaffId` in `Lead` should relate precisely to the `id` of a `User`).
3. **Strings over Primitives:** Because this involves a lot of financial forms, you'll notice many items like `"loanAmount": "£250,000"` or `"homeOwner": "Yes"` are currently handled as Strings on the frontend. The backend may choose to sanitize these into Numbers or Booleans, but the frontend currently accepts formatted string versions directly.
