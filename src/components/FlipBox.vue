<template>
    <div class="box" :class="word.correct === true ? 'correct' : word.correct === false ? 'incorrect' : ''" @click="select" :style="doosStyle">
        <span>{{ word.word }}</span>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, toRefs, watch } from 'vue'
import TWEEN from '@tweenjs/tween.js'

const props = defineProps({
    word: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['selected'])
const { word } = toRefs(props)

const colors = {
    orange: '#FFB74D',
    orangedark: '#EF6C00',
    blue: '#039BE5',
    bluedark: '#0277BD',
    green: '#43A047',
    red: '#E53935',
}

const boxRotateY = ref(0)
let animationFrameId = null

const doosStyle = computed(() => {
    let backgroundColor = colors.orange

    if (word.value.type === 'en') {
        backgroundColor = colors.blue
    }

    if (word.value.selected) {
        backgroundColor = colors.orangedark
        if (word.value.type === 'en') {
            backgroundColor = colors.bluedark
        }
    }

    if (word.value.correct === true) {
        backgroundColor = colors.green
    }

    if (word.value.correct === false) {
        backgroundColor = colors.red
    }

    return {
        color: '#ffffff',
        transform: `rotateY(${boxRotateY.value}deg)`,
        '--bg-color': backgroundColor,
    }
})

function rot(start, end) {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }

    const rotateBox = { pos: start }
    const tween = new TWEEN.Tween(rotateBox)
        .to({ pos: end }, 250)
        .onUpdate(() => {
            boxRotateY.value = rotateBox.pos
        })
        .start()

    const animate = (time) => {
        if (tween.update(time)) {
            animationFrameId = requestAnimationFrame(animate)
        } else {
            animationFrameId = null
        }
    }

    animationFrameId = requestAnimationFrame(animate)
}

function select() {
    emit('selected')
}

watch(
    () => word.value.flipping,
    (isFlipping) => {
        if (isFlipping) {
            rot(0, 360)
        }
    }
)

onBeforeUnmount(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
})
</script>

<style lang="less" scoped>
.box {
    height: calc((100vh - 210px)/5);
    border: 1px solid var(--bg-color);
    background: var(--bg-color);
    font-weight: bold;
    box-sizing: border-box;

    display: grid;
    grid-template-rows: 1fr;
    align-items: center;

    & > span {
        word-break: break-word;
    }

    &.correct,
    &.incorrect {
        span {
            opacity: 0.5;
        }

        &::after {
            position: absolute;
            content: '\2713';
            color: #fff;
            left: 50%;
            top: 50%;
            margin-top: -30px;
            margin-left: -14px;
            font-size: 50px;
        }
    }

    &.incorrect::after {
        content: '\00D7';
        margin-top: -33px;
    }
}

@media (min-width: 600px) {
    .box {
        /* 573 - 160 = 413 */
        height: calc(413px/5);
    }
}
</style>