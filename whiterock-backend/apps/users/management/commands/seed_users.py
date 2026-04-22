"""
Creates demo users for all roles.
Run: python manage.py seed_users
"""
from django.core.management.base import BaseCommand
import bcrypt
from apps.users.models import User

DEMO_USERS = [
    {
        'email':      'admin@alphafunding.com',
        'first_name': 'Alex',
        'last_name':  'Morgan',
        'role':       'super_admin',
        'phone':      '+61 400 000 001',
    },
    {
        'email':      'lead@alphafunding.com',
        'first_name': 'Taylor',
        'last_name':  'Brooks',
        'role':       'team_lead',
        'phone':      '+61 400 000 002',
    },
    {
        'email':      'accounts@alphafunding.com',
        'first_name': 'Jordan',
        'last_name':  'Chen',
        'role':       'accounts_manager',
        'phone':      '+61 400 000 003',
    },
    {
        'email':      'agent@alphafunding.com',
        'first_name': 'Sam',
        'last_name':  'Rivera',
        'role':       'tele_agent',
        'phone':      '+61 400 000 004',
    },
]

PASSWORD = 'password123'


class Command(BaseCommand):
    help = 'Seed demo users for all roles (password: password123)'

    def handle(self, *args, **options):
        pw_hash = bcrypt.hashpw(PASSWORD.encode(), bcrypt.gensalt()).decode()
        created = 0
        skipped = 0

        for data in DEMO_USERS:
            existing = User.objects(email=data['email']).first()
            if existing:
                self.stdout.write(self.style.WARNING(
                    f"  SKIP  {data['email']} (already exists)"
                ))
                skipped += 1
                continue

            User(
                email=data['email'],
                password=pw_hash,
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=data['role'],
                phone=data['phone'],
                is_active=True,
            ).save()

            self.stdout.write(self.style.SUCCESS(
                f"  CREATE {data['role']:20s} -> {data['email']}"
            ))
            created += 1

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done. {created} created, {skipped} skipped.'
        ))
        self.stdout.write('')
        self.stdout.write('  Password for all accounts: password123')
        self.stdout.write('')
        self.stdout.write('  Credentials:')
        for u in DEMO_USERS:
            self.stdout.write(f"    {u['role']:20s} -> {u['email']}")
