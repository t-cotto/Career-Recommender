# Generated by Django 3.2.4 on 2021-07-12 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recommender', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='date_joined',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
