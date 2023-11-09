from .filters import AgentFilter
from .models import Agent
from .serializers import AgentSerializer
from rest_framework import generics
from django_filters import rest_framework as django_filters


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
