<template>
    <div class="box" :class="word.correct === true ? 'correct' : word.correct === false ? 'incorrect' : ''" @click="select" :style="doosStyle">
        <span>{{ word.word }}</span>
    </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js';

export default {
    name: 'FlipBox',
    props: ['word'],
    data() {
        return {
            colors: {
                orange: '#FFB74D',
                orangedark: '#EF6C00',
                blue: '#039BE5',
                bluedark: '#0277BD',
                green: '#43A047',
                red: '#E53935',
            },
            boxRotateY: 0,
        }
    },
    computed: {
        doosStyle() {
            let backgroundColor = this.colors.orange
            if (this.word.type === 'en') {
                backgroundColor = this.colors.blue
            }
            if (this.word.selected) {
                backgroundColor = this.colors['orangedark']
                if (this.word.type === 'en') {
                    backgroundColor = this.colors['bluedark']
                }
            }
            if (this.word.correct === true) {
                backgroundColor = this.colors.green
            }
            if (this.word.correct === false) {
                backgroundColor = this.colors.red
            }
            return {
                color: '#ffffff',
                transform: `rotateY(${this.boxRotateY}deg)`,
                '--bg-color': backgroundColor,
            }
        },

    },
    methods: {
        rot(start, end) {
            function animate(time) {
                requestAnimationFrame(animate);
                TWEEN.update(time);
            }
            requestAnimationFrame(animate);

            const rotateBox = { pos: start };
            new TWEEN.Tween(rotateBox)
                .to({ pos: end }, 250)
                .onUpdate(() => { this.boxRotateY = rotateBox.pos; })
                .start()
        },
        select() {
            this.$emit('selected')
        },
    },
    watch: {
        'word.flipping': function(isFlipping) {
            if (isFlipping) {
                this.rot(0, 360)
            }
        },
    },
}
</script>

<style lang="less" scoped>
.box {
    height: calc((100vh - 160px)/5);
    border: 1px solid var(--bg-color);
    background: var(--bg-color);
    font-weight: bold;
    box-sizing: border-box;
    
    display: grid;
    grid-template-rows: 1fr;
    align-items: center;

    &>span {
        word-break: break-word;
    }

    &.correct, &.incorrect {
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
        /* 573 - 160 = 413*/
        height: calc(413px/5);
    }
}
</style>