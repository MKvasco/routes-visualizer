# Generated by Django 4.0.4 on 2022-05-29 12:33

import api.models
from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.CharField(max_length=64, unique=True)),
                ('name', models.CharField(max_length=32)),
                ('password', models.CharField(max_length=255)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'user_model',
            },
            managers=[
                ('objects', api.models.UserManagerModel()),
            ],
        ),
        migrations.CreateModel(
            name='FileModel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('file', models.FileField(upload_to='data/imports')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'file_model',
            },
        ),
        migrations.CreateModel(
            name='RouteBaseModel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('route_name', models.CharField(blank=True, max_length=32)),
                ('points_line', django.contrib.gis.db.models.fields.LineStringField(srid=4326)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.filemodel')),
            ],
            options={
                'db_table': 'route_model',
            },
        ),
        migrations.CreateModel(
            name='RouteModel',
            fields=[
                ('routebasemodel_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.routebasemodel')),
                ('title', models.CharField(blank=True, max_length=32)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'db_table': 'user_route_model',
            },
            bases=('api.routebasemodel',),
        ),
    ]