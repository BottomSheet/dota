<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="7" tone="gold"
        title="ЭГИС БЕССМЕРТНОГО"
        subtitle="Roshan уронил его дважды. Михаилу 21. Прокрути двадцать одну истину."
      />

      <div class="aegis-stage">
        <!-- Aegis art -->
        <div class="aegis-orb">
          <div class="orb-glow"></div>
          <svg viewBox="0 0 240 280" width="200" height="232">
            <defs>
              <radialGradient id="aegisG" cx="50%" cy="35%">
                <stop offset="0%" stop-color="#fff5d6"/>
                <stop offset="40%" stop-color="#ffd86b"/>
                <stop offset="80%" stop-color="#d4a64a"/>
                <stop offset="100%" stop-color="#6b4a13"/>
              </radialGradient>
              <linearGradient id="aegisRim" x1="0" x2="1">
                <stop offset="0%" stop-color="#ffd86b"/>
                <stop offset="50%" stop-color="#fff"/>
                <stop offset="100%" stop-color="#6b4a13"/>
              </linearGradient>
              <filter id="aegisGlow">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <!-- Shield body -->
            <path d="M120 20 C 60 30, 30 70, 30 130 C 30 200, 70 250, 120 270 C 170 250, 210 200, 210 130 C 210 70, 180 30, 120 20 Z"
                  fill="url(#aegisG)" stroke="url(#aegisRim)" stroke-width="3" filter="url(#aegisGlow)"/>

            <!-- Inner ornament -->
            <path d="M120 50 C 80 58, 60 90, 60 130 C 60 180, 90 225, 120 240 C 150 225, 180 180, 180 130 C 180 90, 160 58, 120 50 Z"
                  fill="none" stroke="#6b4a13" stroke-width="1.5" opacity="0.6"/>

            <!-- Center sigil (21) -->
            <circle cx="120" cy="135" r="42" fill="rgba(0,0,0,0.25)" stroke="#6b4a13" stroke-width="1.5"/>
            <text x="120" y="148" text-anchor="middle"
                  font-family="Cinzel, serif" font-weight="900" font-size="44" fill="#0d0a14"
                  filter="url(#aegisGlow)">21</text>

            <!-- Decorative rays -->
            <g stroke="#6b4a13" stroke-width="1" opacity="0.5">
              <line x1="120" y1="60" x2="120" y2="72"/>
              <line x1="120" y1="200" x2="120" y2="212"/>
              <line x1="60" y1="135" x2="72" y2="135"/>
              <line x1="168" y1="135" x2="180" y2="135"/>
              <line x1="80" y1="90" x2="88" y2="98"/>
              <line x1="160" y1="90" x2="152" y2="98"/>
              <line x1="80" y1="180" x2="88" y2="172"/>
              <line x1="160" y1="180" x2="152" y2="172"/>
            </g>

            <!-- Top crown gem -->
            <path d="M120 18 L 110 32 L 130 32 Z" fill="#c11a3a" stroke="#ffd86b" stroke-width="1"/>

            <!-- Bottom gem -->
            <circle cx="120" cy="252" r="6" fill="#3aa6ff" stroke="#ffd86b" stroke-width="1"/>
          </svg>

          <div class="aegis-label t-rune">AEGIS · OF · THE · IMMORTAL</div>
          <div class="aegis-sub t-mono">// 21 TRUTHS UNLOCKED</div>
        </div>

        <!-- Truths list -->
        <div class="truths-wrap">
          <div class="truths-head">
            <div class="t-mono truths-eyebrow">// MIKHAIL_CHRONICLE.txt</div>
            <h2 class="t-rune truths-title t-glow-gold">ДВАДЦАТЬ ОДНА ИСТИНА</h2>
            <p class="truths-sub">прокрути до конца — последняя истина откроет проход.</p>
          </div>

          <div class="truths-scroll" ref="scrollEl" @scroll="onScroll">
            <div v-for="(t, i) in truths" :key="i" class="truth"
                 :class="{ visible: visibleSet.has(i) }">
              <div class="truth-num t-rune">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="truth-content">
                <p>{{ t }}</p>
              </div>
              <div class="truth-deco">✦</div>
            </div>
          </div>

          <div class="scroll-hint t-mono">
            <span v-if="!complete">↓ читай дальше — {{ visibleSet.size }} / 21</span>
            <span v-else class="t-glow-gold">★ ВСЕ ИСТИНЫ ОТКРЫТЫ ★</span>
          </div>
        </div>
      </div>
    </div>

    <QuestComplete
      :show="complete"
      reward="+ AEGIS · IMMORTALITY · 1000 XP"
      message="Михаил подобрал эгис. Теперь — финальный пуш на трон."
      next="/quest/8-ancient"
      next-label="К ТРОНУ →"
    />
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const scrollEl = ref(null)
const visibleSet = reactive(new Set([0, 1, 2]))
const complete = ref(false)

const truths = [
  'Михаил умеет тащить безнадёжный матч из 0-25 на середине.',
  'Не паникует, даже если саппорт ушёл за рунами и не вернулся.',
  'Знает, что 21 — это уровень, на котором Necrophos уже всех кладёт.',
  'Кидает Sun Strike не глядя — а попадает.',
  'Пишет «gg ez» только когда честно заслужил.',
  'Может молчать в чате три игры подряд и всё равно тащить.',
  'Не флеймит саппорта, даже если без варда.',
  'Знает, что Pudge на миду — это образ жизни.',
  'Покупает варды. Просто потому что взрослый.',
  'Никогда не оставляет тиму в фонтан-кэмпе.',
  'Помнит времена, когда Aghanim был синий.',
  'Понимает разницу между картой и калибровкой.',
  'Может объяснить, почему Spectre — лучший керри финала.',
  'Дотерпит до 60-й минуты, если нужно.',
  'Не сдаётся в 30-й при -25к голде.',
  'Знает, как собирать Octarine Core. И главное — зачем.',
  'Умеет уважать соперника. Даже Pudge с хуком в стену.',
  'Принимает поражение и анализирует, а не кидает мышку.',
  'Шутит про патчи лучше, чем стримеры.',
  'Знает, что The International — это не пятница.',
  'И самое главное — Михаил умеет любить эту игру. Двадцать первый год подряд.'
]

function onScroll() {
  const el = scrollEl.value
  if (!el) return
  const items = el.querySelectorAll('.truth')
  items.forEach((item, idx) => {
    const r = item.getBoundingClientRect()
    const containerR = el.getBoundingClientRect()
    if (r.top < containerR.bottom - 30 && r.bottom > containerR.top + 30) {
      visibleSet.add(idx)
    }
  })
  if (visibleSet.size >= truths.length && !complete.value) {
    complete.value = true
    quest.complete('aegis')
    quest.unlock('21_truths')
  }
}

// Auto-scroll observer fallback
onMounted(() => {
  setTimeout(onScroll, 100)
})
</script>

<style scoped>
.aegis-stage {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 800px) {
  .aegis-stage { grid-template-columns: 1fr; }
}

.aegis-orb {
  position: sticky;
  top: 100px;
  text-align: center;
  padding: 1.5rem;
}

.orb-glow {
  position: absolute;
  inset: 10%;
  background: radial-gradient(circle, rgba(255, 216, 107, 0.4), transparent 70%);
  filter: blur(40px);
  animation: pulse-glow 3s ease-in-out infinite;
  z-index: -1;
}

.aegis-orb svg {
  filter: drop-shadow(0 0 24px rgba(255, 216, 107, 0.5));
  animation: aegis-float 4s ease-in-out infinite;
}

@keyframes aegis-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.aegis-label {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  color: var(--gold-bright);
  margin-top: 1rem;
  text-shadow: 0 0 12px rgba(255, 216, 107, 0.5);
}
.aegis-sub {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: var(--gold);
  opacity: 0.6;
  margin-top: 0.4rem;
}

/* === Truths === */
.truths-head { margin-bottom: 1.5rem; }
.truths-eyebrow { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--plague); margin-bottom: 0.6rem; }
.truths-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  margin-bottom: 0.5rem;
}
.truths-sub { color: var(--ash); font-style: italic; }

.truths-scroll {
  height: 520px;
  overflow-y: scroll;
  padding: 1rem 1.5rem 1rem 0.5rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.4), rgba(7, 6, 10, 0.85));
  border: 1px solid rgba(212, 166, 74, 0.3);
  position: relative;
  scroll-behavior: smooth;
}
.truths-scroll::before, .truths-scroll::after {
  content: '';
  position: sticky;
  display: block;
  left: 0; right: 0;
  height: 24px;
  z-index: 1;
  pointer-events: none;
}
.truths-scroll::before {
  top: 0;
  background: linear-gradient(180deg, rgba(7, 6, 10, 0.95), transparent);
  margin-top: -1rem;
}
.truths-scroll::after {
  bottom: 0;
  background: linear-gradient(0deg, rgba(7, 6, 10, 0.95), transparent);
  margin-bottom: -1rem;
}

.truth {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.2rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px dashed rgba(212, 166, 74, 0.15);
  opacity: 0.15;
  transform: translateX(-12px);
  transition: all 0.5s ease;
}
.truth:last-child { border-bottom: none; }
.truth.visible { opacity: 1; transform: translateX(0); }

.truth-num {
  font-size: 1.6rem;
  color: var(--gold);
  text-shadow: 0 0 8px rgba(212, 166, 74, 0.4);
  min-width: 50px;
}

.truth-content p {
  font-family: var(--f-body);
  font-size: 1.1rem;
  color: var(--bone);
  line-height: 1.5;
}

.truth:last-child .truth-content p {
  font-size: 1.25rem;
  font-style: italic;
  color: var(--gold-bright);
  text-shadow: 0 0 8px rgba(255, 216, 107, 0.3);
}

.truth-deco {
  font-size: 1.2rem;
  color: var(--gold);
  opacity: 0.4;
}

.scroll-hint {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: var(--ash);
}
</style>
