# SmartX 插件中的事件体系与生命周期钩子

插件被打开后，会以标签页的形式打开，会在`window`对象内保留一个顶级`smart`对象和一系列子对象。

## 事件体系

[`smart`对象](https://smarttest.ztqft.com/sdkDoc/plugin/1.0.0/api/pluginApi.html#smart-%E5%85%A8%E5%B1%80api%E5%85%A5%E5%8F%A3%E5%AF%B9%E8%B1%A1)、
[账户（`Account`）对象](https://smarttest.ztqft.com/sdkDoc/plugin/1.0.0/api/pluginApi.html#account)和
[策略（`Strategy`）对象](https://smarttest.ztqft.com/sdkDoc/plugin/1.0.0/api/pluginApi.html#strategy)
都是一个[`Emitter`](https://github.com/component/emitter)，意味着都可以使用如下方法

* `on`: 注册一个监听器
* `once`: 注册一个一次性的监听器
* `off`: 取消注册监听器
* `emit`: 派发事件
* `listeners`: 查看监听器

详情参考[`component-emitter`文档](https://github.com/component/emitter#readme)

同时为了方便调用，以上对象中还暴露了若干以`on_`开头的方法，与`on`方法等效。例如

```js
smart.on_init(fn);
smart.on(Event.ON_INIT, fn);
```

## 生命周期钩子

插件的生命周期钩子派发到smart对象上。共四个周期钩子。

### `Event.ON_INIT`

插件页面被打开，插件运行环境初始完成后回调，为了保证程序正常，插件所有代码均在此之后执行（如订阅行情）

### `Event.ON_SHOW`

插件页面被激活展示时的回调，可以重新申请一些on_hide释放掉的资源

注意：第一次打开插件时，触发`Event.ON_INIT`并不会触发`Event.ON_SHOW`

### `Event.ON_HIDE`

插件页面被切走时的回调，可以释放一些不必要的资源

### `Event.ON_CLOSE`

插件页面被关闭时回调，彻底释放掉插件所有资源，如订阅
