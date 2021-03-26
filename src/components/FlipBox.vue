<template>
    <div class="box" @click="select" :style="doosStyle">
        {{ word.word }}
        <div v-if="word.correct === true">&#10004;</div>
        <div v-if="word.correct === false">&times;</div>
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
    height: 80px;  
    border: 1px solid var(--bg-color);
    background: var(--bg-color);
    font-weight: bold;
    box-sizing: border-box;
    padding-top: 20px;
}


</style>