from django.contrib import admin
from .models import CustomUser, QuestionSet, Question, PersonalityType, PersonalityComponent, Sector, Career

# Register your models here.
admin.site.register(Question)
admin.site.register(QuestionSet)
admin.site.register(PersonalityComponent)
admin.site.register(PersonalityType)
admin.site.register(Sector)
admin.site.register(Career)
admin.site.register(CustomUser)