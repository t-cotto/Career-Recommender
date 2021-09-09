from rest_framework import serializers
from .models import Career, Question, PersonalityType, PersonalityComponent, CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

#Default serializer handling all the Question Model Fields. 
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

#Default Serializer for the personality components
class PersonalityComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalityComponent
        fields = ['letterCode', 'description', 'title']

#Default serializer for the Personality Types
class PersonalityTypeSerializer(serializers.ModelSerializer) :
    associatedComponents = PersonalityComponentSerializer(many=True)
    class Meta:
        model = PersonalityType
        fields = ['typeCode', 'personalityTitle', 'personalityDescription', 'associatedComponents']

#Default serializer that serializses all fields of the career except the id
class CareerModelSerializer(serializers.ModelSerializer) :
    associatedPersonalityType = serializers.ReadOnlyField(source='associatedPersonalityType.typeCode')
    class Meta :
        model = Career
        exclude = ['_careerId']
   
#Serializer for the default user without authentication token        
class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only = True)
    dob = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['_id', 'email', 'firstName', 'lastName', 'dob']

    def get__id(self, obj) :
        return obj._id
    
    def get_dob(self, obj) :
        return obj.dob


#Serializer for the user model with the included authentication token
class UserSerializerWithToken(UserSerializer) :
    token = serializers.SerializerMethodField(read_only = True)
    personalityType = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['_id', 'email', 'firstName', 'lastName', 'dob', 'personalityType', 'quizDate', 'token']

    def get_token(self, obj) :
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

    def get_personalityType(self, obj) :
        if (obj.personalityType) != None :
            return str(obj.personalityType)