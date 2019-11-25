<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
  #app {
    height: 100%;
  }
  @import "./style/style";
  .toolbar {
    background: #fff;
    height: 30px;
    padding: 5px 5px 5px 20px;
    margin-bottom: 10px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
