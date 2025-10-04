from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('add_expense/', add_expense, name='add_expense'),
    path('manage_expense/<int:user_id>/', manage_expense, name='manage_expense'),
    path('edit_expense/<int:expense_id>/', edit_expense),
    path('search_expense/<int:user_id>/', search_expense, name='search_expense'),
]