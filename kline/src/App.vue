<template>
    <div class="root">
        <sxQuotePlaceHolder v-model="show" width="25%" height="300" :ticker="ticker" />
        <div class="btns">
            <button @click="show=!show">显示隐藏</button>
            <input type="text" ref="ticker" />
            <button @click="ticker=$refs.ticker.value">切换证券</button>
        </div>
    </div>
</template>
<script>
export default {
    name: "App",
    data() {
        return {
            show: true,
            ticker: "000001.SZ"
        }
    },
    created() {

    }
};
</script>
<style scoped>
</style>