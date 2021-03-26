<template>
  <div>
    <h1>{{ msg }}</h1>
    <h3>Hoe goed is je engels dan?</h3>
    <p>Klik een blauw (engels) en oranje (nederlands) woord aan om ze te laten flippen! Heb je het goed? Dan verdwijnen ze.</p>
    <div id="scoreboard">
      <span>Lives: {{ lives }}</span>
      <span>Points: {{ points }}</span>
    </div>
    <div v-if="flattenedWords.length" class="grid">
      <FlipBox v-for="i in numberWordsRemaining" 
        :key="`box_${i}`" 
        :word="flattenedWords[i-1]" 
        @selected="selectWord(i-1)"
      />
    </div>
    <LevelUpSplash v-if="showNewLevelSplash" :level="level"/>
  </div>
</template>

<script>
import words from '@/words/list'
import FlipBox from './FlipBox'
import LevelUpSplash from './LevelUpSplash'

export default {
  name: 'Flipwords',
  components: {FlipBox, LevelUpSplash},
  props: {
    msg: String
  },
  data() {
    return {
      allTheWords: words,
      boxes: {
        rows: 5,
        cols: 2,
      },
      flattenedWords: [],
      selectedBoxes: [],
      lives: 3,
      points: 0,
      level: 1,
      showNewLevelSplash: false,
    }
  },
  computed: {
    numberWordsRemaining() {
      return this.flattenedWords.length
    },
    numberSelectedBoxes() {
      return this.selectedBoxes.length
    },
    isCombiWorthChecking() {
      if (this.numberSelectedBoxes !== 2) return false
      const enLength = this.selectedBoxes.filter(word => word.type === 'en').length
      const nlLength = this.selectedBoxes.filter(word => word.type === 'nl').length
      if (enLength === nlLength) {
        return true
      }
      return false
    },
    isCombiCorrect() {
      if (this.isCombiWorthChecking) {
        const enWord = this.selectedBoxes.filter(word => word.type === 'en').pop()
        const nlWord = this.selectedBoxes.filter(word => word.type === 'nl').pop()
        // find english word in list
        const indexInList = words.findIndex(word => word.english === enWord.word)
        if (indexInList > -1 && words[indexInList].translation === nlWord.word) {
          return true
        }
      }
      return false
    },
  },
  methods: {
    init() {
      const flattenedWordsArray = []
      const randomWordsFromList = this.randomPickFromList()
      randomWordsFromList.forEach(({english, translation}) => {
        flattenedWordsArray.push({
          word: english, 
          type: 'en', 
          selected: false,
          flipping: false,
          correct: null,
        })
        flattenedWordsArray.push({
          word: translation, 
          type: 'nl', 
          selected: false,
          flipping: false,
          correct: null,
        })
      })
      this.flattenedWords = this.shuffle(flattenedWordsArray)
    },
    shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    },
    waitFor(delay = 500) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, delay)
      })
    },
    markWordAsSelected(i) {
      this.selectedBoxes.push(this.flattenedWords[i])
      this.flattenedWords[i].selected = true
    },
    async handleCorrect() {
      await this.waitFor()
      this.flattenedWords = this.flattenedWords.map(word => ({...word, correct: (word.flipping ? true : null)}))
      this.points++

      // na een timeout van 1 seconde, verwijder woorden uit het grid
      await this.waitFor(1000)
      this.flattenedWords = this.flattenedWords.filter(word => !word.correct)

      // clear selected boxes
      this.selectedBoxes = []

      // continue if level completed
      if (this.flattenedWords.length === 0) {
        this.levelUp()
      }
    },
    async handleIncorrect() {
      await this.waitFor()
      this.flattenedWords = this.flattenedWords.map(word => ({...word, correct: (word.flipping ? false : null)}))
      this.lives--
      // flip back
      await this.waitFor(1000)
      this.flattenedWords = this.flattenedWords.map(word => ({...word, flipping: false, selected: false, correct: null}))
      this.selectedBoxes = []
    },
    selectWord(i) {
      if (this.numberSelectedBoxes < 2) {
        // check if [i] not in selectedBoxes
        if (this.selectedBoxes.length === 0 || this.selectedBoxes.findIndex(word => word.word === this.flattenedWords[i].word) === -1) {
          this.markWordAsSelected(i)

          if (this.numberSelectedBoxes === 2) {
            // start flipping
            this.flattenedWords = this.flattenedWords.map(word => ({...word, flipping: word.selected}))

            // check if correct
            if (this.isCombiWorthChecking) {

              if (this.isCombiCorrect) {
                this.handleCorrect()
              } else {
                this.handleIncorrect()
              }
            }
          }
        } 
      }
    },
    async levelUp() {
      this.level++
      // Animate: `Level up: ${this.level}`
      this.showNewLevelSplash = true
      await this.waitFor(2000)
      this.showNewLevelSplash = false

      // init arrays again
      this.init()
    },
    randomPickFromList() {
      const numberToPick = this.boxes.cols * this.boxes.rows / 2
      const selectedWordsFromList = this.shuffle(this.allTheWords).slice(0, numberToPick)
      // remove them from allTheWords
      this.allTheWords = this.allTheWords.filter(word => {
        // indien word in selectedWordsFromList return false
        if (selectedWordsFromList.find(item => item.english === word.english)) {
          return false
        }
        return true
      })
      return selectedWordsFromList
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style scoped lang="less">
@orange: #FFB74D;

#doos {
  background: @orange;
  width: 150px;
  height: 120px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  padding-top: 35px;
  box-sizing: border-box;
  font-weight: bold;
}

a {
  color: #42b983;
}

h3 {
  border-bottom: double 3px @orange;
  display: inline;
}

.grid {
  margin-top: 10px;
  padding: 0 20px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;  
  grid-gap: 10px;
  box-sizing: border-box;
  align-items: center;
}

#scoreboard {
  padding: 0 20px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  box-sizing: border-box;

  span {
    text-transform: capitalize;
    font-weight: bold;
  }
}

</style>
