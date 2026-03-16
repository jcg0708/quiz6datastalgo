from django.contrib import admin
from .models import *

admin.site.register(CustomUser)
admin.site.register(SellerApplication)
admin.site.register(Service)
admin.site.register(Order)