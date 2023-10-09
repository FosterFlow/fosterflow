import django_filters
from .models import Agent


class AgentFilter(django_filters.FilterSet):
    is_user = django_filters.BooleanFilter(field_name='user', lookup_expr='isnull', exclude=True)
    is_nlp_model = django_filters.BooleanFilter(field_name='nlp_model', lookup_expr='isnull', exclude=True)

    class Meta:
        model = Agent
        fields = []
