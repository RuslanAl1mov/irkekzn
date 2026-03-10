from django.db import migrations

def add_permission(apps, schema_editor):
    Permission = apps.get_model('auth', 'Permission')
    ContentType = apps.get_model('contenttypes', 'ContentType')
    
    content_type, _ = ContentType.objects.get_or_create(
        app_label='auth', 
        model='group'
    )
    
    Permission.objects.get_or_create(
        codename='view_group_list',
        content_type=content_type,
        name='Can see users Groups list'
    )

def remove_permission(apps, schema_editor):
    Permission = apps.get_model('auth', 'Permission')
    Permission.objects.filter(codename='view_group_list').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RunPython(add_permission, remove_permission),
    ]