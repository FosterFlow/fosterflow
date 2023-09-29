from rest_framework import generics
from .models import Agent
from .serializers import AgentSerializer


class AgentListView(generics.ListAPIView):
    queryset = Agent.objects.filter(is_active=True)
    serializer_class = AgentSerializer


# class AgentDetailView(generics.RetrieveUpdateAPIView):
#     queryset = Agent.objects.all()
#     serializer_class = AgentSerializer
#
#     # def perform_destroy(self, instance):
#     #     instance.is_active = False
#     #     instance.save()
