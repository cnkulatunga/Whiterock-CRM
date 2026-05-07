from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.notes.models import Note
from apps.notes.serializers import NoteSerializer, NoteCreateSerializer, NoteUpdateSerializer
from apps.core.permissions import IsAuthenticated


class NoteListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lead_id = request.query_params.get('lead_id')
        if lead_id:
            from apps.leads.models import Lead
            try:
                lead = Lead.objects.get(id=lead_id)
                notes = Note.objects.filter(lead=lead).order_by('-created_at')
            except Lead.DoesNotExist:
                notes = Note.objects.none()
        else:
            notes = Note.objects.filter(created_by=request.user)
        return Response(NoteSerializer(notes, many=True).data)

    def post(self, request):
        serializer = NoteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.create({**serializer.validated_data, 'created_by': request.user})
        return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)


class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            note = Note.objects.get(id=pk, created_by=request.user)
        except Note.DoesNotExist:
            return Response({'error': True, 'detail': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NoteUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        note = serializer.update(note, serializer.validated_data)
        return Response(NoteSerializer(note).data)

    def delete(self, request, pk):
        try:
            note = Note.objects.get(id=pk, created_by=request.user)
        except Note.DoesNotExist:
            return Response({'error': True, 'detail': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
