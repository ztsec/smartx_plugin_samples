<template>
    <div class="root">
        <section>
            <h2>K线 （原生DOM操作）</h2>
            <div class="btns">
                <input type="checkbox" @change="dom_toggle" />显示 / 隐藏
                <br />
                <input type="text" v-model="dom_ticker" placeholder="请输入证券代码 例如 : 000001.SZ" />
                <button @click="dom_changeTicker">切换证券</button>
            </div>
            <ul>
                <li>width: {{candle1.KlineWidth}}</li>
                <li>height: {{candle1.KlineHeight}}</li>
                <li>当前显示证券: {{candle1.ticker}}</li>
                <li>当前显示状态: {{candle1.show}}</li>
            </ul>
            <div class="quote">占位</div>
        </section>
        <section>
            <h2>K线 （Vue组件）</h2>
            <div class="btns">
                <input type="checkbox" v-model="candle2.show" />显示 / 隐藏
                <br />
                <input type="text" ref="ticker" placeholder="请输入证券代码 例如 : 000001.SZ" />
                <button @click="candle2.ticker=$refs.ticker.value">切换证券</button>
            </div>
            <ul>
                <li>width: {{candle2.KlineWidth}}</li>
                <li>height: {{candle2.KlineHeight}}</li>
                <li>当前显示证券: {{candle2.ticker}}</li>
                <li>当前显示状态: {{candle2.show}}</li>
            </ul>
            <sxQuotePlaceHolder
                ref="kline"
                v-model="candle2.show"
                :width="candle2.KlineWidth"
                :height="candle2.KlineHeight"
                :ticker="candle2.ticker"
                :candleId="1"
            />
        </section>
    </div>
</template>
<script>

let candleStick;

async function getCandleStick() {
    if (!candleStick) {
        candleStick = await smart.getCandleStick();
    }
    return candleStick;
}

export default {
    name: "App",
    data() {
        return {
            dom_ticker: "",
            candle1: {
                show: "--",
                ticker: "--",
                KlineWidth: "--",
                KlineHeight: "--"
            },
            candle2: {
                show: true,
                ticker: "000001.SH",
                KlineWidth: "70%",
                KlineHeight: "300"
            }
        }
    },
    mounted() {
        this.KlineWidth = this.$refs.kline.style.width;
        this.KlineHeight = this.$refs.kline.style.height;
    },
    methods: {
        /**
         * 纯dom操作，与vue实现无关
         */
        async dom_toggle(event) {
            console.info("dom_toggle", event.target.checked);
            const visible = event.target.checked;
            const candleStick = await getCandleStick();
            console.info("candleStick", candleStick);
            if (visible) {
                const rect = smart.getCandleStickRect(document.querySelector(".quote"));
                console.info("rect", rect);
                await candleStick.show(rect);
            } else {
                await candleStick.hide();
            }

            this.dom_showInfo(candleStick);
        },
        async dom_changeTicker() {
            const candleStick = await getCandleStick();
            await candleStick.changeTicker(this.dom_ticker);

            this.dom_showInfo(candleStick);
        },
        dom_showInfo(candleStick) {
            // console.info("candleStick", candleStick, candleStick._lastRact);
            this.candle1.KlineWidth = candleStick._lastRact.width;
            this.candle1.KlineHeight = candleStick._lastRact.height;
            this.candle1.ticker = candleStick.ticker;
            this.candle1.show = candleStick.visible;
        },

        // vue_toggle(event) {
        //     // const visible = event.target.checked;
        //     this.candle2.show = !this.candle2.show;
        // }

    }
};
</script>
<style scoped>
.root {
    padding: 36px;
    color: #fff;
}
.root section {
    float: left;
    width: 50%;
}
.quote {
    width: 500px;
    height: 500px;
    background-color: brown;
}
.btns > input[type="text"] {
    width: 200px;
}
</style>
