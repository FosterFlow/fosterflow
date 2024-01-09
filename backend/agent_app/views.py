from .filters import AgentFilter
from .models import Agent
from .serializers import AgentSerializer
from rest_framework import generics
from django_filters import rest_framework as django_filters
from rest_framework.permissions import IsAuthenticated

class AgentListView(generics.ListAPIView):
    queryset = Agent.objects.filter(is_active=True).exclude(user__isnull=False)
    serializer_class = AgentSerializer
    filter_backends = (django_filters.DjangoFilterBackend,)
    filterset_class = AgentFilter
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']  


class AgentDetailsView(generics.RetrieveUpdateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get'] 

class AgentSelfView(generics.ListAPIView):
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get'] 

    def get_queryset(self):
        """
        This view should return a list of all the agents
        for the currently authenticated user.
        """
        user = self.request.user
        return Agent.objects.filter(user=user, is_active=True)