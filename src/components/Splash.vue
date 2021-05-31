<template>
    <div id="splash-container">
        <div id="splash-grid">
            <slot></slot>
        </div>
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
    height: 100vh;
    color: #FFB74D;
    left: 0;
    font-weight: bold;

    #splash-grid {
        height: 100%;
        display: grid;
        align-items: center;
    }
}

@media (min-width: 600px) {
    #splash-container {
        height: 100%;
    }
}
</style>