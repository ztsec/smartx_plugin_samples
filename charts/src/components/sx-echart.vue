<template>
    <div>
        <div ref="chart" :style="{ width: '600px', height: '300px' }"></div>
    </div>
</template>

<script>
// 引入基本模板
const echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/bar");
// 引入折线图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
    name: "sx-echarts",
    props: {
        texttitle: String,
        textlink: String,
        legenddata: Array,
        axisdata: Array,
        seriesdata: Array,
    },
    data() {
        return {
            title: this.texttitle,
            link: this.textlink,
            legend_data: this.legenddata,
            axis_data: this.axisdata,
            series_data: this.seriesdata,
        };
    },
    mounted() {
        this.drawBar();
    },
    methods: {
        drawBar() {
            const myCharts = echarts.init(this.$refs.chart);
            myCharts.setOption({
                backgroundColor: "#21202D",
                title: {
                    text: this.title,
                    x: "center",
                    link: this.link,
                    textStyle: {
                        color: "#fff",
                    },
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: this.legend_data,
                    left: "center",
                    bottom: "0",
                    textStyle: {
                        color: "#fff",
                    },
                },
                xAxis: [
                    {
                        type: "category",
                        position: "bottom",
                        data: this.axis_data,
                        axisTick: {
                            lineStyle: {
                                color: "#fff",
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: "#fff",
                            },
                            rotate: 30,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        axisLine: {
                            lineStyle: {
                                color: "#fff",
                            },
                        },
                    },
                ],
                series: this.series_data,
            });
        },
    },
};
</script>
