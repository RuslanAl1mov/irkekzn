#!/bin/bash
# Файл: deploy.sh
# Описание: Скрипт для сборки React-приложения и деплоя на удалённый сервер, с обновлением backend и перезапуском сервисов

# Выход при ошибке
set -e

# --- Настройка переменных ---
# Директория сборки (по умолчанию для Create React App это build)
BUILD_DIR="build"

# Данные для подключения к серверу
REMOTE_USER="root"
REMOTE_HOST="185.185.70.52"
REMOTE_DIR="/var/www/irkekzn/administration/build"

# --- Сборка проекта ---
echo "Переход в директорию проекта: $PROJECT_DIR"
cd "$PROJECT_DIR" || { echo "Директория проекта не найдена!"; exit 1; }

echo "Установка зависимостей..."
npm install

echo "Запуск сборки проекта..."
npm run build

# --- Отправка файлов на сервер ---
echo "Деплой сборки в $REMOTE_DIR на сервере $REMOTE_HOST..."
scp -r "$BUILD_DIR/"* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# --- Подключение к серверу и выполнение команд обновления backend и перезапуска сервисов ---
echo "Подключение к серверу $REMOTE_HOST для выполнения команд обновления и перезапуска сервисов..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
  # Переход в нужную директорию
  cd /var/www/irkekzn/
  sudo systemctl restart nginx
  sudo systemctl status nginx
EOF

echo "Деплой завершён успешно!"
