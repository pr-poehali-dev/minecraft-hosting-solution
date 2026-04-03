import { useState } from "react";
import Icon from "@/components/ui/icon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIcon = any;

const HERO_IMAGE = "https://cdn.poehali.dev/projects/4c4908b8-8f83-4f3d-abf5-b4fb93b8af1a/files/4ec654f4-33b3-4ef0-a4e7-4f62f32fde2a.jpg";

const plans = [
  {
    id: "free",
    name: "Free",
    flag: "🇩🇪",
    price: 0,
    cpu: "125%",
    cpuModel: "Intel Core i9 9900K",
    ram: "3 GB DDR4",
    disk: "10 GB NVMe",
    net: "100 Mbit/s",
    ports: 2,
    backups: 1,
    databases: 0,
    popular: false,
  },
  {
    id: "game1",
    name: "GAME–1",
    flag: "🇩🇪",
    price: 95,
    cpu: "225%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "2 GB DDR4",
    disk: "32 GB NVMe",
    net: "1 Gbit/s",
    ports: 5,
    backups: 5,
    databases: 10,
    popular: false,
  },
  {
    id: "game2",
    name: "GAME–2",
    flag: "🇩🇪",
    price: 249,
    cpu: "400%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "4 GB DDR4",
    disk: "64 GB NVMe",
    net: "1 Gbit/s",
    ports: 10,
    backups: 8,
    databases: 15,
    popular: true,
  },
  {
    id: "game3",
    name: "GAME–3",
    flag: "🇩🇪",
    price: 389,
    cpu: "500%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "6 GB DDR4",
    disk: "96 GB NVMe",
    net: "1 Gbit/s",
    ports: 15,
    backups: 10,
    databases: 20,
    popular: false,
  },
  {
    id: "game4",
    name: "GAME–4",
    flag: "🇩🇪",
    price: 509,
    cpu: "750%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "8 GB DDR4",
    disk: "128 GB NVMe",
    net: "1 Gbit/s",
    ports: 20,
    backups: 13,
    databases: 25,
    popular: false,
  },
  {
    id: "game5",
    name: "GAME–5",
    flag: "🇩🇪",
    price: 629,
    cpu: "850%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "12 GB DDR4",
    disk: "128 GB NVMe",
    net: "1 Gbit/s",
    ports: 25,
    backups: 15,
    databases: 30,
    popular: false,
  },
  {
    id: "game6",
    name: "GAME–6",
    flag: "🇩🇪",
    price: 729,
    cpu: "950%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "16 GB DDR4",
    disk: "256 GB NVMe",
    net: "1 Gbit/s",
    ports: 30,
    backups: 18,
    databases: 35,
    popular: false,
  },
  {
    id: "game7",
    name: "GAME–7",
    flag: "🇩🇪",
    price: 999,
    cpu: "1200%",
    cpuModel: "AMD Ryzen 9 3900",
    ram: "24 GB DDR4",
    disk: "256 GB NVMe",
    net: "1 Gbit/s",
    ports: 40,
    backups: 20,
    databases: 40,
    popular: false,
  },
];

const servers = [
  { name: "DE-NODE-01", location: "Франкфурт", status: "online", ping: 12, uptime: "99.98%" },
  { name: "DE-NODE-02", location: "Франкфурт", status: "online", ping: 14, uptime: "99.97%" },
  { name: "DE-NODE-03", location: "Берлин", status: "online", ping: 18, uptime: "100%" },
  { name: "DE-NODE-04", location: "Берлин", status: "degraded", ping: 45, uptime: "98.2%" },
  { name: "FI-NODE-01", location: "Хельсинки", status: "online", ping: 22, uptime: "99.95%" },
  { name: "FI-NODE-02", location: "Хельсинки", status: "online", ping: 25, uptime: "99.93%" },
];

const faqs = [
  {
    q: "Какие игры поддерживаются?",
    a: "Minecraft, Rust, ARK: Survival Evolved, CS2, Valheim, Terraria, 7 Days to Die, FiveM и сотни других. Устанавливаем любой игровой сервер в один клик.",
  },
  {
    q: "Как быстро активируется сервер?",
    a: "Сервер разворачивается автоматически за 30 секунд после оплаты. Никаких задержек и ожидания модерации.",
  },
  {
    q: "Есть ли защита от DDoS?",
    a: "Да, все серверы защищены от DDoS-атак на уровне сети. Фильтрация атак до 1 Тбит/с включена в каждый тариф бесплатно.",
  },
  {
    q: "Можно ли сменить тариф?",
    a: "Конечно! Апгрейд происходит мгновенно без потери данных. Оплата пересчитывается пропорционально.",
  },
  {
    q: "Как работает оплата через Яндекс.Кассу?",
    a: "Принимаем карты Visa/MasterCard/МИР, электронные кошельки, СБП. Автоматическое продление — вы не потеряете сервер.",
  },
  {
    q: "Что такое CPU %?",
    a: "Процент означает долю физического ядра. 100% = одно полное ядро AMD Ryzen 9 3900. 400% = мощность 4 ядер для вашего сервера.",
  },
];

const blogPosts = [
  {
    tag: "Обновление",
    date: "28 мар 2026",
    title: "Новые серверы в Хельсинки: ещё ближе к игрокам СНГ",
    excerpt: "Запускаем два новых узла в Финляндии. Пинг до Москвы — 22 мс. Идеально для Minecraft и Rust.",
    color: "cyan",
  },
  {
    tag: "Гайд",
    date: "15 мар 2026",
    title: "Как настроить Minecraft сервер за 5 минут",
    excerpt: "Пошаговая инструкция по запуску Paper MC, настройке плагинов и защите от гриферов.",
    color: "purple",
  },
  {
    tag: "Акция",
    date: "01 мар 2026",
    title: "Скидка 30% на тарифы GAME-4 и выше",
    excerpt: "Только до конца апреля — апгрейдируй сервер и плати меньше. Промокод: NEXUS30",
    color: "green",
  },
];

const navItems = [
  { label: "Главная", href: "#hero" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Управление", href: "#panel" },
  { label: "Статус", href: "#status" },
  { label: "FAQ", href: "#faq" },
  { label: "Блог", href: "#blog" },
  { label: "Контакты", href: "#contacts" },
];

function PlanCard({ plan, onBuy }: { plan: typeof plans[0]; onBuy: (p: typeof plans[0]) => void }) {
  return (
    <div
      className={`relative rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 cursor-pointer group ${plan.popular ? "cyber-card-popular" : "cyber-card"}`}
    >
      {plan.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest"
          style={{ background: "linear-gradient(90deg, #00f5ff, #bf5af2)", color: "#050a0f" }}
        >
          ПОПУЛЯРНЫЙ
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-lg">{plan.flag}</span>
        <h3
          className="font-bold text-lg tracking-wider"
          style={{ fontFamily: "'Orbitron', monospace", color: plan.popular ? "var(--neon-cyan)" : "white" }}
        >
          {plan.name}
        </h3>
      </div>

      <div className="space-y-2">
        {[
          { icon: "Cpu", content: <><span className="font-bold text-cyan-400">CPU: {plan.cpu}</span><span className="text-gray-400 text-xs ml-1">{plan.cpuModel}</span></> },
          { icon: "MemoryStick", content: <span className="text-white font-medium">RAM: {plan.ram}</span> },
          { icon: "HardDrive", content: <span className="text-white font-medium">Диск: {plan.disk}</span> },
          { icon: "Wifi", content: <span className="text-white">Сеть: <span className="font-medium">{plan.net}</span><span className="text-gray-400"> · Порты: {plan.ports} шт.</span></span> },
          { icon: "RotateCcw", content: <span className="text-white">Бекапы: <span className="font-medium">{plan.backups} шт.</span></span> },
          { icon: "Database", content: <span className="text-white">Базы данных: <span className="font-medium">{plan.databases} шт.</span></span> },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.1)" }}>
            <Icon name={row.icon as AnyIcon} size={14} className="text-cyan-400 shrink-0" />
            {row.content}
          </div>
        ))}
      </div>

      <button onClick={() => onBuy(plan)} className="mt-auto w-full py-3 rounded-lg font-bold text-sm tracking-wider flex items-center justify-center gap-2 neon-btn-cyan" style={{ fontFamily: "'Orbitron', monospace" }}>
        <Icon name="ShoppingCart" size={14} />
        Приобрести — {plan.price === 0 ? "0 ₽" : `${plan.price} ₽`}
      </button>
    </div>
  );
}

type Modal = "login" | "register" | "purchase" | "pterodactyl" | null;

export default function Index() {
  const [activeNav, setActiveNav] = useState("hero");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [pteroStep, setPteroStep] = useState(0);

  const handleNav = (href: string) => {
    setActiveNav(href.replace("#", ""));
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setModal("auth" as Modal);
  };

  const openPurchase = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setModal("purchase");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)", fontFamily: "'Rubik', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(5,10,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded" style={{ background: "linear-gradient(135deg, #00f5ff, #bf5af2)", boxShadow: "0 0 15px rgba(0,245,255,0.5)" }} />
            <span className="font-bold text-xl tracking-widest" style={{ fontFamily: "'Orbitron', monospace", color: "var(--neon-cyan)" }}>
              NEXUS<span style={{ color: "white" }}>HOST</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`nav-link text-sm font-medium transition-colors ${activeNav === item.href.replace("#", "") ? "text-cyan-400 active" : "text-gray-400 hover:text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => openAuth("login")} className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Войти
            </button>
            <button onClick={() => openAuth("register")} className="px-4 py-2 rounded-lg text-sm font-bold neon-btn-solid" style={{ fontFamily: "'Orbitron', monospace" }}>
              Начать
            </button>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(0,245,255,0.1)" }}>
            {navItems.map((item) => (
              <button key={item.href} onClick={() => handleNav(item.href)} className="text-left py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 cyber-grid">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="NEXUS HOST" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,10,15,0.3) 0%, rgba(5,10,15,0.7) 60%, var(--dark-bg) 100%)" }} />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "var(--neon-cyan)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: "var(--neon-purple)" }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium tracking-widest"
            style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)", color: "var(--neon-cyan)" }}>
            <div className="w-2 h-2 rounded-full status-online animate-status-pulse" />
            СЕРВЕРЫ ОНЛАЙН · ГЕРМАНИЯ · ФИНЛЯНДИЯ
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight" style={{ fontFamily: "'Orbitron', monospace" }}>
            <span className="block text-white">ИГРОВОЙ</span>
            <span className="block neon-cyan glitch-text" data-text="ХОСТИНГ">ХОСТИНГ</span>
            <span className="block" style={{ color: "var(--neon-purple)" }}>НОВОГО УРОВНЯ</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Серверы для игр с <span className="text-cyan-400 font-medium">NVMe дисками</span>, защитой от DDoS и активацией за <span className="text-cyan-400 font-medium">30 секунд</span>. Киберпанк скорость — реальная надёжность.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => handleNav("#pricing")} className="px-8 py-4 rounded-lg font-bold text-lg tracking-wider neon-btn-solid" style={{ fontFamily: "'Orbitron', monospace" }}>
              Выбрать тариф
            </button>
            <button onClick={() => handleNav("#panel")} className="px-8 py-4 rounded-lg font-bold text-lg tracking-wider neon-btn-cyan" style={{ fontFamily: "'Orbitron', monospace" }}>
              Панель управления
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "Zap", value: "30 сек", label: "Активация" },
              { icon: "Shield", value: "1 Тбит/с", label: "DDoS защита" },
              { icon: "Server", value: "99.98%", label: "Аптайм" },
              { icon: "Globe", value: "2 локации", label: "Германия / Финляндия" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, background: "rgba(10,22,40,0.6)", border: "1px solid rgba(0,245,255,0.15)" }}>
                <Icon name={stat.icon as AnyIcon} size={24} className="text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <Icon name="ChevronDown" size={24} className="text-cyan-400 opacity-60" />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 cyber-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest mb-4" style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>
              ТАРИФНЫЕ ПЛАНЫ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', monospace" }}>
              ВЫБЕРИ МО<span style={{ color: "var(--neon-cyan)" }}>ЩНОСТЬ</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              От бесплатного старта до мощного выделенного сервера. Все тарифы с NVMe дисками и 1 Гбит/с сетью.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onBuy={openPurchase} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              Оплата через <span className="text-cyan-400">Яндекс.Кассу</span>, банковские карты, СБП и электронные кошельки
            </p>
          </div>
        </div>
      </section>

      {/* CONTROL PANEL */}
      <section id="panel" className="py-24 px-4" style={{ background: "linear-gradient(180deg, var(--dark-bg) 0%, rgba(10,22,40,0.5) 50%, var(--dark-bg) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest mb-4" style={{ background: "rgba(191,90,242,0.1)", color: "var(--neon-purple)", border: "1px solid rgba(191,90,242,0.2)" }}>
                ПАНЕЛЬ УПРАВЛЕНИЯ
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Orbitron', monospace" }}>
                ПОЛНЫЙ<br /><span style={{ color: "var(--neon-purple)" }}>КОНТРОЛЬ</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Современная панель управления с удобным интерфейсом. Запускай, останавливай, настраивай сервер в пару кликов — даже со смартфона.
              </p>

              <button
                onClick={() => { setPteroStep(0); setModal("pterodactyl"); }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm tracking-wider mb-8"
                style={{ background: "rgba(191,90,242,0.15)", border: "1px solid rgba(191,90,242,0.4)", color: "var(--neon-purple)", fontFamily: "'Orbitron', monospace" }}
              >
                <Icon name="Terminal" size={16} />
                Установить Pterodactyl Panel
              </button>

              <div className="space-y-4">
                {[
                  { icon: "Terminal", title: "Веб-консоль", desc: "Прямой доступ к серверу через браузер" },
                  { icon: "BarChart2", title: "Мониторинг в реальном времени", desc: "CPU, RAM, диск, сеть — всё на одном экране" },
                  { icon: "Package", title: "Авто-установка игр", desc: "Minecraft, Rust, ARK и другие — в один клик" },
                  { icon: "RotateCcw", title: "Автоматические бекапы", desc: "Восстановление сервера за секунды" },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(191,90,242,0.15)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(191,90,242,0.15)" }}>
                      <Icon name={feat.icon as AnyIcon} size={18} style={{ color: "var(--neon-purple)" }} />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm mb-1">{feat.title}</div>
                      <div className="text-gray-500 text-xs">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(0,245,255,0.2)", boxShadow: "0 0 60px rgba(0,245,255,0.1)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                <span className="ml-4 text-xs text-gray-500 font-mono">panel.nexushost.ru — Minecraft #3</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Статус сервера</span>
                  <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--neon-green)" }}>
                    <div className="w-2 h-2 rounded-full status-online animate-status-pulse" />
                    ОНЛАЙН
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Игроков онлайн</span>
                  <span className="text-white font-mono font-bold">12 / 50</span>
                </div>
                {[
                  { label: "CPU", value: 34, color: "var(--neon-cyan)" },
                  { label: "RAM", value: 58, color: "var(--neon-purple)" },
                  { label: "Диск", value: 22, color: "var(--neon-green)" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{stat.label}</span>
                      <span style={{ color: stat.color }}>{stat.value}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${stat.value}%`, background: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
                    </div>
                  </div>
                ))}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Запустить", bg: "rgba(57,255,20,0.15)", color: "var(--neon-green)", border: "rgba(57,255,20,0.3)" },
                    { label: "Остановить", bg: "rgba(255,68,68,0.15)", color: "#ff4444", border: "rgba(255,68,68,0.3)" },
                    { label: "Перезапуск", bg: "rgba(0,245,255,0.15)", color: "var(--neon-cyan)", border: "rgba(0,245,255,0.3)" },
                  ].map((btn) => (
                    <button key={btn.label} className="py-2 rounded text-xs font-medium transition-all hover:opacity-80"
                      style={{ background: btn.bg, color: btn.color, border: `1px solid ${btn.border}` }}>
                      {btn.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.5)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.1)" }}>
                  <div className="text-gray-500">[16:42:01] Server started</div>
                  <div className="text-green-400">[16:42:03] Done (2.1s)! For help: /help</div>
                  <div className="text-gray-400">[16:43:12] Player Steve joined</div>
                  <div className="text-cyan-400">[16:44:05] Player Alex joined</div>
                  <div className="opacity-50">█</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVER STATUS */}
      <section id="status" className="py-24 px-4 cyber-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest mb-4" style={{ background: "rgba(57,255,20,0.1)", color: "var(--neon-green)", border: "1px solid rgba(57,255,20,0.2)" }}>
              МОНИТОРИНГ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', monospace" }}>
              СТАТУС <span style={{ color: "var(--neon-green)" }}>СЕРВЕРОВ</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server, i) => (
              <div key={i} className="p-5 rounded-xl cyber-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-white font-mono">{server.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{server.location}</div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium`}
                    style={{
                      color: server.status === "online" ? "var(--neon-green)" : "#ffaa00",
                      background: server.status === "online" ? "rgba(57,255,20,0.1)" : "rgba(255,170,0,0.1)",
                      border: `1px solid ${server.status === "online" ? "rgba(57,255,20,0.3)" : "rgba(255,170,0,0.3)"}`
                    }}>
                    <div className={`w-1.5 h-1.5 rounded-full ${server.status === "online" ? "status-online animate-status-pulse" : "status-degraded"}`} />
                    {server.status === "online" ? "Онлайн" : "Нагрузка"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 rounded-lg" style={{ background: "rgba(0,245,255,0.05)" }}>
                    <div className="text-cyan-400 font-bold font-mono">{server.ping} мс</div>
                    <div className="text-xs text-gray-500">Пинг</div>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: "rgba(0,245,255,0.05)" }}>
                    <div className="text-cyan-400 font-bold font-mono">{server.uptime}</div>
                    <div className="text-xs text-gray-500">Аптайм</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl text-center" style={{ background: "rgba(57,255,20,0.05)", border: "1px solid rgba(57,255,20,0.15)" }}>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--neon-green)" }}>
              <div className="w-2 h-2 rounded-full status-online animate-status-pulse" />
              Все системы работают в штатном режиме · Обновлено: {new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest mb-4" style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>
              ВОПРОСЫ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
              ЧАС<span style={{ color: "var(--neon-cyan)" }}>ТО</span> СПРАШИВАЮТ
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.6)", border: `1px solid ${openFaq === i ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.1)"}`, transition: "border-color 0.3s" }}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left gap-4" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium text-white">{faq.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-cyan-400 shrink-0" />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed animate-fade-in-up" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-24 px-4 cyber-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest mb-4" style={{ background: "rgba(191,90,242,0.1)", color: "var(--neon-purple)", border: "1px solid rgba(191,90,242,0.2)" }}>
              МАТЕРИАЛЫ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
              БЛО<span style={{ color: "var(--neon-purple)" }}>Г</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => {
              const tagColor = post.color === "cyan" ? "var(--neon-cyan)" : post.color === "purple" ? "var(--neon-purple)" : "var(--neon-green)";
              const tagBg = post.color === "cyan" ? "rgba(0,245,255,0.1)" : post.color === "purple" ? "rgba(191,90,242,0.1)" : "rgba(57,255,20,0.1)";
              return (
                <div key={i} className="cyber-card rounded-xl overflow-hidden cursor-pointer group">
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${tagColor}, transparent)` }} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: tagBg, color: tagColor }}>{post.tag}</span>
                      <span className="text-xs text-gray-600">{post.date}</span>
                    </div>
                    <h3 className="font-bold text-white mb-3 leading-snug group-hover:text-cyan-400 transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                    <div className="mt-5 flex items-center gap-1 text-xs font-medium" style={{ color: tagColor }}>
                      Читать далее
                      <Icon name="ArrowRight" size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest mb-4" style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>
              СВЯЗЬ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
              КОН<span style={{ color: "var(--neon-cyan)" }}>ТАКТЫ</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { icon: "MessageSquare", label: "Telegram", value: "@nexushost_support", color: "cyan" },
                { icon: "Mail", label: "Email", value: "support@nexushost.ru", color: "purple" },
                { icon: "Headphones", label: "Тикет-система", value: "Создать обращение", color: "green" },
              ].map((c, i) => {
                const col = c.color === "cyan" ? "var(--neon-cyan)" : c.color === "purple" ? "var(--neon-purple)" : "var(--neon-green)";
                const rgb = c.color === "cyan" ? "0,245,255" : c.color === "purple" ? "191,90,242" : "57,255,20";
                return (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-xl cyber-card cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `rgba(${rgb},0.1)` }}>
                      <Icon name={c.icon as AnyIcon} size={22} style={{ color: col }} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">{c.label}</div>
                      <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{c.value}</div>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-gray-600 ml-auto group-hover:text-cyan-400 transition-colors" />
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl p-6" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(0,245,255,0.2)" }}>
              <h3 className="font-bold text-white mb-5">Отправить сообщение</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Имя</label>
                  <input type="text" placeholder="Ваше имя" className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,245,255,0.15)" }} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,245,255,0.15)" }} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Сообщение</label>
                  <textarea rows={4} placeholder="Опишите ваш вопрос..." className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors resize-none"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,245,255,0.15)" }} />
                </div>
                <button className="w-full py-3 rounded-lg font-bold text-sm tracking-wider neon-btn-solid" style={{ fontFamily: "'Orbitron', monospace" }}>
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* ===== MODALS ===== */}

      {/* Auth Modal (Войти / Начать) */}
      {modal === ("auth" as Modal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl p-8 animate-fade-in-up" style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(0,245,255,0.3)", boxShadow: "0 0 60px rgba(0,245,255,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
                {(["login", "register"] as const).map(tab => (
                  <button key={tab} onClick={() => setAuthTab(tab)} className="px-4 py-2 rounded-md text-sm font-bold transition-all"
                    style={{ background: authTab === tab ? "rgba(0,245,255,0.15)" : "transparent", color: authTab === tab ? "var(--neon-cyan)" : "#6b7280", border: authTab === tab ? "1px solid rgba(0,245,255,0.3)" : "1px solid transparent" }}>
                    {tab === "login" ? "Войти" : "Регистрация"}
                  </button>
                ))}
              </div>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {authTab === "register" && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Имя пользователя</label>
                  <input type="text" placeholder="gamepro2077" className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,245,255,0.2)" }} />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,245,255,0.2)" }} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Пароль</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,245,255,0.2)" }} />
              </div>
              {authTab === "login" && (
                <div className="text-right">
                  <button className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Забыли пароль?</button>
                </div>
              )}
              <button className="w-full py-3 rounded-lg font-bold text-sm tracking-wider neon-btn-solid mt-2" style={{ fontFamily: "'Orbitron', monospace" }}>
                {authTab === "login" ? "Войти в аккаунт" : "Создать аккаунт"}
              </button>
              <p className="text-center text-xs text-gray-600">
                {authTab === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
                <button onClick={() => setAuthTab(authTab === "login" ? "register" : "login")} className="text-cyan-400 hover:underline">
                  {authTab === "login" ? "Регистрация" : "Войти"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {modal === "purchase" && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={() => setModal(null)}>
          <div className="w-full max-w-lg rounded-2xl p-8 animate-fade-in-up" style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(0,245,255,0.3)", boxShadow: "0 0 60px rgba(0,245,255,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
                {selectedPlan.flag} {selectedPlan.name}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.15)" }}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-400">CPU: <span className="text-cyan-400 font-bold">{selectedPlan.cpu}</span></div>
                <div className="text-gray-400">RAM: <span className="text-white font-medium">{selectedPlan.ram}</span></div>
                <div className="text-gray-400">Диск: <span className="text-white font-medium">{selectedPlan.disk}</span></div>
                <div className="text-gray-400">Сеть: <span className="text-white font-medium">{selectedPlan.net}</span></div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Период оплаты</label>
                <div className="grid grid-cols-3 gap-2">
                  {["1 месяц", "3 месяца", "6 месяцев"].map((p, i) => (
                    <button key={p} className="py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ background: i === 0 ? "rgba(0,245,255,0.15)" : "rgba(255,255,255,0.05)", color: i === 0 ? "var(--neon-cyan)" : "#9ca3af", border: i === 0 ? "1px solid rgba(0,245,255,0.4)" : "1px solid rgba(255,255,255,0.1)" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email для аккаунта</label>
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,245,255,0.2)" }} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.3)" }}>
              <span className="text-gray-400">Итого в месяц:</span>
              <span className="text-2xl font-black" style={{ color: "var(--neon-cyan)", fontFamily: "'Orbitron', monospace" }}>
                {selectedPlan.price === 0 ? "0 ₽" : `${selectedPlan.price} ₽`}
              </span>
            </div>

            <button className="w-full py-4 rounded-lg font-bold tracking-wider neon-btn-solid flex items-center justify-center gap-2" style={{ fontFamily: "'Orbitron', monospace" }}>
              <Icon name="CreditCard" size={18} />
              Оплатить через Яндекс.Кассу
            </button>
            <p className="text-center text-xs text-gray-600 mt-3">Visa · MasterCard · МИР · СБП · ЮMoney</p>
          </div>
        </div>
      )}

      {/* Pterodactyl Install Modal */}
      {modal === "pterodactyl" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)" }} onClick={() => setModal(null)}>
          <div className="w-full max-w-3xl rounded-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col" style={{ background: "rgba(5,10,20,0.99)", border: "1px solid rgba(191,90,242,0.4)", boxShadow: "0 0 80px rgba(191,90,242,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(191,90,242,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(191,90,242,0.2)" }}>
                  <Icon name="Feather" size={18} style={{ color: "var(--neon-purple)" }} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm" style={{ fontFamily: "'Orbitron', monospace" }}>Pterodactyl Panel</div>
                  <div className="text-xs text-gray-500">Гайд по установке на Ubuntu 22.04</div>
                </div>
              </div>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Steps nav */}
            <div className="flex overflow-x-auto px-6 py-3 gap-2" style={{ borderBottom: "1px solid rgba(191,90,242,0.15)", scrollbarWidth: "none" }}>
              {["Зависимости", "База данных", "Установка", "Настройка", "Systemd"].map((step, i) => (
                <button key={i} onClick={() => setPteroStep(i)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{ background: pteroStep === i ? "rgba(191,90,242,0.2)" : "rgba(255,255,255,0.05)", color: pteroStep === i ? "var(--neon-purple)" : "#6b7280", border: pteroStep === i ? "1px solid rgba(191,90,242,0.4)" : "1px solid transparent" }}>
                  {i + 1}. {step}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              {pteroStep === 0 && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Установка PHP 8.3, MariaDB, Redis, Nginx и Composer на Ubuntu 22.04.</p>
                  <pre className="text-xs p-4 rounded-xl overflow-x-auto leading-relaxed" style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.15)", fontFamily: "monospace" }}>{`# Обновление пакетов
apt -y install software-properties-common curl \\
  apt-transport-https ca-certificates gnupg

# PHP 8.3 (PPA Ondřej)
LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php

# Redis официальный репозиторий
curl -fsSL https://packages.redis.io/gpg | \\
  sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] \\
  https://packages.redis.io/deb $(lsb_release -cs) main" | \\
  sudo tee /etc/apt/sources.list.d/redis.list

apt update

# Установка всех зависимостей
apt -y install php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} \\
  mariadb-server nginx tar unzip git redis-server

# Composer
curl -sS https://getcomposer.org/installer | \\
  sudo php -- --install-dir=/usr/local/bin --filename=composer`}</pre>
                </div>
              )}
              {pteroStep === 1 && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Создание базы данных и пользователя MariaDB для панели.</p>
                  <pre className="text-xs p-4 rounded-xl overflow-x-auto leading-relaxed" style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.15)", fontFamily: "monospace" }}>{`# Подключиться к MariaDB
mariadb -u root -p

# Внутри MariaDB — замени 'yourPassword' на свой пароль!
CREATE USER 'pterodactyl'@'127.0.0.1' 
  IDENTIFIED BY 'yourPassword';
CREATE DATABASE panel;
GRANT ALL PRIVILEGES ON panel.* 
  TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;
exit`}</pre>
                  <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.2)", color: "#ffaa00" }}>
                    Запомни пароль — он понадобится на шаге настройки окружения.
                  </div>
                </div>
              )}
              {pteroStep === 2 && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Скачивание и распаковка панели Pterodactyl.</p>
                  <pre className="text-xs p-4 rounded-xl overflow-x-auto leading-relaxed" style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.15)", fontFamily: "monospace" }}>{`mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl

curl -Lo panel.tar.gz \\
  https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
tar -xzvf panel.tar.gz
chmod -R 755 storage/* bootstrap/cache/

cp .env.example .env
COMPOSER_ALLOW_SUPERUSER=1 composer install \\
  --no-dev --optimize-autoloader

# Генерация ключа приложения
php artisan key:generate --force`}</pre>
                </div>
              )}
              {pteroStep === 3 && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Настройка окружения, подключение к БД и создание первого администратора.</p>
                  <pre className="text-xs p-4 rounded-xl overflow-x-auto leading-relaxed" style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.15)", fontFamily: "monospace" }}>{`# Настройка окружения (URL сайта, кеш и т.д.)
php artisan p:environment:setup

# Подключение к базе данных
php artisan p:environment:database

# (Опционально) Настройка почты
php artisan p:environment:mail

# Миграция и заполнение БД
php artisan migrate --seed --force

# Создать первого администратора
php artisan p:user:make

# Права на файлы для Nginx
chown -R www-data:www-data /var/www/pterodactyl/*

# Крон — добавь в crontab (crontab -e)
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1`}</pre>
                </div>
              )}
              {pteroStep === 4 && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Настройка systemd-сервиса для очереди задач Pterodactyl.</p>
                  <pre className="text-xs p-4 rounded-xl overflow-x-auto leading-relaxed" style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.15)", fontFamily: "monospace" }}>{`# Создай файл /etc/systemd/system/pteroq.service
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

# Запуск сервисов
sudo systemctl enable --now redis-server
sudo systemctl enable --now pteroq.service`}</pre>
                  <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(57,255,20,0.06)", border: "1px solid rgba(57,255,20,0.2)", color: "var(--neon-green)" }}>
                    Готово! Теперь перейди на pterodactyl.io для настройки Nginx и Wings (агента на нодах).
                  </div>
                  <a href="https://pterodactyl.io/panel/1.0/getting_started.html" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(191,90,242,0.15)", color: "var(--neon-purple)", border: "1px solid rgba(191,90,242,0.3)" }}>
                    <Icon name="ExternalLink" size={12} />
                    Официальная документация Pterodactyl
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid rgba(191,90,242,0.15)" }}>
              <button onClick={() => setPteroStep(Math.max(0, pteroStep - 1))} disabled={pteroStep === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>
                ← Назад
              </button>
              <span className="text-xs text-gray-600">Шаг {pteroStep + 1} из 5</span>
              <button onClick={() => setPteroStep(Math.min(4, pteroStep + 1))} disabled={pteroStep === 4}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30"
                style={{ background: "rgba(191,90,242,0.15)", color: "var(--neon-purple)", border: "1px solid rgba(191,90,242,0.3)" }}>
                Далее →
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="py-12 px-4" style={{ background: "rgba(5,10,15,0.9)", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded" style={{ background: "linear-gradient(135deg, #00f5ff, #bf5af2)" }} />
              <span className="font-bold text-lg tracking-widest" style={{ fontFamily: "'Orbitron', monospace", color: "var(--neon-cyan)" }}>
                NEXUS<span className="text-white">HOST</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {navItems.map((item) => (
                <button key={item.href} onClick={() => handleNav(item.href)} className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-600">© 2026 NEXUS HOST · Все права защищены</div>
          </div>
        </div>
      </footer>
    </div>
  );
}