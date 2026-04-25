<template>
  <div class="finale-page">
    <!-- Multi-layer animated background -->
    <div class="finale-bg">
      <div class="bg-rays"></div>
      <div class="bg-particles">
        <span v-for="n in 60" :key="n" class="particle" :style="particleStyle(n)"></span>
      </div>
      <div class="bg-confetti" :key="confettiKey">
        <span v-for="(c, i) in confettiPieces" :key="confettiKey + '-' + i" class="confetti" :style="c"></span>
      </div>
    </div>

    <!-- Soundtrack of victory: opening titles -->
    <div class="finale-inner">
      <transition name="route-fade" appear>
        <div v-if="phase >= 1" class="act-1 anim-fade-in">
          <div class="t-mono finale-eyebrow">// MATCH_RESULT</div>
          <h1 class="finale-h1">
            <span class="vh-line vh-1">VICTORY</span>
            <span class="vh-line vh-2">— RADIANT —</span>
          </h1>
          <div class="finale-stats">
            <div class="fs">
              <div class="fs-k t-mono">DURATION</div>
              <div class="fs-v t-rune">21:00</div>
            </div>
            <div class="fs">
              <div class="fs-k t-mono">MMR GAIN</div>
              <div class="fs-v t-rune t-glow-plague">+∞</div>
            </div>
            <div class="fs">
              <div class="fs-k t-mono">HERO</div>
              <div class="fs-v t-rune t-glow-gold">MIKHAIL</div>
            </div>
            <div class="fs">
              <div class="fs-k t-mono">KDA</div>
              <div class="fs-v t-rune">21 / 0 / 21</div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="route-fade">
        <div v-if="phase >= 2" class="act-2 anim-fade-in">
          <div class="divider">
            <span class="div-line"></span>
            <span class="div-glyph">✦</span>
            <span class="div-line"></span>
          </div>

          <div class="hbd-block">
            <div class="hbd-eyebrow t-mono">// PERSONAL_MESSAGE.txt</div>
            <h2 class="hbd-title">
              <span class="hbd-with">с</span>
              <span class="hbd-main t-rune">днём рождения</span>
              <span class="hbd-name t-rune">МИХАИЛ</span>
            </h2>
            <div class="hbd-21">
              <span class="num-2">2</span>
              <span class="num-1">1</span>
            </div>
            <p class="hbd-prose">
              Двадцать один — это уровень, на котором у Necrophos уже Aghanim'а в инвентаре,
              а у тебя — все ответы, все скиллы, и ещё про запас. Ты прошёл девять испытаний.
              Roshan склонил голову. Invoker произнёс твоё имя. Эгис лёг тебе в руки сам.
            </p>
            <p class="hbd-prose">
              Пусть в этом году у тебя будет больше эпических тимфайтов, меньше тильт-игр,
              чистая статистика по фарму и саппорт, который ставит варды без напоминаний.
              И пусть жизнь, как идеальный мид, идёт по линии — без лишних смертей,
              с регулярными бонусами и редкими, но красивыми тиммейтами.
            </p>
          </div>
        </div>
      </transition>

      <transition name="route-fade">
        <div v-if="phase >= 3" class="act-3 anim-fade-in">
          <div class="divider">
            <span class="div-line"></span>
            <span class="div-glyph">✦</span>
            <span class="div-line"></span>
          </div>

          <div class="poem-card frame-scepter">
            <div class="poem-eyebrow t-mono">// SCROLL_OF_THE_BARD · DOTA POETRY · CANTO XXI</div>
            <div class="poem-flair">~ от Михаила, для Михаила, на двадцать первом уровне ~</div>

            <div class="poem-stage">
              <div class="poem-line stanza" v-for="(stanza, i) in stanzas" :key="i" :class="`stanza-${i}`">
                <div v-for="(line, j) in stanza" :key="j" class="line-row">
                  {{ line }}
                </div>
              </div>
            </div>

            <div class="poem-attr">
              <span class="attr-mark">— </span>
              <span class="attr-name t-rune t-glow-plague">бард-Necrophos</span>
              <br>
              <span class="attr-sub t-mono">// archived in The Book of Aghanim, page 21</span>
            </div>
          </div>
        </div>
      </transition>

      <transition name="route-fade">
        <div v-if="phase >= 4" class="act-4 anim-fade-in">
          <div class="divider">
            <span class="div-line"></span>
            <span class="div-glyph">★</span>
            <span class="div-line"></span>
          </div>

          <div class="rewards">
            <div class="rew-eyebrow t-mono">// UNLOCKED_TROPHIES</div>
            <h3 class="rew-title t-rune t-glow-gold">ТРОФЕИ ЭТОГО МАТЧА</h3>
            <div class="trophies stagger">
              <div v-for="t in trophies" :key="t.id" class="trophy anim-float-in">
                <div class="t-icon">{{ t.icon }}</div>
                <div class="t-name t-rune">{{ t.name }}</div>
                <div class="t-desc">{{ t.desc }}</div>
              </div>
            </div>
          </div>

          <div class="finale-cta">
            <button class="btn-cast btn-big" @click="restart">
              <span class="btn-icon">⚔</span>
              <span>СЫГРАТЬ ЕЩЁ ОДНУ</span>
            </button>
            <button class="btn-cast btn-plague btn-big" @click="confetti">
              <span class="btn-icon">✨</span>
              <span>ЕЩЁ КОНФЕТТИ!</span>
            </button>
          </div>

          <div class="gg-line">
            <span class="gg t-rune">GG</span>
            <span class="dot">·</span>
            <span class="gg t-rune">WP</span>
            <span class="dot">·</span>
            <span class="gg t-rune">МИХАИЛ</span>
            <span class="dot">·</span>
            <span class="gg t-rune t-glow-ember">21</span>
          </div>

          <div class="signature t-mono">
            // crafted with care for Mikhail's 21st level<br>
            // Necrophos approves · Invoker invokes · 2026
          </div>
        </div>
      </transition>
    </div>

    <!-- Floating Necrophos final cameo -->
    <div v-if="phase >= 4" class="necro-cameo" @click="confetti">
      <svg viewBox="0 0 80 80" width="60" height="60">
        <circle cx="40" cy="40" r="38" fill="#0d2818" stroke="#3fa86b" stroke-width="1.5"/>
        <ellipse cx="40" cy="42" rx="22" ry="26" fill="#d8cfb8"/>
        <ellipse cx="32" cy="38" rx="4" ry="6" fill="#0a0408"/>
        <ellipse cx="48" cy="38" rx="4" ry="6" fill="#0a0408"/>
        <circle cx="32" cy="38" r="2" fill="#b6ff5f"/>
        <circle cx="48" cy="38" r="2" fill="#b6ff5f"/>
        <path d="M40 48 L 36 58 L 44 58 Z" fill="#0a0408"/>
      </svg>
      <span class="t-mono">click for plague ✦</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const quest = inject('quest')
const phase = ref(0)

const stanzas = [
  [
    'любите доту 2, поэты!',
    'ведь там найдете жизни след:',
    'как фармить лес без откровений',
    'и как тащить всю тиму вслед'
  ],
  [
    'когда саппорт ушел без варда',
    'и керри фидит пятый раз',
    'в туманном хаосе распада',
    'сквозит небытия указ'
  ],
  [
    'в лесах, где спектра шепчет тайну',
    'где пудж свистит крюком межбытия',
    'и мид, как истина случайна',
    'сф кайлы кидает зря'
  ]
]

const trophies = [
  { id: 1, icon: '⚔', name: 'ANCIENT SLAYER', desc: 'Уронил Ancient на 21:00.' },
  { id: 2, icon: '☠', name: 'PLAGUE LORD', desc: 'Прошёл некропоническое посвящение.' },
  { id: 3, icon: '🜂', name: 'INVOKER MAIN', desc: 'Скастовал Sun Strike с первого раза.' },
  { id: 4, icon: '👑', name: 'AGHANIM\'S CHILD', desc: 'Достиг 21 уровня. Букавально.' },
  { id: 5, icon: '🌙', name: 'WARD GIVER', desc: 'Прочитал 21 истину.' },
  { id: 6, icon: '🏆', name: 'IMMORTAL', desc: 'Поднял эгис. Дважды.' }
]

function particleStyle(n) {
  const colors = ['#ffd86b', '#ff7a1a', '#6dffa8', '#a76dff', '#ff2a8a']
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    background: colors[n % colors.length],
    animationDelay: (Math.random() * 6) + 's',
    animationDuration: (4 + Math.random() * 6) + 's'
  }
}

function confettiSeed() {
  const colors = ['#ffd86b', '#ff7a1a', '#6dffa8', '#3aa6ff', '#ff2a8a', '#a76dff', '#b6ff5f']
  return Array.from({ length: 120 }, (_, i) => {
    const r = Math.random()
    return {
      left: (Math.random() * 100) + '%',
      background: colors[i % colors.length],
      animationDelay: (-Math.random() * 4) + 's',
      animationDuration: (3 + Math.random() * 4) + 's',
      transform: `rotate(${r * 360}deg)`,
      width: (5 + Math.random() * 6) + 'px',
      height: (10 + Math.random() * 8) + 'px'
    }
  })
}

const confettiPieces = ref(confettiSeed())
const confettiKey = ref(0)

function confetti() {
  confettiPieces.value = confettiSeed()
  confettiKey.value++
}

function restart() {
  quest.reset()
  router.push('/')
}

onMounted(() => {
  // Staged reveal of finale
  setTimeout(() => phase.value = 1, 200)
  setTimeout(() => phase.value = 2, 1400)
  setTimeout(() => phase.value = 3, 2600)
  setTimeout(() => phase.value = 4, 4000)

  // Console gratitude
  console.log('%cМИХАИЛ. С ДНЁМ РОЖДЕНИЯ.', 'color: #ffd86b; font: 900 32px serif; text-shadow: 0 0 12px #ff7a1a;')
  console.log('%cты прошёл квест целиком. это уровень.', 'color: #6dffa8; font: italic 16px serif;')
})
</script>

<style scoped>
.finale-page {
  min-height: 100vh;
  position: relative;
  padding: 4rem 1.5rem 6rem;
  overflow: hidden;
}

/* === Background === */
.finale-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.bg-rays {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 20%, rgba(255, 216, 107, 0.18), transparent 50%),
    radial-gradient(ellipse at 20% 80%, rgba(63, 168, 107, 0.12), transparent 50%),
    radial-gradient(ellipse at 80% 90%, rgba(193, 26, 58, 0.1), transparent 50%);
}

.bg-particles, .bg-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  opacity: 0.7;
  animation: float-particle 6s ease-in-out infinite;
}
@keyframes float-particle {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  50% { transform: translateY(-30px) translateX(20px); opacity: 0.9; }
}

.confetti {
  position: absolute;
  top: -20px;
  width: 8px; height: 14px;
  animation: confetti-fall linear infinite;
  opacity: 0.85;
}
@keyframes confetti-fall {
  0% { transform: translateY(-20px) rotate(0); }
  100% { transform: translateY(110vh) rotate(720deg); }
}

/* === Layout === */
.finale-inner {
  max-width: 880px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.finale-eyebrow { font-size: 0.7rem; letter-spacing: 0.35em; color: var(--plague); margin-bottom: 1rem; text-align: center; }

/* === Act 1 === */
.act-1 { text-align: center; padding: 2rem 0; }
.finale-h1 {
  font-family: var(--f-display);
  margin-bottom: 2rem;
}
.vh-line { display: block; }
.vh-1 {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  background: linear-gradient(180deg, var(--gold-bright) 0%, var(--exort-orange) 50%, var(--blood) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 24px rgba(255, 122, 26, 0.6));
  line-height: 1;
}
.vh-2 {
  font-size: clamp(0.9rem, 2.5vw, 1.4rem);
  letter-spacing: 0.4em;
  color: var(--gold);
  margin-top: 0.5rem;
}

.finale-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.7), rgba(13, 10, 20, 0.9));
  border: 1px solid var(--gold);
  box-shadow: inset 0 1px 0 rgba(255, 216, 107, 0.2), 0 0 40px rgba(255, 122, 26, 0.15);
}
.fs { text-align: center; }
.fs-k { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--ash); margin-bottom: 0.3rem; }
.fs-v { font-size: 1.6rem; color: var(--paper); }

/* === Divider === */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 4rem auto;
  max-width: 600px;
}
.div-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.div-glyph { font-size: 1.4rem; color: var(--gold-bright); filter: drop-shadow(0 0 8px var(--gold-bright)); }

/* === Act 2: HBD === */
.act-2 { text-align: center; }
.hbd-block { padding: 1rem 0; }
.hbd-eyebrow { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--plague); margin-bottom: 1.5rem; }

.hbd-title {
  font-family: var(--f-display);
  font-weight: 900;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
  line-height: 0.95;
}
.hbd-with {
  font-family: var(--f-body);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: var(--ash);
  text-transform: lowercase;
  letter-spacing: 0;
}
.hbd-main {
  font-size: clamp(1.6rem, 5vw, 2.8rem);
  letter-spacing: 0.06em;
  color: var(--paper);
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 216, 107, 0.3);
}
.hbd-name {
  font-size: clamp(2.6rem, 9vw, 5rem);
  letter-spacing: 0.04em;
  background: linear-gradient(180deg, var(--gold-bright), var(--exort-orange) 50%, var(--blood));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 24px rgba(255, 122, 26, 0.5));
}

.hbd-21 {
  font-family: var(--f-display);
  font-weight: 900;
  font-size: clamp(6rem, 18vw, 14rem);
  line-height: 0.85;
  margin: 1rem 0 2rem;
  display: inline-flex;
  letter-spacing: -0.05em;
}
.num-2, .num-1 {
  background: linear-gradient(180deg, var(--gold-bright) 0%, var(--exort-orange) 40%, var(--blood) 80%, var(--magenta) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 32px rgba(255, 122, 26, 0.6));
  animation: num-pulse 3s ease-in-out infinite;
}
.num-1 { animation-delay: 0.4s; }
@keyframes num-pulse {
  0%, 100% { filter: drop-shadow(0 0 32px rgba(255, 122, 26, 0.6)); transform: translateY(0); }
  50% { filter: drop-shadow(0 0 56px rgba(255, 216, 107, 0.8)); transform: translateY(-6px); }
}

.hbd-prose {
  font-family: var(--f-body);
  font-size: 1.2rem;
  line-height: 1.7;
  color: var(--bone);
  max-width: 680px;
  margin: 0 auto 1.2rem;
  text-align: left;
}
.hbd-prose:first-letter {
  font-family: var(--f-display);
  font-size: 3.4rem;
  line-height: 1;
  float: left;
  margin: 0.1em 0.2em 0 0;
  color: var(--gold-bright);
  text-shadow: 0 0 12px rgba(255, 216, 107, 0.4);
}

/* === Act 3: Poem === */
.act-3 { padding: 2rem 0; }

.poem-card {
  padding: 3rem 2rem 2rem;
  position: relative;
  text-align: center;
}

.poem-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--gold);
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.poem-flair {
  font-family: var(--f-body);
  font-style: italic;
  color: var(--plague);
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  opacity: 0.85;
}

.poem-stage {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  margin-bottom: 2.5rem;
}

.poem-line.stanza {
  font-family: var(--f-body);
  font-size: 1.3rem;
  line-height: 1.85;
  color: var(--bone);
  text-align: center;
  font-style: italic;
  position: relative;
}

.line-row {
  position: relative;
  animation: float-up 0.8s ease both;
}

.stanza-0 .line-row:nth-child(1) { animation-delay: 0.1s; }
.stanza-0 .line-row:nth-child(2) { animation-delay: 0.25s; }
.stanza-0 .line-row:nth-child(3) { animation-delay: 0.4s; }
.stanza-0 .line-row:nth-child(4) { animation-delay: 0.55s; }

.stanza-1 .line-row:nth-child(1) { animation-delay: 0.7s; }
.stanza-1 .line-row:nth-child(2) { animation-delay: 0.85s; }
.stanza-1 .line-row:nth-child(3) { animation-delay: 1.0s; }
.stanza-1 .line-row:nth-child(4) { animation-delay: 1.15s; }

.stanza-2 .line-row:nth-child(1) { animation-delay: 1.3s; color: var(--plague-bright); }
.stanza-2 .line-row:nth-child(2) { animation-delay: 1.45s; color: var(--exort-bright); }
.stanza-2 .line-row:nth-child(3) { animation-delay: 1.6s; color: var(--gold-bright); }
.stanza-2 .line-row:nth-child(4) { animation-delay: 1.75s; color: var(--magenta); text-shadow: 0 0 8px currentColor; }

.poem-attr {
  margin-top: 1.5rem;
  text-align: right;
  padding-top: 1.5rem;
  border-top: 1px dashed rgba(212, 166, 74, 0.2);
}
.attr-mark { color: var(--ash); }
.attr-name { font-size: 1.1rem; letter-spacing: 0.1em; }
.attr-sub { font-size: 0.7rem; color: var(--ash); letter-spacing: 0.2em; opacity: 0.6; }

/* === Act 4: Trophies & CTA === */
.act-4 { padding: 2rem 0; text-align: center; }

.rewards { margin-bottom: 3rem; }
.rew-eyebrow { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--plague); margin-bottom: 0.6rem; }
.rew-title { font-size: 1.6rem; margin-bottom: 2rem; }

.trophies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  text-align: center;
}

.trophy {
  padding: 1.5rem 1rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.7), rgba(13, 10, 20, 0.9));
  border: 1px solid var(--gold);
  transition: all 0.3s;
}
.trophy:hover {
  transform: translateY(-6px) rotate(-1deg);
  border-color: var(--gold-bright);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 32px rgba(255, 216, 107, 0.3);
}
.t-icon {
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 12px rgba(255, 216, 107, 0.4));
}
.t-name {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  color: var(--gold-bright);
  margin-bottom: 0.4rem;
}
.t-desc { font-size: 0.78rem; color: var(--ash); line-height: 1.4; }

.finale-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 3rem 0 2rem;
}

.gg-line {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
  flex-wrap: wrap;
}
.gg {
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  letter-spacing: 0.25em;
  color: var(--paper);
}
.dot { color: var(--gold); opacity: 0.6; }

.signature {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--ash);
  opacity: 0.5;
  text-align: center;
  margin-top: 3rem;
  line-height: 1.8;
}

/* === Necro cameo === */
.necro-cameo {
  position: fixed;
  bottom: 1rem; left: 1rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(13, 40, 24, 0.85);
  border: 1px solid var(--plague);
  cursor: pointer;
  font-size: 0.65rem;
  color: var(--plague-bright);
  letter-spacing: 0.15em;
  transition: all 0.3s;
}
.necro-cameo:hover {
  border-color: var(--plague-bright);
  box-shadow: 0 0 20px rgba(109, 255, 168, 0.3);
}
</style>
