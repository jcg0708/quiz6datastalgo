from django.urls import path
from .views import CreateOrderView, UserOrderHistoryView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('history/', UserOrderHistoryView.as_view(), name='order-history'),
]
