import os
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from apps.docs.models import Doc, DocCategory
from apps.docs.serializers import DocSerializer, DocUpdateSerializer, DocCategorySerializer
from apps.core.permissions import IsAuthenticated, IsSuperAdmin, ROLE_HIERARCHY

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'xlsx', 'xls', 'png', 'jpg', 'jpeg', 'pptx'}
MAX_UPLOAD_MB = 20

PRESET_CATS = ['Knowledge Base', 'Guides', 'FAQs', 'Products', 'Policies', 'Scripts']


def _is_super_admin(user):
    return ROLE_HIERARCHY.get(getattr(user, 'role', ''), 0) >= 4


class DocListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        docs = Doc.objects.all()
        return Response(DocSerializer(docs, many=True, context={'request': request}).data)

    def post(self, request):
        if not _is_super_admin(request.user):
            return Response({'error': 'Only Super Admin/Admin can upload documents.'}, status=403)

        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided.'}, status=400)

        ext = file.name.rsplit('.', 1)[-1].lower() if '.' in file.name else ''
        if ext not in ALLOWED_EXTENSIONS:
            return Response({'error': f'File type .{ext} is not allowed.'}, status=400)

        if file.size > MAX_UPLOAD_MB * 1024 * 1024:
            return Response({'error': f'File exceeds {MAX_UPLOAD_MB} MB limit.'}, status=400)

        title = request.data.get('title', '').strip()
        if not title:
            return Response({'error': 'Title is required.'}, status=400)

        category = request.data.get('category', 'Knowledge Base').strip()
        description = request.data.get('description', '').strip()
        version = request.data.get('version', 'v1.0').strip()

        safe_name = f'{uuid.uuid4().hex}.{ext}'
        rel_path = f'docs/{safe_name}'
        abs_path = os.path.join(settings.MEDIA_ROOT, 'docs', safe_name)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)

        with open(abs_path, 'wb') as fh:
            for chunk in file.chunks():
                fh.write(chunk)

        size_str = (
            f'{file.size / 1_048_576:.1f} MB' if file.size >= 1_048_576
            else f'{file.size // 1024} KB'
        )

        doc = Doc(
            title=title,
            description=description,
            category=category,
            filename=file.name,
            file_type=ext,
            file_size=size_str,
            file_path=rel_path,
            version=version,
            status='New',
            uploaded_by=request.user,
        )
        doc.save()
        return Response(DocSerializer(doc, context={'request': request}).data, status=201)


class DocDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not _is_super_admin(request.user):
            return Response({'error': 'Forbidden'}, status=403)
        try:
            doc = Doc.objects.get(id=pk)
        except Doc.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        serializer = DocUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        doc = serializer.update(doc, serializer.validated_data)
        return Response(DocSerializer(doc, context={'request': request}).data)

    def delete(self, request, pk):
        if not _is_super_admin(request.user):
            return Response({'error': 'Forbidden'}, status=403)
        try:
            doc = Doc.objects.get(id=pk)
        except Doc.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        abs_path = os.path.join(settings.MEDIA_ROOT, doc.file_path)
        if os.path.exists(abs_path):
            os.remove(abs_path)

        doc.delete()
        return Response(status=204)


class DocCategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        custom = DocCategory.objects.all()
        custom_names = [c.name for c in custom]
        all_cats = PRESET_CATS + [n for n in custom_names if n not in PRESET_CATS]
        return Response({
            'preset': PRESET_CATS,
            'custom': DocCategorySerializer(custom, many=True).data,
            'all': all_cats,
        })

    def post(self, request):
        if not _is_super_admin(request.user):
            return Response({'error': 'Only Super Admin/Admin can create categories.'}, status=403)
        name = (request.data.get('name') or '').strip()
        if not name:
            return Response({'error': 'Name is required.'}, status=400)
        norm = name[0].upper() + name[1:]
        if norm in PRESET_CATS:
            return Response({'error': 'This is already a preset category.'}, status=400)
        existing = DocCategory.objects(name=norm).first()
        if existing:
            return Response(DocCategorySerializer(existing).data, status=200)
        cat = DocCategory(name=norm, created_by=request.user)
        cat.save()
        return Response(DocCategorySerializer(cat).data, status=201)


class DocCategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if not _is_super_admin(request.user):
            return Response({'error': 'Forbidden'}, status=403)
        try:
            cat = DocCategory.objects.get(id=pk)
        except DocCategory.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        cat.delete()
        return Response(status=204)
