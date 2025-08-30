import { reactive } from 'vue'

export const gameStore = reactive({
  diamonds: 1000,
  inventory: [],
  myTeam: Array(9).fill(null), // 9 ô
  enemyTeam: Array(9).fill(null),

  addHero(hero) {
    this.inventory.push(hero)
  },
  spendDiamonds(amount) {
    if (this.diamonds >= amount) {
      this.diamonds -= amount
      return true
    }
    return false
  },
  setMyTeam(pos, hero) {
    if (this.myTeam.filter(Boolean).length >= 5 && !this.myTeam[pos]) return
    this.myTeam[pos] = hero
  },
  randomEnemy(pool) {
    this.enemyTeam = Array(9).fill(null)
    let candidates = [...pool]
    let selected = []
    for (let i = 0; i < 5; i++) {
      let h = candidates[Math.floor(Math.random() * candidates.length)]
      selected.push(h)
    }
    for (let i = 0; i < selected.length; i++) {
      let pos = Math.floor(Math.random() * 9)
      while (this.enemyTeam[pos]) pos = Math.floor(Math.random() * 9)
      this.enemyTeam[pos] = selected[i]
    }
  },
})
