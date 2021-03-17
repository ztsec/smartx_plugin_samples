// 导入类型声明
import { Account, Exchange, Strategy, Position, Order, Trade, Quote, Book, PriceType, OrderStatus, StrategyStatus, StrategyPlatformType, StatusChangeEvent } from "@xtp-smart/sdk/typings";

// 导入变量声明
import { smart, Utils, Event, Type } from "@xtp-smart/sdk";

namespace demo {


    class Plugin {
        private account: Account;
        private strategies: {
            [propName: string]: Strategy
        };

        private domHelper = new DomHelper();

        constructor() {
            this.account = smart.current_account;
            this.strategies = this.account.strategy_map; //策略列表
            this.domHelper.renderStrategyList(Object.values(this.strategies));
            this.bindEvent();
            this.initListener();
        }

        private initListener() {
            // 其他进程也可以操作相关进程，所以要做监听对应的事件
            smart.on(Event.ON_ALPHAX_MD_STATUS_CHANGE, this.onAlphaxMdStatusChange.bind(this));
            smart.on(Event.ON_ALPHAX_TD_STATUS_CHANGE, this.onAlphaxTdStatusChange.bind(this));
            smart.on(Event.ON_STRATEGY_STATUS_CHANGE, this.onStrategyStatusChange.bind(this));

            // 监听策略对象上发生的事件
            for (let strategy of Object.values(this.strategies)) {
                strategy.on(Event.ON_ORDER, (order: Order) => {
                    this.onStrategyOrder(strategy, order);
                })
                strategy.on(Event.ON_TRADE, (trade: Trade) => {
                    this.onStrategyTrade(strategy, trade);
                })
                strategy.on(Event.ON_POSITION, (position: Position) => {
                    this.onStrategyPosition(strategy, position);
                })
                strategy.on(Event.ON_BOOK, (book: Book) => {
                    this.onStrategyBook(strategy, book);
                })
                strategy.on(Event.ON_ALPHAX_MSG, (msg: any) => {
                    this.onStrategyMsg(strategy, msg);
                })
                strategy.on(Event.ON_STRATEGY_STATUS_CHANGE, (event: StatusChangeEvent) => {
                    this.onStrategyStatusChange2(strategy, event);
                });

            }
        }

        private bindEvent() {
            this.domHelper.bindEvent("#btnStartMd", "click", () => {
                this.startMd();
            })
            this.domHelper.bindEvent("#btnStartTd", "click", () => {
                this.startTd();
            })

            this.domHelper.bindEvent("#list", "click", (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const key = target.id;
                const strategy = this.strategies[key!];
                if (!strategy) {
                    console.error(`策略[${key}]不存在！`)
                    return;
                }
                this.domHelper.renderStrategyDetail(strategy);
            })

            this.domHelper.bindEvent("#load", "click", async (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const strategyId = target.parentElement!.dataset['sid'];
                const strategy = this.strategies[strategyId!];
                if (!strategy) {
                    console.error(`策略[${strategyId}]不存在！`)
                    return;
                }
                await strategy.loadData();
                this.domHelper.renderStrategyDetail(strategy);
            })

            this.domHelper.bindEvent("#btnStartStrategy", "click", (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const strategyId = target.parentElement!.dataset['sid'];
                this.startStrategy(strategyId);
            })
            this.domHelper.bindEvent("#btnstopStrategy", "click", (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const strategyId = target.parentElement!.dataset['sid'];
                this.stopStrategy(strategyId);
            })
            this.domHelper.bindEvent("#btnSendMsg", "click", (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const strategyId = target.parentElement!.dataset['sid'];

                const text = (document.getElementById("msg") as HTMLInputElement).value;

                this.sendMsg2Strategy(strategyId!, text);
            })

            const renderItemDetail = (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                try {
                    this.domHelper.renderItemDetail(JSON.parse(target.textContent!));
                } catch (error) {
                    console.error(error);
                }
            }

            this.domHelper.bindEvent("#positions", "click", renderItemDetail)
            this.domHelper.bindEvent("#orders", "click", renderItemDetail)
            this.domHelper.bindEvent("#trades", "click", renderItemDetail)

        }

        // 启动行情进程
        async startMd(source: string = Type.Source.XTP): Promise<void> {
            const md = smart.alphax_md_list.find(md => md.source === source);
            if (!md) {
                console.error("没有找到xtpmd");
                return;
            }
            if (Type.StrategyStatus.Started === md.status
                || Type.StrategyStatus.Starting === md.status) {
                console.info("md 已经启动！")
                return;
            }
            const strategy = Object.values(this.strategies)[0];
            // 一个很尴尬的事情，startMD必须使用一个strategy对象启动
            if (!strategy) {
                console.error("没有一个strategy，无法启动md");
                return;
            }
            try {
                const result = await strategy.startMD(this.account.account_id);
                console.info("md 启动成功", result);
            } catch (error) {
                console.error("md 启动失败", error);
            }
        }

        // 启动交易进程
        async startTd(account?: string, source?: string, pwd?: string): Promise<void> {
            if (!account) {
                account = this.account.account_id;
            }
            if (!source) {
                source = this.account.source;
            }
            console.info("准备启动td", this.account, source, pwd);
            const td = smart.alphax_td_list.find(td => td.source === source && td.account_id === account);
            if (!td) {
                console.error("没有找到xtp td");
                return;
            }
            if (Type.StrategyStatus.Started === td.status
                || Type.StrategyStatus.Starting === td.status) {
                console.info("td 已经启动！", account)
                return;
            }
            const strategy = Object.values(this.strategies)[0];
            // 一个很尴尬的事情，startTD必须使用一个strategy对象启动
            if (!strategy) {
                console.error("没有一个strategy，无法启动td");
                return;
            }
            try {
                const result = await strategy.startTD(account, pwd);
                console.info("td 启动成功", account, result);
            } catch (error) {
                console.error("td 启动失败", account, error);
            }
        }

        // 启动策略
        async startStrategy(strategyId?: string): Promise<void> {
            let strategy;
            if (strategyId) {
                strategy = this.strategies[strategyId];
            } else {
                strategy = Object.values(this.strategies)[0];
            }
            if (!strategy) {
                console.error("没有一个strategy，无法启动td");
                return;
            }
            try {
                const result = await strategy.startStrategy();
                console.info("strategy 启动成功", result);
            } catch (error) {
                console.error("strategy 启动失败", error, error.code, error.data);
            }
        }

        async stopStrategy(strategyId?: string): Promise<void> {
            let strategy;
            if (strategyId) {
                strategy = this.strategies[strategyId];
            } else {
                strategy = Object.values(this.strategies)[0];
            }
            if (!strategy) {
                console.error("没有一个strategy，无法启动td");
                return;
            }
            try {
                const result = await strategy.stopStrategy();
                console.info("strategy 启动成功", result);
            } catch (error) {
                console.error("strategy 启动失败", error, error.code, error.data);
            }
        }

        private async sendMsg2Strategy(strategyId: string, text: string) {
            let strategy;
            if (strategyId) {
                strategy = this.strategies[strategyId];
            } else {
                strategy = Object.values(this.strategies)[0];
            }
            if (!strategy) {
                console.error("没有一个strategy，无法启动td");
                return;
            }
            try {
                const result = await strategy.postStrategyParams({ "msg": text });
                console.info("strategy 传参成功！", result);
            } catch (error) {
                console.error("strategy 传参失败", error, error.code, error.data);
            }
        }

        // 各种推送消息的处理逻辑

        private onAlphaxMdStatusChange(event: StatusChangeEvent) {
            console.info("onAlphaxMdStatusChange", event);
            const dom = document.querySelector("#md");
            if (!dom) return
            dom.innerHTML = `${event.status_name}`;
            if (["Started", "Starting"].includes(event.status)) {
                this.domHelper.disableStartMdBtn(true);
            } else {
                this.domHelper.disableStartMdBtn(false);
            }
        }

        private onAlphaxTdStatusChange(event: StatusChangeEvent) {
            console.info("onAlphaxTdStatusChange", event);
            const dom = document.querySelector("#td");
            if (!dom) return
            dom.innerHTML = `${event.status_name}`;
            if (["Started", "Starting"].includes(event.status)) {
                this.domHelper.disableStartTdBtn(true);
            } else {
                this.domHelper.disableStartTdBtn(false);
            }
        }

        private onStrategyStatusChange(event: StatusChangeEvent) {
            console.info("onStrategyStatusChange globle", event);
        }

        private onStrategyOrder(strategy: Strategy, order: Order) {
            console.info("on order", strategy.strategy_id, order);
        }

        private onStrategyTrade(strategy: Strategy, trade: Trade) {
            console.info("on trade", strategy.strategy_id, trade);
        }

        private onStrategyPosition(strategy: Strategy, position: Position) {
            console.info("on pos", strategy.strategy_id, position);
        }

        private onStrategyBook(strategy: Strategy, book: Book) {
            console.info("on book", strategy.strategy_id, book);
        }

        private onStrategyMsg(strategy: Strategy, msg: any) {
            console.info("on msg", strategy.strategy_id, msg);
        }

        private onStrategyStatusChange2(strategy: Strategy, event: StatusChangeEvent) {
            console.info("onStrategyStatusChange", strategy.strategy_id, event);
        }
    }

    /**
     * 主要负责界面dom操作
     */
    class DomHelper {
        bindEvent(target: string, event: string, callback: Function) {
            document.querySelector(target)?.addEventListener(event, (event) => {
                callback(event);
            }, true);
        }
        /**
         * 禁用启动MD的按钮
         * @param disabled true 禁用按钮；false 启用按钮
         */
        disableStartMdBtn(disabled: boolean) {
            (document.querySelector("#btnStartMd") as HTMLButtonElement).disabled = disabled;
        }
        /**
         * 禁用启动TD的按钮
         * @param disabled true 禁用按钮；false 启用按钮
         */
        disableStartTdBtn(disabled: boolean) {
            (document.querySelector("#btnStartTd") as HTMLButtonElement).disabled = disabled;
        }
        renderStrategyList(strategies: Array<Strategy>) {
            const list = [];
            for (let strategy of strategies) {
                list.push(`<li id="${strategy.strategy_id}_${strategy.strategy_platform_type}">${strategy.strategy_id}</li>`);
            }
            const ol = document.getElementById('list');
            if (ol) ol.innerHTML = list.join("")
        }
        renderStrategyDetail(strategy: any) {

            // 基础信息
            let list = [];
            const propertise = ["strategy_id", "status_name", "strategy_platform_type", "status", "status_name"]
            for (let prop of propertise) {
                list.push(`<li><lable>${prop}:</lable> <span>${strategy[prop]}</span></li>`);
            }
            let ul = document.getElementById('info');
            if (ul) {
                ul.innerHTML = list.join("");
                ul.parentElement!.dataset["sid"] = strategy.strategy_id + "_" + strategy.strategy_platform_type;
            }

            // 资产
            list = [];
            for (let prop in strategy.book) {
                list.push(`<li><lable>${prop}:</lable> <span>${strategy.book[prop]}</span></li>`);
            }
            ul = document.getElementById('book');
            if (ul) ul.innerHTML = list.join("")

            // 持仓
            list = [];
            for (let pos of strategy.strategy_position_list) {
                list.push(`<li>${JSON.stringify(pos)}</li>`);
            }
            ul = document.getElementById('positions');
            if (ul) ul.innerHTML = list.join("")

            // 委托
            list = [];
            for (let order of strategy.strategy_order_list) {
                list.push(`<li>${JSON.stringify(order)}</li>`);
            }
            ul = document.getElementById('orders');
            if (ul) ul.innerHTML = list.join("")

            // 成交
            list = [];
            for (let trade of strategy.strategy_trade_list) {
                list.push(`<li>${JSON.stringify(trade)}</li>`);
            }
            ul = document.getElementById('trades');
            if (ul) ul.innerHTML = list.join("")

        }

        renderItemDetail(item: any) {
            const list = [];
            for (let prop in item) {
                list.push(`<li><lable>${prop}:</lable> <span>${item[prop]}</span></li>`);
            }
            const ul = document.getElementById('items');
            if (ul) ul.innerHTML = list.join("")
        }

        private onQuote(quote: Quote) {
            console.info("on quote", quote);
            // const exchangeMap: { [prop: string]: string } = { "SSE": "SH", "SZE": "SZ" };
            // const dom = document.querySelector(`[id='${quote.instrument_id}.${exchangeMap[quote.exchange_id]}'] span`);
            // if (!dom) return
            // dom.innerHTML = `最新价：${quote.last_price}`;
        }
    }

    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
        new Plugin();
    });
    smart.on(Event.ON_CLOSE, () => {
    });
}
