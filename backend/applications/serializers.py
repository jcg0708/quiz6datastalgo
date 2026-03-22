from rest_framework import serializers
from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = SellerApplication
        fields = [
            'id', 'user_id', 'user_email', 'user_first_name', 'user_last_name',
            'status', 'decline_reason', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'decline_reason', 'created_at']
