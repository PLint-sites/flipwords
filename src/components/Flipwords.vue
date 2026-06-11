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
                <FlipBox
                    v-for="i in numberWordsRemaining"
                    :key="`box_${i}`"
                    :word="flattenedWords[i - 1]"
                    @selected="selectWord(i - 1)"
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

<script setup>
import { computed, ref, watch } from 'vue'
import words from '@/words/list'
import FlipBox from './FlipBox.vue'
import Splash from './Splash.vue'

const NUMBER_OF_STARTING_LIVES = 3

const props = defineProps({
    wordsForLevel: {
        type: Array,
        required: true,
    },
    remainingNumberOfWords: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['get-new-words', 'reset-words-on-game-over'])

const flattenedWords = ref(props.wordsForLevel)
const selectedBoxes = ref([])
const lives = ref(NUMBER_OF_STARTING_LIVES)
const points = ref(0)
const level = ref(1)
const showStartUp = ref(true)
const showNewLevel = ref(false)
const showGameOver = ref(false)
const gameCompleted = ref(false)

const numberWordsRemaining = computed(() => flattenedWords.value.length)
const numberSelectedBoxes = computed(() => selectedBoxes.value.length)
const isCombiWorthChecking = computed(() => {
    if (numberSelectedBoxes.value !== 2) {
        return false
    }

    const enLength = selectedBoxes.value.filter((word) => word.type === 'en').length
    const nlLength = selectedBoxes.value.filter((word) => word.type === 'nl').length

    return enLength === nlLength
})

const isCombiCorrect = computed(() => {
    if (!isCombiWorthChecking.value) {
        return false
    }

    const enWord = selectedBoxes.value.filter((word) => word.type === 'en').pop()
    const nlWord = selectedBoxes.value.filter((word) => word.type === 'nl').pop()
    const indexInList = words.findIndex((word) => word.english === enWord.word)

    return indexInList > -1 && words[indexInList].translation === nlWord.word
})

watch(
    () => props.wordsForLevel,
    (newList) => {
        flattenedWords.value = newList
    }
)

function waitFor(delay = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

function markWordAsSelected(index) {
    selectedBoxes.value.push(flattenedWords.value[index])
    flattenedWords.value[index].selected = true
}

async function handleCorrect() {
    await waitFor()
    flattenedWords.value = flattenedWords.value.map((word) => ({ ...word, correct: word.flipping ? true : null }))
    points.value += 1

    await waitFor(1000)
    flattenedWords.value = flattenedWords.value.filter((word) => !word.correct)
    selectedBoxes.value = []

    if (flattenedWords.value.length === 0 && props.remainingNumberOfWords === 0) {
        gameCompleted.value = true
    }

    if (flattenedWords.value.length === 0) {
        levelUp()
    }
}

async function handleIncorrect() {
    await waitFor()
    flattenedWords.value = flattenedWords.value.map((word) => ({ ...word, correct: word.flipping ? false : null }))
    lives.value -= 1

    if (lives.value > 0) {
        await waitFor(1000)
        flattenedWords.value = flattenedWords.value.map((word) => ({ ...word, flipping: false, selected: false, correct: null }))
        selectedBoxes.value = []
    } else {
        showGameOver.value = true
    }
}

function selectWord(index) {
    if (numberSelectedBoxes.value < 2) {
        const firstSelected = selectedBoxes.value[0]
        const canSelectSecond = selectedBoxes.value.length === 1 && firstSelected.type !== flattenedWords.value[index].type

        if (selectedBoxes.value.length === 0 || canSelectSecond) {
            markWordAsSelected(index)

            // marking as selected now increases the number of selected boxes.

            if (numberSelectedBoxes.value === 2) {
                flattenedWords.value = flattenedWords.value.map((word) => ({ ...word, flipping: word.selected }))
                if (isCombiWorthChecking.value) {
                    if (isCombiCorrect.value) {
                        handleCorrect()
                    } else {
                        handleIncorrect()
                    }
                }
            }
        }
    }
}

function start() {
    showStartUp.value = false
}

async function levelUp() {
    level.value += 1
    showNewLevel.value = true
    await waitFor(2000)
    showNewLevel.value = false
    emit('get-new-words')
}

async function reset() {
    await waitFor()
    showGameOver.value = false
    lives.value = NUMBER_OF_STARTING_LIVES
    points.value = 0
    selectedBoxes.value = []
    emit('reset-words-on-game-over')
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
