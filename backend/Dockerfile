FROM python:3.11-alpine
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

RUN apk add --no-cache postgresql-libs zlib libjpeg-turbo \
 && apk add --no-cache --virtual .build-deps build-base postgresql-dev python3-dev zlib-dev jpeg-dev

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt && apk del .build-deps

COPY . .

# entrypoint: миграции и collectstatic
RUN printf '#!/bin/sh\nset -e\npython manage.py migrate --noinput\npython manage.py collectstatic --noinput\nexec "$@"\n' > /entrypoint.sh \
 && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn","core.wsgi:application","--bind","0.0.0.0:8000"]
