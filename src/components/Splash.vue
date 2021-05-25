<template>
    <div id="splash-container">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Splash',
}
</script>

<style lang="less" scoped>
#splash-container {
    position: absolute;
    top: 0;
    background: #333;
    width: 100%;
    height: 108vh;
    color: #FFB74D;
    left: 0;
    font-weight: bold;
}
</style>