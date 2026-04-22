from django.urls import path
from .report_views import ReportSummaryView, ReportLogsView

urlpatterns = [
    path('summary/', ReportSummaryView.as_view(), name='report-summary'),
    path('logs/',    ReportLogsView.as_view(),    name='report-logs'),
]
