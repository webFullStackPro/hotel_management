<template>
  <div class="home">
    <div class="home-container">{{ $t('welcomeMessage') }}</div>
    <div class="home-container">{{ $t('ad1')}}</div>
    <div class="home-container">{{ $t('ad2')}}</div>
    <div class="home-container">{{ $t('ad3')}}</div>
    <div class="home-container"><img src="../assets/weixinqrcode_small.jpg" :alt="$t('weixinAlt')"/></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-container{
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 22px;
  margin: 10px auto 0;
}
</style>
