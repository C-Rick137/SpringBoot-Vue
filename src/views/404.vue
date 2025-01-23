<template>
    <div style="text-align: center;">
        <img alt="" src="@/assets/404.png" @click="backHome">
    </div>
</template>

<script setup>
const backHome = () => {
    location.href = '/manager/home'
}
</script>

<style scoped>

</style>