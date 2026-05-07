from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def crm_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            'error': True,
            'status_code': response.status_code,
            'detail': response.data.get('detail', response.data),
        }
        return response

    return Response(
        {'error': True, 'status_code': 500, 'detail': 'Internal server error.'},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
