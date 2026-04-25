import { reactive, computed } from 'vue'

const STORAGE_KEY = 'mikhail_quest_21_state'

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return null
}

function saveState(state) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) {}
}

const initial = loadState() || {
  completed: [],   // step ids that are done
  unlocks: [],     // easter egg ids
  invokerSpell: null, // last spell name
  konami: false
}

export const questState = reactive({
  completed: initial.completed,
  unlocks: initial.unlocks,
  invokerSpell: initial.invokerSpell,
  konami: initial.konami,

  complete(stepId) {
    if (!this.completed.includes(stepId)) {
      this.completed.push(stepId)
      saveState(this.snapshot())
    }
  },
  unlock(eggId) {
    if (!this.unlocks.includes(eggId)) {
      this.unlocks.push(eggId)
      saveState(this.snapshot())
    }
  },
  setSpell(name) {
    this.invokerSpell = name
    saveState(this.snapshot())
  },
  setKonami(v) {
    this.konami = v
    saveState(this.snapshot())
  },
  reset() {
    this.completed = []
    this.unlocks = []
    this.invokerSpell = null
    this.konami = false
    saveState(this.snapshot())
  },
  snapshot() {
    return {
      completed: this.completed,
      unlocks: this.unlocks,
      invokerSpell: this.invokerSpell,
      konami: this.konami
    }
  },
  isDone(stepId) { return this.completed.includes(stepId) },
  hasUnlock(id) { return this.unlocks.includes(id) }
})

// Konami code listener — global
let konamiBuf = []
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    konamiBuf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key)
    if (konamiBuf.length > konamiSeq.length) konamiBuf.shift()
    if (konamiBuf.length === konamiSeq.length && konamiBuf.every((k, i) => k === konamiSeq[i])) {
      questState.setKonami(true)
      questState.unlock('konami')
      // Visual feedback
      const flash = document.createElement('div')
      flash.style.cssText = `
        position:fixed;inset:0;z-index:9999;pointer-events:none;
        background:radial-gradient(circle, rgba(109,255,168,0.4), transparent 70%);
        animation: fade-in 0.3s ease, fade-in 0.6s 0.4s ease reverse forwards;
      `
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 1200)
      konamiBuf = []
    }
  })
}
