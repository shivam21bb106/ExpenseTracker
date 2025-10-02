from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *

@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        full_name = data.get("FullName")
        email = data.get("Email")
        password = data.get("Password")
        if UserDetail.objects.filter(Email=email).exists():
            return HttpResponse({"message":"Email already exists"}, status=400)
        UserDetail.objects.create(FullName=full_name, Email=email, Password=password)
        return HttpResponse({"message":"User created successfully"}, status=201)