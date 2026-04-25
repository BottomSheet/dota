<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="1" tone="gold"
        title="ПРОБУДИ РОШАНА"
        subtitle="Древний дремлет в Pit. Удар за ударом — он узнáет, кто пришёл."
      />

      <div class="lore-strip frame-plague anim-fade-in">
        <p>
          <span class="t-mono">// ROSHAN_PIT.log</span><br>
          В глубине реки спит зверь. Его шкура помнит сотни тимфайтов.
          Он откроется только тому, чьё имя ему знакомо.
          <strong class="t-glow-plague">Кликай Рошана пока он не проснётся.</strong>
          Каждый удар оставляет след.
        </p>
      </div>

      <div class="arena">
        <!-- Roshan -->
        <div class="rosh-stage">
          <div class="rosh-pit">
            <div class="pit-ring"></div>
            <div class="pit-ring inner"></div>
          </div>

          <div class="rosh-shadow" :style="{ transform: `scale(${1 - hits * 0.01})` }"></div>

          <button class="rosh"
                  @click="hit"
                  :class="{ shaking: shaking, awake: awake }"
                  :disabled="awake">
            <svg viewBox="0 0 240 280" width="220" height="240" class="rosh-svg">
              <defs>
                <radialGradient id="roshanBody" cx="50%" cy="40%">
                  <stop offset="0%" stop-color="#5a3a1a"/>
                  <stop offset="60%" stop-color="#2a1810"/>
                  <stop offset="100%" stop-color="#0d0810"/>
                </radialGradient>
                <radialGradient id="roshEye">
                  <stop offset="0%" stop-color="#fff"/>
                  <stop offset="40%" stop-color="#ffd86b"/>
                  <stop offset="100%" stop-color="#ff7a1a"/>
                </radialGradient>
                <linearGradient id="roshTusk" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#f3ead4"/>
                  <stop offset="100%" stop-color="#8a7a4a"/>
                </linearGradient>
              </defs>

              <!-- body / hunched shoulder -->
              <path d="M40 200 C 35 150, 60 90, 120 80 C 180 90, 205 150, 200 200 C 200 240, 170 260, 120 260 C 70 260, 40 240, 40 200 Z"
                    fill="url(#roshanBody)" stroke="#3a2810" stroke-width="2"/>

              <!-- spikes on back -->
              <path d="M70 105 L 78 75 L 82 105 Z" fill="#1a1008"/>
              <path d="M95 92 L 105 60 L 108 92 Z" fill="#1a1008"/>
              <path d="M125 85 L 138 50 L 140 85 Z" fill="#1a1008"/>
              <path d="M155 92 L 168 62 L 168 95 Z" fill="#1a1008"/>
              <path d="M180 110 L 192 85 L 188 115 Z" fill="#1a1008"/>

              <!-- head -->
              <ellipse cx="120" cy="140" rx="55" ry="48" fill="#3a240f" stroke="#1a0d04" stroke-width="2"/>

              <!-- horns -->
              <path d="M80 115 Q 60 80 75 60 Q 88 80 92 110" fill="#0d0810" stroke="#3a2810" stroke-width="1.5"/>
              <path d="M160 115 Q 180 80 165 60 Q 152 80 148 110" fill="#0d0810" stroke="#3a2810" stroke-width="1.5"/>

              <!-- eyes -->
              <ellipse cx="100" cy="138" rx="11" ry="8" fill="#000"/>
              <ellipse cx="140" cy="138" rx="11" ry="8" fill="#000"/>
              <circle cx="100" cy="138" r="4" fill="url(#roshEye)" :class="{ glow: hits > 0 }"/>
              <circle cx="140" cy="138" r="4" fill="url(#roshEye)" :class="{ glow: hits > 0 }"/>

              <!-- nose / snout -->
              <ellipse cx="120" cy="158" rx="12" ry="8" fill="#1a0d04"/>
              <ellipse cx="116" cy="156" rx="2" ry="2" fill="#000"/>
              <ellipse cx="124" cy="156" rx="2" ry="2" fill="#000"/>

              <!-- tusks -->
              <path d="M105 168 L 100 195 L 110 192 Z" fill="url(#roshTusk)" stroke="#3a2810"/>
              <path d="M135 168 L 140 195 L 130 192 Z" fill="url(#roshTusk)" stroke="#3a2810"/>

              <!-- arms / hands holding aegis -->
              <ellipse cx="55" cy="195" rx="18" ry="28" fill="#2a1810"/>
              <ellipse cx="185" cy="195" rx="18" ry="28" fill="#2a1810"/>

              <!-- chest scar -->
              <path d="M95 195 L 145 215 M 100 215 L 140 200" stroke="#5a0a18" stroke-width="2" opacity="0.5"/>

              <!-- aegis (after enough hits) -->
              <g v-if="awake" class="aegis-reveal">
                <ellipse cx="120" cy="225" rx="36" ry="14" fill="#d4a64a" stroke="#6b4a13" stroke-width="2"/>
                <text x="120" y="231" text-anchor="middle" font-family="serif" font-weight="900" font-size="14" fill="#0d0a14">AEGIS</text>
              </g>
            </svg>

            <!-- HP bar over rosh -->
            <div class="rosh-hp">
              <div class="rosh-hp-fill" :style="{ width: hpPercent + '%' }"></div>
              <span class="rosh-hp-text t-mono">{{ Math.max(0, maxHits - hits) }} / {{ maxHits }}</span>
            </div>
          </button>

          <!-- damage numbers -->
          <transition-group name="dmg" tag="div" class="dmg-layer">
            <div v-for="d in damages" :key="d.id" class="dmg" :style="d.style">
              {{ d.value }}
            </div>
          </transition-group>
        </div>

        <!-- Side panel -->
        <aside class="rosh-side">
          <div class="side-card frame-scepter">
            <div class="side-eyebrow t-mono">// ROSHAN.STATS</div>
            <div class="side-rows">
              <div class="row">
                <span class="t-mono key">HITS DEALT</span>
                <span class="val t-rune">{{ hits }}</span>
              </div>
              <div class="row">
                <span class="t-mono key">CRIT MULT</span>
                <span class="val t-rune">×{{ critMult }}</span>
              </div>
              <div class="row">
                <span class="t-mono key">SCREAMS</span>
                <span class="val t-rune">{{ screams }}</span>
              </div>
              <div class="row">
                <span class="t-mono key">STATUS</span>
                <span class="val t-rune" :class="awake ? 't-glow-plague' : ''">
                  {{ awake ? 'AWAKENED' : 'SLEEPING' }}
                </span>
              </div>
            </div>
          </div>

          <div class="rosh-quote frame-plague">
            <div v-for="(q, i) in visibleQuotes" :key="i" class="rosh-line">
              <span class="rosh-line-mark">›</span> {{ q }}
            </div>
          </div>
        </aside>
      </div>
    </div>

    <QuestComplete
      :show="awake"
      reward="+ AEGIS OF THE QUEST · 350 XP"
      message="Roshan склонил голову. Имя «Михаил» эхом катится по реке. Пора звать Invoker'а."
      next="/quest/2-invoker"
      next-label="К ИЗВОКЕРУ →"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const maxHits = 12
const hits = ref(0)
const damages = ref([])
const shaking = ref(false)
const screams = ref(0)
const dmgId = ref(0)

const awake = computed(() => hits.value >= maxHits)
const hpPercent = computed(() => Math.max(0, 100 - (hits.value / maxHits) * 100))
const critMult = computed(() => 1 + Math.floor(hits.value / 3))

const lines = [
  'rrrrr…',
  '… *шевелится*',
  'кто будит древнего?',
  'хм… знакомый запах…',
  'хелсбар тает',
  'ещё немного…',
  'я слышу твоё имя',
  'михаил?',
  'михаил.',
  'МИХАИЛ!!',
  'эгис — твой',
  '*склоняет голову*'
]
const visibleQuotes = computed(() => lines.slice(0, hits.value))

function hit() {
  if (awake.value) return
  hits.value++

  shaking.value = true
  setTimeout(() => (shaking.value = false), 200)

  // damage popup
  const isCrit = Math.random() < 0.18 + hits.value * 0.04
  const dmg = isCrit ? `${50 + Math.floor(Math.random() * 80)} CRIT!` : `${10 + Math.floor(Math.random() * 35)}`
  const id = ++dmgId.value
  damages.value.push({
    id,
    value: dmg,
    style: {
      left: 30 + Math.random() * 40 + '%',
      top: 30 + Math.random() * 30 + '%',
      color: isCrit ? 'var(--gold-bright)' : 'var(--exort-bright)',
      fontSize: isCrit ? '2rem' : '1.3rem'
    }
  })
  setTimeout(() => {
    damages.value = damages.value.filter(d => d.id !== id)
  }, 1000)

  if (Math.random() < 0.3) screams.value++

  if (awake.value) {
    quest.complete('roshan')
    quest.unlock('roshan_awakened')
  }
}
</script>

<style scoped>
.lore-strip {
  padding: 1rem 1.4rem;
  margin-bottom: 2.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.arena {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .arena { grid-template-columns: 1fr; }
}

/* === Roshan stage === */
.rosh-stage {
  position: relative;
  min-height: 480px;
  background:
    radial-gradient(ellipse at center 70%, rgba(0, 0, 0, 0.7), transparent 60%),
    radial-gradient(ellipse at center 40%, rgba(255, 122, 26, 0.1), transparent 50%);
  border: 1px solid rgba(212, 166, 74, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.rosh-pit {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 380px;
  height: 100px;
  pointer-events: none;
}
.pit-ring {
  position: absolute;
  inset: 0;
  border: 1px dashed var(--gold);
  border-radius: 50%;
  opacity: 0.3;
  animation: spin-slow 30s linear infinite;
}
.pit-ring.inner {
  inset: 30px;
  border-color: var(--exort-orange);
  animation: spin-slow 18s linear infinite reverse;
  opacity: 0.4;
}

.rosh-shadow {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.7), transparent);
  filter: blur(8px);
  pointer-events: none;
  transform-origin: center;
}

.rosh {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.6));
  z-index: 2;
}
.rosh:hover { transform: scale(1.02); }
.rosh:active { transform: scale(0.97); }
.rosh.shaking { animation: shake 0.2s; }
.rosh.awake { cursor: default; }
.rosh.awake .rosh-svg { filter: drop-shadow(0 0 24px var(--gold-bright)); }

.aegis-reveal {
  animation: aegis-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}
@keyframes aegis-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.rosh-svg circle.glow {
  filter: drop-shadow(0 0 6px var(--exort-bright));
  animation: pulse-glow 1.6s ease-in-out infinite;
}

.rosh-hp {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 14px;
  background: var(--void-1);
  border: 1px solid rgba(212, 166, 74, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.rosh-hp-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: linear-gradient(180deg, var(--blood) 0%, #5a0a18 100%);
  box-shadow: inset 0 1px 0 rgba(255, 100, 100, 0.5);
  transition: width 0.3s ease;
}
.rosh-hp-text {
  position: relative;
  z-index: 1;
  font-size: 0.65rem;
  color: var(--paper);
  text-shadow: 0 0 4px black;
  letter-spacing: 0.1em;
}

.dmg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dmg {
  position: absolute;
  font-family: var(--f-impact);
  font-weight: 900;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.8), 0 0 12px currentColor;
  pointer-events: none;
}
.dmg-enter-active { animation: dmg-rise 1s ease-out; }
.dmg-leave-active { display: none; }
@keyframes dmg-rise {
  0% { opacity: 0; transform: translateY(20px) scale(0.6); }
  20% { opacity: 1; transform: translateY(0) scale(1.1); }
  100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
}

/* === Side panel === */
.side-card { padding: 1.4rem; }
.side-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--plague);
  margin-bottom: 1rem;
}
.side-rows { display: flex; flex-direction: column; gap: 0.6rem; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.4rem 0; border-bottom: 1px dashed rgba(212, 166, 74, 0.15); }
.row:last-child { border-bottom: none; }
.key { font-size: 0.7rem; color: var(--ash); letter-spacing: 0.15em; }
.val { font-size: 1rem; color: var(--gold-bright); }

.rosh-quote {
  margin-top: 1rem;
  padding: 1.2rem;
  font-family: var(--f-body);
  font-style: italic;
  font-size: 0.95rem;
  min-height: 220px;
  max-height: 320px;
  overflow-y: auto;
}
.rosh-line {
  margin-bottom: 0.4rem;
  color: var(--bone);
  animation: float-up 0.4s ease both;
}
.rosh-line-mark {
  color: var(--plague);
  margin-right: 0.4rem;
  font-family: var(--f-mono);
}
</style>
