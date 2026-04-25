<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="6" tone="blood"
        title="ТИМФАЙТ НА МИДУ"
        subtitle="5v5. Высокий грунт. Михаил инициирует. Прокликай комбу в правильном порядке."
      />

      <div class="tf-stage">
        <!-- Battlefield -->
        <div class="battlefield" :class="{ chaos: phase === 'fighting', ulti: phase === 'ulti' }">
          <!-- Allies -->
          <div class="team team-radiant">
            <div v-for="h in radiant" :key="h.name" class="hero" :class="`tone-${h.tone}`">
              <div class="hero-avatar">{{ h.icon }}</div>
              <div class="hero-name t-mono">{{ h.name }}</div>
              <div class="hp-bar"><div class="hp-fill" :style="{ width: h.hp + '%' }"></div></div>
            </div>
          </div>

          <div class="vs-glyph">VS</div>

          <!-- Enemies -->
          <div class="team team-dire">
            <div v-for="h in dire" :key="h.name" class="hero enemy" :class="`tone-${h.tone}`">
              <div class="hero-avatar">{{ h.icon }}</div>
              <div class="hero-name t-mono">{{ h.name }}</div>
              <div class="hp-bar"><div class="hp-fill" :style="{ width: h.hp + '%' }"></div></div>
            </div>
          </div>

          <!-- Effect particles -->
          <div v-if="phase === 'fighting'" class="fx-layer">
            <span v-for="n in 30" :key="n" class="fx" :style="fxStyle(n)"></span>
          </div>

          <!-- Phase banners -->
          <transition name="phase">
            <div v-if="phase === 'idle'" class="phase-banner idle">
              <div class="t-mono banner-eyebrow">// PRE-FIGHT</div>
              <div class="t-rune banner-text">КОМАНДА ГОТОВА</div>
              <button class="btn-cast" @click="startFight">
                <span class="btn-icon">⚔</span><span>INITIATE</span>
              </button>
            </div>
            <div v-else-if="phase === 'won'" class="phase-banner won">
              <div class="t-mono banner-eyebrow">// TEAMFIGHT_WON</div>
              <div class="t-rune banner-text" style="color: var(--gold-bright);">ACE</div>
              <p>5/0. Михаил всех закрыл.</p>
            </div>
            <div v-else-if="phase === 'lost'" class="phase-banner lost">
              <div class="t-mono banner-eyebrow">// WIPED</div>
              <div class="t-rune banner-text" style="color: var(--blood);">RETRY</div>
              <p>Тимфайт слит. Не страшно.</p>
              <button class="btn-cast btn-plague" @click="reset">⟲ ПЕРЕЗАХОД</button>
            </div>
          </transition>
        </div>

        <!-- Combo prompt -->
        <div v-if="phase === 'fighting'" class="combo-area">
          <div class="combo-eyebrow t-mono">ПРОКЛИКАЙ КОМБО · ПО ПОРЯДКУ</div>
          <div class="combo-prompts">
            <button v-for="(step, i) in combo" :key="i"
                    class="combo-key"
                    :class="{
                      done: i < step_,
                      current: i === step_,
                      pending: i > step_
                    }"
                    @click="press(step.key)"
                    :disabled="i !== step_ || locked">
              <div class="combo-icon">{{ step.icon }}</div>
              <div class="combo-name">{{ step.name }}</div>
              <div class="combo-key-label t-mono">[{{ step.key.toUpperCase() }}]</div>
            </button>
          </div>
          <div class="combo-timer">
            <div class="combo-timer-fill" :style="{ width: comboTimer + '%' }"></div>
          </div>
          <div class="combo-hint t-mono">время до контр-инициации: {{ Math.ceil(comboTimer / 10) }}s</div>
        </div>

        <!-- Final dialog -->
        <div v-if="phase === 'won'" class="combo-finale frame-scepter">
          <p>«Reaper's Scythe» хлопнула в грунт. Враги испаряются.<br>
          В чате <span class="t-glow-plague">«gg»</span>. На таймере 21:00. Aegis ждёт.</p>
        </div>
      </div>
    </div>

    <QuestComplete
      :show="phase === 'won'"
      reward="+ TEAM ACE · 850 XP"
      message="Михаил инициировал, протанковал и закрыл фарм. Идеальная комба. Эгис — следующая остановка."
      next="/quest/7-aegis"
      next-label="К ЭГИСУ →"
    />
  </div>
</template>

<script setup>
import { ref, inject, onBeforeUnmount } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const phase = ref('idle') // idle | fighting | won | lost | ulti
const step_ = ref(0)
const locked = ref(false)
const comboTimer = ref(100)

const combo = [
  { key: 'q', icon: '☠', name: 'Death Pulse' },
  { key: 'w', icon: '☣', name: 'Ghost Shroud' },
  { key: 'e', icon: '🜏', name: 'Scythe' },
  { key: 'r', icon: '🜍', name: "Reaper's" },
  { key: 'd', icon: '⚛', name: 'Refresh' },
  { key: 'r', icon: '🜍', name: 'DOUBLE Reaper' }
]

const radiant = ref([
  { name: 'NECROPHOS · М.', icon: '☠', hp: 100, tone: 'plague' },
  { name: 'INVOKER', icon: '🔥', hp: 100, tone: 'ember' },
  { name: 'CRYSTAL M.', icon: '❄', hp: 100, tone: 'blue' },
  { name: 'LION', icon: '✋', hp: 100, tone: 'violet' },
  { name: 'JUGGERNAUT', icon: '⚔', hp: 100, tone: 'gold' }
])

const dire = ref([
  { name: 'PUDGE', icon: '🪝', hp: 100, tone: 'rot' },
  { name: 'SHADOW F.', icon: '👹', hp: 100, tone: 'blood' },
  { name: 'PHANTOM A.', icon: '🗡', hp: 100, tone: 'violet' },
  { name: 'ANTI-MAGE', icon: '⚡', hp: 100, tone: 'blue' },
  { name: 'WINTER WYV.', icon: '❄', hp: 100, tone: 'blue' }
])

let timerInterval = null

function startFight() {
  phase.value = 'fighting'
  step_.value = 0
  locked.value = false
  comboTimer.value = 100
  timerInterval = setInterval(() => {
    comboTimer.value -= 1
    // Random damage to allies
    if (Math.random() < 0.18) {
      const ally = radiant.value[Math.floor(Math.random() * radiant.value.length)]
      ally.hp = Math.max(5, ally.hp - 3)
    }
    if (comboTimer.value <= 0) lose()
  }, 200)
}

function press(key) {
  if (locked.value || phase.value !== 'fighting') return
  if (combo[step_.value].key !== key) return
  step_.value++

  // Damage enemies
  dire.value.forEach(d => {
    d.hp = Math.max(0, d.hp - 18 - Math.random() * 8)
  })

  if (step_.value >= combo.length) {
    win()
  }
}

function win() {
  locked.value = true
  clearInterval(timerInterval)
  // Death animation: kill all enemies
  dire.value.forEach(d => d.hp = 0)
  setTimeout(() => {
    phase.value = 'won'
    quest.complete('teamfight')
    quest.unlock('ace_combo')
  }, 800)
}

function lose() {
  clearInterval(timerInterval)
  locked.value = true
  phase.value = 'lost'
}

function reset() {
  radiant.value.forEach(h => h.hp = 100)
  dire.value.forEach(h => h.hp = 100)
  phase.value = 'idle'
  step_.value = 0
}

function fxStyle(n) {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    background: ['#ff7a1a', '#6dffa8', '#ffd86b', '#a76dff'][n % 4],
    animationDelay: (n * 0.07) + 's'
  }
}

function onKey(e) {
  press(e.key.toLowerCase())
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKey)
}

onBeforeUnmount(() => {
  clearInterval(timerInterval)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.tf-stage {
  display: grid;
  gap: 2rem;
}

.battlefield {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  min-height: 360px;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(193, 26, 58, 0.08), transparent 70%),
    repeating-linear-gradient(45deg, transparent 0 20px, rgba(212, 166, 74, 0.02) 20px 21px),
    linear-gradient(180deg, rgba(13, 10, 20, 0.95), rgba(7, 6, 10, 0.98));
  border: 1px solid rgba(193, 26, 58, 0.3);
  overflow: hidden;
  transition: all 0.3s;
}

.battlefield.chaos {
  background:
    radial-gradient(ellipse at 50% 50%, rgba(193, 26, 58, 0.2), transparent 60%),
    linear-gradient(180deg, rgba(13, 10, 20, 0.95), rgba(7, 6, 10, 0.98));
  animation: shake 0.4s ease-in-out infinite;
}

.team { display: flex; flex-direction: column; gap: 0.6rem; }
.team-dire { align-items: flex-end; }

.hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem;
  align-items: center;
  padding: 0.5rem 0.8rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.7), rgba(13, 10, 20, 0.9));
  border: 1px solid rgba(212, 166, 74, 0.3);
  min-width: 180px;
  transition: all 0.3s;
}
.hero.enemy { border-color: rgba(193, 26, 58, 0.4); }
.hero.tone-plague { border-color: var(--plague); box-shadow: 0 0 12px rgba(63, 168, 107, 0.2); }

.hero-avatar {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  background: var(--void-1);
  border: 1px solid currentColor;
  filter: drop-shadow(0 0 6px currentColor);
}
.hero-name {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  color: var(--bone);
  margin-bottom: 0.2rem;
  grid-column: 2;
  grid-row: 1;
}
.hp-bar {
  grid-column: 2; grid-row: 2;
  height: 6px;
  background: var(--void-2);
  border: 1px solid rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
}
.hp-fill {
  height: 100%;
  background: linear-gradient(180deg, #6dffa8, #1a5c3a);
  transition: width 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.enemy .hp-fill { background: linear-gradient(180deg, #c11a3a, #5a0a18); }

.vs-glyph {
  font-family: var(--f-display);
  font-weight: 900;
  font-size: 2rem;
  color: var(--blood);
  letter-spacing: 0.1em;
  text-shadow: 0 0 16px var(--blood);
  align-self: center;
}

.fx-layer {
  position: absolute; inset: 0;
  pointer-events: none;
}
.fx {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  opacity: 0;
  animation: fx-burst 1.4s ease-out infinite;
}
@keyframes fx-burst {
  0% { opacity: 0; transform: scale(0); }
  20% { opacity: 1; transform: scale(2); }
  100% { opacity: 0; transform: scale(0.5) translate(20px, -40px); }
}

.phase-banner {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: linear-gradient(180deg, rgba(13, 10, 20, 0.97), rgba(7, 6, 10, 0.99));
  border: 1px solid var(--gold);
  padding: 1.6rem 2rem;
  z-index: 5;
  width: min(420px, 90%);
}
.phase-banner.lost { border-color: var(--blood); }
.phase-banner.won { border-color: var(--gold-bright); box-shadow: 0 0 60px rgba(255, 216, 107, 0.3); }

.banner-eyebrow { font-size: 0.7rem; color: var(--ash); letter-spacing: 0.3em; margin-bottom: 0.5rem; }
.banner-text { font-size: 2rem; margin-bottom: 0.8rem; }
.phase-banner p { color: var(--bone); font-size: 1rem; margin-bottom: 1rem; }

.phase-enter-active, .phase-leave-active { transition: all 0.3s ease; }
.phase-enter-from, .phase-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }

/* === Combo === */
.combo-area {
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(193, 26, 58, 0.08), rgba(13, 10, 20, 0.9));
  border: 1px solid rgba(193, 26, 58, 0.4);
}
.combo-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--blood);
  text-align: center;
  margin-bottom: 1rem;
}

.combo-prompts {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.combo-key {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.8rem 1rem;
  min-width: 90px;
  background: linear-gradient(180deg, rgba(13, 10, 20, 0.8), rgba(7, 6, 10, 0.95));
  border: 2px solid rgba(212, 166, 74, 0.3);
  transition: all 0.2s;
}
.combo-key.done {
  border-color: var(--plague-bright);
  background: linear-gradient(180deg, rgba(63, 168, 107, 0.18), rgba(13, 40, 24, 0.85));
  box-shadow: 0 0 12px rgba(63, 168, 107, 0.25);
}
.combo-key.current {
  border-color: var(--exort-bright);
  background: linear-gradient(180deg, rgba(255, 122, 26, 0.2), rgba(13, 10, 20, 0.95));
  box-shadow: 0 0 24px rgba(255, 122, 26, 0.4);
  animation: pulse-glow 1s ease-in-out infinite;
  cursor: pointer;
}
.combo-key.current:hover { transform: translateY(-3px); }
.combo-key.pending { opacity: 0.4; }

.combo-icon { font-size: 1.6rem; }
.combo-name {
  font-family: var(--f-display);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--bone);
}
.combo-key-label { font-size: 0.6rem; color: var(--gold); letter-spacing: 0.15em; }

.combo-timer {
  height: 6px;
  background: var(--void-1);
  border: 1px solid rgba(193, 26, 58, 0.4);
  margin-top: 0.6rem;
  overflow: hidden;
}
.combo-timer-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--plague), var(--gold), var(--blood));
  transition: width 0.2s linear;
}

.combo-hint {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.65rem;
  color: var(--ash);
  letter-spacing: 0.2em;
}

.combo-finale {
  padding: 1.5rem 2rem;
  text-align: center;
}
.combo-finale p { font-size: 1.1rem; color: var(--bone); line-height: 1.6; }
</style>
