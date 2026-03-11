from django.db import migrations

def add_permission(apps, schema_editor):
    Permission = apps.get_model('auth', 'Permission')
    ContentType = apps.get_model('contenttypes', 'ContentType')
    
    # Получаем или создаем content type
    content_type, content_type_created = ContentType.objects.get_or_create(
        app_label='auth', 
        model='group'
    )
    
    # Проверяем, существует ли уже такой permission
    permission, permission_created = Permission.objects.get_or_create(
        codename='view_group_list',
        content_type=content_type,
        defaults={'name': 'Can see users Groups list'}
    )
    
    if permission_created:
        print("✓ Permission 'view_group_list' успешно создан")
        print(f"  - Название: {permission.name}")
        print(f"  - Content Type: {permission.content_type}")
    else:
        print("ℹ Permission 'view_group_list' уже существует")
        print(f"  - ID: {permission.id}")
        print(f"  - Название: {permission.name}")

def remove_permission(apps, schema_editor):
    Permission = apps.get_model('auth', 'Permission')
    ContentType = apps.get_model('contenttypes', 'ContentType')
    
    try:
        # Получаем content type
        content_type = ContentType.objects.get(
            app_label='auth',
            model='group'
        )
        
        # Ищем permission
        permission = Permission.objects.filter(
            codename='view_group_list',
            content_type=content_type
        ).first()
        
        if permission:
            permission.delete()
            print(f"✓ Permission 'view_group_list' успешно удален")
        else:
            print("ℹ Permission 'view_group_list' не найден, удаление не требуется")
            
    except ContentType.DoesNotExist:
        print("ℹ ContentType для auth.group не найден, удаление не требуется")

class Migration(migrations.Migration):
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RunPython(add_permission, remove_permission),
    ]