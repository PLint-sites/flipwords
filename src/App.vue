<template>
  <div id="app">
    <Demo/>
  </div>
</template>

<script>
import Demo from './Demo.vue'

export default {
  name: 'App',
  components: {
    Demo
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
