from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
from django.http import JsonResponse
from django.core.exceptions import FieldError
import traceback
from datetime import datetime
from django.db.models import Sum
from django.utils.dateparse import parse_date


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
        

@csrf_exempt
def manage_expense(request, user_id):
    if request.method == "GET":
        try:
            expenses = Expense.objects.filter(UserId=user_id)  
            expense_list = list(expenses.values())
            return JsonResponse(expense_list, safe=False, status=200)
        except FieldError as e:
            return JsonResponse({"error": f"Invalid field: {str(e)}"}, status=400)
        except Exception as e:
            # log real error in console for debugging
            print("Error in manage_expense:", e)
            return JsonResponse({"error": "Server error. Check logs."}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)



@csrf_exempt
def edit_expense(request, expense_id):
    try:
        
        if request.method == "DELETE":
            try:
                e = Expense.objects.get(id=expense_id)
                e.delete()
                return JsonResponse({"message": "Expense deleted"}, status=200)
            except Expense.DoesNotExist:
                return JsonResponse({"error": "Expense not found"}, status=404)

        if request.method != "PUT":
            return JsonResponse({"error": "Method not allowed"}, status=405)

        data = json.loads(request.body.decode("utf-8") or "{}")

        user_id = data.get("UserId")
        if not user_id:
            return JsonResponse({"error": "UserId is required"}, status=400)

      
        try:
            expense = Expense.objects.get(id=expense_id)
        except Expense.DoesNotExist:
            return JsonResponse({"error": "Expense not found"}, status=404)

        
        try:
            if getattr(expense.UserId, "id", None) != int(user_id):
                return JsonResponse({"error": "Unauthorized"}, status=403)
        except (ValueError, TypeError):
            return JsonResponse({"error": "UserId must be an integer"}, status=400)

        
        if "ExpenseDate" in data:
            if data["ExpenseDate"] in [None, ""]:
                expense.ExpenseDate = None
            else:
                try:
                    expense.ExpenseDate = datetime.strptime(data["ExpenseDate"], "%Y-%m-%d").date()
                except ValueError:
                    return JsonResponse({"error": "ExpenseDate must be YYYY-MM-DD"}, status=400)

        if "ExpenseItem" in data:
            expense.ExpenseItem = data["ExpenseItem"]

        if "ExpenseCost" in data:
            val = data["ExpenseCost"]
            if isinstance(val, (dict, list)):
                return JsonResponse({"error": "ExpenseCost must be a string/number"}, status=400)
            expense.ExpenseCost = str(val) if val is not None else ""

        
        try:
            expense.save()
        except Exception as save_err:
            tb = traceback.format_exc()
          
            print("Error saving expense:", save_err)
            print(tb)
            return JsonResponse({"error": "Save failed", "details": str(save_err), "trace": tb}, status=500)

        return JsonResponse({"message": "Expense updated successfully"}, status=200)

    except Exception as e:
        tb = traceback.format_exc()
        print("Unhandled error in edit_expense:", e)
        print(tb)
        return JsonResponse({"error": "Internal server error", "details": str(e), "trace": tb}, status=500)
    



@csrf_exempt
def search_expense(request, user_id):
    
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)

    try:
       
        from_date_str = request.GET.get("from_date")
        to_date_str = request.GET.get("to_date")

       
        from_date = parse_date(from_date_str) if from_date_str else None
        to_date = parse_date(to_date_str) if to_date_str else None

       
        qs = Expense.objects.filter(UserId=user_id)  
        if from_date and to_date:
            qs = qs.filter(ExpenseDate__range=[from_date, to_date])
        elif from_date:
            qs = qs.filter(ExpenseDate__gte=from_date)
        elif to_date:
            qs = qs.filter(ExpenseDate__lte=to_date)

        expense_list = list(qs.values())
        agg = qs.aggregate(total=Sum("ExpenseCost"))
        total = agg.get("total") or 0

        return JsonResponse({"expenses": expense_list, "total": total}, status=200, safe=False)

    except Exception as e:
       
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": "Server error", "details": str(e)}, status=500)