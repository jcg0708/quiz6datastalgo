from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.service_name', read_only=True)
    seller_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'service', 'service_name', 'seller_name',
            'paypal_transaction_id', 'price_paid', 'date_purchased',
        ]
        read_only_fields = ['id', 'date_purchased']

    def get_seller_name(self, obj):
        seller = obj.service.seller
        full_name = f"{seller.first_name} {seller.last_name}".strip()
        return full_name if full_name else seller.username
