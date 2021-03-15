<template>
    <div>
        <Echart
            :texttitle="texttitle"
            :textlink="textlink"
            :legenddata="legenddata"
            :axisdata="axisdata"
            :seriesdata="seriesdata"
        ></Echart>
        <Echart
            :texttitle="texttitle"
            :textlink="textlink"
            :legenddata="legenddata"
            :axisdata="axisdata"
            :seriesdata="seriesdata"
        ></Echart>
    </div>
</template>

<script>
import Echart from "@/components/sx-echart.vue";
export default {
    name: "App",
    components: {
        Echart
    },
    data() {
        return {
            texttitle: "过去七日交易额",
            textlink: "https://www.baidu.com",
            legenddata: ["交易额", "交易量"],
            axisdata: [
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
                "星期日"
            ],
            seriesdata: [
                {
                    name: "交易额",
                    type: "bar",
                    data: [2000, 2300, 2400, 2500, 3100, 2100, 2800]
                },
                {
                    name: "交易量",
                    type: "line",
                    symbol: "rect",
                    symbolSize: 10,
                    lineStyle: {
                        normal: {
                            width: 4
                        }
                    },
                    data: [2023, 3044, 2044, 2250, 1450, 3440, 2270]
                }
            ]
        };
    },
};
</script>
