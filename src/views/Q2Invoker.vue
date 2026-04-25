<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="2" tone="ember"
        title="ИЗВОКАЦИЯ"
        subtitle="Три сферы. Десять заклинаний. Найди верную комбинацию для Михаила."
      />

      <div class="invoker-stage">
        <!-- Invoker silhouette -->
        <div class="invoker-art">
          <svg viewBox="0 0 200 280" width="180" height="252">
            <defs>
              <linearGradient id="invk-robe" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#3a2840"/>
                <stop offset="100%" stop-color="#0d0a14"/>
              </linearGradient>
              <radialGradient id="invk-aura">
                <stop offset="0%" stop-color="#ffb04a" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#ff7a1a" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <!-- aura -->
            <ellipse cx="100" cy="140" rx="100" ry="140" fill="url(#invk-aura)" :class="{ 'aura-active': activeOrbs.length > 0 }"/>
            <!-- robe -->
            <path d="M70 80 L 50 250 L 150 250 L 130 80 Q 100 70 70 80 Z" fill="url(#invk-robe)" stroke="#6b4a13" stroke-width="1.5"/>
            <!-- hood -->
            <path d="M60 90 Q 100 30 140 90 L 130 110 Q 100 95 70 110 Z" fill="#0d0a14" stroke="#6b4a13" stroke-width="1.5"/>
            <!-- face shadow -->
            <ellipse cx="100" cy="100" rx="22" ry="28" fill="#000"/>
            <!-- eyes -->
            <ellipse cx="92" cy="98" rx="3" ry="4" fill="#ffb04a" :class="{ 'eye-glow': activeOrbs.length > 0 }"/>
            <ellipse cx="108" cy="98" rx="3" ry="4" fill="#ffb04a" :class="{ 'eye-glow': activeOrbs.length > 0 }"/>
            <!-- staff -->
            <line x1="155" y1="60" x2="170" y2="240" stroke="#6b4a13" stroke-width="3"/>
            <circle cx="155" cy="55" r="10" fill="#ff7a1a" stroke="#ffd86b" stroke-width="2">
              <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>

        <!-- Active orb slots -->
        <div class="orb-slots">
          <div v-for="i in 3" :key="i" class="slot" :class="{ filled: activeOrbs[i-1] }">
            <div v-if="activeOrbs[i-1]" class="orb-token" :class="`orb-${activeOrbs[i-1]}`">
              {{ orbGlyph(activeOrbs[i-1]) }}
            </div>
            <span v-else class="slot-num">{{ i }}</span>
          </div>
        </div>

        <!-- Orb selectors -->
        <div class="orb-row">
          <button class="orb-pick orb-quas"
                  @click="addOrb('q')"
                  :disabled="activeOrbs.length >= 3 || casting">
            <span class="orb-glyph">❄</span>
            <span class="orb-name t-rune">QUAS</span>
            <span class="orb-key t-mono">[Q]</span>
          </button>
          <button class="orb-pick orb-wex"
                  @click="addOrb('w')"
                  :disabled="activeOrbs.length >= 3 || casting">
            <span class="orb-glyph">⚡</span>
            <span class="orb-name t-rune">WEX</span>
            <span class="orb-key t-mono">[W]</span>
          </button>
          <button class="orb-pick orb-exort"
                  @click="addOrb('e')"
                  :disabled="activeOrbs.length >= 3 || casting">
            <span class="orb-glyph">🜂</span>
            <span class="orb-name t-rune">EXORT</span>
            <span class="orb-key t-mono">[E]</span>
          </button>
        </div>

        <!-- Invoke action -->
        <div class="invoke-actions">
          <button class="btn-cast btn-plague" @click="reset" :disabled="activeOrbs.length === 0 || casting">
            <span>сбросить</span>
          </button>
          <button class="btn-cast" @click="invoke"
                  :disabled="activeOrbs.length !== 3 || casting">
            <span class="btn-icon">✦</span>
            <span>INVOKE [R]</span>
          </button>
        </div>

        <!-- Spell result -->
        <div class="spell-display" :class="{ active: !!spellResult }">
          <div v-if="!spellResult" class="spell-empty t-mono">
            // выбери три сферы и активируй INVOKE
          </div>
          <div v-else class="spell-card" :class="`tone-${spellResult.tone}`">
            <div class="spell-icon-big">{{ spellResult.icon }}</div>
            <div class="spell-content">
              <div class="spell-eyebrow t-mono">SPELL CAST · {{ activeOrbs.join('-').toUpperCase() }}</div>
              <h3 class="spell-name t-rune">{{ spellResult.name }}</h3>
              <p class="spell-desc">{{ spellResult.desc }}</p>
              <div class="spell-effect">
                <span class="t-mono">// эффект:</span> {{ spellResult.effect }}
              </div>
            </div>
          </div>
        </div>

        <!-- Hint book -->
        <details class="hintbook">
          <summary class="t-mono">› открыть книгу комбинаций (10 заклинаний)</summary>
          <div class="hint-grid">
            <div v-for="s in spellbook" :key="s.combo" class="hint-row" :class="{ found: foundSpells.includes(s.combo) }">
              <span class="hint-icon">{{ s.icon }}</span>
              <span class="hint-combo t-mono">{{ s.combo.toUpperCase() }}</span>
              <span class="hint-name t-rune">{{ foundSpells.includes(s.combo) ? s.name : '???' }}</span>
            </div>
          </div>
        </details>

        <div class="trial-msg" v-if="winSpell">
          <div class="t-glow-gold t-rune trial-msg-title">★ ВЕРНОЕ ЗАКЛИНАНИЕ ДЛЯ МИХАИЛА ★</div>
          <p>«Sun Strike» — луч с небес, который не промахивается.
             Так и судьба попадает Михаила точно в день рождения. Дальше — некрополис.</p>
        </div>
      </div>
    </div>

    <QuestComplete
      :show="winSpell"
      reward="+ INVOKER WAND · 500 XP"
      message="Луч пробил тучу. Михаилу 21. Заклинание отозвалось."
      next="/quest/3-runes"
      next-label="К РУНАМ →"
    />
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')
const activeOrbs = ref([])
const casting = ref(false)
const spellResult = ref(null)
const foundSpells = ref([])
const winSpell = ref(false)

// All 10 Invoker spells
const spellbook = [
  { combo: 'qqq', icon: '❄', name: 'Cold Snap', desc: 'Лютый мороз заковывает врага.', tone: 'blue', effect: 'фриз на 4 сек.' },
  { combo: 'www', icon: '⚡', name: 'EMP', desc: 'Импульс выжигает ману.', tone: 'violet', effect: 'mana burn — поппинг.' },
  { combo: 'eee', icon: '🜂', name: 'Sun Strike', desc: 'Луч с неба бьёт точно в цель — где бы она ни была.', tone: 'gold', effect: 'true damage по всей карте.' },
  { combo: 'qqw', icon: '👻', name: 'Ghost Walk', desc: 'Невидимая прогулка между мирами.', tone: 'violet', effect: 'invis.' },
  { combo: 'qqe', icon: '❅', name: 'Ice Wall', desc: 'Стена льда замедляет всё.', tone: 'blue', effect: 'slow + dmg.' },
  { combo: 'wwq', icon: '🌀', name: 'Tornado', desc: 'Смерч поднимает героев в воздух.', tone: 'violet', effect: 'lift.' },
  { combo: 'wwe', icon: '✨', name: 'Alacrity', desc: 'Ускоряет атаку и удары союзника.', tone: 'amber', effect: '+attack & spell.' },
  { combo: 'eeq', icon: '🔥', name: 'Forge Spirit', desc: 'Призывает огненного духа.', tone: 'amber', effect: 'summon spirit.' },
  { combo: 'eew', icon: '☄', name: 'Chaos Meteor', desc: 'Метеор катится по линии и сжигает землю.', tone: 'amber', effect: 'rolling dmg.' },
  { combo: 'qwe', icon: '🜬', name: 'Deafening Blast', desc: 'Оглушающий звуковой взрыв.', tone: 'gold', effect: 'aoe disarm + push.' }
]

function orbGlyph(o) {
  return o === 'q' ? '❄' : o === 'w' ? '⚡' : '🜂'
}

function addOrb(o) {
  if (activeOrbs.value.length >= 3 || casting.value) return
  activeOrbs.value.push(o)
}

function reset() {
  activeOrbs.value = []
  spellResult.value = null
}

function invoke() {
  if (activeOrbs.value.length !== 3) return
  casting.value = true
  // Sort to match combo lookup (Invoker rule: order doesn't matter, only counts)
  const counts = { q: 0, w: 0, e: 0 }
  activeOrbs.value.forEach(o => counts[o]++)
  const key = `${'q'.repeat(counts.q)}${'w'.repeat(counts.w)}${'e'.repeat(counts.e)}`

  const found = spellbook.find(s => s.combo === key)
  setTimeout(() => {
    spellResult.value = found
    if (found && !foundSpells.value.includes(found.combo)) {
      foundSpells.value.push(found.combo)
    }
    if (found && found.combo === 'eee') {
      winSpell.value = true
      quest.complete('invoker')
      quest.setSpell(found.name)
      quest.unlock('sun_strike')
    }
    casting.value = false
  }, 600)
}

function onKey(e) {
  const k = e.key.toLowerCase()
  if (k === 'q' || k === 'w' || k === 'e') addOrb(k)
  if (k === 'r') invoke()
  if (e.key === 'Backspace' || e.key === 'Escape') reset()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.invoker-stage {
  display: grid;
  grid-template-areas:
    'art slots'
    'art orbs'
    'art actions'
    'result result'
    'hints hints'
    'win win';
  grid-template-columns: 220px 1fr;
  gap: 2rem 2.5rem;
  align-items: start;
}

@media (max-width: 800px) {
  .invoker-stage {
    grid-template-areas:
      'art'
      'slots'
      'orbs'
      'actions'
      'result'
      'hints'
      'win';
    grid-template-columns: 1fr;
    justify-items: center;
  }
}

.invoker-art {
  grid-area: art;
  position: sticky;
  top: 100px;
}
.aura-active { animation: pulse-glow 2s ease-in-out infinite; }
.eye-glow { filter: drop-shadow(0 0 4px var(--exort-bright)); animation: pulse-glow 1s ease-in-out infinite; }

/* === Slots === */
.orb-slots {
  grid-area: slots;
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.slot {
  width: 70px; height: 70px;
  border: 2px dashed rgba(212, 166, 74, 0.4);
  display: flex; align-items: center; justify-content: center;
  background: rgba(13, 10, 20, 0.5);
  position: relative;
  transition: all 0.3s;
}
.slot.filled {
  border-style: solid;
  border-color: var(--gold);
  background: rgba(255, 122, 26, 0.1);
  box-shadow: 0 0 16px rgba(255, 122, 26, 0.3);
}
.slot-num {
  font-family: var(--f-impact);
  font-size: 1.6rem;
  color: var(--ash);
  opacity: 0.4;
}
.orb-token {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px currentColor);
  animation: float-up 0.4s ease;
}
.orb-q { color: var(--quas-blue); }
.orb-w { color: var(--wex-violet); }
.orb-e { color: var(--exort-orange); }

/* === Orb pickers === */
.orb-row {
  grid-area: orbs;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.orb-pick {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(180deg, rgba(13, 10, 20, 0.8), rgba(7, 6, 10, 0.95));
  border: 2px solid rgba(212, 166, 74, 0.3);
  transition: all 0.25s;
  min-width: 110px;
}
.orb-pick:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: currentColor;
}
.orb-pick:disabled { opacity: 0.4; cursor: not-allowed; }

.orb-quas { border-color: rgba(58, 166, 255, 0.4); color: var(--quas-blue); }
.orb-quas:hover:not(:disabled) { background: rgba(58, 166, 255, 0.12); box-shadow: 0 0 24px rgba(58, 166, 255, 0.4); }
.orb-wex { border-color: rgba(167, 109, 255, 0.4); color: var(--wex-violet); }
.orb-wex:hover:not(:disabled) { background: rgba(167, 109, 255, 0.12); box-shadow: 0 0 24px rgba(167, 109, 255, 0.4); }
.orb-exort { border-color: rgba(255, 122, 26, 0.4); color: var(--exort-orange); }
.orb-exort:hover:not(:disabled) { background: rgba(255, 122, 26, 0.12); box-shadow: 0 0 24px rgba(255, 122, 26, 0.4); }

.orb-glyph { font-size: 2rem; filter: drop-shadow(0 0 8px currentColor); }
.orb-name { font-size: 0.9rem; letter-spacing: 0.2em; }
.orb-key { font-size: 0.65rem; opacity: 0.7; }

/* === Actions === */
.invoke-actions {
  grid-area: actions;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* === Spell display === */
.spell-display { grid-area: result; min-height: 140px; }
.spell-empty {
  text-align: center;
  color: var(--ash);
  opacity: 0.5;
  font-size: 0.85rem;
  padding: 2rem;
  border: 1px dashed rgba(212, 166, 74, 0.2);
}

.spell-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.85), rgba(13, 10, 20, 0.95));
  border: 1px solid var(--gold);
  animation: float-up 0.5s ease;
}
.spell-card.tone-blue { border-color: var(--quas-blue); box-shadow: 0 0 32px rgba(58, 166, 255, 0.25); }
.spell-card.tone-violet { border-color: var(--wex-violet); box-shadow: 0 0 32px rgba(167, 109, 255, 0.25); }
.spell-card.tone-amber { border-color: var(--exort-orange); box-shadow: 0 0 32px rgba(255, 122, 26, 0.25); }
.spell-card.tone-gold { border-color: var(--gold-bright); box-shadow: 0 0 36px rgba(255, 216, 107, 0.4); }

.spell-icon-big {
  font-size: 3.6rem;
  filter: drop-shadow(0 0 16px currentColor);
}
.spell-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--ash);
  margin-bottom: 0.4rem;
}
.spell-name {
  font-size: 1.6rem;
  color: var(--gold-bright);
  margin-bottom: 0.5rem;
}
.spell-desc { color: var(--bone); margin-bottom: 0.5rem; }
.spell-effect {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--exort-bright);
}

/* === Hintbook === */
.hintbook { grid-area: hints; }
.hintbook summary {
  cursor: pointer;
  color: var(--ash);
  font-size: 0.8rem;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(212, 166, 74, 0.2);
  letter-spacing: 0.15em;
  transition: all 0.2s;
}
.hintbook summary:hover { color: var(--gold); border-color: var(--gold); }
.hint-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.4rem;
}
.hint-row {
  display: grid;
  grid-template-columns: 30px auto 1fr;
  gap: 0.6rem;
  align-items: center;
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(212, 166, 74, 0.1);
  font-size: 0.85rem;
  background: rgba(13, 10, 20, 0.5);
}
.hint-row.found { border-color: var(--plague); background: rgba(63, 168, 107, 0.08); }
.hint-icon { font-size: 1.2rem; opacity: 0.8; }
.hint-combo { font-size: 0.7rem; color: var(--exort-bright); letter-spacing: 0.15em; }
.hint-name { font-size: 0.8rem; letter-spacing: 0.1em; color: var(--bone); }

/* === Trial message === */
.trial-msg {
  grid-area: win;
  margin-top: 1.5rem;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(255, 216, 107, 0.08), rgba(13, 10, 20, 0.9));
  border: 1px solid var(--gold-bright);
  animation: float-up 0.6s ease;
}
.trial-msg-title { font-size: 1rem; letter-spacing: 0.3em; margin-bottom: 1rem; }
.trial-msg p { color: var(--bone); font-size: 1.05rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
</style>
