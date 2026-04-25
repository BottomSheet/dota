<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="8" tone="blood"
        title="ПУШ ТРОНА"
        subtitle="Высокий грунт зачищен. Ancient мерцает. Удар за ударом — добей."
      />

      <div class="ancient-stage">
        <!-- Ancient throne -->
        <div class="throne-area">
          <div class="throne-bg"></div>

          <div class="ancient" :class="{ low: ancientHp < 50, dying: ancientHp < 20, dead: ancientHp <= 0 }">
            <svg viewBox="0 0 280 360" width="240" height="308">
              <defs>
                <radialGradient id="anc-core" cx="50%" cy="40%">
                  <stop offset="0%" stop-color="#fff5d6"/>
                  <stop offset="40%" stop-color="#ffd86b"/>
                  <stop offset="100%" stop-color="#c11a3a"/>
                </radialGradient>
                <linearGradient id="anc-base" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#3a2840"/>
                  <stop offset="100%" stop-color="#0d0a14"/>
                </linearGradient>
              </defs>

              <!-- Base / pyramid -->
              <path d="M40 340 L 240 340 L 200 270 L 80 270 Z" fill="url(#anc-base)" stroke="#6b4a13" stroke-width="2"/>
              <path d="M80 270 L 200 270 L 180 230 L 100 230 Z" fill="url(#anc-base)" stroke="#6b4a13" stroke-width="2"/>
              <path d="M100 230 L 180 230 L 165 195 L 115 195 Z" fill="url(#anc-base)" stroke="#6b4a13" stroke-width="2"/>

              <!-- Tower / spike -->
              <path d="M120 195 L 160 195 L 145 100 L 135 100 Z" fill="url(#anc-base)" stroke="#6b4a13" stroke-width="2"/>

              <!-- Glowing core / heart -->
              <ellipse cx="140" cy="80" rx="35" ry="50" fill="url(#anc-core)" class="core-pulse"/>
              <circle cx="140" cy="80" r="20" fill="#fff5d6" opacity="0.8"/>
              <circle cx="140" cy="80" r="10" fill="#fff" class="core-bright"/>

              <!-- Side spikes / decorative -->
              <path d="M70 270 L 50 240 L 40 270 Z" fill="#5a0a18" stroke="#6b4a13"/>
              <path d="M210 270 L 230 240 L 240 270 Z" fill="#5a0a18" stroke="#6b4a13"/>

              <!-- Cracks (when low HP) -->
              <g v-if="ancientHp < 50" class="cracks">
                <line x1="140" y1="100" x2="125" y2="180" stroke="#ff7a1a" stroke-width="2"/>
                <line x1="140" y1="100" x2="155" y2="190" stroke="#ff7a1a" stroke-width="1.5"/>
                <line x1="130" y1="220" x2="120" y2="260" stroke="#c11a3a" stroke-width="1.5"/>
                <line x1="160" y1="220" x2="170" y2="265" stroke="#c11a3a" stroke-width="1"/>
              </g>

              <!-- Death effect rays -->
              <g v-if="ancientHp <= 0" class="death-rays">
                <circle cx="140" cy="80" r="80" fill="#ffd86b" opacity="0.4"/>
                <circle cx="140" cy="80" r="120" fill="#ff7a1a" opacity="0.2"/>
              </g>
            </svg>

            <!-- HP bar -->
            <div class="ancient-hp">
              <div class="ancient-hp-fill" :style="{ width: ancientHp + '%' }"></div>
              <span class="ancient-hp-text t-impact">ANCIENT · {{ Math.max(0, Math.round(ancientHp)) }}%</span>
            </div>
          </div>

          <!-- Damage popups -->
          <div class="dmg-layer">
            <transition-group name="dmg-fade">
              <div v-for="d in dmgPops" :key="d.id" class="dmg-pop"
                   :style="{ left: d.x + '%', top: d.y + '%', color: d.color, fontSize: d.size }">
                {{ d.value }}
              </div>
            </transition-group>
          </div>

          <!-- Status overlays -->
          <transition name="route-fade">
            <div v-if="ancientHp <= 0" class="victory-banner">
              <div class="victory-text t-rune">ANCIENT FALLEN</div>
              <div class="victory-sub t-mono">// VICTORY · MIKHAIL · 21</div>
            </div>
          </transition>
        </div>

        <!-- Action panel -->
        <div class="action-panel">
          <div class="action-eyebrow t-mono">// COMBAT_LOG</div>
          <div class="combat-log" ref="logEl">
            <div v-for="(line, i) in log" :key="i" class="log-line"
                 :class="`log-${line.type}`">
              <span class="log-time t-mono">{{ line.time }}</span>
              <span class="log-text">{{ line.text }}</span>
            </div>
          </div>

          <div class="abilities-grid">
            <button v-for="ab in abilities" :key="ab.key"
                    class="ab-btn"
                    :class="{ cooldown: ab.cd > 0 }"
                    @click="useAbility(ab)"
                    :disabled="ab.cd > 0 || ancientHp <= 0">
              <div class="ab-icon" :style="{ background: ab.color }">{{ ab.icon }}</div>
              <div class="ab-meta">
                <div class="ab-name t-rune">{{ ab.name }}</div>
                <div class="ab-stat t-mono">DMG {{ ab.dmg }} · CD {{ ab.cdMax }}s</div>
              </div>
              <div v-if="ab.cd > 0" class="ab-cd-overlay">{{ ab.cd }}s</div>
              <div class="ab-key t-mono">[{{ ab.key.toUpperCase() }}]</div>
            </button>
          </div>

          <div class="bash-bar">
            <button class="btn-cast btn-bash" @click="bash" :disabled="ancientHp <= 0">
              <span class="btn-icon">⚔</span>
              <span>BASIC ATTACK [SPACE]</span>
              <span class="btn-shortcut">+{{ baseAttack }} dmg</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <QuestComplete
      :show="ancientHp <= 0"
      reward="+ ANCIENT KILL · 1500 XP · GG WP"
      message="Радиант побеждает. Дайр сдаётся. На таймере 21:00. Михаил легендарен."
      next="/finale"
      next-label="К ПОЗДРАВЛЕНИЮ →"
    />
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, onBeforeUnmount, nextTick } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const ancientHp = ref(100)
const dmgPops = ref([])
const log = ref([
  { time: '21:00', text: 'Михаил вышел на high ground.', type: 'info' },
  { time: '21:01', text: 'Радиант начинает финальный пуш.', type: 'info' }
])
const baseAttack = 4
let dmgId = 0
let logId = 0
const logEl = ref(null)

const abilities = reactive([
  { key: 'q', name: 'Death Pulse', icon: '☠', color: 'linear-gradient(180deg, #3fa86b, #0d2818)', dmg: 12, cd: 0, cdMax: 3 },
  { key: 'w', name: 'Sun Strike', icon: '🔥', color: 'linear-gradient(180deg, #ffb04a, #c11a3a)', dmg: 18, cd: 0, cdMax: 6 },
  { key: 'e', name: 'Cold Snap', icon: '❄', color: 'linear-gradient(180deg, #aaccff, #2a4a6c)', dmg: 8, cd: 0, cdMax: 2 },
  { key: 'r', name: "Reaper's Scythe", icon: '🜍', color: 'linear-gradient(180deg, #ffd86b, #c11a3a)', dmg: 35, cd: 0, cdMax: 12 }
])

function pop(value, color = 'var(--exort-bright)', size = '1.4rem') {
  const id = ++dmgId
  dmgPops.value.push({
    id, value, color, size,
    x: 30 + Math.random() * 40,
    y: 25 + Math.random() * 25
  })
  setTimeout(() => {
    dmgPops.value = dmgPops.value.filter(d => d.id !== id)
  }, 1100)
}

function addLog(text, type = 'hit') {
  const t = `21:${String(2 + (logId++)).padStart(2, '0')}`
  log.value.push({ time: t, text, type })
  if (log.value.length > 8) log.value.shift()
  nextTick(() => {
    if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
  })
}

function damage(amount, label) {
  if (ancientHp.value <= 0) return
  const isCrit = Math.random() < 0.15
  const final = Math.round(amount * (isCrit ? 2 : 1))
  ancientHp.value = Math.max(0, ancientHp.value - final)
  pop(isCrit ? `${final} CRIT!` : `${final}`,
      isCrit ? 'var(--gold-bright)' : 'var(--exort-bright)',
      isCrit ? '2rem' : '1.4rem')
  addLog(`${label} → ${final}${isCrit ? ' (crit!)' : ''}`)
  if (ancientHp.value <= 0) {
    addLog('★ ANCIENT FALLEN — GG WP', 'win')
    quest.complete('ancient')
    quest.unlock('ancient_killed')
  }
}

function bash() {
  damage(baseAttack + Math.random() * 3, 'Basic Attack')
}

function useAbility(ab) {
  if (ab.cd > 0) return
  damage(ab.dmg + Math.random() * 4, ab.name)
  ab.cd = ab.cdMax
}

let cdTick = null
onMounted(() => {
  cdTick = setInterval(() => {
    abilities.forEach(a => { if (a.cd > 0) a.cd-- })
  }, 1000)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(cdTick)
  window.removeEventListener('keydown', onKey)
})

function onKey(e) {
  if (e.key === ' ') { e.preventDefault(); bash(); return }
  const ab = abilities.find(a => a.key === e.key.toLowerCase())
  if (ab) useAbility(ab)
}
</script>

<style scoped>
.ancient-stage {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

@media (max-width: 900px) {
  .ancient-stage { grid-template-columns: 1fr; }
}

/* === Throne === */
.throne-area {
  position: relative;
  min-height: 480px;
  background:
    radial-gradient(ellipse at center 70%, rgba(255, 122, 26, 0.15), transparent 60%),
    radial-gradient(ellipse at center 30%, rgba(193, 26, 58, 0.1), transparent 50%),
    linear-gradient(180deg, rgba(13, 10, 20, 0.95), rgba(7, 6, 10, 0.99));
  border: 1px solid rgba(193, 26, 58, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.throne-bg {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent 0 40px, rgba(212, 166, 74, 0.04) 40px 41px),
    repeating-linear-gradient(90deg, transparent 0 40px, rgba(212, 166, 74, 0.04) 40px 41px);
  opacity: 0.6;
  pointer-events: none;
}

.ancient {
  position: relative;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6));
  z-index: 2;
}
.ancient.low svg { animation: shake 0.3s ease-in-out infinite; }
.ancient.dying svg { animation: shake 0.15s ease-in-out infinite; filter: drop-shadow(0 0 24px var(--blood)); }
.ancient.dead svg { animation: ancient-fall 1.5s ease-out forwards; }

@keyframes ancient-fall {
  0% { transform: scale(1) rotate(0); }
  20% { transform: scale(1.15) rotate(-3deg); filter: brightness(2); }
  40% { transform: scale(1.3) rotate(2deg); filter: brightness(3); }
  100% { transform: scale(0.5) rotate(20deg); opacity: 0.2; filter: brightness(0.3); }
}

.core-pulse { animation: pulse-glow 1.4s ease-in-out infinite; transform-origin: center; }
.core-bright { animation: pulse-glow 0.8s ease-in-out infinite; transform-origin: center; }

.ancient-hp {
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 18px;
  background: var(--void-1);
  border: 1px solid rgba(212, 166, 74, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.ancient-hp-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--gold-bright), var(--exort-orange) 50%, var(--blood) 100%);
  transition: width 0.3s ease;
  width: 100%;
  transform-origin: left;
}
.ancient-hp-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: xp-shine 1.5s linear infinite;
}
.ancient-hp-text {
  position: relative;
  z-index: 1;
  font-size: 0.8rem;
  color: var(--paper);
  text-shadow: 0 0 4px black, 0 1px 0 black;
  letter-spacing: 0.15em;
}

.dmg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dmg-pop {
  position: absolute;
  font-family: var(--f-impact);
  font-weight: 900;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.8), 0 0 12px currentColor;
  animation: dmg-rise 1.1s ease-out forwards;
  pointer-events: none;
}
@keyframes dmg-rise {
  0% { opacity: 0; transform: translateY(20px) scale(0.6); }
  20% { opacity: 1; transform: translateY(0) scale(1.15); }
  100% { opacity: 0; transform: translateY(-80px) scale(0.85); }
}

.victory-banner {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}
.victory-text {
  font-family: var(--f-display);
  font-size: 3rem;
  letter-spacing: 0.15em;
  color: var(--gold-bright);
  text-shadow: 0 0 24px var(--gold-bright), 0 0 60px var(--exort-orange);
  margin-bottom: 0.5rem;
  animation: victory-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes victory-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
.victory-sub {
  font-size: 0.8rem;
  letter-spacing: 0.4em;
  color: var(--gold);
}

/* === Action panel === */
.action-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.2rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.65), rgba(7, 6, 10, 0.92));
  border: 1px solid rgba(212, 166, 74, 0.25);
}

.action-eyebrow { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--plague); }

.combat-log {
  height: 140px;
  overflow-y: auto;
  padding: 0.8rem;
  background: rgba(7, 6, 10, 0.7);
  border: 1px solid rgba(212, 166, 74, 0.15);
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.log-line {
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
  animation: float-up 0.3s ease;
}
.log-time { font-size: 0.65rem; color: var(--ash); opacity: 0.6; min-width: 40px; }
.log-text { color: var(--bone); flex: 1; }
.log-line.log-info .log-text { color: var(--ash); font-style: italic; }
.log-line.log-win .log-text { color: var(--gold-bright); font-weight: 700; text-shadow: 0 0 8px rgba(255, 216, 107, 0.5); }

.abilities-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.ab-btn {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem;
  padding: 0.6rem;
  background: linear-gradient(180deg, rgba(13, 10, 20, 0.8), rgba(7, 6, 10, 0.95));
  border: 1px solid rgba(212, 166, 74, 0.3);
  text-align: left;
  transition: all 0.2s;
}
.ab-btn:hover:not(:disabled) {
  border-color: var(--exort-orange);
  background: linear-gradient(180deg, rgba(255, 122, 26, 0.1), rgba(13, 10, 20, 0.9));
}
.ab-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ab-btn.cooldown { opacity: 0.4; }

.ab-icon {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  border: 1px solid var(--gold);
}
.ab-name { font-size: 0.7rem; letter-spacing: 0.1em; color: var(--paper); }
.ab-stat { font-size: 0.6rem; color: var(--ash); letter-spacing: 0.1em; margin-top: 0.2rem; }

.ab-cd-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-impact);
  font-size: 1.4rem;
  color: var(--gold-bright);
  background: rgba(0, 0, 0, 0.7);
  text-shadow: 0 0 8px black;
}

.ab-key {
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 0.55rem;
  color: var(--gold);
  letter-spacing: 0.15em;
  opacity: 0.7;
}

.bash-bar { display: flex; }
.btn-bash {
  flex: 1;
  justify-content: center;
}
.btn-bash .btn-shortcut {
  margin-left: auto;
  color: var(--gold-bright);
  opacity: 0.9;
}
</style>
