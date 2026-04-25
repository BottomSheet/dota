<template>
  <div class="page">
    <div class="page-inner">
      <QuestBanner step="5" tone="gold"
        title="ТАЙНАЯ ЛАВКА"
        subtitle="6 слотов в инвентаре. Twenty первый уровень близко. Что соберёт Михаил для финального пуша?"
      />

      <div class="shop-stage">
        <!-- Inventory -->
        <div class="inventory frame-scepter">
          <div class="inv-head">
            <div class="t-mono inv-eyebrow">// MIKHAIL_INVENTORY · 6/6 SLOTS</div>
            <div class="inv-gold">
              <span class="t-mono">GOLD</span>
              <span class="t-rune t-glow-gold">{{ goldLeft }}</span>
            </div>
          </div>
          <div class="inv-grid">
            <div v-for="i in 6" :key="i" class="inv-slot"
                 :class="{ filled: !!inventory[i-1] }"
                 @click="removeFromSlot(i-1)">
              <template v-if="inventory[i-1]">
                <div class="inv-icon" :style="{ background: inventory[i-1].color }">
                  {{ inventory[i-1].icon }}
                </div>
                <div class="inv-name t-mono">{{ inventory[i-1].name }}</div>
              </template>
              <template v-else>
                <span class="slot-empty t-mono">slot {{ i }}</span>
              </template>
            </div>
          </div>
          <div class="inv-status">
            <span class="t-mono">FILLED:</span>
            <span class="t-rune">{{ filled }} / 6</span>
            <button v-if="filled === 6" class="btn-cast" @click="confirm">
              <span class="btn-icon">✓</span><span>READY · IDЁМ В БОЙ</span>
            </button>
          </div>
        </div>

        <!-- Shop catalog -->
        <div class="catalog">
          <div class="cat-head">
            <div class="t-mono cat-eyebrow">// SECRET_SHOP.catalog</div>
            <div class="cat-tabs">
              <button v-for="t in tabs" :key="t.key"
                      class="tab-btn t-mono"
                      :class="{ active: tab === t.key }"
                      @click="tab = t.key">
                {{ t.label }}
              </button>
            </div>
          </div>

          <div class="cat-grid">
            <button v-for="item in filteredItems" :key="item.id"
                    class="shop-item"
                    @click="buy(item)"
                    :disabled="!canAfford(item) || filled >= 6">
              <div class="shop-icon" :style="{ background: item.color }">{{ item.icon }}</div>
              <div class="shop-meta">
                <div class="shop-name t-rune">{{ item.name }}</div>
                <div class="shop-desc">{{ item.desc }}</div>
                <div class="shop-row">
                  <span class="shop-price" :class="{ 'no-afford': !canAfford(item) }">
                    <span class="coin">◉</span> {{ item.price }}
                  </span>
                  <span class="shop-tag t-mono">{{ item.tag }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Build review -->
      <transition name="route-fade">
        <div v-if="reviewed" class="build-review frame-plague">
          <div class="t-mono cat-eyebrow">// BUILD_ANALYSIS</div>
          <h3 class="review-title t-rune t-glow-gold">{{ reviewTitle }}</h3>
          <p class="review-text">{{ reviewText }}</p>
          <div class="review-flags">
            <span v-for="f in flags" :key="f" class="review-flag t-mono">{{ f }}</span>
          </div>
        </div>
      </transition>
    </div>

    <QuestComplete
      :show="reviewed"
      reward="+ 6 ARTEFACTS · 720 XP"
      message="Билд готов. Михаил выходит на финал. Тимфайт впереди."
      next="/quest/6-teamfight"
      next-label="К ТИМФАЙТУ →"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import QuestBanner from '../components/QuestBanner.vue'
import QuestComplete from '../components/QuestComplete.vue'

const quest = inject('quest')

const startingGold = 24000
const inventory = ref([null, null, null, null, null, null])
const reviewed = ref(false)

const items = [
  // Core
  { id: 1, icon: '👑', name: 'Aghanim\'s Scepter', price: 4200, tag: 'core', color: 'linear-gradient(180deg, #ffd86b, #6b4a13)', desc: 'Усиление ультимейта. Святой грааль билда.', bonus: 'agh' },
  { id: 2, icon: '🜏', name: 'Scythe of Vyse', price: 5675, tag: 'core', color: 'linear-gradient(180deg, #b6ff5f, #1a5c3a)', desc: 'Превращает врага в свинью. Necrophos одобряет.', bonus: 'scythe' },
  { id: 3, icon: '⚛', name: 'Refresher Orb', price: 5000, tag: 'core', color: 'linear-gradient(180deg, #3aa6ff, #1a3a5c)', desc: 'Сброс кулдаунов. Двойная коса!', bonus: 'refresh' },
  { id: 4, icon: '☄', name: 'Shiva\'s Guard', price: 4850, tag: 'core', color: 'linear-gradient(180deg, #aaccff, #2a4a6c)', desc: 'Aoe замедление + AoE дамаг.', bonus: 'shiva' },
  // Defense
  { id: 5, icon: '☥', name: 'Heart of Tarrasque', price: 5100, tag: 'def', color: 'linear-gradient(180deg, #c11a3a, #5a0a18)', desc: '+45 STR, регенерация. Бессмертие.', bonus: 'heart' },
  { id: 6, icon: '🜨', name: 'Black King Bar', price: 4050, tag: 'def', color: 'linear-gradient(180deg, #2a2040, #0d0a14)', desc: 'Магический иммунитет. Танкуй ультимы.', bonus: 'bkb' },
  { id: 7, icon: '◈', name: 'Pipe of Insight', price: 3175, tag: 'def', color: 'linear-gradient(180deg, #d4a64a, #6b4a13)', desc: 'Aoe магический барьер.', bonus: 'pipe' },
  // Mobility / utility
  { id: 8, icon: '✈', name: 'Boots of Travel', price: 2500, tag: 'mob', color: 'linear-gradient(180deg, #6b4a13, #2a1810)', desc: 'Тп на любую крип-волну.', bonus: 'bot' },
  { id: 9, icon: '◐', name: 'Force Staff', price: 2200, tag: 'mob', color: 'linear-gradient(180deg, #a76dff, #3a2840)', desc: 'Толкни себя или союзника на 600.', bonus: 'force' },
  { id: 10, icon: '⊛', name: 'Eul\'s Scepter', price: 2725, tag: 'mob', color: 'linear-gradient(180deg, #aaccff, #2a4a6c)', desc: 'Закрутить врага в торнадо.', bonus: 'euls' },
  // Cheap traps
  { id: 11, icon: '☘', name: 'Bottle of Tears', price: 600, tag: 'trap', color: 'linear-gradient(180deg, #3fa86b, #0d2818)', desc: 'Очень обычная бутылка слёз. Подозрительно.', bonus: 'tears' },
  { id: 12, icon: '🍕', name: 'Pizza Slice', price: 200, tag: 'trap', color: 'linear-gradient(180deg, #ffb04a, #6b4a13)', desc: 'Не предмет. Не используется в Dota. Но вкусно.', bonus: 'pizza' }
]

const tabs = [
  { key: 'all', label: 'ALL' },
  { key: 'core', label: 'CORE' },
  { key: 'def', label: 'DEFENSE' },
  { key: 'mob', label: 'MOBILITY' },
  { key: 'trap', label: 'CURIOS' }
]

const tab = ref('all')

const filteredItems = computed(() => {
  if (tab.value === 'all') return items
  return items.filter(i => i.tag === tab.value)
})

const filled = computed(() => inventory.value.filter(Boolean).length)
const goldLeft = computed(() => {
  const spent = inventory.value.filter(Boolean).reduce((s, i) => s + i.price, 0)
  return startingGold - spent
})

function canAfford(item) { return goldLeft.value >= item.price }

function buy(item) {
  const slot = inventory.value.findIndex(s => !s)
  if (slot === -1) return
  inventory.value[slot] = item
}

function removeFromSlot(idx) {
  inventory.value[idx] = null
}

const flags = ref([])
const reviewTitle = ref('')
const reviewText = ref('')

function confirm() {
  flags.value = []
  const bonuses = inventory.value.map(i => i?.bonus).filter(Boolean)
  let score = 0

  if (bonuses.includes('agh')) { score += 2; flags.value.push('+ AGH SCEPTER') }
  if (bonuses.includes('scythe')) { score += 2; flags.value.push('+ NECRO COMBO') }
  if (bonuses.includes('refresh')) { score += 2; flags.value.push('+ DOUBLE ULT') }
  if (bonuses.includes('heart') || bonuses.includes('bkb')) { score += 1; flags.value.push('+ SURVIVAL') }
  if (bonuses.includes('shiva') || bonuses.includes('pipe')) { score += 1; flags.value.push('+ TEAM AURA') }
  if (bonuses.includes('bot')) { score += 1; flags.value.push('+ MAP CONTROL') }
  if (bonuses.includes('tears')) { flags.value.push('? BOTTLE OF TEARS') }
  if (bonuses.includes('pizza')) { flags.value.push('? PIZZA') }

  if (score >= 6) {
    reviewTitle.value = 'GOD-TIER BUILD'
    reviewText.value = 'Михаил собрал чистейший Necrophos late-game стак. С таким билдом тимфайт уже выигран. Aghanim + Scythe + Refresher = двойной reaper, и враг просто не существует.'
  } else if (score >= 3) {
    reviewTitle.value = 'СОЛИДНЫЙ БИЛД'
    reviewText.value = 'Нормально. Не Reddit-постом, но в матче работает. У Михаила есть, чем удивить ancient.'
  } else {
    reviewTitle.value = 'СПОРНЫЙ ВЫБОР'
    reviewText.value = 'Бутылка слёз и пицца — это смело. Но Михаилу 21, в этом возрасте уже можно делать что угодно.'
  }

  reviewed.value = true
  quest.complete('shopkeeper')
  if (bonuses.includes('pizza')) quest.unlock('pizza_easter')
  if (bonuses.includes('agh') && bonuses.includes('scythe') && bonuses.includes('refresh')) {
    quest.unlock('god_build')
  }
}
</script>

<style scoped>
.shop-stage {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .shop-stage { grid-template-columns: 1fr; }
}

/* === Inventory === */
.inventory {
  padding: 1.5rem;
  position: sticky;
  top: 100px;
}
.inv-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px dashed rgba(212, 166, 74, 0.2);
}
.inv-eyebrow { font-size: 0.65rem; letter-spacing: 0.25em; color: var(--ash); }
.inv-gold { display: flex; align-items: baseline; gap: 0.5rem; }
.inv-gold .t-mono { font-size: 0.7rem; color: var(--gold); letter-spacing: 0.2em; }
.inv-gold .t-rune { font-size: 1.4rem; }

.inv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.inv-slot {
  aspect-ratio: 1;
  border: 1px dashed rgba(212, 166, 74, 0.35);
  background: rgba(13, 10, 20, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.inv-slot.filled {
  border-style: solid;
  border-color: var(--gold);
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.8), rgba(13, 10, 20, 0.95));
  box-shadow: 0 0 12px rgba(255, 122, 26, 0.15);
}
.inv-slot.filled:hover { box-shadow: 0 0 16px rgba(193, 26, 58, 0.4); border-color: var(--blood); }
.inv-slot.filled:hover::after {
  content: '× clear';
  position: absolute;
  bottom: 4px;
  font-size: 0.55rem;
  color: var(--blood);
  letter-spacing: 0.15em;
  font-family: var(--f-mono);
}

.slot-empty {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: var(--ash);
  opacity: 0.4;
}

.inv-icon {
  width: 44px; height: 44px;
  border: 1px solid var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
  filter: drop-shadow(0 0 6px rgba(255, 216, 107, 0.3));
}

.inv-name {
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  color: var(--bone);
  text-align: center;
  line-height: 1.1;
}

.inv-status {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(212, 166, 74, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.inv-status .t-mono { font-size: 0.65rem; color: var(--ash); letter-spacing: 0.2em; }
.inv-status .t-rune { font-size: 1rem; color: var(--exort-bright); }

/* === Catalog === */
.catalog { padding: 0.5rem 0; }

.cat-head { margin-bottom: 1rem; }
.cat-eyebrow { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--plague); margin-bottom: 0.8rem; }

.cat-tabs {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(212, 166, 74, 0.15);
}
.tab-btn {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--ash);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  margin-bottom: -1px;
}
.tab-btn:hover { color: var(--gold); }
.tab-btn.active {
  color: var(--gold-bright);
  border-bottom-color: var(--gold);
  text-shadow: 0 0 8px rgba(255, 216, 107, 0.4);
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.7rem;
}

.shop-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: stretch;
  padding: 0.8rem;
  background: linear-gradient(180deg, rgba(31, 24, 48, 0.5), rgba(13, 10, 20, 0.85));
  border: 1px solid rgba(212, 166, 74, 0.2);
  text-align: left;
  transition: all 0.2s;
}
.shop-item:hover:not(:disabled) {
  border-color: var(--gold);
  background: linear-gradient(180deg, rgba(255, 122, 26, 0.05), rgba(13, 10, 20, 0.92));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}
.shop-item:disabled { opacity: 0.4; cursor: not-allowed; }

.shop-icon {
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem;
  border: 1px solid var(--gold);
  filter: drop-shadow(0 0 6px rgba(212, 166, 74, 0.3));
}

.shop-meta { display: flex; flex-direction: column; gap: 0.25rem; }
.shop-name { font-size: 0.8rem; letter-spacing: 0.1em; color: var(--paper); }
.shop-desc { font-size: 0.78rem; color: var(--ash); flex-grow: 1; line-height: 1.3; }

.shop-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.3rem;
}
.shop-price {
  font-family: var(--f-impact);
  font-size: 1rem;
  color: var(--gold-bright);
  display: flex; align-items: center; gap: 0.3rem;
}
.shop-price.no-afford { color: var(--blood); }
.coin { font-size: 0.8rem; }

.shop-tag {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: var(--plague);
  text-transform: uppercase;
  padding: 0.15rem 0.4rem;
  border: 1px solid rgba(63, 168, 107, 0.4);
}

/* === Build review === */
.build-review {
  margin-top: 2.5rem;
  padding: 2rem;
}
.review-title { font-size: 1.6rem; margin: 0.5rem 0 1rem; }
.review-text { color: var(--bone); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1rem; }

.review-flags {
  display: flex; gap: 0.4rem; flex-wrap: wrap;
}
.review-flag {
  padding: 0.3rem 0.7rem;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  border: 1px solid var(--plague);
  color: var(--plague-bright);
  background: rgba(63, 168, 107, 0.08);
}
</style>
