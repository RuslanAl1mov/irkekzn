from django.db import migrations


def add_permission(apps, schema_editor):
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")

    # Получаем или создаем content type
    content_type, created = ContentType.objects.get_or_create(
        app_label="auth", model="group"
    )

    # Проверяем, существует ли уже такой permission
    permission, created = Permission.objects.get_or_create(
        codename="view_permission_list",
        content_type=content_type,
        defaults={"name": "Can see Permissions list"},
    )

    if created:
        print(f"✓ Permission 'view_permission_list' created successfully")
    else:
        print(f"! Permission 'view_permission_list' already exists")


def remove_permission(apps, schema_editor):
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")

    try:
        content_type = ContentType.objects.get(app_label="auth", model="group")

        deleted_count, _ = Permission.objects.filter(
            codename="view_permission_list", content_type=content_type
        ).delete()

        if deleted_count:
            print(f"✓ Permission 'view_permission_list' removed successfully")
        else:
            print(f"! Permission 'view_permission_list' not found")

    except ContentType.DoesNotExist:
        print(f"! ContentType for auth.group not found")


class Migration(migrations.Migration):
    dependencies = [
        ("administration", "0001_add_custom_group_permissions copy"),
    ]

    operations = [
        migrations.RunPython(add_permission, remove_permission),
    ]
