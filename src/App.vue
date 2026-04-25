<template>
  <QuestGate>
    <div class="app-root">
    <div class="bg-atmosphere"></div>

    <!-- Top HUD -->
    <header class="hud" v-if="$route.name !== 'finale'">
      <div class="hud-left">
        <div class="hud-portrait">
          <div class="portrait-ring"></div>
          <span class="portrait-glyph">M</span>
          <span class="portrait-lvl">{{ progress.level }}</span>
        </div>
        <div class="hud-info">
          <div class="hud-name t-rune">МИХАИЛ</div>
          <div class="hud-class t-mono">PLAGUE LORD · ASCENDANT</div>
        </div>
      </div>

      <div class="hud-center">
        <div class="hud-quest-label t-mono">QUEST {{ String(progress.step).padStart(2, '0') }} / 09</div>
        <div class="xp-bar-shell" style="width: 280px;">
          <div class="xp-bar-fill" :style="{ width: progress.percent + '%' }"></div>
        </div>
        <div class="hud-quest-name">{{ progress.title }}</div>
      </div>

      <div class="hud-right">
        <button class="hud-mute" @click="toggleMute" :title="muted ? 'unmute' : 'mute'">
          <svg v-if="!muted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        </button>
        <router-link to="/" class="hud-home t-mono" v-if="$route.name !== 'home'">⌂ ALT+F4</router-link>
      </div>
    </header>

    <!-- Page content -->
    <router-view v-slot="{ Component }">
      <transition name="route-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Floating easter egg: hidden Necrophos summon -->
    <button class="ee-skull" @click="invokeNecro" :title="'whisper to the deathseer'">☠</button>
    <transition name="route-fade">
      <div v-if="necroVisible" class="necro-overlay" @click="necroVisible = false">
        <div class="necro-card">
          <div class="necro-art">
            <svg viewBox="0 0 200 240" width="180" height="216">
              <defs>
                <radialGradient id="hood" cx="50%" cy="40%">
                  <stop offset="0%" stop-color="#1a5c3a"/>
                  <stop offset="100%" stop-color="#0a1410"/>
                </radialGradient>
                <radialGradient id="eye" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="#fff"/>
                  <stop offset="40%" stop-color="#b6ff5f"/>
                  <stop offset="100%" stop-color="#1a5c3a"/>
                </radialGradient>
              </defs>
              <!-- hood silhouette -->
              <path d="M100 20 C 50 30, 20 90, 30 160 C 35 200, 60 230, 100 235 C 140 230, 165 200, 170 160 C 180 90, 150 30, 100 20 Z" fill="url(#hood)" stroke="#3fa86b" stroke-width="1.5"/>
              <!-- skull face -->
              <ellipse cx="100" cy="115" rx="42" ry="50" fill="#d8cfb8" opacity="0.95"/>
              <ellipse cx="100" cy="155" rx="30" ry="20" fill="#1a1014"/>
              <!-- eye sockets -->
              <ellipse cx="84" cy="110" rx="10" ry="13" fill="#0a0408"/>
              <ellipse cx="116" cy="110" rx="10" ry="13" fill="#0a0408"/>
              <!-- glowing eyes -->
              <circle cx="84" cy="110" r="4" fill="url(#eye)"/>
              <circle cx="116" cy="110" r="4" fill="url(#eye)"/>
              <!-- nose -->
              <path d="M100 125 L 95 145 L 105 145 Z" fill="#0a0408"/>
              <!-- teeth -->
              <g fill="#1a1014">
                <rect x="84" y="158" width="5" height="12"/>
                <rect x="92" y="158" width="5" height="12"/>
                <rect x="100" y="158" width="5" height="12"/>
                <rect x="108" y="158" width="5" height="12"/>
              </g>
              <!-- plague aura -->
              <circle cx="100" cy="120" r="80" fill="none" stroke="#6dffa8" stroke-width="0.5" opacity="0.4"/>
              <circle cx="100" cy="120" r="95" fill="none" stroke="#3fa86b" stroke-width="0.3" opacity="0.3"/>
            </svg>
          </div>
          <div class="necro-text">
            <div class="t-rune t-glow-plague" style="font-size: 1.4rem;">NECROPHOS</div>
            <div class="t-mono" style="opacity: 0.7; font-size: 0.8rem; letter-spacing: 0.2em;">THE DEATHSEER WHISPERS</div>
            <p style="margin-top: 1rem; font-style: italic; color: var(--plague-bright);">«Чума идёт по следам тех, кто празднует. Пройди до конца, Михаил — и я вылечу тебя от смертности».</p>
            <div class="necro-hint t-mono">ulti ready · scythe charged</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  </QuestGate>
</template>

<script setup>
import { computed, ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { questState } from './composables/useQuest'
import QuestGate from './components/QuestGate.vue'

const route = useRoute()
const muted = ref(true)
const necroVisible = ref(false)

provide('quest', questState)
provide('muted', muted)

const progress = computed(() => {
  const meta = route.meta || {}
  const step = meta.step ?? 0
  const total = 9
  const percent = Math.min(100, (step / total) * 100)
  return {
    step,
    percent,
    level: 20 + Math.min(1, step / total),
    title: meta.title || 'PROLOGUE'
  }
})

function toggleMute() { muted.value = !muted.value }

function invokeNecro() {
  necroVisible.value = !necroVisible.value
  questState.unlock('necro_summon')
}

onMounted(() => {
  // Console easter egg
  const styles = [
    'color: #6dffa8; font: 900 16px serif; text-shadow: 0 0 8px #3fa86b;',
    'color: #ffb04a; font: 700 13px monospace;',
    'color: #d4a64a; font: italic 12px serif;'
  ]
  console.log('%cNECROPHOS WHISPERS:', styles[0])
  console.log('%c> Михаилу 21. Чума празднует.', styles[1])
  console.log('%c> Try the Konami code. Or click the skull. Or just enjoy the journey.', styles[2])
  console.log('%c> ↑ ↑ ↓ ↓ ← → ← → B A — and the scythe is yours.', styles[1])
})
</script>

<style scoped>
.app-root { min-height: 100vh; }

/* ===== HUD ===== */
.hud {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  padding: 0.7rem 1.6rem;
  background:
    linear-gradient(180deg, rgba(7, 6, 10, 0.92) 0%, rgba(13, 10, 20, 0.85) 70%, transparent 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(212, 166, 74, 0.18);
}

.hud-left { display: flex; align-items: center; gap: 0.9rem; }

.hud-portrait {
  position: relative;
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle, var(--plague-mid), var(--void-1));
  border: 2px solid var(--gold);
  box-shadow:
    inset 0 0 20px rgba(109, 255, 168, 0.4),
    0 0 16px rgba(255, 122, 26, 0.3);
}

.portrait-ring {
  position: absolute; inset: -6px;
  border: 1px dashed var(--exort-orange);
  border-radius: 50%;
  opacity: 0.6;
  animation: spin-slow 12s linear infinite;
}

.portrait-glyph {
  font-family: var(--f-display);
  font-weight: 900;
  font-size: 1.8rem;
  color: var(--paper);
  text-shadow: 0 0 8px var(--plague-bright);
}

.portrait-lvl {
  position: absolute;
  bottom: -4px; right: -6px;
  background: var(--exort-orange);
  color: var(--void-0);
  font-family: var(--f-impact);
  font-size: 0.75rem;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--void-0);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--exort-orange);
}

.hud-name {
  font-size: 1rem;
  color: var(--gold-bright);
  letter-spacing: 0.22em;
}
.hud-class {
  font-size: 0.65rem;
  color: var(--plague);
  letter-spacing: 0.25em;
}

.hud-center {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
}

.hud-quest-label {
  font-size: 0.7rem;
  color: var(--ash);
  letter-spacing: 0.3em;
}

.hud-quest-name {
  font-family: var(--f-display);
  font-size: 0.78rem;
  color: var(--exort-bright);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hud-right { display: flex; align-items: center; gap: 1rem; justify-content: flex-end; }

.hud-mute {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(212, 166, 74, 0.3);
  color: var(--ash);
  background: rgba(13, 10, 20, 0.5);
  transition: all 0.2s;
}
.hud-mute:hover { border-color: var(--exort-orange); color: var(--exort-bright); }

.hud-home {
  font-size: 0.7rem;
  color: var(--ash);
  letter-spacing: 0.2em;
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(212, 166, 74, 0.25);
  transition: all 0.2s;
}
.hud-home:hover { color: var(--paper); border-color: var(--blood); }

@media (max-width: 820px) {
  .hud { grid-template-columns: auto 1fr auto; padding: 0.5rem 1rem; }
  .hud-info { display: none; }
  .hud-quest-name { display: none; }
  .xp-bar-shell { width: 100% !important; max-width: 200px; }
}

/* ===== Necrophos easter egg ===== */
.ee-skull {
  position: fixed;
  bottom: 1.2rem; right: 1.2rem;
  z-index: 100;
  width: 44px; height: 44px;
  background: radial-gradient(circle, var(--plague-mid), var(--void-1));
  border: 1px solid var(--plague);
  color: var(--plague-bright);
  font-size: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 16px rgba(109, 255, 168, 0.3);
  transition: all 0.3s;
  animation: pulse-glow 3.5s ease-in-out infinite;
}
.ee-skull:hover {
  transform: scale(1.1) rotate(-8deg);
  box-shadow: 0 0 32px var(--plague-bright);
}

.necro-overlay {
  position: fixed; inset: 0;
  z-index: 200;
  background: rgba(7, 6, 10, 0.85);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  cursor: pointer;
}

.necro-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  max-width: 600px;
  padding: 2rem;
  background: linear-gradient(180deg, rgba(13, 40, 24, 0.95), rgba(7, 6, 10, 0.98));
  border: 1px solid var(--plague);
  box-shadow: 0 0 80px rgba(63, 168, 107, 0.4);
  cursor: default;
}

.necro-art { display: flex; align-items: center; }
.necro-text > p { font-size: 1.05rem; line-height: 1.5; }
.necro-hint {
  margin-top: 1rem;
  font-size: 0.7rem;
  color: var(--plague);
  letter-spacing: 0.25em;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .necro-card { grid-template-columns: 1fr; text-align: center; }
  .necro-art { justify-content: center; }
}
</style>
