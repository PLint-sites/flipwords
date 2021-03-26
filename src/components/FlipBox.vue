<template>
    <div class="box" :class="word.type" @click="select" :style="doosStyle">{{ word.word }}</div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js';

export default {
    name: 'FlipBox',
    props: ['word'],
    data() {
        return {
            boxRotateY: 0,
        }
    },
    computed: {
        doosStyle() {
            return {
                transform: `rotateY(${this.boxRotateY}deg)`,
                background: (this.word.selected) ? 'purple' : ''
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
@orange: #FFB74D;
@orangedark: #EF6C00;
@blue: #039BE5;
@bluedark: #0277BD;
@green: #43A047;
@red: #E53935;

.box {
    height: 80px;  
    border: 1px solid @orange;
    background: @orange;
    font-weight: bold;
    box-sizing: border-box;
    padding-top: 20px;
    line-height: 40px;

    &.en {
        border: 1px solid @blue;
        background: @blue;
    }
}


</style>