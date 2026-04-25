<template>
  <div class="gate">
    <div class="gate-bg"></div>
    <div class="gate-runes">
      <span v-for="(r, i) in runes" :key="i" class="gate-rune"
            :style="{ left: r.x + '%', top: r.y + '%', animationDelay: r.d + 's', color: r.c }">{{ r.s }}</span>
    </div>

    <div class="gate-inner">
      <!-- MOBILE BLOCK -->
      <template v-if="isMobile">
        <div class="gate-eyebrow t-mono">// DEVICE_CHECK · FAILED</div>
        <div class="gate-icon">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <rect x="30" y="10" width="40" height="80" rx="6" fill="none" stroke="#c11a3a" stroke-width="3"/>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#c11a3a" stroke-width="4" stroke-linecap="round"/>
            <line x1="80" y1="20" x2="20" y2="80" stroke="#c11a3a" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="gate-title t-rune" style="color: var(--blood);">ТОЛЬКО С ПК</h1>
        <p class="gate-prose">
          Михаил, этот квест — для большого экрана.<br>
          Открой ссылку <strong>с компьютера или ноутбука</strong>.<br><br>
          Здесь будут SVG-битвы, мини-игры на клавиатуру (Q-W-E-R) и сложные тимфайты —
          с телефона ничего не получится.
        </p>
        <div class="gate-tip t-mono">
          → скопируй ссылку и пришли себе в Telegram «Saved Messages»<br>
          → открой на ПК ровно 26 апреля
        </div>
      </template>

      <!-- COUNTDOWN BLOCK -->
      <template v-else-if="!isUnlocked">
        <div class="gate-eyebrow t-mono">// QUEST_LOCKED · UNTIL 2026-04-26 00:00 MSK</div>

        <div class="gate-icon">
          <svg viewBox="0 0 120 120" width="100" height="100" class="lock-svg">
            <defs>
              <radialGradient id="lockg" cx="50%" cy="40%">
                <stop offset="0%" stop-color="#ffd86b"/>
                <stop offset="100%" stop-color="#6b4a13"/>
              </radialGradient>
            </defs>
            <!-- shackle -->
            <path d="M40 55 L 40 35 Q 40 18 60 18 Q 80 18 80 35 L 80 55"
                  fill="none" stroke="url(#lockg)" stroke-width="6" stroke-linecap="round"/>
            <!-- body -->
            <rect x="28" y="55" width="64" height="50" rx="6" fill="url(#lockg)" stroke="#3a2810" stroke-width="2"/>
            <!-- keyhole -->
            <circle cx="60" cy="78" r="6" fill="#0d0a14"/>
            <rect x="57" y="78" width="6" height="14" fill="#0d0a14"/>
          </svg>
        </div>

        <h1 class="gate-title t-rune">КВЕСТ ЗАПЕЧАТАН</h1>
        <p class="gate-sub">
          Aghanim'ский замок откроется ровно в полночь<br>
          по московскому времени, 26 апреля.
        </p>

        <div class="countdown">
          <div class="cd-cell">
            <div class="cd-num t-rune">{{ pad(time.days) }}</div>
            <div class="cd-label t-mono">DAYS</div>
          </div>
          <div class="cd-divider">:</div>
          <div class="cd-cell">
            <div class="cd-num t-rune">{{ pad(time.hours) }}</div>
            <div class="cd-label t-mono">HOURS</div>
          </div>
          <div class="cd-divider">:</div>
          <div class="cd-cell">
            <div class="cd-num t-rune">{{ pad(time.minutes) }}</div>
            <div class="cd-label t-mono">MIN</div>
          </div>
          <div class="cd-divider">:</div>
          <div class="cd-cell">
            <div class="cd-num t-rune cd-sec">{{ pad(time.seconds) }}</div>
            <div class="cd-label t-mono">SEC</div>
          </div>
        </div>

        <div class="gate-target">
          <div class="t-mono target-eyebrow">// UNLOCK_TIMESTAMP</div>
          <div class="target-time">26.04.2026 · 00:00:00 MSK</div>
        </div>

        <div class="gate-quote">
          <div class="quote-mark">«</div>
          <p>
            Терпение, Михаил. Древние не любят спешки.<br>
            Когда стрелки сойдутся — Necrophos сам откроет проход.
          </p>
          <div class="quote-attr t-mono">— Aghanim, Лорд Магов</div>
        </div>

        <div class="gate-foot t-mono">
          // Twenty-One. Coming soon. Save the link.
        </div>
      </template>

      <!-- UNLOCKED → render slot (the real app) -->
      <slot v-else></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

// === Config ===
// Target: April 26, 2026 at 00:00 Moscow time (UTC+3)
// In UTC, that's April 25, 2026 at 21:00 UTC
const TARGET_UTC = new Date(Date.UTC(2026, 3, 25, 21, 0, 0)).getTime()

// === State ===
const now = ref(Date.now())
const isMobile = ref(false)

// Pre-decorative runes
const runes = Array.from({ length: 14 }, () => {
  const symbols = ['⚝', '☄', '✦', '⚔', '☠', '◈', '✺', '🜂', '❄', '⚡']
  const colors = ['#ff7a1a', '#6dffa8', '#a76dff', '#ffd86b', '#3aa6ff']
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    d: Math.random() * 8,
    s: symbols[Math.floor(Math.random() * symbols.length)],
    c: colors[Math.floor(Math.random() * colors.length)]
  }
})

const isUnlocked = computed(() => now.value >= TARGET_UTC)

const time = computed(() => {
  const diff = Math.max(0, TARGET_UTC - now.value)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
})

function pad(n) { return String(n).padStart(2, '0') }

function detectMobile() {
  if (typeof window === 'undefined') return false
  // Coarse-pointer (touch primary) AND narrow screen → real mobile
  // Allow tablets in landscape and laptops with touch
  const ua = navigator.userAgent || ''
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)
  const isNarrow = window.innerWidth < 900
  const isTouchOnly = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches
  // Block if: mobile UA, OR (narrow AND touch-only)
  return isMobileUA || (isNarrow && isTouchOnly)
}

let timer = null

onMounted(() => {
  isMobile.value = detectMobile()
  window.addEventListener('resize', () => {
    isMobile.value = detectMobile()
  })

  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  // Dev override: ?unlock=1 in URL bypasses the gate (only for testing)
  if (typeof window !== 'undefined' && window.location.search.includes('unlock=1')) {
    // simulate already past target
    now.value = TARGET_UTC + 1000
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.gate {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.gate-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(255, 122, 26, 0.08), transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(63, 168, 107, 0.06), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(167, 109, 255, 0.04), transparent 60%),
    var(--void-0);
}
.gate-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.5 0 0 0 0 0.3 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.18;
  mix-blend-mode: overlay;
}

.gate-runes {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.gate-rune {
  position: absolute;
  font-size: 1.6rem;
  opacity: 0.2;
  filter: drop-shadow(0 0 8px currentColor);
  animation: gate-float 16s ease-in-out infinite alternate;
}
@keyframes gate-float {
  from { transform: translate(0, 0) rotate(0); }
  to { transform: translate(30px, -40px) rotate(180deg); }
}

.gate-inner {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gate-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  color: var(--plague);
  margin-bottom: 1.5rem;
  opacity: 0.85;
  animation: float-up 0.8s ease both;
}

.gate-icon {
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 24px rgba(255, 216, 107, 0.4));
  animation: float-up 0.9s ease both, gate-pulse 3s ease-in-out infinite 1s;
}
@keyframes gate-pulse {
  0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 24px rgba(255, 216, 107, 0.4)); }
  50% { transform: translateY(-6px); filter: drop-shadow(0 0 40px rgba(255, 216, 107, 0.7)); }
}

.lock-svg { animation: lock-rattle 5s ease-in-out infinite; }
@keyframes lock-rattle {
  0%, 90%, 100% { transform: rotate(0); }
  92% { transform: rotate(-3deg); }
  94% { transform: rotate(3deg); }
  96% { transform: rotate(-2deg); }
  98% { transform: rotate(0); }
}

.gate-title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  letter-spacing: 0.15em;
  color: var(--gold-bright);
  text-shadow: 0 0 24px rgba(255, 216, 107, 0.5), 0 0 60px rgba(255, 122, 26, 0.3);
  margin-bottom: 1rem;
  animation: float-up 1s ease 0.2s both;
}

.gate-sub {
  font-family: var(--f-body);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--bone);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  animation: float-up 1s ease 0.4s both;
}

.gate-prose {
  font-family: var(--f-body);
  font-size: 1.15rem;
  color: var(--bone);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  max-width: 540px;
  animation: float-up 1s ease 0.4s both;
}
.gate-prose strong { color: var(--gold-bright); }

.gate-tip {
  margin-top: 1.5rem;
  font-size: 0.78rem;
  letter-spacing: 0.15em;
  color: var(--plague-bright);
  line-height: 2;
  border: 1px dashed rgba(63, 168, 107, 0.4);
  padding: 1rem 1.5rem;
  animation: float-up 1s ease 0.6s both;
}

/* === Countdown === */
.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
  animation: float-up 1s ease 0.6s both;
}

.cd-cell {
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.85), rgba(13, 10, 20, 0.95));
  border: 1px solid var(--gold);
  padding: 1rem 1.2rem;
  min-width: 90px;
  box-shadow:
    inset 0 1px 0 rgba(255, 216, 107, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.5),
    0 12px 30px rgba(0, 0, 0, 0.6),
    0 0 24px rgba(255, 122, 26, 0.15);
  position: relative;
}
.cd-cell::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.cd-num {
  font-family: var(--f-display);
  font-weight: 900;
  font-size: clamp(2rem, 6vw, 3.4rem);
  line-height: 1;
  background: linear-gradient(180deg, var(--gold-bright) 0%, var(--exort-orange) 50%, var(--blood) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(255, 122, 26, 0.4));
}

.cd-sec {
  animation: cd-tick 1s ease infinite;
}
@keyframes cd-tick {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(255, 122, 26, 0.4)); }
  50% { filter: drop-shadow(0 0 24px rgba(255, 216, 107, 0.7)); }
}

.cd-label {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: var(--ash);
  margin-top: 0.5rem;
}

.cd-divider {
  font-family: var(--f-display);
  font-weight: 900;
  font-size: 2rem;
  color: var(--gold);
  opacity: 0.6;
  align-self: flex-start;
  margin-top: 1rem;
}

.gate-target {
  margin-top: 1rem;
  margin-bottom: 2.5rem;
  animation: float-up 1s ease 0.8s both;
}
.target-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--ash);
  margin-bottom: 0.4rem;
}
.target-time {
  font-family: var(--f-mono);
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  color: var(--exort-bright);
  text-shadow: 0 0 8px rgba(255, 122, 26, 0.4);
}

/* === Quote === */
.gate-quote {
  position: relative;
  max-width: 520px;
  margin: 0 auto 2rem;
  padding: 2rem 1.5rem 1.5rem;
  background: linear-gradient(180deg, rgba(13, 40, 24, 0.5), rgba(7, 6, 10, 0.85));
  border: 1px solid rgba(63, 168, 107, 0.35);
  animation: float-up 1s ease 1s both;
}
.quote-mark {
  position: absolute;
  top: -12px;
  left: 1rem;
  font-family: var(--f-display);
  font-size: 4rem;
  color: var(--plague);
  line-height: 1;
  text-shadow: 0 0 12px var(--plague);
}
.gate-quote p {
  font-family: var(--f-body);
  font-size: 1.05rem;
  font-style: italic;
  color: var(--bone);
  line-height: 1.7;
}
.quote-attr {
  margin-top: 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--plague);
  text-align: right;
}

.gate-foot {
  margin-top: 2rem;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--ash);
  opacity: 0.5;
  animation: float-up 1s ease 1.2s both;
}

@media (max-width: 600px) {
  .countdown { gap: 0.3rem; }
  .cd-cell { min-width: 64px; padding: 0.7rem 0.5rem; }
  .cd-divider { font-size: 1.4rem; margin-top: 0.6rem; }
}
</style>
