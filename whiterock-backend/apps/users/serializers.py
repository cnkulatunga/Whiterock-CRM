from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
import bcrypt
from .models import User


# ── Standalone login serializer — no Django ORM / simplejwt parent class ──
class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email    = attrs['email'].strip().lower()
        password = attrs['password']

        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')

        try:
            user = User.objects(email=email, is_active=True).first()
        except Exception:
            raise serializers.ValidationError('Database unavailable. Please try again.')

        if not user:
            raise serializers.ValidationError('No account found with this email.')

        try:
            pw_ok = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
        except Exception:
            raise serializers.ValidationError('Invalid credentials.')

        if not pw_ok:
            raise serializers.ValidationError('Incorrect password.')

        # Build JWT — embed role + user_id into both tokens
        refresh = RefreshToken()
        refresh['user_id']    = str(user.pk)
        refresh['role']       = user.role
        refresh['email']      = user.email
        refresh['first_name'] = user.first_name
        refresh['last_name']  = user.last_name

        from datetime import datetime
        user.last_login = datetime.utcnow()
        user.save()

        return {
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id':         str(user.pk),
                'email':      user.email,
                'first_name': user.first_name,
                'last_name':  user.last_name,
                'role':       user.role,
                'full_name':  user.full_name,
            },
        }


class UserSerializer(serializers.Serializer):
    id          = serializers.CharField(source='pk', read_only=True)
    email       = serializers.EmailField()
    first_name  = serializers.CharField(max_length=100, default='')
    last_name   = serializers.CharField(max_length=100, default='')
    phone       = serializers.CharField(max_length=20, default='', required=False)
    role        = serializers.ChoiceField(choices=[
                    'super_admin', 'tele_agent', 'accounts_manager', 'team_lead', 'client'
                  ])
    is_active   = serializers.BooleanField(default=True)
    date_joined = serializers.DateTimeField(read_only=True)
    full_name   = serializers.CharField(read_only=True)


class CreateUserSerializer(serializers.Serializer):
    email      = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name  = serializers.CharField(max_length=100, default='', required=False)
    phone      = serializers.CharField(max_length=20, default='', required=False)
    role       = serializers.ChoiceField(choices=[
                   'super_admin', 'tele_agent', 'accounts_manager', 'team_lead', 'client'
                 ])
    password   = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, value):
        if User.objects(email=value.lower()).first():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def create(self, validated_data):
        pw_hash = bcrypt.hashpw(
            validated_data['password'].encode('utf-8'), bcrypt.gensalt()
        ).decode('utf-8')
        return User(
            email=validated_data['email'],
            password=pw_hash,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=validated_data['role'],
        ).save()


# Keep name alias so the JWT settings entry doesn't break anything
CustomTokenObtainPairSerializer = LoginSerializer
