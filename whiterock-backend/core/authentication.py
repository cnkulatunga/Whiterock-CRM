from rest_framework_simplejwt.authentication import JWTAuthentication


class _TokenUser:
    """Stand-in for Django User — satisfies DRF's IsAuthenticated check without ORM lookup."""
    is_active       = True
    is_staff        = False
    is_superuser    = False
    is_anonymous    = False
    is_authenticated = True

    def __init__(self, token):
        self.token = token
        self.pk    = token.get('user_id', '')
        self.id    = self.pk

    def __str__(self):
        return self.token.get('email', str(self.pk))


class MongoJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that skips the Django ORM user lookup.
    Users live in MongoDB; we only need the validated token payload.
    After authentication:
      request.user → _TokenUser (is_authenticated = True)
      request.auth → validated AccessToken (has .payload dict)
    """

    def get_user(self, validated_token):
        return _TokenUser(validated_token)
