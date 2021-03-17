<template>
  <div class="box" :class="itemClass" @click="select">
    {{ word.word }}
    <span v-if="word.correct">&check;</span>
    <span v-else-if="word.correct === false">&times;</span>
  </div>
</template>

<script>
export default {
  name: 'FlipWord',
  props: ['word'],
  computed: {
    itemClass() {
      let correctClass = 'correct'
      if (this.word.correct === null) {
        correctClass = ''
      } else if (this.word.correct === false) {
        correctClass = 'incorrect'
      }
      return `${this.word.type} ${this.word.selected ? 'selected' : ''} ${this.word.flipping ? 'flipping' : ''} ${correctClass}`
    }
  },
  methods: {
    select() {
      this.$emit('selected')
    },
  },
}
</script>

<style scoped lang="less">
@orange: #FFB74D;
@orangedark: #EF6C00;
@blue: #039BE5;
@bluedark: #0277BD;
@green: #43A047;
@red: #E53935;

.box {
  height: 80px;  
  transition: transform 1s ease-in;

  span {
    position: absolute;
    width: 14px;
    top: 56px;
    left: 50%;
    margin-left: -7px;
    border: 1px solid #fff;
    border-radius: 50%;
    font-size: 10px;
  }

  &:hover {
    cursor: pointer;
  }

  &.flipping {
    transform: rotateY(1440deg);
  }

  &.en {
    border: 1px solid @blue;
    background: @blue;

    &.selected {
      background: @bluedark;

      &.correct {
        background: @green;
        border-color: @green;
        color: white;
      }

      &.incorrect {
        background: @red;
        border-color: @red;
        color: white;
      }
    }
  }

  &.nl {
    border: 1px solid @orange;
    background: @orange;
    
    &.selected {
      background: @orangedark;
      
      &.correct {
        background: @green;
        border-color: @green;
        color: white;
      }

      &.incorrect {
        background: @red;
        border-color: @red;
        color: white;
      }
    }
  }
}
</style>
