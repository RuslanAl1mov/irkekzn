from django.db import models


class CallRequest(models.Model):
    """
    Модель для запросов на звонок ("Свяжитесь со мной").
    """
    class StatusType(models.TextChoices):
        POSITIVE = "positive", "Потенциальный клиент"
        NEGATIVE = "negative", "Не готов сотрудничать"
        RECALL = "recall", "Просили перезвонить"
        MISTAKE = "mistake", "Ошиблись/Недопонимание"
        SPAM = "spam", "Спам/Реклама"
        NEED_MORE_TIME = "need_more_time", "Нужно время на подумать"
        QUESTION = "question", "Просто задать вопрос"
        ANOTHER = "another", "Другое (указать в поле \"Комментарий\")"

    name = models.CharField(verbose_name="Имя потенциального клиента", max_length=100)
    phone = models.CharField(verbose_name="Номер телефона", max_length=20)
    date_created = models.DateTimeField(verbose_name="Дата отправки запроса", auto_now_add=True)
    is_checked = models.BooleanField(verbose_name="Заявка обработана", default=False)
    date_checked = models.DateTimeField(verbose_name="Дата обработки заявки", blank=True, null=True)
    status = models.CharField(verbose_name="Статус ответа клиента", max_length=100, choices=StatusType.choices, blank=True, null=True)
    comment = models.TextField(verbose_name="Комментарий", blank=True, null=True)
    date_to_recall = models.DateField(verbose_name="Дата перезвона клиенту", blank=True, null=True)
    
    class Meta:
        verbose_name = "Запрос на звонок"
        verbose_name_plural = "Запросы на звонок"
        
        permissions = [
            ("view_callrequest_list", "Can see call requests list"),
        ]

    def __str__(self):
        return f"(ID: {self.id}) {self.name} ({self.phone})"
