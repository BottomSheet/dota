# 🜂 QUEST: Михаил — 21-й уровень

Эпический квест-сайт на **Vue 3** в стиле **Dota 2 + аниме**, посвящённый 21-летию Михаила. Девять испытаний → финальное поздравление со стихом.

## ✦ Что внутри

- **9 квестов** + финал (всего 10 страниц)
- Тема: Necrophos (любимый герой Михаила) + Invoker, ember-gold-plague палитра
- Vue 3 (Composition API) + Vue Router + Vite
- Шрифты: Cinzel, Cormorant Garamond, JetBrains Mono, Bebas Neue
- HUD сверху (портрет, уровень, XP-бар, квест-индикатор)
- Прогресс сохраняется в `sessionStorage`
- Кастомные SVG-иллюстрации (Roshan, Invoker, Necrophos, Aegis, Ancient)
- Анимации, частицы, глоу-эффекты, грейн

## ✦ Пасхалки

- **🜍 Череп Necrophos** в правом нижнем углу — кликни для шёпота героя
- **⌨ Konami-код** `↑ ↑ ↓ ↓ ← → ← → B A` — секретная вспышка
- **🖥 F12** — открой консоль для приветствия Necrophos
- **🍕 Pizza Slice** в Secret Shop — купи и узнай
- **★ Pudge'ы и куры** в комбат-логе — мелочи

## ✦ Квесты

| № | Название | Что делает |
|---|---|---|
| I | Awaken Roshan | Кликай древнего, пока не назовёт Михаила по имени |
| II | Invoke The Spell | Q-W-E комбинации Invoker'а — призови Sun Strike (E-E-E) |
| III | Bounty Runes | Реакционная мини-игра: лови руны до мидера |
| IV | Necropolis | SVG-Necrophos + квиз про любимого героя |
| V | Secret Shop | Собери инвентарь из 6 предметов на 24000 голды |
| VI | Teamfight | 5v5, прокликай комбо-сиквенс с таймером |
| VII | Aegis | Прокрути 21 истину о Михаиле |
| VIII | Push Ancient | Финальный бой, способности с кулдаунами + базовая атака |
| IX | Finale | 4-актная финальная сцена + стих от барда-Necrophos |

## ✦ Запуск

### Вариант 1: Уже собранный билд (быстро)

В папке `dist/` лежит готовый production-билд. Просто открой `dist/index.html`:

```bash
# Простой способ: открой dist/index.html в браузере напрямую
# Или подними локальный сервер:
cd dist
python3 -m http.server 8000
# открой http://localhost:8000
```

### Вариант 2: Из исходников (для разработки)

Нужен Node.js 18+ и npm:

```bash
npm install
npm run dev      # dev-сервер на http://localhost:5173
npm run build    # production-билд в dist/
npm run preview  # превью production-билда
```

## ✦ Структура

```
quest/
├── index.html               # entry point
├── vite.config.js
├── package.json
├── src/
│   ├── main.js              # Vue app entry
│   ├── App.vue              # root + HUD + necro overlay
│   ├── assets/
│   │   └── main.css         # global theme + animations
│   ├── components/
│   │   ├── QuestBanner.vue  # banner на каждом квесте
│   │   └── QuestComplete.vue # модалка завершения
│   ├── composables/
│   │   └── useQuest.js      # state + Konami listener
│   ├── router/
│   │   └── index.js         # 10 routes
│   └── views/
│       ├── HomeView.vue     # пролог
│       ├── Q1Roshan.vue
│       ├── Q2Invoker.vue
│       ├── Q3Runes.vue
│       ├── Q4Necropolis.vue
│       ├── Q5Shopkeeper.vue
│       ├── Q6Teamfight.vue
│       ├── Q7Aegis.vue
│       ├── Q8Ancient.vue
│       └── FinaleView.vue   # финал со стихом
└── dist/                    # уже собранный билд
```

## ✦ Финальный стих

На последней странице звучит стих от «барда-Necrophos» — раскрашенный по строфам:

> любите доту 2, поэты!  
> ведь там найдете жизни след:  
> как фармить лес без откровений  
> и как тащить всю тиму вслед
>
> когда саппорт ушел без варда  
> и керри фидит пятый раз  
> в туманном хаосе распада  
> сквозит небытия указ
>
> в лесах, где спектра шепчет тайну  
> где пудж свистит крюком межбытия  
> и мид, как истина случайна  
> сф кайлы кидает зря

---

`gg · wp · михаил · 21`  
*crafted for Mikhail's 21st level · Necrophos approves · 2026*
