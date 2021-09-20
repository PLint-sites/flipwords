<template>
  <div>
    <Splash v-if="gameCompleted">
      <div class="splashscreen" id="startup">
        <h1>Well done!</h1>
        <div style="width:100%;height:0;padding-bottom:45%;position:relative;">
          <iframe src="https://giphy.com/embed/zGnnFpOB1OjMQ" width="100%" height="100%" style="position:absolute; left:0; width:100%; box-sizing:border-box;" frameBorder="0" class="giphy-embed" allowFullScreen>
          </iframe>
        </div>
        <p>You completed all words!</p>
        <h2>Score: {{ points }}</h2>
      </div>
    </Splash>
    <template v-else>
        <Splash v-if="showStartUp">
        <div class="splashscreen" id="startup">
          <h1>Flip Words</h1>
          <p>
            Zoek de Engelse en Nederlandse woorden bij elkaar en haal zo veel mogelijk punten. <br><br>
            Klik een blauw (Engels) en oranje (Nederlands) woord aan om ze te laten flippen!
          </p>
          <button type="button" @click="start">Start game</button>
        </div>
      </Splash>
      <div v-else>
        <h1>Flip Words</h1>
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
        <h3>Level {{ level }}</h3>
      </div>
      <Splash v-if="showNewLevel">
        <div class="splashscreen" id="levelup">
          <span>LEVEL UP</span>
          <span id="level">{{ level }}</span>
        </div>
      </Splash>

      <Splash v-if="showGameOver">
        <div class="splashscreen" id="gameover">
          GAME OVER
          <button type="button" @click="reset">Play again?</button>
        </div>
      </Splash>
    </template>
  </div>
</template>

<script>
import words from '@/words/list'
import FlipBox from './FlipBox'
import Splash from './Splash'

const NUMBER_OF_STARTING_LIVES = 3

export default {
  name: 'Flipwords',
  components: {FlipBox, Splash},
  props: ['wordsForLevel', 'remainingNumberOfWords'],
  data() {
    return {
      flattenedWords: this.wordsForLevel,
      selectedBoxes: [],
      lives: NUMBER_OF_STARTING_LIVES,
      points: 0,
      level: 1,
      showStartUp: true,
      showNewLevel: false,
      showGameOver: false,
      gameCompleted: false,
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
  watch: {
    wordsForLevel(newList) {
      this.flattenedWords = newList
    }
  },
  methods: {
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
      if (this.flattenedWords.length === 0 && this.remainingNumberOfWords === 0) {
        this.gameCompleted = true
      }

      if (this.flattenedWords.length === 0) {
        this.levelUp()
      }
    },
    async handleIncorrect() {
      await this.waitFor()
      this.flattenedWords = this.flattenedWords.map(word => ({...word, correct: (word.flipping ? false : null)}))
      this.lives--

      if (this.lives > 0) {
        // flip back
        await this.waitFor(1000)
        this.flattenedWords = this.flattenedWords.map(word => ({...word, flipping: false, selected: false, correct: null}))
        this.selectedBoxes = []
      } else {
        this.showGameOver = true
      }
    },
    selectWord(i) {
      if (this.numberSelectedBoxes < 2) {
        // check if [i] not in selectedBoxes
        
        // Only continue if this is the first box or, if second box, it is not the same or from same type
        if (this.selectedBoxes.length === 0 || (this.selectedBoxes.length === 1 && this.selectedBoxes[0].type !== this.flattenedWords[i].type)) {
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
    async start() {
      this.showStartUp = false
    },
    async levelUp() {
      this.level++
      // Animate: `Level up: ${this.level}`
      this.showNewLevel = true
      await this.waitFor(2000)
      this.showNewLevel = false

      // init arrays again
      this.$emit('get-new-words')
    },
    async reset() {
      await this.waitFor()
      this.showGameOver = false
      this.lives = NUMBER_OF_STARTING_LIVES
      this.points = 0
      this.selectedBoxes = []
      this.$emit('reset-words-on-game-over')
    },
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

h1 {
  font-size: 28px;
  padding: 7px 0;
  border-bottom: double 3px @orange;
  margin-bottom: 7px;
}

.grid {
  margin-top: 7px;
  margin-bottom: 7px;
  padding: 0 20px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 7px;
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

.splashscreen {
  padding: 0 20px;  
  position: relative;
  font-size: 30px;
  letter-spacing: 2px;

  button {
    display: block;
    background: #039BE5;
    padding: 12px 20px;
    border: 1px solid #0277BD;
    margin-left: auto;
    margin-right: auto;
    width: 200px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
  }
}

#levelup {
  width: 230px;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  display: grid;
  grid-template-columns: 170px 60px;
  align-items: center;

  #level {
    position: relative;
    color: #039BE5;
    font-size: 80px;
  }
}

#gameover {
  color: #E53935;
}

#startup {
  h1 {
    font-size: 40px;
  }

  p {
    font-size: 18px;
  }

  button {
    margin-top: 25px;
    margin-bottom: 25px;
  }
}

@media (min-width: 600px) {
  h1 {
    font-size: 28px;
    padding: 7px 0;
    margin-bottom: 7px;
  }

  .grid {
    margin-top: 7px;
    margin-bottom: 7px;
  }
}
</style>
