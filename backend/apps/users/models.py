from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("role", "Admin")
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("Admin", "Admin"),
        ("Team Leader", "Team Leader"),
        ("Tele Agent", "Tele Agent"),
        ("Accounts Manager", "Accounts Manager"),
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default="Tele Agent")
    status = models.CharField(
        max_length=10,
        choices=[("Active", "Active"), ("Inactive", "Inactive")],
        default="Active",
    )
    designation = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.CharField(max_length=5, blank=True)
    avatar_bg = models.CharField(max_length=20, default="#6366f1")
    joined_date = models.DateField(null=True, blank=True)
    modules = models.JSONField(default=dict)
    features = models.JSONField(default=dict)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.name} ({self.role})"

    def save(self, *args, **kwargs):
        if not self.avatar:
            parts = self.name.split()
            self.avatar = "".join(p[0] for p in parts[:2]).upper()
        super().save(*args, **kwargs)
