import traceback
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import transaction

class Command(BaseCommand):
    help = "Проверяет корректность JSON-файла для loaddata без сохранения в БД."

    def add_arguments(self, parser):
        parser.add_argument('json_filepath', type=str, help='Путь к JSON-файлу для проверки')

    def handle(self, *args, **options):
        json_filepath = options['json_filepath']
        try:
            with transaction.atomic():
                call_command("loaddata", json_filepath, verbosity=3)
                raise Exception("Псевдозагрузка завершена – прерывание транзакции")
        except Exception as e:
            # Вывод полного traceback
            traceback_str = traceback.format_exc()
            self.stdout.write(self.style.ERROR(traceback_str))
            if str(e) == "Псевдозагрузка завершена – прерывание транзакции":
                self.stdout.write(self.style.SUCCESS("Псевдозагрузка прошла успешно! Данные корректны."))
            else:
                self.stdout.write(self.style.ERROR(f"Ошибка при загрузке данных: {e}"))
