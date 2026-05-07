from datetime import datetime

from django.core.management.base import BaseCommand

from apps.audit.models import AuditLog
from apps.lenders.models import Lender, LoanRange, Promotion, RateRange
from apps.leads.models import Lead
from apps.licenses.models import License
from apps.notes.models import Note
from apps.notifications.models import Notification
from apps.tasks.models import Task
from apps.users.models import Permissions, User


DEFAULT_PASSWORD = 'Pass@123'


ROLE_PERMISSIONS = {
    'Super Admin': {
        'modules': {
            'tasks': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True, 'assign': True}, 'view': 'all'},
            'leads': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True, 'assign': True, 'upload_docs': True, 'view_docs': True, 'approve_docs': True, 'reject_docs': True, 'reupload_docs': True}, 'view': 'all'},
            'pipeline': {'enabled': True, 'actions': {'full_access': True, 'view_stages': True, 'move_stages': True, 'edit_data': True}, 'view': 'all'},
            'lenders': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': True}, 'view': 'all'},
            'promotions': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': True}, 'view': 'all'},
            'users': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True}, 'view': 'all'},
            'reports': {'enabled': True, 'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'all'},
        },
        'features': {'ai_assistant': True, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {
            'notes': True, 'op_calendar': True, 'license_insurance': True, 'online_agents': True,
            'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': True,
            'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True,
            'my_team_leads': True, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': True,
        },
    },
    'Admin': {
        'modules': {
            'tasks': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True, 'assign': True}, 'view': 'all'},
            'leads': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True, 'assign': True, 'upload_docs': True, 'view_docs': True, 'approve_docs': True, 'reject_docs': True, 'reupload_docs': True}, 'view': 'all'},
            'pipeline': {'enabled': True, 'actions': {'full_access': True, 'view_stages': True, 'move_stages': True, 'edit_data': True}, 'view': 'all'},
            'lenders': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': True}, 'view': 'all'},
            'promotions': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': True}, 'view': 'all'},
            'users': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': True}, 'view': 'all'},
            'reports': {'enabled': True, 'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'all'},
        },
        'features': {'ai_assistant': True, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {
            'notes': True, 'op_calendar': True, 'license_insurance': True, 'online_agents': True,
            'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': True,
            'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True,
            'my_team_leads': True, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': True,
        },
    },
    'Accounts Manager': {
        'modules': {
            'tasks': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': False, 'assign': False}, 'view': 'all'},
            'leads': {'enabled': True, 'actions': {'add': False, 'edit': False, 'delete': False, 'assign': False, 'upload_docs': False, 'view_docs': True, 'approve_docs': True, 'reject_docs': False, 'reupload_docs': False}, 'view': 'all'},
            'pipeline': {'enabled': True, 'actions': {'full_access': False, 'view_stages': True, 'move_stages': False, 'edit_data': False}, 'view': 'all'},
            'lenders': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': False}, 'view': 'all'},
            'promotions': {'enabled': True, 'actions': {'add': False, 'edit': False, 'delete': False, 'view': True, 'send_application': False}, 'view': 'all'},
            'docs': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': False}, 'view': 'all'},
            'users': {'enabled': False, 'actions': {'add': False, 'edit': False, 'delete': False}, 'view': 'all'},
            'reports': {'enabled': True, 'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'all'},
        },
        'features': {'ai_assistant': False, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {
            'notes': True, 'op_calendar': True, 'license_insurance': True, 'online_agents': False,
            'lead_portfolio': False, 'upcoming_followups': False, 'pending_payouts': True,
            'lender_promotions': True, 'my_leads_pipeline': False, 'document_request': True,
            'my_team_leads': False, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': True,
        },
    },
    'Team Leader': {
        'modules': {
            'tasks': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': False, 'assign': True}, 'view': 'team'},
            'leads': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': False, 'assign': True, 'upload_docs': True, 'view_docs': True, 'approve_docs': True, 'reject_docs': True, 'reupload_docs': True}, 'view': 'team'},
            'pipeline': {'enabled': True, 'actions': {'full_access': False, 'view_stages': True, 'move_stages': True, 'edit_data': True}, 'view': 'team'},
            'lenders': {'enabled': True, 'actions': {'add': False, 'view': True, 'edit': False, 'delete': False}, 'view': 'all'},
            'promotions': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': False, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': True, 'delete': False}, 'view': 'team'},
            'users': {'enabled': False, 'actions': {'add': False, 'edit': False, 'delete': False}, 'view': 'all'},
            'reports': {'enabled': True, 'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'team'},
        },
        'features': {'ai_assistant': True, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {
            'notes': True, 'op_calendar': True, 'license_insurance': False, 'online_agents': True,
            'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': False,
            'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True,
            'my_team_leads': True, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': False,
        },
    },
    'Tele Agent': {
        'modules': {
            'tasks': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': False, 'assign': False}, 'view': 'self'},
            'leads': {'enabled': True, 'actions': {'add': True, 'edit': True, 'delete': False, 'assign': False, 'upload_docs': True, 'view_docs': True, 'approve_docs': False, 'reject_docs': False, 'reupload_docs': True}, 'view': 'self'},
            'pipeline': {'enabled': False, 'actions': {'full_access': False, 'view_stages': True, 'move_stages': False, 'edit_data': False}, 'view': 'self'},
            'lenders': {'enabled': False, 'actions': {'add': False, 'view': True, 'edit': False, 'delete': False}, 'view': 'self'},
            'promotions': {'enabled': True, 'actions': {'add': False, 'edit': False, 'delete': False, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs': {'enabled': True, 'actions': {'add': True, 'view': True, 'edit': False, 'delete': False}, 'view': 'self'},
            'users': {'enabled': False, 'actions': {'add': False, 'edit': False, 'delete': False}, 'view': 'self'},
            'reports': {'enabled': False, 'actions': {'view': True, 'export': False, 'filter': False}, 'view': 'self'},
        },
        'features': {'ai_assistant': False, 'premium_calculator': False, 'whatsapp_direct': True, 'teams': False, 'mail': True},
        'dashboardCards': {
            'notes': True, 'op_calendar': False, 'license_insurance': False, 'online_agents': False,
            'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': False,
            'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True,
            'my_team_leads': False, 'pipeline_snapshot': False, 'team_directory': False, 'finance_center': False,
        },
    },
}


USERS = [
    {'name': 'Lakshan R', 'email': 'ceo@whiterock.com', 'role': 'Super Admin', 'avatar': 'https://i.pravatar.cc/150?u=ceo', 'status': 'Active'},
    {'name': 'Sarah White', 'email': 'admin.ops@whiterock.com', 'role': 'Admin', 'avatar': 'https://i.pravatar.cc/150?u=sarah', 'status': 'Active'},
    {'name': 'Michael Chen', 'email': 'm.chen@whiterock.com', 'role': 'Team Leader', 'status': 'Active'},
    {'name': 'Cody Lane', 'email': 'cody@whiterock.com', 'role': 'Tele Agent', 'status': 'Active'},
    {'name': 'Leo Kumar', 'email': 'leo@whiterock.com', 'role': 'Accounts Manager', 'status': 'Active'},
    {'name': 'Emma Watson', 'email': 'emma@whiterock.com', 'role': 'Tele Agent', 'phone': '07123 987654', 'status': 'Active'},
]

LENDERS = [
    {'name': 'ANZ Bank', 'trading': 'ANZ', 'type': 'Bank', 'status': 'Active', 'email': 'broker@anz.com.au', 'manager': 'Sarah Collins', 'manager_email': 's.collins@anz.com.au', 'address': '242 Pitt Street, Sydney NSW 2000', 'reg_address': '242 Pitt Street, Sydney NSW 2000', 'trading_years': 185, 'rate_min': 5.74, 'rate_max': 9.49, 'loan_min': 20000, 'loan_max': 5000000, 'categories': ['Secured', 'Commercial', 'Refinance'], 'notes': "One of Australia's Big Four banks.", 'added': '2026-01-10'},
    {'name': 'Commonwealth Bank', 'trading': 'CommBank', 'type': 'Bank', 'status': 'Active', 'email': 'broker@cba.com.au', 'manager': 'James Wu', 'manager_email': 'j.wu@cba.com.au', 'address': '201 Sussex St, Sydney', 'reg_address': '201 Sussex St, Sydney', 'trading_years': 112, 'rate_min': 5.69, 'rate_max': 9.99, 'loan_min': 10000, 'loan_max': 10000000, 'categories': ['Secured', 'Commercial', 'Unsecured'], 'notes': "Australia's largest bank.", 'added': '2026-01-10'},
    {'name': 'NAB', 'trading': 'NAB', 'type': 'Bank', 'status': 'Active', 'email': 'broker@nab.com.au', 'manager': 'Emily Tran', 'manager_email': 'e.tran@nab.com.au', 'address': '800 Bourke St, Docklands', 'reg_address': '800 Bourke St, Docklands', 'trading_years': 163, 'rate_min': 5.79, 'rate_max': 9.89, 'loan_min': 20000, 'loan_max': 8000000, 'categories': ['Secured', 'Commercial'], 'notes': 'Strong SME focus.', 'added': '2026-02-01'},
    {'name': 'Starling', 'trading': 'Starling', 'type': 'Bank', 'status': 'Active', 'email': 'j.cole@starling.com', 'manager': 'James Cole', 'loan_min': 50000, 'loan_max': 3000000, 'categories': ['SME', 'Asset Finance'], 'notes': '2-Day Payout'},
    {'name': 'Barclays', 'trading': 'Barclays', 'type': 'Bank', 'status': 'Active', 'email': 'r.adams@barclays.co.uk', 'manager': 'Rachel Adams', 'loan_min': 50000, 'loan_max': 4000000, 'categories': ['Commercial', 'Hospitality'], 'notes': 'Standard Terms'},
    {'name': 'HSBC', 'trading': 'HSBC', 'type': 'Bank', 'status': 'Active', 'email': 't.harding@hsbc.co.uk', 'manager': 'Tom Harding', 'loan_min': 50000, 'loan_max': 5000000, 'categories': ['Commercial', 'Green Asset'], 'notes': '3-Day Settlement'},
]

PROMOTIONS = [
    {'lender': 'Barclays', 'title': 'Q2 Recovery Plus', 'description': 'Up to 90% LVR for hospitality sector recovery loans.', 'valid_until': '2026-06-30'},
    {'lender': 'Starling', 'title': 'SME Fixed Rate', 'description': 'Fixed rates from 6.49% for loans over GBP 50k.', 'rate': 6.49, 'valid_until': '2026-05-15'},
    {'lender': 'HSBC', 'title': 'Green Asset Fund', 'description': 'Lower commission but 0.5% rate discount for green vehicles.', 'rate': 0.5, 'valid_until': '2026-08-31'},
    {'lender': 'NAB', 'title': 'FastTrack Asset', 'description': 'Auto-approval for asset finance under GBP 25k.'},
]

LEADS = [
    {'name': 'Robert Miller', 'company': 'Miller Logistics', 'email': 'robert.m@miller-logistics.co.uk', 'phone': '07123 456789', 'amount': 'GBP 12,000', 'agent': 'Sarah White', 'status': 'collecting', 'priority': 'hot', 'days': 2, 'lender': None, 'notes': 'Waiting for bank statements', 'quality': 'hot', 'type': 'Asset Finance', 'level': 'Level 1'},
    {'name': 'Priya Singh', 'company': 'Singh Media', 'email': 'contact@singhmedia.com', 'phone': '07123 987654', 'amount': 'GBP 450,000', 'agent': 'Michael Chen', 'status': 'collecting', 'priority': 'warm', 'days': 1, 'lender': None, 'notes': 'Large expansion loan request.', 'quality': 'warm', 'type': 'Commercial', 'level': 'Level 2'},
    {'name': 'John Smith', 'company': 'ABC Corp', 'email': 'jsmith@abccorp.uk', 'phone': '07123 111222', 'amount': 'GBP 55,000', 'agent': 'Sarah White', 'status': 'lender', 'priority': 'hot', 'days': 4, 'lender': 'Barclays', 'notes': 'Email sent to partners, awaiting offers.', 'quality': 'hot', 'type': 'Asset Finance', 'level': 'Level 1'},
    {'name': 'Mike Johnson', 'company': 'Urban Scaffolding Ltd', 'email': 'mike@urban-scaff.co.uk', 'phone': '07123 444555', 'amount': 'GBP 85,000', 'agent': 'Michael Chen', 'status': 'verified', 'priority': 'cool', 'days': 5, 'lender': None, 'notes': 'Bank statements audited and approved.', 'quality': 'cool', 'type': 'Invoice Finance', 'level': 'Level 2'},
    {'name': 'David Brown', 'company': 'Miller Logistics', 'email': 'd.brown@miller-logistics.co.uk', 'phone': '07123 666777', 'amount': 'GBP 150,000', 'agent': 'Sarah White', 'status': 'approved', 'priority': 'hot', 'days': 12, 'lender': 'Starling', 'notes': 'Offer accepted, final checks in progress.', 'quality': 'hot', 'type': 'Commercial', 'level': 'Level 1'},
    {'name': 'Kevin Malone', 'company': 'Malone Paints', 'email': 'kevin@malonepaints.com', 'phone': '07123 888999', 'amount': 'GBP 25,000', 'agent': 'Michael Chen', 'status': 'rejected', 'priority': 'cool', 'days': 1, 'lender': None, 'notes': 'Low credit score and high existing debt.', 'quality': 'cool', 'type': 'Asset Finance', 'level': 'Level 2'},
]

TASKS = [
    {'title': 'Follow up with James Wilson', 'type': 'Priority Call', 'status': 'Pending', 'priority': 'High', 'date': '2026-04-23', 'time': '09:30', 'client': 'Alpha Tech Ltd', 'phone': '07123 456789', 'email': 'james@alphatech.com', 'assignee': 'Sarah White', 'description': 'Discuss valuation report gaps'},
    {'title': 'Check valuation report for LD-102', 'type': 'Case Research', 'status': 'In Progress', 'priority': 'Medium', 'date': '2026-04-23', 'time': '11:00', 'client': 'Bright Build Co', 'phone': '07123 987654', 'email': 'oliver@brightbuild.co', 'assignee': 'Michael Chen', 'description': 'Pending lender response'},
    {'title': 'Review compliance for new Tele Agent', 'type': 'Critical Document', 'status': 'Done', 'priority': 'Low', 'date': '2026-04-20', 'time': '14:30', 'client': 'System Registry', 'phone': '', 'email': 'compliance@whiterock.com', 'assignee': 'Leo Kumar', 'description': 'All docs verified'},
]

LICENSES = [
    {'type': 'License', 'name': 'FCA Broker License', 'desc': 'Financial Conduct Authority primary brokerage authorization.', 'date': '2026-12-15', 'remind_days': 30, 'status': 'ACTIVE'},
    {'type': 'Insurance', 'name': 'Professional Indemnity', 'desc': 'Annual coverage for brokerage activities.', 'date': '2026-10-01', 'remind_days': 30, 'status': 'ACTIVE'},
    {'type': 'License', 'name': 'Data Protection (ICO)', 'desc': 'Information Commissioner Office entry renewal.', 'date': '2026-05-20', 'remind_days': 14, 'status': 'ACTIVE'},
]

NOTES = [
    {'text': 'Remember to check quarterly commission structures.', 'date': '2026-04-20 | 14:30', 'pinned': True, 'highlighted': False},
    {'text': 'New server migration scheduled for next month.', 'date': '2026-04-22 | 09:15', 'pinned': False, 'highlighted': True},
]

NOTIFICATIONS = [
    {'title': 'New lead assigned', 'desc': 'Robert Miller from Miller Logistics', 'time': '5m ago', 'unread': True},
    {'title': 'Case Approved', 'desc': 'Case AF-772 has been approved by lender', 'time': '1h ago', 'unread': False},
    {'title': 'System Alert', 'desc': 'Server Maintenance at 12:00 tonight', 'time': '3h ago', 'unread': True},
]

ACTIVITIES = [
    {'user_name': 'James Smith', 'action': 'Uploaded Bank Statements', 'time': '10 mins ago', 'icon': 'fa-file-arrow-up', 'color': 'indigo'},
    {'user_name': 'NatWest', 'action': 'Approved Application #AF-022', 'time': '45 mins ago', 'icon': 'fa-circle-check', 'color': 'emerald'},
    {'user_name': 'System', 'action': 'Sent Automated Follow-up to Oliver', 'time': '2h ago', 'icon': 'fa-paper-plane', 'color': 'blue'},
    {'user_name': 'Priya', 'action': 'Rejected Document for #AF-045', 'time': '3h ago', 'icon': 'fa-circle-xmark', 'color': 'rose'},
    {'user_name': 'Lloyds Bank', 'action': 'Requested Further Info', 'time': '5h ago', 'icon': 'fa-circle-info', 'color': 'amber'},
]


def parse_date(value):
    if not value:
        return None
    return datetime.strptime(value, '%Y-%m-%d')


def role_permissions(role):
    data = ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS['Tele Agent'])
    return Permissions(
        modules=data['modules'],
        features=data['features'],
        dashboardCards=data['dashboardCards'],
    )


class Command(BaseCommand):
    help = 'Seed MongoDB with demo CRM data from the frontend mock datasets.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete seeded collections before inserting demo data.',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.reset_collections()

        users = self.seed_users()
        lenders = self.seed_lenders()
        self.seed_promotions(lenders)
        self.seed_leads(users, lenders)
        self.seed_tasks(users)
        self.seed_licenses()
        self.seed_notes(users)
        self.seed_notifications(users)
        self.seed_audit_logs(users)

        self.stdout.write(self.style.SUCCESS('Demo data seed complete. Login with any seeded user and password Pass@123.'))

    def reset_collections(self):
        for model in [AuditLog, Notification, Note, License, Task, Lead, Lender, User]:
            model.drop_collection()
        self.stdout.write(self.style.WARNING('Dropped demo collections.'))

    def seed_users(self):
        users = {}
        for item in USERS:
            email = item['email'].lower()
            user = User.objects(email=email).first() or User(email=email)
            user.name = item['name']
            user.role = item['role']
            user.avatar = item.get('avatar', '')
            user.status = item.get('status', 'Active')
            user.phone = item.get('phone', '')
            user.designation = item.get('designation', '')
            user.permissions = role_permissions(user.role)
            if not user.password_hash:
                user.set_password(DEFAULT_PASSWORD)
            user.save()
            users[user.name] = user
            users[user.email] = user
        self.stdout.write(f'Seeded users: {len(USERS)}')
        return users

    def seed_lenders(self):
        lenders = {}
        for item in LENDERS:
            lender = Lender.objects(name=item['name']).first() or Lender(name=item['name'])
            lender.trading = item.get('trading', '')
            lender.type = item.get('type', 'Bank')
            lender.status = item.get('status', 'Active')
            lender.email = item.get('email', '')
            lender.manager = item.get('manager', '')
            lender.manager_email = item.get('manager_email', '')
            lender.address = item.get('address', '')
            lender.reg_address = item.get('reg_address', '')
            lender.trading_years = item.get('trading_years', 0)
            lender.rates = RateRange(min=item.get('rate_min', 0.0), max=item.get('rate_max', 0.0))
            lender.loan_ranges = LoanRange(min=item.get('loan_min', 0.0), max=item.get('loan_max', 0.0))
            lender.categories = item.get('categories', [])
            lender.notes = item.get('notes', '')
            if item.get('added'):
                lender.added = parse_date(item['added'])
            lender.save()
            lenders[lender.name] = lender
            lenders[lender.trading] = lender
        self.stdout.write(f'Seeded lenders: {len(LENDERS)}')
        return lenders

    def seed_promotions(self, lenders):
        count = 0
        for item in PROMOTIONS:
            lender = lenders.get(item['lender'])
            if not lender:
                continue
            existing = next((promo for promo in lender.promotions if promo.title == item['title']), None)
            promotion = existing or Promotion(title=item['title'])
            promotion.description = item.get('description', '')
            promotion.rate = item.get('rate', 0.0)
            promotion.valid_until = parse_date(item.get('valid_until'))
            if existing is None:
                lender.promotions.append(promotion)
            lender.save()
            count += 1
        self.stdout.write(f'Seeded promotions: {count}')

    def seed_leads(self, users, lenders):
        for item in LEADS:
            lead = Lead.objects(email=item['email']).first() or Lead(email=item['email'])
            for field in ['name', 'company', 'phone', 'amount', 'status', 'priority', 'quality', 'type', 'level', 'notes', 'days']:
                setattr(lead, field, item.get(field, ''))
            lead.agent = users.get(item.get('agent'))
            lead.lender = lenders.get(item.get('lender')) if item.get('lender') else None
            lead.save()
        self.stdout.write(f'Seeded leads: {len(LEADS)}')

    def seed_tasks(self, users):
        for item in TASKS:
            task = Task.objects(title=item['title']).first() or Task(title=item['title'])
            for field in ['type', 'status', 'priority', 'time', 'client', 'phone', 'email', 'description']:
                setattr(task, field, item.get(field, ''))
            task.date = parse_date(item.get('date'))
            task.assignee = users.get(item.get('assignee'))
            task.save()
        self.stdout.write(f'Seeded tasks: {len(TASKS)}')

    def seed_licenses(self):
        for item in LICENSES:
            license_obj = License.objects(name=item['name']).first() or License(name=item['name'], type=item['type'])
            license_obj.type = item['type']
            license_obj.desc = item.get('desc', '')
            license_obj.date = parse_date(item.get('date'))
            license_obj.remind_days = item.get('remind_days', 30)
            license_obj.status = item.get('status', 'ACTIVE')
            license_obj.save()
        self.stdout.write(f'Seeded licenses: {len(LICENSES)}')

    def seed_notes(self, users):
        created_by = users.get('Sarah White') or next(iter(users.values()), None)
        for item in NOTES:
            note = Note.objects(text=item['text']).first() or Note(text=item['text'])
            note.date = item.get('date', '')
            note.pinned = item.get('pinned', False)
            note.highlighted = item.get('highlighted', False)
            note.created_by = created_by
            note.save()
        self.stdout.write(f'Seeded notes: {len(NOTES)}')

    def seed_notifications(self, users):
        recipients = [user for key, user in users.items() if '@' in key]
        for user in recipients:
            for item in NOTIFICATIONS:
                notification = Notification.objects(user=user, title=item['title']).first() or Notification(user=user, title=item['title'])
                notification.desc = item.get('desc', '')
                notification.time = item.get('time', '')
                notification.unread = item.get('unread', True)
                notification.save()
        self.stdout.write(f'Seeded notifications: {len(recipients) * len(NOTIFICATIONS)}')

    def seed_audit_logs(self, users):
        actor = users.get('Sarah White') or next(iter(users.values()), None)
        for item in ACTIVITIES:
            log = AuditLog.objects(action=item['action'], user_name=item['user_name']).first() or AuditLog(action=item['action'])
            log.user = actor
            log.user_name = item['user_name']
            log.user_email = getattr(actor, 'email', '')
            log.entity_type = 'DemoActivity'
            log.entity_id = item['action']
            log.metadata = {
                'relative_time': item.get('time', ''),
                'icon': item.get('icon', ''),
                'color': item.get('color', ''),
            }
            log.save()
        self.stdout.write(f'Seeded audit logs: {len(ACTIVITIES)}')
