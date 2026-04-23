import os
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.cache import cache
from django.conf import settings
from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def list(self, request):
        cache_key = f"docs_list_{request.query_params.urlencode()}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        qs = Document.objects.all()
        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)

        search = request.query_params.get("search")
        if search:
            qs = qs.filter(
                __raw__={"$or": [
                    {"title": {"$regex": search, "$options": "i"}},
                    {"description": {"$regex": search, "$options": "i"}},
                ]}
            )

        data = DocumentSerializer(qs, many=True).data
        result = {"count": qs.count(), "results": data}
        cache.set(cache_key, result, 300)
        return Response(result)

    def create(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "No file provided."}, status=400)

        # Save file to media
        upload_dir = os.path.join(settings.MEDIA_ROOT, "documents")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.name)
        with open(file_path, "wb+") as dest:
            for chunk in file.chunks():
                dest.write(chunk)

        ext = file.name.rsplit(".", 1)[-1].lower() if "." in file.name else ""
        size_kb = file.size / 1024
        size_str = f"{size_kb:.0f} KB" if size_kb < 1024 else f"{size_kb/1024:.1f} MB"

        doc = Document(
            title=request.data.get("title", file.name),
            category=request.data.get("category", "Knowledge Base"),
            version=request.data.get("version", "v1.0"),
            description=request.data.get("description", ""),
            filename=file.name,
            file_type=ext,
            file_size=size_str,
            file_path=file_path,
            uploaded_by=request.user.name,
        )
        doc.save()
        cache.delete_pattern("docs_list_*")
        return Response(DocumentSerializer(doc).data, status=201)

    def partial_update(self, request, pk=None):
        try:
            doc = Document.objects.get(id=pk)
        except Document.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        for field in ["title", "category", "description", "version", "status"]:
            if field in request.data:
                setattr(doc, field, request.data[field])
        doc.save()
        cache.delete_pattern("docs_list_*")
        return Response(DocumentSerializer(doc).data)

    def destroy(self, request, pk=None):
        try:
            doc = Document.objects.get(id=pk)
        except Document.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        doc.delete()
        cache.delete_pattern("docs_list_*")
        return Response(status=204)
