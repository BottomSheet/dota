<template>
  <div class="page home-page">
    <!-- Floating runes -->
    <div class="rune-field">
      <span v-for="(r, i) in runes" :key="i" class="floating-rune"
            :style="{ left: r.x + '%', top: r.y + '%', animationDelay: r.d + 's', color: r.c }">{{ r.s }}</span>
    </div>

    <div class="page-inner">
      <!-- Hero / cover -->
      <section class="cover">
        <div class="cover-flair t-mono anim-fade-in">// ANCIENT_LOGS / 2026-04-25 / SUMMONING_PROTOCOL_INITIATED</div>

        <div class="cover-eyebrow t-rune anim-float-in">
          THE CALL OF AGHANIM · QUEST EDITION
        </div>

        <h1 class="cover-title">
          <span class="line line-1 anim-float-in">МИХАИЛ</span>
          <span class="line line-2 anim-float-in">призывает</span>
          <span class="line line-3 anim-float-in t-glow-ember">
            <span class="lvl-21">21</span>
            <span class="lvl-text">— ый уровень</span>
          </span>
        </h1>

        <div class="cover-meta anim-float-in">
          <div class="meta-cell">
            <div class="meta-k t-mono">HERO</div>
            <div class="meta-v t-rune t-glow-plague">NECROPHOS</div>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-cell">
            <div class="meta-k t-mono">ROLE</div>
            <div class="meta-v t-rune">PLAGUE LORD</div>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-cell">
            <div class="meta-k t-mono">DIFFICULTY</div>
            <div class="meta-v t-rune t-glow-ember">ASCENDANT</div>
          </div>
        </div>

        <p class="cover-prose anim-fade-in">
          Девять испытаний. Древние шепчут твоё имя. Roshan ворочается во сне. Tower на миду уже трещит.
          Ты — герой этой арки, Михаил. Каста начинается.
        </p>

        <div class="cover-cta anim-float-in">
          <router-link to="/quest/1-roshan" class="btn-cast btn-big">
            <span class="btn-icon">⚔</span>
            <span>НАЧАТЬ ИГРУ</span>
            <span class="btn-shortcut">[ENTER]</span>
          </router-link>
          <button class="btn-cast btn-plague btn-secondary" @click="scrollTo('lore')">
            <span>лор &amp; пророчества</span>
          </button>
        </div>
      </section>

      <!-- Quest table of contents -->
      <section class="quest-toc">
        <div class="toc-head">
          <div class="toc-eyebrow t-mono">// QUEST_LOG.dat</div>
          <h2 class="toc-title t-rune">ДЕВЯТЬ ИСПЫТАНИЙ</h2>
          <div class="toc-flair">— к финальному поздравлению —</div>
        </div>

        <div class="toc-grid stagger">
          <article v-for="(q, idx) in quests" :key="idx" class="toc-card anim-float-in"
                   :class="{ done: quest.isDone(q.id) }">
            <div class="toc-num t-rune">{{ q.roman }}</div>
            <div class="toc-body">
              <h3 class="toc-name t-rune">{{ q.name }}</h3>
              <p class="toc-desc">{{ q.desc }}</p>
              <div class="toc-tags">
                <span v-for="t in q.tags" :key="t" class="toc-tag t-mono">{{ t }}</span>
              </div>
            </div>
            <div class="toc-status">
              <span v-if="quest.isDone(q.id)" class="status-done">✓</span>
              <span v-else class="status-locked">▶</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Lore section -->
      <section id="lore" class="lore">
        <div class="lore-head">
          <div class="t-mono toc-eyebrow">// FROM THE BOOK OF AGHANIM, ENTRY XXI</div>
          <h2 class="t-rune toc-title">ПРОРОЧЕСТВО</h2>
        </div>

        <div class="lore-quote frame-plague">
          <div class="quote-mark">«</div>
          <p>
            И когда плагмастер достигнет двадцать первого витка — туман Дайр расступится,
            а из реки выплывет Аганимский скипетр. Тот, кто пройдёт девять испытаний — обретёт право
            на финальный пуш. Не на крип-волну. На самóй ancient.
          </p>
          <div class="quote-attr t-mono">— шепнул Necrophos над свежей могилой</div>
        </div>

        <div class="lore-stats">
          <div class="stat-card frame-scepter">
            <div class="stat-num t-rune t-glow-ember">21</div>
            <div class="stat-label t-mono">YEARS UNLOCKED</div>
          </div>
          <div class="stat-card frame-scepter">
            <div class="stat-num t-rune t-glow-plague">∞</div>
            <div class="stat-label t-mono">MMR ON HORIZON</div>
          </div>
          <div class="stat-card frame-scepter">
            <div class="stat-num t-rune t-glow-gold">9</div>
            <div class="stat-label t-mono">QUESTS REMAINING</div>
          </div>
          <div class="stat-card frame-scepter">
            <div class="stat-num t-rune" style="color: var(--magenta);">1</div>
            <div class="stat-label t-mono">SCYTHE OF VYSE</div>
          </div>
        </div>
      </section>

      <!-- Foot CTA -->
      <section class="foot-cta">
        <div class="foot-line"></div>
        <p class="foot-text t-rune">
          ГОТОВ?
        </p>
        <router-link to="/quest/1-roshan" class="btn-cast btn-big">
          <span class="btn-icon">⚔</span>
          <span>ВОЙТИ В ПЕРВЫЙ КВЕСТ</span>
        </router-link>
        <div class="foot-hint t-mono">
          подсказка: попробуй ↑↑↓↓←→←→ B A · кликни череп ☠ · загляни в консоль F12
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const quest = inject('quest')
const router = useRouter()

const runes = Array.from({ length: 18 }, (_, i) => {
  const symbols = ['⚝', '☄', '☘', '✦', '✧', '⚔', '⚕', '☠', '◈', '◉', '✺']
  const colors = ['#ff7a1a', '#6dffa8', '#3aa6ff', '#a76dff', '#ffd86b']
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    d: Math.random() * 8,
    s: symbols[Math.floor(Math.random() * symbols.length)],
    c: colors[Math.floor(Math.random() * colors.length)]
  }
})

const quests = [
  { id: 'roshan', roman: 'I', name: 'Awaken Roshan', desc: 'Разбудить древнего и узнать, для кого он откроет первое испытание.', tags: ['lore', 'click'] },
  { id: 'invoker', roman: 'II', name: 'Invoke The Spell', desc: 'Скомбинируй три сферы Quas-Wex-Exort и призови верное заклинание.', tags: ['puzzle', 'invoker'] },
  { id: 'runes', roman: 'III', name: 'The Bounty Runes', desc: 'Поймай руны до того, как мид соберёт. Реакция — ключ.', tags: ['reaction', 'arcade'] },
  { id: 'necropolis', roman: 'IV', name: 'Necropolis Trial', desc: 'Любимый герой Михаила раздаёт чуму. Открой шёпот Necrophos.', tags: ['favorite hero'] },
  { id: 'shopkeeper', roman: 'V', name: 'The Secret Shop', desc: 'Собери билд: что положить в инвентарь к 21-му уровню?', tags: ['inventory', 'choice'] },
  { id: 'teamfight', roman: 'VI', name: 'Teamfight at Mid', desc: 'Решающий тимфайт. Прокликай комбу.', tags: ['action', 'combo'] },
  { id: 'aegis', roman: 'VII', name: 'Aegis of the Immortal', desc: 'Возьми эгис. Прочти 21 истину о Михаиле.', tags: ['scroll', 'tribute'] },
  { id: 'ancient', roman: 'VIII', name: 'Push the Ancient', desc: 'Финальная ультимативная атака на трон.', tags: ['climax'] },
  { id: 'finale', roman: 'IX', name: 'Victory · 21', desc: 'GG. WP. Поздравление и стих от барда-доты.', tags: ['poem', 'reward'] }
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function onKey(e) {
  if (e.key === 'Enter') router.push('/quest/1-roshan')
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.home-page { padding-top: 5rem; }

/* === Floating runes === */
.rune-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.floating-rune {
  position: absolute;
  font-size: 1.4rem;
  opacity: 0.25;
  filter: drop-shadow(0 0 6px currentColor);
  animation: rune-drift 14s ease-in-out infinite alternate;
}
@keyframes rune-drift {
  from { transform: translate(0, 0) rotate(0deg); }
  to { transform: translate(20px, -30px) rotate(180deg); }
}

/* === Cover === */
.cover {
  position: relative;
  text-align: center;
  padding: 4rem 0 5rem;
}

.cover-flair {
  font-size: 0.7rem;
  color: var(--plague);
  letter-spacing: 0.3em;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.cover-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.5em;
  color: var(--gold);
  margin-bottom: 2rem;
  animation-delay: 0.1s;
}

.cover-title {
  font-family: var(--f-display);
  font-weight: 900;
  margin-bottom: 2.5rem;
  line-height: 0.95;
}

.line {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.line-1 {
  font-size: clamp(3rem, 9vw, 6.5rem);
  color: var(--paper);
  text-shadow: 0 0 24px rgba(255, 216, 107, 0.3);
  animation-delay: 0.3s;
}
.line-2 {
  font-family: var(--f-body);
  font-style: italic;
  font-weight: 400;
  text-transform: lowercase;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  color: var(--ash);
  letter-spacing: 0.02em;
  margin: 0.5rem 0;
  animation-delay: 0.45s;
}
.line-3 {
  font-size: clamp(3rem, 11vw, 8rem);
  letter-spacing: -0.02em;
  animation-delay: 0.6s;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.lvl-21 {
  font-size: 1.4em;
  font-weight: 900;
  background: linear-gradient(180deg, var(--gold-bright) 0%, var(--exort-orange) 50%, var(--blood) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 16px rgba(255, 122, 26, 0.6));
}
.lvl-text {
  font-size: 0.5em;
  font-family: var(--f-body);
  font-weight: 400;
  font-style: italic;
  text-transform: lowercase;
  color: var(--ash);
  -webkit-text-fill-color: var(--ash);
  letter-spacing: 0;
}

.cover-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
  animation-delay: 0.8s;
}
.meta-cell { text-align: center; }
.meta-k {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--ash);
  margin-bottom: 0.2rem;
}
.meta-v {
  font-size: 0.95rem;
  letter-spacing: 0.15em;
}
.meta-divider {
  width: 1px;
  height: 32px;
  background: linear-gradient(180deg, transparent, var(--gold), transparent);
}

.cover-prose {
  max-width: 600px;
  margin: 1.5rem auto 2.5rem;
  font-size: 1.15rem;
  font-style: italic;
  color: var(--bone);
  animation-delay: 1s;
}

.cover-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation-delay: 1.2s;
}
.btn-big { padding: 1.2rem 2.4rem; font-size: 1rem; }
.btn-icon { font-size: 1.3em; }
.btn-secondary { padding: 1.2rem 2rem; }
.btn-shortcut {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  opacity: 0.6;
  margin-left: 0.5rem;
  letter-spacing: 0.15em;
}

/* === TOC === */
.quest-toc { margin: 6rem 0 4rem; }
.toc-head { text-align: center; margin-bottom: 3rem; }
.toc-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--plague);
  opacity: 0.7;
  margin-bottom: 0.8rem;
}
.toc-title {
  font-size: clamp(2rem, 5vw, 3.4rem);
  color: var(--paper);
  margin-bottom: 0.4rem;
}
.toc-flair {
  font-style: italic;
  color: var(--ash);
  font-size: 1.1rem;
}

.toc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;
}

.toc-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.2rem;
  align-items: center;
  padding: 1.4rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.6), rgba(13, 10, 20, 0.8));
  border: 1px solid rgba(212, 166, 74, 0.2);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.toc-card:hover {
  border-color: var(--exort-orange);
  background: linear-gradient(180deg, rgba(255, 122, 26, 0.08), rgba(13, 10, 20, 0.9));
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 24px rgba(255, 122, 26, 0.2);
}
.toc-card.done {
  border-color: var(--plague);
  background: linear-gradient(180deg, rgba(63, 168, 107, 0.1), rgba(13, 10, 20, 0.85));
}

.toc-num {
  font-size: 2rem;
  color: var(--gold);
  text-shadow: 0 0 12px rgba(212, 166, 74, 0.5);
  min-width: 50px;
  text-align: center;
}
.toc-name {
  font-size: 1.05rem;
  color: var(--paper);
  margin-bottom: 0.3rem;
  letter-spacing: 0.1em;
}
.toc-desc {
  font-size: 0.9rem;
  color: var(--ash);
  margin-bottom: 0.6rem;
  line-height: 1.4;
}
.toc-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.toc-tag {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: var(--exort-bright);
  padding: 0.15rem 0.5rem;
  border: 1px solid rgba(255, 122, 26, 0.4);
  background: rgba(255, 122, 26, 0.08);
  text-transform: uppercase;
}
.toc-status {
  font-size: 1.4rem;
  width: 32px;
  text-align: center;
}
.status-done { color: var(--plague-bright); text-shadow: 0 0 8px var(--plague-bright); }
.status-locked { color: var(--ash); opacity: 0.4; }

/* === Lore === */
.lore { margin: 5rem 0; }
.lore-head { text-align: center; margin-bottom: 2.5rem; }

.lore-quote {
  position: relative;
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 3rem 2rem 2rem;
}
.quote-mark {
  position: absolute;
  top: -12px;
  left: 1.5rem;
  font-family: var(--f-display);
  font-size: 5rem;
  color: var(--plague);
  line-height: 1;
  text-shadow: 0 0 12px var(--plague);
}
.lore-quote p {
  font-family: var(--f-body);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--bone);
  line-height: 1.7;
}
.quote-attr {
  margin-top: 1.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--plague);
  text-align: right;
}

.lore-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
}
.stat-num {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
}
.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: var(--ash);
  margin-top: 0.6rem;
}

/* === Foot CTA === */
.foot-cta {
  text-align: center;
  margin: 6rem 0 2rem;
  padding-top: 4rem;
  position: relative;
}
.foot-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 60px;
  background: linear-gradient(180deg, transparent, var(--gold), var(--exort-orange));
}
.foot-text {
  font-size: 2.4rem;
  color: var(--exort-bright);
  text-shadow: 0 0 20px rgba(255, 122, 26, 0.5);
  margin-bottom: 2rem;
  letter-spacing: 0.3em;
}
.foot-hint {
  margin-top: 2rem;
  font-size: 0.7rem;
  color: var(--plague);
  opacity: 0.6;
  letter-spacing: 0.15em;
}
</style>
