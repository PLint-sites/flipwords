<template>
    <div id="demo">
        <div id="phone">
            <div id="container">
                <Flipwords 
                    :words-for-level="flattenedWords"
                    :remaining-number-of-words="allTheWords.length"
                    @get-new-words="getNewWordsFromList"
                    @reset-words-on-game-over="resetOnGameOver"
                />
            </div>
        </div>
    </div>
</template>

<script>
import words from '@/words/list'
import Flipwords from './components/Flipwords.vue'
export default {
    name: 'Demo',
    components: {
        Flipwords
    },
    data() {
        return {
            flattenedWords: [],
            
            // fixed data
            allTheWords: words,
            boxes: {
                rows: 5,
                cols: 2,
            },
        }
    },
    methods: {
        getNewWordsFromList() {
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
        resetOnGameOver() {
            this.allTheWords = words
            this.getNewWordsFromList()
        },
        randomPickFromList() {
            const numberToPick = this.boxes.cols * this.boxes.rows / 2
            const selectedWordsFromList = this.shuffle(this.allTheWords).slice(0, numberToPick)
            // const selectedWordsFromList = this.allTheWords.slice(0, numberToPick)
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
        shuffle(array) {
            return array.sort(() => Math.random() - 0.5)
        },
    },
    mounted() {
        this.getNewWordsFromList()
    },
}
</script>

<style lang="less" scoped>
#demo {
    display: grid;
    place-items: center;
    height: 100vh;

    #phone {
        width: 100%;
        height: 100%;
    }

    #container {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        overflow-y: hidden;
    }
}

@media (min-width: 600px) {
    #demo {
        background-image: url(assets/background-dictionary.jpg);
        background-size: cover;
        background-position: 50% 50%;

        #phone {
            background-image: url(assets/smartphone-350.png);
            width: 350px;
            height: 703px;
            background-size: 100%;
        }

        #container {
            max-width: 324px;
            max-height: 573px;
            margin-left: 12px;
            margin-top: 68px;

            #image-grid {
                img {
                    height: 52.1px;
                }
            }
        }
    }
}

/* Voor landscape mobile devices */
@media (min-width: 600px) and (max-height: 703px) {
    #demo {
        height: auto;
        padding: 10px 0;
    }
}

</style>