from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import SellerApplication
from .serializers import SellerApplicationSerializer

User = get_user_model()


class SubmitApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if SellerApplication.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "You have already submitted an application."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        app = SellerApplication.objects.create(user=request.user)
        serializer = SellerApplicationSerializer(app)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListApplicationView(generics.ListAPIView):
    serializer_class = SellerApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'Admin':
            return SellerApplication.objects.none()
        return SellerApplication.objects.all().order_by('-created_at')


class ApproveApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'Admin':
            return Response(status=status.HTTP_403_FORBIDDEN)
        try:
            app = SellerApplication.objects.get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        merchant_id = request.data.get('merchant_id', '')
        app.status = 'approved'
        app.save()
        app.user.role = 'Seller'
        app.user.merchant_id = merchant_id
        app.user.save()
        return Response({"detail": "Application approved.", "merchant_id": merchant_id})


class DeclineApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'Admin':
            return Response(status=status.HTTP_403_FORBIDDEN)
        try:
            app = SellerApplication.objects.get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('decline_reason', '')
        app.status = 'declined'
        app.decline_reason = reason
        app.save()
        return Response({"detail": "Application declined."})

