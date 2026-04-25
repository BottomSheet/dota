<template>
  <div class="quest-banner anim-float-in">
    <div class="banner-deco-l"></div>
    <div class="banner-content">
      <div class="banner-step t-mono">{{ stepLabel }}</div>
      <h1 class="banner-title t-rune" :class="`glow-${tone}`">
        <slot name="title">{{ title }}</slot>
      </h1>
      <div class="banner-sub" v-if="$slots.sub || subtitle">
        <slot name="sub">{{ subtitle }}</slot>
      </div>
    </div>
    <div class="banner-deco-r"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  step: { type: [Number, String], default: 1 },
  total: { type: Number, default: 9 },
  title: String,
  subtitle: String,
  tone: { type: String, default: 'ember' }
})

const stepLabel = computed(() => {
  const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  return `QUEST ${roman[props.step] || props.step} · OF ${props.total}`
})
</script>

<style scoped>
.quest-banner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(212, 166, 74, 0.2);
  position: relative;
}

.quest-banner::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 25%; right: 25%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.banner-deco-l, .banner-deco-r {
  width: 60px; height: 60px;
  position: relative;
}

.banner-deco-l::before, .banner-deco-r::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid var(--gold);
  transform: rotate(45deg);
  background: radial-gradient(circle, rgba(255, 122, 26, 0.3), transparent);
}
.banner-deco-l::after, .banner-deco-r::after {
  content: '';
  position: absolute;
  inset: 22px;
  background: var(--gold-bright);
  transform: rotate(45deg);
  box-shadow: 0 0 12px var(--gold-bright);
}

.banner-content { text-align: center; }

.banner-step {
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  color: var(--ash);
  margin-bottom: 0.5rem;
}

.banner-title {
  font-size: clamp(1.8rem, 4.5vw, 3.2rem);
  line-height: 1;
  margin-bottom: 0.6rem;
}

.banner-title.glow-ember { color: var(--exort-bright); text-shadow: 0 0 12px rgba(255, 122, 26, 0.6), 0 0 36px rgba(255, 122, 26, 0.3); }
.banner-title.glow-plague { color: var(--plague-bright); text-shadow: 0 0 12px rgba(109, 255, 168, 0.6), 0 0 36px rgba(63, 168, 107, 0.3); }
.banner-title.glow-gold { color: var(--gold-bright); text-shadow: 0 0 12px rgba(255, 216, 107, 0.7), 0 0 36px rgba(212, 166, 74, 0.4); }
.banner-title.glow-blood { color: var(--magenta); text-shadow: 0 0 12px rgba(255, 42, 138, 0.7), 0 0 36px rgba(193, 26, 58, 0.5); }

.banner-sub {
  font-family: var(--f-body);
  font-style: italic;
  color: var(--ash);
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .quest-banner { grid-template-columns: 1fr; gap: 0.5rem; }
  .banner-deco-l, .banner-deco-r { display: none; }
}
</style>
