// 导入类型声明
import { Account, Exchange, Strategy, Position, Order, Quote, Book, PriceType, OrderStatus, StrategyStatus, StrategyPlatformType } from "@xtp-smart/sdk";

// 导入变量声明
import { smart, Utils, Event, Type } from "@xtp-smart/sdk";

namespace demo {

    function isSBStock(instrument_id: string) {
        if (!instrument_id || instrument_id.length != 6) return false;
        return instrument_id.startsWith("30");
    }
    class Plugin {

        private subList: Array<string> = [];
        private accountId: string = "";

        constructor() {
            this.accountId = smart.current_account.account_id;
            this.initTickers();
            this.bindEvent();
            this.initListener();
        }

        private initListener() {
            smart.on(Event.ON_QUOTE, this.onQuote.bind(this));
        }

        private bindEvent() {
            document.getElementById("info_s")?.addEventListener("click", () => {
                this.subscribe();
            })
            document.getElementById("info_us")?.addEventListener("click", () => {
                this.unsubscribe();
            })
        }

        /**
         * Event.ON_INIT 后，静态信息已经准备好，可以直接使用
         * 
         */
        private initTickers() {
            console.info("清点本日证券信息：")
            for (let type in smart.instrument_map_by_type) {
                const list = smart.instrument_map_by_type[type];
                console.info(`${type} counts:`, list.length);
            }
            console.info(`total counts:`, smart.instrument_list.length);

            for (let instrument of smart.instrument_map_by_type.Stock) {
                let rate = (instrument.pre_close_price - instrument.lower_limit_price) / instrument.pre_close_price;
                rate = parseFloat(rate.toFixed(2));

                // 过滤出新股

                // 涨跌幅大于10%, 0.001防止精度问题
                if (rate < 0.1 + 0.001) {
                    continue;
                }

                if (Math.abs(rate - 0.4) < 0.001) {
                    // 涨跌幅在40%，肯定为新股
                    console.info(`涨跌幅: ${rate}`, instrument);
                    continue;
                }

                // 是否科创板股票
                if (Utils.isSTIStock(instrument.instrument_id)) {
                    continue;
                }

                // 是否创业板股票
                if (isSBStock(instrument.instrument_id)) {
                    continue;
                }

                console.info(`涨跌幅: ${rate}`, instrument);
            }
        }

        private subscribe(text?: string) {
            if (!text) {
                text = (document.getElementById("sub_code") as HTMLInputElement).value;
            }

            if (!text || this.subList.includes(text)) {
                return;
            }

            let [code, exchangeStr] = text.split(".");
            const exchangeMap: { [prop: string]: Exchange } = { "SH": Type.Exchange.SSE, "SZ": Type.Exchange.SZE };
            let exchange = exchangeMap[exchangeStr];
            if (!exchange!) {
                // smart.notice({ level: "info", title: "欢迎使用！", msg: "欢迎欢迎" });
                return;
            }
            smart.subscribe(this.accountId, [code], exchange!);
            this.subList.push(text);
            this.renderList();
        }

        private unsubscribe(text?: string) {
            if (!text) {
                text = (document.getElementById("unsub_code") as HTMLInputElement).value;
            }
            text = text.trim();

            if (!text || !this.subList.includes(text)) {
                return;
            }

            let [code, exchangeStr] = text.split(".");
            const exchangeMap: { [prop: string]: Exchange } = { "SH": Type.Exchange.SSE, "SZ": Type.Exchange.SZE };
            let exchange = exchangeMap[exchangeStr];
            if (!exchange!) {
                // smart.notice({ level: "info", title: "欢迎使用！", msg: "欢迎欢迎" });
                return;
            }
            smart.unsubscribe(this.accountId, [code], exchange!);
            const index = this.subList.findIndex(item => item === text);
            this.subList.splice(index, 1);
            this.renderList();
        }

        private onQuote(quote: Quote) {
            console.info("on quote", quote);
            const exchangeMap: { [prop: string]: string } = { "SSE": "SH", "SZE": "SZ" };
            const dom = document.querySelector(`[id='${quote.instrument_id}.${exchangeMap[quote.exchange_id]}'] span`);
            if (!dom) return
            dom.innerHTML = `最新价：${quote.last_price}`;
        }

        private renderList() {
            const list = [];
            for (let text of this.subList) {
                list.push(`<li id="${text}"><lable>${text}</lable> <span></span></li>`);
            }
            const ol = document.getElementById('list');
            if (ol) ol.innerHTML = list.join("")
        }

    }

    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
        new Plugin();
    });
    smart.on(Event.ON_CLOSE, () => {
    });
}
