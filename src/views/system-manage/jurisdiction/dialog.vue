<template>
  <transition name="slide-right">
    <div v-if="isShow" class="my-dialog">1231231</div>
  </transition>
</template>

<script>
export default {
  props: {
    isShow: Boolean
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="scss">
  .my-dialog{
    position: fixed;
    top: 0;
    right: 0;
    width: 500;
    z-index: 10;
  }
</style>
