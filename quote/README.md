# 订阅行情

订阅行情可以发生在全局的smart对象上，或者是Account对象上。

请注意使用smart订阅的行情需要使用smart对象进行监听，同理使用Account对象订阅需要使用Account监听，不能混用。

正确方式如下：

```js
// 使用smart对象进行操作
smart.subscribe(smart.current_account.account_id, ["600519", "600050", "600918", "600008"], "SSE");
smart.on(smart.Event.ON_QUOTE, (quote) => {
    // 行情处理
});
smart.unsubscribe(smart.current_account.account_id, ["600519", "600050", "600918", "600008"], "SSE");

// 使用Account对象进行操作
const account = smart.current_account;
account.subscribe(["600519", "600050", "600918", "600008"], "SSE");
account.on(smart.Event.ON_QUOTE, (quote) => {
    // 行情处理
});
account.unsubscribe(["600519", "600050", "600918", "600008"], "SSE");
```
