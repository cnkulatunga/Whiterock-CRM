from django.urls import path
from .dashboard_views import StatsView, ActivityView, RecentLeadsView, TeleStatsView

urlpatterns = [
    path('stats/',         StatsView.as_view(),       name='dashboard-stats'),
    path('tele-stats/',    TeleStatsView.as_view(),    name='tele-stats'),
    path('activity/',      ActivityView.as_view(),     name='dashboard-activity'),
    path('recent-leads/',  RecentLeadsView.as_view(),  name='recent-leads'),
]
