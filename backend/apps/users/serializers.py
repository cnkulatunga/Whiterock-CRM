from rest_framework import serializers

# Role default permissions — mirrors CRM/src/data/permissions.ts DEFAULT_ROLE_PERMISSIONS
ROLE_DEFAULT_PERMISSIONS = {
    'Super Admin': {
        'modules': {
            'tasks':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True,  'assign': True}, 'view': 'all'},
            'leads':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True,  'assign': True,  'upload_docs': True, 'view_docs': True, 'approve_docs': True, 'reject_docs': True, 'reupload_docs': True}, 'view': 'all'},
            'pipeline':   {'enabled': True,  'actions': {'full_access': True, 'view_stages': True, 'move_stages': True, 'edit_data': True}, 'view': 'all'},
            'lenders':    {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': True}, 'view': 'all'},
            'promotions': {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs':       {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': True}, 'view': 'all'},
            'users':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True}, 'view': 'all'},
            'reports':    {'enabled': True,  'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'all'},
        },
        'features': {'ai_assistant': True, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {'notes': True, 'op_calendar': True, 'license_insurance': True, 'online_agents': True, 'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': True, 'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True, 'my_team_leads': True, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': True},
    },
    'Admin': {
        'modules': {
            'tasks':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True,  'assign': True}, 'view': 'all'},
            'leads':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True,  'assign': True,  'upload_docs': True, 'view_docs': True, 'approve_docs': True, 'reject_docs': True, 'reupload_docs': True}, 'view': 'all'},
            'pipeline':   {'enabled': True,  'actions': {'full_access': True, 'view_stages': True, 'move_stages': True, 'edit_data': True}, 'view': 'all'},
            'lenders':    {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': True}, 'view': 'all'},
            'promotions': {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs':       {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': True}, 'view': 'all'},
            'users':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': True}, 'view': 'all'},
            'reports':    {'enabled': True,  'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'all'},
        },
        'features': {'ai_assistant': True, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {'notes': True, 'op_calendar': True, 'license_insurance': True, 'online_agents': True, 'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': True, 'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True, 'my_team_leads': True, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': True},
    },
    'Accounts Manager': {
        'modules': {
            'tasks':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': False, 'assign': False}, 'view': 'all'},
            'leads':      {'enabled': True,  'actions': {'add': False, 'edit': True,  'delete': True,  'assign': False, 'upload_docs': False, 'view_docs': True, 'approve_docs': True, 'reject_docs': False, 'reupload_docs': False}, 'view': 'all'},
            'pipeline':   {'enabled': True,  'actions': {'full_access': False, 'view_stages': True, 'move_stages': False, 'edit_data': False}, 'view': 'all'},
            'lenders':    {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': False}, 'view': 'all'},
            'promotions': {'enabled': True,  'actions': {'add': False, 'edit': False, 'delete': False, 'view': True, 'send_application': False}, 'view': 'all'},
            'docs':       {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': False}, 'view': 'all'},
            'users':      {'enabled': False, 'actions': {'add': False, 'edit': False, 'delete': False}, 'view': 'all'},
            'reports':    {'enabled': True,  'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'all'},
        },
        'features': {'ai_assistant': False, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {'notes': True, 'op_calendar': True, 'license_insurance': True, 'online_agents': False, 'lead_portfolio': False, 'upcoming_followups': False, 'pending_payouts': True, 'lender_promotions': True, 'my_leads_pipeline': False, 'document_request': True, 'my_team_leads': False, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': True},
    },
    'Team Leader': {
        'modules': {
            'tasks':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': False, 'assign': True}, 'view': 'team'},
            'leads':      {'enabled': True,  'actions': {'add': True,  'edit': False, 'delete': False, 'assign': True, 'upload_docs': True, 'view_docs': True, 'approve_docs': True, 'reject_docs': True, 'reupload_docs': True}, 'view': 'team'},
            'pipeline':   {'enabled': True,  'actions': {'full_access': False, 'view_stages': True, 'move_stages': True, 'edit_data': True}, 'view': 'team'},
            'lenders':    {'enabled': True,  'actions': {'add': False, 'view': True,  'edit': False, 'delete': False}, 'view': 'all'},
            'promotions': {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': False, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs':       {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': True,  'delete': False}, 'view': 'team'},
            'users':      {'enabled': False, 'actions': {'add': False, 'edit': False, 'delete': False}, 'view': 'all'},
            'reports':    {'enabled': True,  'actions': {'view': True, 'export': True, 'filter': True}, 'view': 'team'},
        },
        'features': {'ai_assistant': True, 'premium_calculator': True, 'whatsapp_direct': True, 'teams': True, 'mail': True},
        'dashboardCards': {'notes': True, 'op_calendar': True, 'license_insurance': False, 'online_agents': True, 'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': False, 'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True, 'my_team_leads': True, 'pipeline_snapshot': True, 'team_directory': True, 'finance_center': False},
    },
    'Tele Agent': {
        'modules': {
            'tasks':      {'enabled': True,  'actions': {'add': True,  'edit': True,  'delete': False, 'assign': False}, 'view': 'self'},
            'leads':      {'enabled': True,  'actions': {'add': True,  'edit': False, 'delete': False, 'assign': False, 'upload_docs': True, 'view_docs': True, 'approve_docs': False, 'reject_docs': False, 'reupload_docs': True}, 'view': 'self'},
            'pipeline':   {'enabled': False, 'actions': {'full_access': False, 'view_stages': True, 'move_stages': False, 'edit_data': False}, 'view': 'self'},
            'lenders':    {'enabled': False, 'actions': {'add': False, 'view': True,  'edit': False, 'delete': False}, 'view': 'self'},
            'promotions': {'enabled': True,  'actions': {'add': False, 'edit': False, 'delete': False, 'view': True, 'send_application': True}, 'view': 'all'},
            'docs':       {'enabled': True,  'actions': {'add': True,  'view': True,  'edit': False, 'delete': False}, 'view': 'self'},
            'users':      {'enabled': False, 'actions': {'add': False, 'edit': False, 'delete': False}, 'view': 'self'},
            'reports':    {'enabled': False, 'actions': {'view': True, 'export': False, 'filter': False}, 'view': 'self'},
        },
        'features': {'ai_assistant': False, 'premium_calculator': False, 'whatsapp_direct': True, 'teams': False, 'mail': True},
        'dashboardCards': {'notes': True, 'op_calendar': False, 'license_insurance': False, 'online_agents': False, 'lead_portfolio': True, 'upcoming_followups': True, 'pending_payouts': False, 'lender_promotions': True, 'my_leads_pipeline': True, 'document_request': True, 'my_team_leads': False, 'pipeline_snapshot': False, 'team_directory': False, 'finance_center': False},
    },
}


class UserSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['Super Admin', 'Admin', 'Team Leader', 'Accounts Manager', 'Tele Agent'])
    avatar = serializers.CharField(default='', allow_blank=True)
    status = serializers.ChoiceField(choices=['Active', 'Inactive'], default='Active')
    phone = serializers.CharField(default='', allow_blank=True)
    designation = serializers.CharField(default='', allow_blank=True)
    joined = serializers.DateTimeField(read_only=True)
    permissions = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()

    def get_id(self, obj):
        return str(obj.id)

    def get_permissions(self, obj):
        perms = obj.permissions
        defaults = ROLE_DEFAULT_PERMISSIONS.get(obj.role, {})

        def section(db_val, key):
            # Use DB value only when it is a non-empty dict; otherwise fall back to role defaults
            if db_val and isinstance(db_val, dict) and len(db_val) > 0:
                return db_val
            return defaults.get(key, {})

        modules_val = perms.modules if perms else None
        features_val = perms.features if perms else None
        cards_val = perms.dashboardCards if perms else None

        return {
            'modules': section(modules_val, 'modules'),
            'features': section(features_val, 'features'),
            'dashboardCards': section(cards_val, 'dashboardCards'),
        }

    def get_team(self, obj):
        if obj.team:
            return {'id': str(obj.team.id), 'name': obj.team.name}
        return None


class UserCreateSerializer(UserSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    permissions = serializers.DictField(child=serializers.JSONField(), default=dict)
    team_id = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        from apps.users.models import Permissions, User
        from apps.teams.models import Team
        import copy
        password = validated_data.pop('password')
        permissions = validated_data.pop('permissions', None)
        team_id = validated_data.pop('team_id', None)
        validated_data.pop('team', None)
        user = User(**validated_data)
        # Use provided permissions; fall back to role defaults so tabs are never blank
        if not permissions:
            permissions = copy.deepcopy(ROLE_DEFAULT_PERMISSIONS.get(validated_data.get('role', ''), {}))
        if permissions:
            if 'dashboard_cards' in permissions and 'dashboardCards' not in permissions:
                permissions['dashboardCards'] = permissions.pop('dashboard_cards')
            p = Permissions()
            if 'modules' in permissions:
                p.modules = permissions['modules']
            if 'features' in permissions:
                p.features = permissions['features']
            if 'dashboardCards' in permissions:
                p.dashboardCards = permissions['dashboardCards']
            user.permissions = p
        if team_id:
            try:
                user.team = Team.objects.get(id=team_id)
            except Exception:
                pass
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False)
    role = serializers.ChoiceField(
        choices=['Super Admin', 'Admin', 'Team Leader', 'Accounts Manager', 'Tele Agent'],
        required=False,
    )
    avatar = serializers.CharField(allow_blank=True, required=False)
    status = serializers.ChoiceField(choices=['Active', 'Inactive'], required=False)
    phone = serializers.CharField(allow_blank=True, required=False)
    designation = serializers.CharField(allow_blank=True, required=False)
    # JSONField child allows nested dicts/booleans — bare DictField only accepts str values
    permissions = serializers.DictField(child=serializers.JSONField(), required=False)
    team_id = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        from apps.users.models import Permissions
        from apps.teams.models import Team

        team_id = validated_data.pop('team_id', None)
        for field, value in validated_data.items():
            if field == 'permissions':
                if 'dashboard_cards' in value and 'dashboardCards' not in value:
                    value['dashboardCards'] = value.pop('dashboard_cards')
                # Assign each section directly to avoid MongoEngine **kwargs edge cases
                p = instance.permissions or Permissions()
                if 'modules' in value:
                    p.modules = value['modules']
                if 'features' in value:
                    p.features = value['features']
                if 'dashboardCards' in value:
                    p.dashboardCards = value['dashboardCards']
                instance.permissions = p
            else:
                setattr(instance, field, value)
        if team_id is not None:
            if team_id == '':
                instance.team = None
            else:
                try:
                    instance.team = Team.objects.get(id=team_id)
                except Exception:
                    pass
        instance.save()
        return instance
