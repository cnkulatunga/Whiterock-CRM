from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.cache import cache
import os
from .models import Document
from .serializers import DocumentSerializer
from apps.users.permissions import IsStaff


class DocumentListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request):
        qs = Document.objects()
        search = request.query_params.get('search')
        lead_id = request.query_params.get('lead_id')
        if search:
            qs = qs.filter(name__icontains=search)
        if lead_id:
            qs = qs.filter(lead_id=lead_id)

        data = DocumentSerializer(qs[:100], many=True).data
        return Response(data)

    def post(self, request):
        file      = request.FILES.get('file')
        doc_type  = request.data.get('doc_type', 'other')
        lead_id   = request.data.get('lead_id', '')
        name      = request.data.get('name') or (file.name if file else 'untitled')

        payload   = request.auth.payload if request.auth else {}
        user_id   = payload.get('user_id', '')
        email     = payload.get('email', '')

        # In production use S3/Cloudinary; here save locally
        file_url  = ''
        file_size = 0
        mime_type = ''
        if file:
            upload_dir = os.path.join('media', 'documents')
            os.makedirs(upload_dir, exist_ok=True)
            path = os.path.join(upload_dir, file.name)
            with open(path, 'wb+') as dest:
                for chunk in file.chunks():
                    dest.write(chunk)
            file_url  = f'/media/documents/{file.name}'
            file_size = file.size
            mime_type = file.content_type

        doc = Document(
            name=name,
            doc_type=doc_type,
            lead_id=lead_id,
            file_url=file_url,
            file_size=file_size,
            mime_type=mime_type,
            uploaded_by_id=user_id,
            uploaded_by_name=email,
        ).save()

        return Response(DocumentSerializer(doc).data, status=201)


class DocumentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def delete(self, request, pk):
        doc = Document.objects(pk=pk).first()
        if not doc:
            return Response({'detail': 'Not found.'}, status=404)
        doc.delete()
        return Response(status=204)
