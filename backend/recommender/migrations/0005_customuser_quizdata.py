# Generated by Django 3.2.4 on 2021-07-19 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recommender', '0004_auto_20210712_2146'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='quizData',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]