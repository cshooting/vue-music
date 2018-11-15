<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>

  import MHeader from "components/m-header/m-header";
  import Tab from "./components/tab/tab";
  export default {
    name: 'App',
    components: {Tab, MHeader}
  }
</script>

<style>

</style>
