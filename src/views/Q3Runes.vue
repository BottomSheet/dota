<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="3" tone="gold"
        title="ЛОВЛЯ РУН"
        subtitle="00:00 на таймере. Bounty rune появилась. Успей кликнуть до того, как мид-лейнер уйдёт за ней."
      />

      <div class="rune-arena">
        <!-- Top stats -->
        <div class="rune-stats">
          <div class="stat">
            <div class="stat-k t-mono">RUNES CAUGHT</div>
            <div class="stat-v t-rune t-glow-gold">{{ caught }} / {{ target }}</div>
          </div>
          <div class="stat">
            <div class="stat-k t-mono">GOLD</div>
            <div class="stat-v t-rune">{{ gold }}</div>
          </div>
          <div class="stat">
            <div class="stat-k t-mono">MISSES</div>
            <div class="stat-v t-rune" :class="{ danger: misses >= maxMisses - 1 }">{{ misses }} / {{ maxMisses }}</div>
          </div>
          <div class="stat">
            <div class="stat-k t-mono">TIMER</div>
            <div class="stat-v t-rune">{{ formatTime(timer) }}</div>
          </div>
        </div>

        <!-- Game field -->
        <div class="field" ref="fieldRef">
          <!-- River decoration -->
          <div class="river-deco"></div>

          <!-- Spawning runes -->
          <transition-group name="rune" tag="div">
            <button v-for="r in runes" :key="r.id" class="rune-pop"
                    :class="`rune-${r.type}`"
                    :style="{ left: r.x + 'px', top: r.y + 'px' }"
                    @click="catchRune(r)">
              <span class="rune-icon">{{ r.icon }}</span>
              <span class="rune-label t-mono">{{ r.name }}</span>
            </button>
          </transition-group>

          <!-- Status overlay -->
          <div v-if="!started && !won && !lost" class="overlay-card">
            <div class="overlay-eyebrow t-mono">// 0:00 — RUNE_SPAWN_INITIATED</div>
            <h3 class="overlay-title t-rune t-glow-gold">ПОЙМАЙ {{ target }} РУН</h3>
            <p>Bounty, Double Damage, Haste, Regen, Arcane.<br>
            Промахнёшься {{ maxMisses }} раз — мид заберёт всё. Вперёд.</p>
            <button class="btn-cast" @click="start">
              <span class="btn-icon">⚡</span><span>СТАРТ</span>
            </button>
          </div>

          <transition name="route-fade">
            <div v-if="lost" class="overlay-card overlay-lose">
              <div class="overlay-eyebrow t-mono">// MID_TOOK_THE_RUNE</div>
              <h3 class="overlay-title t-rune" style="color: var(--blood);">МИД ЗАБРАЛ</h3>
              <p>Не страшно. У Михаила быстрая реакция — попробуй ещё.</p>
              <button class="btn-cast" @click="restart">RETRY</button>
            </div>
          </transition>
        </div>

        <!-- Rune legend -->
        <div class="rune-legend">
          <div v-for="r in runeTypes" :key="r.type" class="legend-row">
            <span class="legend-icon" :class="`rune-${r.type}`">{{ r.icon }}</span>
            <span class="legend-name t-rune">{{ r.name }}</span>
            <span class="legend-val t-mono">+{{ r.gold }} G</span>
          </div>
        </div>
      </div>
    </div>

    <QuestComplete
      :show="won"
      reward="+ FAST FINGERS · 480 XP · GOLD ×3"
      message="Все руны — твои. Михаил умеет читать тайминги. Дальше — некрополис."
      next="/quest/4-necropolis"
      next-label="К НЕКРОПОЛИСУ →"
    />
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const target = 7
const maxMisses = 3
const caught = ref(0)
const misses = ref(0)
const gold = ref(0)
const timer = ref(0)
const started = ref(false)
const won = ref(false)
const lost = ref(false)
const runes = ref([])
const fieldRef = ref(null)

let runeId = 0
let spawnInterval = null
let timerInterval = null

const runeTypes = [
  { type: 'bounty', icon: '◉', name: 'BOUNTY', gold: 50 },
  { type: 'dd', icon: '⚔', name: 'DOUBLE DAMAGE', gold: 80 },
  { type: 'haste', icon: '➤', name: 'HASTE', gold: 70 },
  { type: 'regen', icon: '✚', name: 'REGEN', gold: 60 },
  { type: 'arcane', icon: '✦', name: 'ARCANE', gold: 75 }
]

function start() {
  started.value = true
  caught.value = 0
  misses.value = 0
  gold.value = 0
  timer.value = 0
  runes.value = []
  spawnInterval = setInterval(spawn, 1100)
  timerInterval = setInterval(() => timer.value++, 100)
  spawn() // first one immediately
}

function restart() {
  clearAll()
  lost.value = false
  start()
}

function clearAll() {
  clearInterval(spawnInterval)
  clearInterval(timerInterval)
  runes.value = []
}

function spawn() {
  if (!fieldRef.value || won.value || lost.value) return
  const rect = fieldRef.value.getBoundingClientRect()
  const type = runeTypes[Math.floor(Math.random() * runeTypes.length)]
  const r = {
    id: ++runeId,
    type: type.type,
    icon: type.icon,
    name: type.name,
    gold: type.gold,
    x: 30 + Math.random() * (rect.width - 130),
    y: 30 + Math.random() * (rect.height - 110),
    timeoutId: null
  }
  runes.value.push(r)
  // Despawns
  r.timeoutId = setTimeout(() => missRune(r), 1500)
}

function missRune(r) {
  const idx = runes.value.findIndex(x => x.id === r.id)
  if (idx === -1) return
  runes.value.splice(idx, 1)
  misses.value++
  if (misses.value >= maxMisses) {
    lost.value = true
    started.value = false
    clearAll()
  }
}

function catchRune(r) {
  clearTimeout(r.timeoutId)
  const idx = runes.value.findIndex(x => x.id === r.id)
  if (idx === -1) return
  runes.value.splice(idx, 1)
  caught.value++
  gold.value += r.gold
  if (caught.value >= target) {
    won.value = true
    started.value = false
    clearAll()
    quest.complete('runes')
    quest.unlock('rune_master')
  }
}

function formatTime(t) {
  const s = Math.floor(t / 10)
  const ms = t % 10
  return `${String(s).padStart(2, '0')}:${ms}0`
}

onBeforeUnmount(clearAll)
</script>

<style scoped>
.rune-arena {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1.5rem;
}

.rune-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.6), rgba(13, 10, 20, 0.85));
  border: 1px solid rgba(212, 166, 74, 0.25);
}
.stat { text-align: center; }
.stat-k { font-size: 0.65rem; letter-spacing: 0.25em; color: var(--ash); margin-bottom: 0.3rem; }
.stat-v { font-size: 1.4rem; color: var(--paper); }
.stat-v.danger { color: var(--blood); animation: pulse-glow 0.6s ease-in-out infinite; }

@media (max-width: 600px) {
  .rune-stats { grid-template-columns: repeat(2, 1fr); }
}

.field {
  position: relative;
  height: 480px;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(63, 168, 107, 0.05), transparent 70%),
    linear-gradient(180deg, rgba(13, 10, 20, 0.95), rgba(7, 6, 10, 0.98));
  border: 1px solid rgba(212, 166, 74, 0.2);
  overflow: hidden;
}

.river-deco {
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  height: 80px;
  transform: translateY(-50%);
  background:
    repeating-linear-gradient(45deg,
      transparent 0 12px,
      rgba(58, 166, 255, 0.04) 12px 14px),
    linear-gradient(180deg, transparent, rgba(63, 168, 107, 0.06), transparent);
}

.rune-pop {
  position: absolute;
  width: 70px; height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  border: 2px solid currentColor;
  background: radial-gradient(circle, rgba(13, 10, 20, 0.9), rgba(7, 6, 10, 0.95));
  cursor: pointer;
  filter: drop-shadow(0 0 12px currentColor);
  transition: transform 0.15s;
  font-family: var(--f-impact);
}
.rune-pop::before {
  content: '';
  position: absolute;
  inset: -8px;
  border: 1px dashed currentColor;
  border-radius: 50%;
  opacity: 0.4;
  animation: spin-slow 3s linear infinite;
}
.rune-pop:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 24px currentColor);
}
.rune-pop:active { transform: scale(0.95); }

.rune-icon { font-size: 1.6rem; }
.rune-label { font-size: 0.5rem; letter-spacing: 0.1em; opacity: 0.8; }

.rune-bounty { color: var(--gold-bright); }
.rune-dd { color: var(--blood); }
.rune-haste { color: var(--exort-bright); }
.rune-regen { color: var(--plague-bright); }
.rune-arcane { color: var(--wex-violet); }

.rune-enter-active { animation: rune-spawn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.rune-leave-active { animation: rune-vanish 0.3s ease; }
@keyframes rune-spawn {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes rune-vanish {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.5); }
}

.overlay-card {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  width: min(440px, 90%);
  padding: 2rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(13, 10, 20, 0.97), rgba(7, 6, 10, 0.99));
  border: 1px solid var(--gold);
  z-index: 10;
}
.overlay-card.overlay-lose { border-color: var(--blood); }
.overlay-eyebrow { font-size: 0.7rem; color: var(--plague); letter-spacing: 0.25em; margin-bottom: 0.6rem; }
.overlay-title { font-size: 1.6rem; margin-bottom: 1rem; }
.overlay-card p { color: var(--bone); margin-bottom: 1.5rem; line-height: 1.6; }

.rune-legend {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0.8rem;
  border-top: 1px solid rgba(212, 166, 74, 0.15);
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.7rem;
  font-size: 0.75rem;
}
.legend-icon { font-size: 1rem; filter: drop-shadow(0 0 6px currentColor); }
.legend-name { letter-spacing: 0.15em; color: var(--bone); }
.legend-val { color: var(--gold); }
</style>
