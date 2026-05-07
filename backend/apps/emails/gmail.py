"""
Gmail API sending helper. Credentials are set up in Phase 7.
"""
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.conf import settings


def _build_message(to_email, subject, body_html, sender_name):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'{sender_name} <{settings.GMAIL_SENDER_EMAIL}>'
    msg['To'] = to_email
    msg.attach(MIMEText(body_html, 'html'))
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return {'raw': raw}


def send_via_gmail(to_email, subject, body_html, sender_name='Whiterock CRM'):
    """Send an email using the Gmail API with stored OAuth2 credentials."""
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build

    # Credentials will be loaded from DB in Phase 7
    creds = Credentials(
        token=None,
        client_id=settings.GMAIL_CLIENT_ID,
        client_secret=settings.GMAIL_CLIENT_SECRET,
        token_uri='https://oauth2.googleapis.com/token',
    )
    service = build('gmail', 'v1', credentials=creds)
    message = _build_message(to_email, subject, body_html, sender_name)
    service.users().messages().send(userId='me', body=message).execute()
