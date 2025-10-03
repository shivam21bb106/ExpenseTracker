from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
from django.http import JsonResponse

@csrf_exempt
def signup(request):
    print("Signup API called")
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        full_name = data.get("FullName")
        email = data.get("Email")
        password = data.get("Password")
        if UserDetail.objects.filter(Email=email).exists():
            return HttpResponse({"message":"Email already exists"}, status=400)
        UserDetail.objects.create(FullName=full_name, Email=email, Password=password)
        return HttpResponse({"message":"User created successfully"}, status=201)
    

@csrf_exempt
def login(request):
    if request.method =="POST":
        data = json.loads(request.body)
        email = data.get("Email")
        password = data.get("Password")
        try:
            user = UserDetail.objects.get(Email=email, Password=password)
            print("Successful login for user:", user.FullName)
            return JsonResponse({"message":"Login successful", "userId":user.id, "userName":user.FullName}, status=200)
        except UserDetail.DoesNotExist:
            print("Login failed for email:", email)
            return HttpResponse({"message":"Invalid credentials"}, status=400)
        
@csrf_exempt
def add_expense(request):
    if request.method =="POST":
        data = json.loads(request.body)
        user_id = data.get("UserId")
        expense_date = data.get("ExpenseDate")
        expense_item = data.get("ExpenseItem")
        expense_cost = data.get("ExpenseCost")
        
        user = UserDetail.objects.get(id=user_id)
        try:
            Expense.objects.create(UserId=user, ExpenseDate=expense_date, ExpenseItem=expense_item, ExpenseCost=expense_cost)
            return JsonResponse({"message":"Expense Added Successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"message":"Something went wrong",'error':str(e)}, status=400)
        