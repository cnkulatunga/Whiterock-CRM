from django.core.management.base import BaseCommand, CommandError

from apps.users.models import Permissions, User
from apps.core.management.commands.seed_demo_data import ROLE_PERMISSIONS


class Command(BaseCommand):
    help = 'Create a Super Admin user for initial CRM access.'

    def add_arguments(self, parser):
        parser.add_argument('--name', required=True)
        parser.add_argument('--email', required=True)
        parser.add_argument('--password', required=True)

    def handle(self, *args, **options):
        email = options['email'].strip().lower()

        if User.objects(email=email).first():
            raise CommandError(f'A user with email {email} already exists.')

        perms_data = ROLE_PERMISSIONS['Super Admin']
        user = User(
            name=options['name'].strip(),
            email=email,
            role='Super Admin',
            status='Active',
            permissions=Permissions(
                modules=perms_data['modules'],
                features=perms_data['features'],
                dashboardCards=perms_data['dashboardCards'],
            ),
        )
        user.set_password(options['password'])
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f'Super Admin created: {user.name} <{user.email}>'
        ))
