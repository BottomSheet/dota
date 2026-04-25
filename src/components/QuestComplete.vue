<template>
  <transition name="complete">
    <div v-if="show" class="complete-wrap">
      <div class="complete-card frame-scepter anim-float-in">
        <div class="complete-burst">
          <div class="ray" v-for="n in 12" :key="n" :style="{ transform: `rotate(${n * 30}deg)` }"></div>
        </div>
        <div class="complete-icon">
          <svg viewBox="0 0 60 60" width="60" height="60">
            <defs>
              <radialGradient id="checkg">
                <stop offset="0%" stop-color="#ffd86b"/>
                <stop offset="100%" stop-color="#ff7a1a"/>
              </radialGradient>
            </defs>
            <circle cx="30" cy="30" r="26" fill="url(#checkg)" stroke="#ffd86b" stroke-width="2"/>
            <path d="M18 30 L 27 39 L 44 22" fill="none" stroke="#0d0a14" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
          </svg>
        </div>
        <div class="complete-label t-mono">QUEST COMPLETE</div>
        <div class="complete-reward t-rune">{{ reward }}</div>
        <p class="complete-msg">{{ message }}</p>
        <router-link v-if="next" :to="next" class="btn-cast complete-next">
          <span>{{ nextLabel }}</span>
          <span style="font-size: 1.2em;">→</span>
        </router-link>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  reward: { type: String, default: '+ 350 XP · GOLD' },
  message: { type: String, default: 'Михаил растёт в силе. Следующее испытание ждёт.' },
  next: String,
  nextLabel: { type: String, default: 'Следующий квест' }
})
</script>

<style scoped>
.complete-wrap {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(7, 6, 10, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.complete-card {
  position: relative;
  max-width: 460px;
  width: 100%;
  padding: 3rem 2rem 2rem;
  text-align: center;
  overflow: hidden;
}

.complete-burst {
  position: absolute;
  top: 50px;
  left: 50%;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.ray {
  position: absolute;
  top: 0; left: 0;
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, var(--gold-bright), transparent);
  transform-origin: 0 0;
  opacity: 0.5;
  animation: ray-pulse 2s ease-in-out infinite;
}

@keyframes ray-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.7; }
}

.complete-icon {
  display: flex; justify-content: center;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 24px var(--exort-orange));
  animation: pulse-glow 2s ease-in-out infinite;
}

.complete-label {
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.complete-reward {
  font-size: 1.6rem;
  color: var(--gold-bright);
  text-shadow: 0 0 16px var(--gold);
  margin-bottom: 1.2rem;
}

.complete-msg {
  font-style: italic;
  color: var(--bone);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.complete-next { margin-top: 0.5rem; }

.complete-enter-active { transition: all 0.4s ease; }
.complete-leave-active { transition: all 0.3s ease; }
.complete-enter-from, .complete-leave-to { opacity: 0; }
</style>
