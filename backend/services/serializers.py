from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    name_of_the_expert = serializers.SerializerMethodField()
    sample_image_url = serializers.SerializerMethodField()
    seller_merchant_id = serializers.CharField(source='seller.merchant_id', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'seller', 'seller_merchant_id', 'service_name', 'description',
            'price', 'duration_of_service', 'sample_image', 'sample_image_url',
            'rating', 'name_of_the_expert', 'created_at',
        ]
        read_only_fields = ['id', 'seller', 'rating', 'created_at']

    def get_name_of_the_expert(self, obj):
        full_name = f"{obj.seller.first_name} {obj.seller.last_name}".strip()
        return full_name if full_name else obj.seller.username

    def get_sample_image_url(self, obj):
        request = self.context.get('request')
        if obj.sample_image and request:
            return request.build_absolute_uri(obj.sample_image.url)
        return None

