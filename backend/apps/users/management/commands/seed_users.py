from django.core.management.base import BaseCommand
from apps.users.models import User


DEMO_USERS = [
    {
        "email": "admin@taskflow.com",
        "name": "Super Admin",
        "role": "Admin",
        "avatar": "SA",
        "avatar_bg": "#6366f1",
        "designation": "Super Admin",
    },
    {
        "email": "amal@taskflow.com",
        "name": "Amal Jayasekera",
        "role": "Team Leader",
        "avatar": "AJ",
        "avatar_bg": "#0891b2",
        "designation": "Lending Specialist",
    },
    {
        "email": "thanushika@taskflow.com",
        "name": "Thanushika R.",
        "role": "Tele Agent",
        "avatar": "TR",
        "avatar_bg": "#16a34a",
        "designation": "Lead Generator",
    },
    {
        "email": "nirosha@taskflow.com",
        "name": "Nirosha K.",
        "role": "Accounts Manager",
        "avatar": "NK",
        "avatar_bg": "#d97706",
        "designation": "Brokerage Accounts",
    },
]


class Command(BaseCommand):
    help = "Seed demo users (password: Pass@123)"

    def handle(self, *args, **kwargs):
        for data in DEMO_USERS:
            if User.objects.filter(email=data["email"]).exists():
                self.stdout.write(f"  skip  {data['email']} (already exists)")
                continue
            User.objects.create_user(password="Pass@123", **data)
            self.stdout.write(self.style.SUCCESS(f"  created  {data['email']}"))

        self.stdout.write(self.style.SUCCESS("\nDone. Password for all users: Pass@123"))
