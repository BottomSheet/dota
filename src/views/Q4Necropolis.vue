<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="4" tone="plague"
        title="НЕКРОПОЛИС"
        subtitle="Любимый герой Михаила. Чума знает своего хозяина. Пройди три вопроса — и Scythe of Vyse твой."
      />

      <div class="necro-stage">
        <!-- Big Necrophos portrait -->
        <div class="necro-portrait frame-plague">
          <svg viewBox="0 0 320 380" width="100%" height="auto">
            <defs>
              <radialGradient id="necroHood" cx="50%" cy="35%">
                <stop offset="0%" stop-color="#1a5c3a"/>
                <stop offset="60%" stop-color="#0d2818"/>
                <stop offset="100%" stop-color="#050a06"/>
              </radialGradient>
              <radialGradient id="necroEye" cx="50%" cy="50%">
                <stop offset="0%" stop-color="#fff"/>
                <stop offset="30%" stop-color="#b6ff5f"/>
                <stop offset="80%" stop-color="#3fa86b"/>
                <stop offset="100%" stop-color="#0a1410"/>
              </radialGradient>
              <radialGradient id="plagueAura">
                <stop offset="0%" stop-color="#6dffa8" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#3fa86b" stop-opacity="0"/>
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <!-- aura -->
            <circle cx="160" cy="190" r="160" fill="url(#plagueAura)" class="aura-pulse"/>

            <!-- robe / hood silhouette -->
            <path d="M160 30 C 80 45, 35 130, 50 250 C 60 320, 100 365, 160 372 C 220 365, 260 320, 270 250 C 285 130, 240 45, 160 30 Z"
                  fill="url(#necroHood)" stroke="#3fa86b" stroke-width="2"/>

            <!-- inner hood shadow / cowl edge -->
            <path d="M88 95 Q 160 65 232 95 L 215 145 Q 160 125 105 145 Z" fill="#050a06" opacity="0.85"/>

            <!-- Skull -->
            <ellipse cx="160" cy="180" rx="62" ry="74" fill="#d8cfb8" filter="url(#glow)"/>
            <!-- Skull cracks -->
            <path d="M120 130 L 132 160 L 128 175" fill="none" stroke="#3a2810" stroke-width="1.2" opacity="0.6"/>
            <path d="M195 145 L 188 175" fill="none" stroke="#3a2810" stroke-width="1" opacity="0.5"/>

            <!-- Jaw shadow -->
            <ellipse cx="160" cy="240" rx="40" ry="28" fill="#1a1014"/>

            <!-- Eye sockets -->
            <ellipse cx="138" cy="175" rx="14" ry="18" fill="#0a0408"/>
            <ellipse cx="182" cy="175" rx="14" ry="18" fill="#0a0408"/>
            <!-- Glowing eyes -->
            <circle cx="138" cy="175" r="6" fill="url(#necroEye)" class="eye-glow"/>
            <circle cx="182" cy="175" r="6" fill="url(#necroEye)" class="eye-glow"/>

            <!-- Nose cavity -->
            <path d="M160 195 L 152 220 L 168 220 Z" fill="#0a0408"/>

            <!-- Teeth -->
            <g fill="#1a1014">
              <rect x="138" y="232" width="6" height="14"/>
              <rect x="148" y="232" width="6" height="14"/>
              <rect x="158" y="232" width="6" height="14"/>
              <rect x="168" y="232" width="6" height="14"/>
              <rect x="178" y="232" width="6" height="14"/>
            </g>

            <!-- Hood horns/peaks -->
            <path d="M70 80 Q 50 30 60 10 Q 80 40 95 75 Z" fill="#0d2818" stroke="#3fa86b" stroke-width="1"/>
            <path d="M250 80 Q 270 30 260 10 Q 240 40 225 75 Z" fill="#0d2818" stroke="#3fa86b" stroke-width="1"/>

            <!-- Scythe handle -->
            <line x1="280" y1="80" x2="305" y2="370" stroke="#3a2810" stroke-width="4"/>
            <line x1="280" y1="80" x2="305" y2="370" stroke="#5a3a1a" stroke-width="2"/>
            <!-- Scythe blade -->
            <path d="M280 80 Q 240 60 250 30 Q 290 40 305 75 Z" fill="url(#necroHood)" stroke="#6dffa8" stroke-width="1.5"/>
            <!-- blade glow line -->
            <path d="M280 80 Q 248 64 254 36" fill="none" stroke="#b6ff5f" stroke-width="1.2" opacity="0.8" filter="url(#glow)"/>

            <!-- Shoulder bone -->
            <ellipse cx="80" cy="270" rx="22" ry="34" fill="#0d2818" stroke="#3fa86b" stroke-width="1"/>
            <ellipse cx="240" cy="270" rx="22" ry="34" fill="#0d2818" stroke="#3fa86b" stroke-width="1"/>

            <!-- Plague particles -->
            <circle cx="120" cy="100" r="2" fill="#b6ff5f" class="plague-p p1"/>
            <circle cx="200" cy="80" r="1.5" fill="#6dffa8" class="plague-p p2"/>
            <circle cx="240" cy="160" r="2.5" fill="#3fa86b" class="plague-p p3"/>
            <circle cx="80" cy="200" r="1.8" fill="#b6ff5f" class="plague-p p4"/>
            <circle cx="100" cy="320" r="2" fill="#6dffa8" class="plague-p p5"/>
            <circle cx="220" cy="340" r="1.5" fill="#3fa86b" class="plague-p p6"/>
          </svg>
        </div>

        <!-- Quiz / dialogue side -->
        <div class="necro-quiz">
          <div class="quiz-eyebrow t-mono">// THE DEATHSEER WHISPERS</div>
          <h2 class="quiz-title t-rune t-glow-plague">Я спрошу. Ты ответишь.</h2>

          <transition name="route-fade" mode="out-in">
            <div :key="qIndex" v-if="qIndex < questions.length">
              <div class="q-prog t-mono">ВОПРОС {{ qIndex + 1 }} / {{ questions.length }}</div>
              <p class="q-text">{{ current.text }}</p>
              <div class="q-options">
                <button v-for="(opt, i) in current.options" :key="i"
                        class="q-opt"
                        :class="{
                          chosen: chosenIdx === i,
                          correct: revealed && i === current.answer,
                          wrong: revealed && chosenIdx === i && i !== current.answer
                        }"
                        :disabled="revealed"
                        @click="choose(i)">
                  <span class="q-opt-letter">{{ String.fromCharCode(65 + i) }}</span>
                  <span class="q-opt-text">{{ opt }}</span>
                </button>
              </div>
              <div v-if="revealed" class="q-feedback" :class="lastRight ? 'good' : 'bad'">
                {{ lastRight ? '✓ верно — чума идёт по следам' : '✗ мимо — но Necrophos прощает' }}
                <button v-if="qIndex < questions.length" class="btn-cast btn-plague q-next" @click="next">
                  <span>далее →</span>
                </button>
              </div>
            </div>
            <div v-else class="quiz-end">
              <div class="quiz-eyebrow t-mono">// CHRONICLE_COMPLETE</div>
              <h3 class="quiz-title t-rune t-glow-gold">{{ score }} / {{ questions.length }}</h3>
              <p class="quiz-end-msg">
                {{ score === questions.length
                  ? 'Безупречно. Михаил знает Некрофоса как себя.'
                  : score >= 2
                    ? 'Достойно. Чума признала тебя.'
                    : 'Неважно. Главное — что Necrophos твой любимый герой.' }}
              </p>
            </div>
          </transition>
        </div>
      </div>

      <!-- Necro abilities deck -->
      <div class="ability-deck stagger">
        <div v-for="a in abilities" :key="a.name" class="ability anim-float-in">
          <div class="ability-icon" :style="{ background: a.color }">{{ a.icon }}</div>
          <div class="ability-meta">
            <div class="ability-name t-rune">{{ a.name }}</div>
            <div class="ability-desc">{{ a.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <QuestComplete
      :show="qIndex >= questions.length"
      reward="+ SCYTHE OF VYSE · 600 XP"
      message="Necrophos шепчет: «Михаил, ты прошёл моё посвящение. Чума — твой подарок». Идём в Secret Shop."
      next="/quest/5-shopkeeper"
      next-label="К ЛАВКЕ →"
    />
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const questions = [
  {
    text: 'Какая ультимативная способность у Necrophos?',
    options: ['Reaper\'s Scythe', 'Black Hole', 'Reverse Polarity', 'Chronosphere'],
    answer: 0
  },
  {
    text: 'Что делает Heartstopper Aura?',
    options: ['Накладывает бесшумность', 'Снимает HP врагам в радиусе', 'Замедляет всех', 'Восстанавливает ману'],
    answer: 1
  },
  {
    text: 'Какой предмет — символ финала Necrophos?',
    options: ['Aghanim\'s Scepter', 'Battle Fury', 'Radiance', 'Manta Style'],
    answer: 0
  }
]

const qIndex = ref(0)
const chosenIdx = ref(null)
const revealed = ref(false)
const score = ref(0)
const lastRight = ref(false)

const current = computed(() => questions[qIndex.value])

function choose(i) {
  if (revealed.value) return
  chosenIdx.value = i
  revealed.value = true
  lastRight.value = i === current.value.answer
  if (lastRight.value) score.value++
}

function next() {
  qIndex.value++
  chosenIdx.value = null
  revealed.value = false
  if (qIndex.value >= questions.length) {
    quest.complete('necropolis')
    quest.unlock('necro_chronicle')
  }
}

const abilities = [
  { icon: '☠', name: 'Death Pulse', color: 'linear-gradient(180deg, #3fa86b, #0d2818)', desc: 'Волна жизни / урона по всем в радиусе.' },
  { icon: '✚', name: 'Heartstopper Aura', color: 'linear-gradient(180deg, #6dffa8, #1a5c3a)', desc: 'Пассивно режет HP врагам вокруг.' },
  { icon: '☣', name: 'Ghost Shroud', color: 'linear-gradient(180deg, #b6ff5f, #3a5a18)', desc: 'Уворот от физ. атак. Магический урон ×.' },
  { icon: '🜍', name: 'Reaper\'s Scythe', color: 'linear-gradient(180deg, #ffd86b, #c11a3a)', desc: 'Финальный удар. Если враг умирает — стан + долгое возрождение.' }
]
</script>

<style scoped>
.necro-stage {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;
}

@media (max-width: 800px) {
  .necro-stage { grid-template-columns: 1fr; }
}

.necro-portrait {
  padding: 1rem;
  position: sticky;
  top: 100px;
  align-self: start;
}

.aura-pulse { animation: pulse-glow 3s ease-in-out infinite; transform-origin: center; }
.eye-glow {
  filter: drop-shadow(0 0 4px #b6ff5f);
  animation: pulse-glow 1.4s ease-in-out infinite;
}

.plague-p { animation: plague-float 4s ease-in-out infinite; }
.p1 { animation-delay: 0s; }
.p2 { animation-delay: 0.7s; }
.p3 { animation-delay: 1.3s; }
.p4 { animation-delay: 2s; }
.p5 { animation-delay: 2.6s; }
.p6 { animation-delay: 3.2s; }
@keyframes plague-float {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-12px); opacity: 1; }
}

/* === Quiz === */
.necro-quiz { padding: 1rem 0; }

.quiz-eyebrow { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--plague); margin-bottom: 0.5rem; }
.quiz-title { font-size: 1.6rem; margin-bottom: 1.5rem; }

.q-prog { font-size: 0.65rem; letter-spacing: 0.25em; color: var(--ash); margin-bottom: 0.6rem; }
.q-text {
  font-size: 1.2rem;
  font-family: var(--f-body);
  color: var(--bone);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.q-options { display: grid; gap: 0.6rem; }

.q-opt {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: center;
  padding: 0.9rem 1.1rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.4), rgba(13, 10, 20, 0.7));
  border: 1px solid rgba(212, 166, 74, 0.25);
  text-align: left;
  transition: all 0.2s;
  font-size: 1rem;
  color: var(--bone);
}
.q-opt:hover:not(:disabled) {
  border-color: var(--plague);
  background: linear-gradient(180deg, rgba(63, 168, 107, 0.1), rgba(13, 10, 20, 0.85));
  transform: translateX(4px);
}
.q-opt:disabled { cursor: default; }

.q-opt-letter {
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  background: var(--void-2);
  border: 1px solid var(--gold);
  font-family: var(--f-display);
  font-size: 0.85rem;
  color: var(--gold-bright);
}

.q-opt.correct {
  border-color: var(--plague-bright);
  background: linear-gradient(180deg, rgba(109, 255, 168, 0.15), rgba(13, 40, 24, 0.8));
  box-shadow: 0 0 16px rgba(109, 255, 168, 0.3);
}
.q-opt.correct .q-opt-letter { background: var(--plague); border-color: var(--plague-bright); color: var(--void-0); }

.q-opt.wrong {
  border-color: var(--blood);
  background: linear-gradient(180deg, rgba(193, 26, 58, 0.15), rgba(13, 10, 20, 0.85));
}
.q-opt.wrong .q-opt-letter { background: var(--blood-deep); border-color: var(--blood); color: var(--paper); }

.q-feedback {
  margin-top: 1.5rem;
  padding: 1rem 1.3rem;
  border-left: 3px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-style: italic;
}
.q-feedback.good { border-color: var(--plague-bright); color: var(--plague-bright); background: rgba(63, 168, 107, 0.08); }
.q-feedback.bad { border-color: var(--blood); color: var(--blood); background: rgba(193, 26, 58, 0.08); }

.q-next { padding: 0.6rem 1.4rem; font-size: 0.8rem; }

.quiz-end { text-align: center; padding: 2rem 0; }
.quiz-end .quiz-title { font-size: 3rem; margin: 1rem 0; }
.quiz-end-msg { font-size: 1.1rem; color: var(--bone); font-style: italic; max-width: 500px; margin: 0 auto; }

/* === Abilities deck === */
.ability-deck {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.ability {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(13, 40, 24, 0.5), rgba(7, 6, 10, 0.9));
  border: 1px solid rgba(63, 168, 107, 0.35);
  transition: all 0.3s;
}
.ability:hover {
  border-color: var(--plague-bright);
  box-shadow: 0 0 24px rgba(63, 168, 107, 0.3);
  transform: translateY(-2px);
}

.ability-icon {
  width: 56px; height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  border: 1px solid var(--gold);
  filter: drop-shadow(0 0 8px rgba(63, 168, 107, 0.5));
}

.ability-name {
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  color: var(--plague-bright);
  margin-bottom: 0.3rem;
}
.ability-desc { font-size: 0.85rem; color: var(--bone); line-height: 1.4; }
</style>
