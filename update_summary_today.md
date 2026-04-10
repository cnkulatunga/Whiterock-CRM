# Mobile Responsiveness Update Summary

## Layouts (All 4 roles)
- Added `sm:p-4 sm:px-3` to content area padding in SuperAdmin, TeleAgent, AccountsManager, TeamLeader layouts
- "Create New User" button collapses to "New" on mobile in all layouts

## User Management Page
- Filter bar restructured: single row on desktop (search → dividers → filters → create button), two rows on mobile
- List/Grid toggle removed entirely
- Desktop: original table view
- Mobile: card layout — avatar + name/email on top row, role badge + status + actions on bottom row
- Actions moved to top row on mobile so they never get clipped
- Role badges get `whitespace-nowrap` to prevent wrapping
- Status column hidden on mobile table
- "Add Leader" button in TeamLeaders KPI navigates to User Management with modal auto-open (`location.state.openCreate`)

## Lenders Page
- KPI grid: `md:grid-cols-1` → `md:grid-cols-2 sm:grid-cols-1`
- Desktop: original grid table
- Mobile: card layout — avatar initial + name/email + status badge + delete button on top, categories + manager name on bottom
- Entire card clickable with `cursor-pointer`, delete button uses `stopPropagation`
- Details + Edit merged into single unified modal with Details/Edit tab switcher
- Details modal: `grid-cols-2 sm:grid-cols-1` for email/manager cards, `break-all` on email
- Modal header/body/footer padding reduced on mobile

## UserProfileModal
- Bottom-sheet on mobile (`sm:items-end`, rounded top corners only, drag handle)
- Header restructured: role badge and "Active" status split into separate badges, email on own line
- Leads list: desktop table + mobile card layout (name/business/amount top, stage/agent/progress bottom)
- Team members list: card rows replacing table
- Inner scrollbars hidden (`scrollbarWidth: none`)
- Business name shown in lead rows
- Grid columns: `1fr 180px 110px 110px` with matching header labels
- Status badges use color-coded styles matching other pages
- Progress bar and percentage match status color
- Mobile card font sizes reduced

## LeadDetails Page
- Header: title/status wrap cleanly, action buttons collapse text on mobile
- Progress bar: `min-w` reduced from 520px to 480px, dots shrunk to `w-6 h-6`
- Card headers: icon `w-6 h-6`, title `text-[12px]`
- Row labels: `text-[9px]`, values `text-[12px]`

## CreateLead Page
- Form header: `flex-wrap gap-3`, System ID hidden on mobile
- Input padding: `p-3 px-4` → `sm:p-2 sm:px-3`
- Input font: `text-sm` → `sm:text-[12px]`
- Labels: `text-[13px]` → `sm:text-[11px]`
- Section margins: `mb-6` → `sm:mb-3`
- Grid gaps: `gap-6` → `sm:gap-3`
- Icon positions: `left-4` → `sm:left-3`, input padding adjusted to match
- Document upload row: input `flex-1 min-w-0`, Upload button compact with icon-only on mobile

## SuperAdmin Dashboard
- StatTile: horizontal layout on mobile (`sm:flex-row`), icon `sm:w-8 sm:h-8`, value `sm:text-base`, label `sm:text-[8px]`
- KPI grid gap: `sm:gap-1.5`
- Stat modals (Total Leads, Pending Lender Approvals, Pending Doc Approvals): bottom-sheet on mobile, card list replacing table
- "2 records" badge: `whitespace-nowrap`
- OnlineUsersPopup: `w-[560px]` → `max-w-[560px]`
- KnowledgeBase popup: bottom-sheet on mobile, stacked list/preview layout

## SuperAdmin Tasks
- Task card title: `break-words` → `truncate` (prevents vertical character stacking)
- Status dropdowns and action buttons moved to own row below title

## SuperAdmin Team Leaders
- KPI cards: replaced inline styles with Tailwind colored cards (indigo/emerald/violet/rose)
- Mobile grid: `grid-cols-1` → `grid-cols-2` at 640px
- Search input moved inline with filter tabs on desktop, hidden on mobile
- Agent member rows: status badge inline with name, email on separate line with truncation

## SuperAdmin Lenders (Audit Logs)
- Page title in nav bar: "Compliance & Audit" (route `reports` matched)
- Filter bar: single row on desktop (log type → search → date → role → icon), stacked on mobile
- Action text: `items-start` for wrapping, IP hidden on mobile, metadata badges lose indent on mobile

## Operational Flow
- Pipeline steps: `min-w` removed, `flex-1` on each step, dots `sm:w-6 sm:h-6`, labels `sm:text-[8px]`
- Auto-switches to grid view on mobile (≤1024px)
- Search bar: `flex-1 max-w-[260px] sm:max-w-full`
- Grid cards: personnel chain uses `flex flex-wrap` with `›` separators, `whitespace-nowrap` labels
- Amount + Lead Status added to grid cards

## AccountsManager Dashboard
- DashboardModal: bottom-sheet on mobile with drag handle
- Lead list (MY_LEADS/VERIFIED/PENDING): desktop table + mobile cards
- Follow-ups (FOLLOW_UPS): desktop table + mobile cards (lead/phone/schedule top, status/progress/note bottom)

## TeleDashboard & TeamLeaderDashboard
- KPI value sizes: `text-3xl` → `text-2xl sm:text-xl`
- Main content grid gap: `sm:gap-3`
- Outer container gap: `sm:gap-2`
- Follow-ups table: `overflow-hidden` → `overflow-x-auto`

## Tele Agent Tasks / SuperAdmin Tasks / TeamLeader Calendar
- Right panel: already had `lg:w-full lg:border-l-0 lg:border-t`
- Search inputs: `w-[220px] lg:w-full`

## DocumentVerification
- KPI grid: `md:grid-cols-1` → `md:grid-cols-2 sm:grid-cols-1`

## LeadMonitoring / LenderSelectionApproved / LenderSelector
- Search inputs: added `sm:w-full`
