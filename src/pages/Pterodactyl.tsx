import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const steps = [
  {
    id: 0,
    title: "Зависимости",
    subtitle: "PHP 8.3, MariaDB, Redis, Nginx, Composer",
    icon: "Package",
    color: "cyan",
    description: "Установка всех необходимых пакетов на Ubuntu 22.04. Запускай команды последовательно от root.",
    code: `# 1. Базовые утилиты
apt -y install software-properties-common curl \\
  apt-transport-https ca-certificates gnupg

# 2. Репозиторий PHP 8.3 (Ondřej Surý PPA)
LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php

# 3. Официальный репозиторий Redis
curl -fsSL https://packages.redis.io/gpg | \\
  sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] \\
  https://packages.redis.io/deb $(lsb_release -cs) main" | \\
  sudo tee /etc/apt/sources.list.d/redis.list

# 4. Обновление и установка
apt update
apt -y install php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} \\
  mariadb-server nginx tar unzip git redis-server

# 5. Composer (глобально)
curl -sS https://getcomposer.org/installer | \\
  sudo php -- --install-dir=/usr/local/bin --filename=composer`,
    tips: [
      "Выполняй все команды под root или через sudo",
      "Убедись что Ubuntu 22.04 (Jammy) — другие версии могут отличаться",
    ],
  },
  {
    id: 1,
    title: "База данных",
    subtitle: "MariaDB: создание пользователя и БД",
    icon: "Database",
    color: "purple",
    description: "Создаём отдельного пользователя MariaDB с минимально необходимыми правами для безопасности.",
    code: `# Подключиться к MariaDB (введи пароль root если задан)
mariadb -u root -p

# --- Выполни внутри MariaDB ---

# Замени 'yourPassword' на НАДЁЖНЫЙ пароль!
CREATE USER 'pterodactyl'@'127.0.0.1'
  IDENTIFIED BY 'yourPassword';

CREATE DATABASE panel;

GRANT ALL PRIVILEGES ON panel.*
  TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;

exit`,
    tips: [
      "Запомни пароль — он понадобится при настройке .env",
      "Никогда не используй root пользователя для приложения",
    ],
  },
  {
    id: 2,
    title: "Установка панели",
    subtitle: "Скачивание и распаковка Pterodactyl",
    icon: "Download",
    color: "cyan",
    description: "Скачиваем последнюю стабильную версию панели с GitHub и устанавливаем зависимости Composer.",
    code: `# Создаём директорию и переходим в неё
mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl

# Скачиваем последний релиз
curl -Lo panel.tar.gz \\
  https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz

# Распаковываем
tar -xzvf panel.tar.gz

# Права на кеш и хранилище
chmod -R 755 storage/* bootstrap/cache/

# Копируем конфиг
cp .env.example .env

# Устанавливаем зависимости PHP
COMPOSER_ALLOW_SUPERUSER=1 composer install \\
  --no-dev --optimize-autoloader

# Генерируем уникальный ключ приложения
php artisan key:generate --force`,
    tips: [
      "Ключ APP_KEY генерируется один раз — не теряй его",
      "Не запускай composer от www-data, только от root на этом шаге",
    ],
  },
  {
    id: 3,
    title: "Настройка",
    subtitle: "Окружение, БД, почта, первый админ",
    icon: "Settings",
    color: "purple",
    description: "Настраиваем подключение к базе данных, URL панели и создаём первого администратора.",
    code: `# Настройка окружения (URL, кеш, очереди)
php artisan p:environment:setup

# Подключение к БД (укажи данные из шага 2)
php artisan p:environment:database

# Настройка почты (выбери smtp или mail)
php artisan p:environment:mail

# Миграция БД и заполнение начальными данными
php artisan migrate --seed --force

# Создание первого администратора
php artisan p:user:make

# Выставляем права на файлы (для Nginx/Apache)
chown -R www-data:www-data /var/www/pterodactyl/*

# Добавляем в crontab (crontab -e):
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1`,
    tips: [
      "p:user:make создаст первого супер-администратора",
      "Крон нужен для автоматических задач панели",
    ],
  },
  {
    id: 4,
    title: "Системные сервисы",
    subtitle: "Systemd: очередь задач и автозапуск",
    icon: "Cpu",
    color: "green",
    description: "Создаём systemd-юнит для обработки фоновых задач. Без него задачи не будут выполняться автоматически.",
    code: `# Создай файл сервиса
cat > /etc/systemd/system/pteroq.service << 'EOF'
[Unit]
Description=Pterodactyl Queue Worker
After=redis-server.service

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan \\
  queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

# Включаем и запускаем сервисы
sudo systemctl daemon-reload
sudo systemctl enable --now redis-server
sudo systemctl enable --now pteroq.service

# Проверка статуса
systemctl status pteroq`,
    tips: [
      "После этого перейди к настройке Nginx-конфига для панели",
      "Далее нужно установить Wings (агент) на игровые ноды",
    ],
  },
  {
    id: 5,
    title: "Nginx",
    subtitle: "Веб-сервер и SSL сертификат",
    icon: "Globe",
    color: "cyan",
    description: "Настраиваем Nginx как reverse proxy для панели. Рекомендуем использовать Let's Encrypt для SSL.",
    code: `# Конфиг Nginx (замени panel.example.com на свой домен)
cat > /etc/nginx/sites-available/pterodactyl.conf << 'EOF'
server {
    listen 80;
    server_name panel.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name panel.example.com;

    root /var/www/pterodactyl/public;
    index index.php;

    access_log /var/log/nginx/pterodactyl.app-access.log;
    error_log  /var/log/nginx/pterodactyl.app-error.log error;

    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    ssl_certificate /etc/letsencrypt/live/panel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.example.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ [.]php$ {
        fastcgi_split_path_info ^(.+[.]php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \\n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_read_timeout 300;
    }
}
EOF

# Получить SSL сертификат (Let's Encrypt)
apt install certbot python3-certbot-nginx -y
certbot certonly --nginx -d panel.example.com

# Активируем конфиг
ln -s /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx`,
    tips: [
      "Домен должен уже указывать на IP сервера до получения SSL",
      "После настройки панели — ставь Wings на игровые ноды",
    ],
  },
];

const colorMap = {
  cyan: { text: "var(--neon-cyan)", bg: "rgba(0,245,255,0.1)", border: "rgba(0,245,255,0.3)", tipBg: "rgba(0,245,255,0.06)", tipBorder: "rgba(0,245,255,0.15)" },
  purple: { text: "var(--neon-purple)", bg: "rgba(191,90,242,0.1)", border: "rgba(191,90,242,0.3)", tipBg: "rgba(191,90,242,0.06)", tipBorder: "rgba(191,90,242,0.15)" },
  green: { text: "var(--neon-green)", bg: "rgba(57,255,20,0.1)", border: "rgba(57,255,20,0.3)", tipBg: "rgba(57,255,20,0.06)", tipBorder: "rgba(57,255,20,0.15)" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIcon = any;

export default function Pterodactyl() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const step = steps[activeStep];
  const c = colorMap[step.color as keyof typeof colorMap];

  const copyCode = () => {
    navigator.clipboard.writeText(step.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)", fontFamily: "'Rubik', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(5,10,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm">Назад</span>
          </button>
          <div className="w-px h-6" style={{ background: "rgba(0,245,255,0.2)" }} />
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(191,90,242,0.2)", border: "1px solid rgba(191,90,242,0.3)" }}>
              <Icon name="Feather" size={15} style={{ color: "var(--neon-purple)" }} />
            </div>
            <span className="font-bold tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
              PTERODACTYL <span style={{ color: "var(--neon-purple)" }}>PANEL</span>
            </span>
          </div>
          <div className="ml-auto">
            <a href="https://pterodactyl.io/panel/1.0/getting_started.html" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(191,90,242,0.1)", color: "var(--neon-purple)", border: "1px solid rgba(191,90,242,0.2)" }}>
              <Icon name="ExternalLink" size={12} />
              Офиц. документация
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-16 cyber-grid min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium tracking-widest"
              style={{ background: "rgba(191,90,242,0.1)", border: "1px solid rgba(191,90,242,0.3)", color: "var(--neon-purple)" }}>
              <Icon name="Feather" size={12} />
              OPEN SOURCE GAME SERVER MANAGEMENT
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', monospace" }}>
              PTERO<span style={{ color: "var(--neon-purple)" }}>DACTYL</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Пошаговый гайд по установке игровой панели управления Pterodactyl на Ubuntu 22.04 с нуля.
            </p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">

            {/* Sidebar — steps */}
            <div className="space-y-2">
              {steps.map((s, i) => {
                const sc = colorMap[s.color as keyof typeof colorMap];
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <button key={i} onClick={() => setActiveStep(i)}
                    className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-3"
                    style={{
                      background: isActive ? sc.bg : "rgba(10,22,40,0.5)",
                      border: `1px solid ${isActive ? sc.border : "rgba(0,245,255,0.08)"}`,
                    }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                      style={{ background: isActive ? sc.bg : isDone ? "rgba(57,255,20,0.1)" : "rgba(255,255,255,0.05)", color: isActive ? sc.text : isDone ? "var(--neon-green)" : "#6b7280", border: `1px solid ${isActive ? sc.border : isDone ? "rgba(57,255,20,0.2)" : "rgba(255,255,255,0.08)"}` }}>
                      {isDone ? <Icon name="Check" size={14} /> : i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm" style={{ color: isActive ? "white" : "#9ca3af" }}>{s.title}</div>
                      <div className="text-xs truncate" style={{ color: isActive ? sc.text : "#4b5563" }}>{s.subtitle}</div>
                    </div>
                  </button>
                );
              })}

              {/* Progress */}
              <div className="p-4 rounded-xl mt-4" style={{ background: "rgba(10,22,40,0.5)", border: "1px solid rgba(0,245,255,0.08)" }}>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Прогресс</span>
                  <span style={{ color: "var(--neon-cyan)" }}>{activeStep}/{steps.length}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(activeStep / steps.length) * 100}%`, background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))", boxShadow: "0 0 10px rgba(0,245,255,0.4)" }} />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${c.border}`, boxShadow: `0 0 40px ${c.bg}` }}>
              {/* Step header */}
              <div className="p-6 flex items-center gap-4" style={{ borderBottom: `1px solid ${c.tipBorder}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <Icon name={step.icon as AnyIcon} size={22} style={{ color: c.text }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: c.bg, color: c.text }}>ШАГ {activeStep + 1}</span>
                    <h2 className="font-black text-xl text-white" style={{ fontFamily: "'Orbitron', monospace" }}>{step.title}</h2>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{step.subtitle}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-gray-300 leading-relaxed">{step.description}</p>

                {/* Tips */}
                <div className="space-y-2">
                  {step.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg text-sm" style={{ background: c.tipBg, border: `1px solid ${c.tipBorder}` }}>
                      <Icon name="Info" size={14} style={{ color: c.text, marginTop: 2, flexShrink: 0 }} />
                      <span style={{ color: c.text }}>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Code block */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,245,255,0.15)" }}>
                  <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
                      <span className="ml-2 text-xs text-gray-600 font-mono">bash — Ubuntu 22.04</span>
                    </div>
                    <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all"
                      style={{ background: copied ? "rgba(57,255,20,0.15)" : "rgba(0,245,255,0.1)", color: copied ? "var(--neon-green)" : "var(--neon-cyan)", border: `1px solid ${copied ? "rgba(57,255,20,0.3)" : "rgba(0,245,255,0.2)"}` }}>
                      <Icon name={copied ? "Check" : "Copy"} size={12} />
                      {copied ? "Скопировано!" : "Копировать"}
                    </button>
                  </div>
                  <pre className="p-5 text-xs leading-relaxed overflow-x-auto" style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-cyan)", fontFamily: "monospace" }}>
                    {step.code}
                  </pre>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon name="ArrowLeft" size={14} />
                    Назад
                  </button>

                  <span className="text-xs text-gray-600">{activeStep + 1} / {steps.length}</span>

                  {activeStep < steps.length - 1 ? (
                    <button onClick={() => setActiveStep(activeStep + 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
                      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                      Следующий шаг
                      <Icon name="ArrowRight" size={14} />
                    </button>
                  ) : (
                    <a href="https://pterodactyl.io/wings/1.0/installing.html" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold"
                      style={{ background: "rgba(57,255,20,0.15)", color: "var(--neon-green)", border: "1px solid rgba(57,255,20,0.3)" }}>
                      Установить Wings
                      <Icon name="ExternalLink" size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Extra info cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: "Server", title: "Минимальные требования", items: ["1 CPU ядро", "1 GB RAM", "10 GB диск", "Ubuntu 20.04+"], color: "cyan" },
              { icon: "Shield", title: "Что даёт Pterodactyl", items: ["Веб-консоль для серверов", "Управление файлами", "Планировщик задач", "API для автоматизации"], color: "purple" },
              { icon: "Zap", title: "После установки", items: ["Установить Wings на ноды", "Создать ноду в панели", "Распределить серверы", "Настроить домен"], color: "green" },
            ].map((card, i) => {
              const cc = colorMap[card.color as keyof typeof colorMap];
              return (
                <div key={i} className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.6)", border: `1px solid ${cc.tipBorder}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: cc.bg }}>
                      <Icon name={card.icon as AnyIcon} size={18} style={{ color: cc.text }} />
                    </div>
                    <h3 className="font-bold text-white text-sm">{card.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cc.text }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}