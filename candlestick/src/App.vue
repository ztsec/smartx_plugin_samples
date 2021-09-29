<template>
    <div class="root">
        <div class="btns">
            <button @click="show=!show">显示隐藏</button>
            <input type="text" ref="ticker" placeholder="请输入证券代码 例如 : 000001.SZ" />
            <button @click="ticker=$refs.ticker.value">切换证券</button>
        </div>
        <p>width: {{KlineWidth}}</p>
        <p>height: {{KlineHeight}}</p>
        <p>当前显示证券:{{ticker}}</p>
        <p>当前显示状态:{{show}}</p>
        <sxQuotePlaceHolder ref="kline" v-model="show" width="25%" height="300" :ticker="ticker" />
    </div>
</template>
<script>
export default {
    name: "App",
    data() {
        return {
            show: true,
            ticker: "000001.SH",
            KlineWidth: "",
            KlineHeight: ""
        }
    },
    mounted() {
        this.KlineWidth = this.$refs.kline.style.width;
        this.KlineHeight = this.$refs.kline.style.height;
    }
};
</script>
<style scoped>
.root {
    padding: 36px;
}
p {
    color: #fff;
}
.btns > input[type="text"] {
    width: 200px;
}
</style>