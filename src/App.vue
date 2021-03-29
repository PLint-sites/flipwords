<template>
  <div id="app">
    <Flipwords msg="Flip Words"/>
  </div>
</template>

<script>
import Flipwords from './components/Flipwords.vue'

export default {
  name: 'App',
  components: {
    Flipwords
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
