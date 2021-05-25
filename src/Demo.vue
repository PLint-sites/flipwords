<template>
    <div id="demo">
        <div id="phone">
            <div id="container">
                <Flipwords msg="Flip Words"/>
            </div>
        </div>
    </div>
</template>

<script>
import Flipwords from './components/Flipwords.vue'
export default {
    name: 'Demo',
    components: {
        Flipwords
    }
}
</script>

<style lang="less" scoped>
#demo {
    display: grid;
    place-items: center;
    height: 100vh;

    #container {
        width: 100%;
        height: 100%;
        background: #efefef;
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

</style>