from .filters import AgentFilter
from .models import Agent
from .serializers import AgentSerializer
from rest_framework import generics
from django_filters import rest_framework as django_filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework import status


class AgentListView(generics.ListAPIView):
    queryset = Agent.objects.filter(is_active=True)
    serializer_class = AgentSerializer
    filter_backends = (django_filters.DjangoFilterBackend,)
    filterset_class = AgentFilter


class AgentDetailView(generics.RetrieveUpdateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

    # def perform_destroy(self, instance):
    #     instance.is_active = False
    #     instance.save()

class AgentSelfView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def get(self, request, format=None):
        # Assuming that the Agent model is related to the Django User model
        # through a ForeignKey or OneToOneField called 'user'.
        agent = get_object_or_404(Agent, user=request.user)
        serializer = AgentSerializer(agent)

        return Response(serializer.data, status=status.HTTP_200_OK)