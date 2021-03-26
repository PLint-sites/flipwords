<template>
    <div id="container">
        <div id="word">
            LEVEL UP <span id="level">{{ level }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LevelUpSplash',
    props: ['level']
}
</script>

<style lang="less" scoped>
#container {
    position: absolute;
    top: 0;
    background: #333;
    width: 100%;
    height: 108vh;
    color: #FFB74D;
    left: 0;
    font-weight: bold;

    #word {
        position: relative;
        top: 44%;
        margin-top: -30px;
        font-size: 30px;
        letter-spacing: 2px;

        #level {
            position: relative;
            color: #039BE5;
            font-size: 80px;
            margin-left: 10px;
            top: 11px;
        }
    }
}
</style>