# SmartX Plugin Samples

## Doc

Smart插件开发文档请参考[此处](https://smarttest.ztqft.com/sdkDoc/)

## Issues

如果本项目有任何BUG，可以在smart客户端的[主项目](https://github.com/ztsec/smart_client/issues)中反馈问题。

QQ 交流群： 659577632

## 样例

如果你对Smart插件开发并没有了解，推荐按照列表的顺序查看各个插件的实现，由浅入深的了解我们的插件体系。

### 项目搭建

通过项目演进，了解各个文件作用。熟悉整个结构后，可以使用脚手架工具`@xtp-smart/cli`快速生成项目。

* `hello-world`: 没有任何逻辑，只显示`"Hello World"`字样
* `todomvc-jquery`: 不调用任何SDK中的API，引用自[TodoMVC](https://todomvc.com/)中的[JQuery](https://github.com/tastejs/todomvc/tree/gh-pages/examples/jquery)实现
* `webpack`: TODO
* `webpack-typescript`: 使用webpack编译typescript语言，直接生成调式或生产版本的插件。

### API

* `lifecycle`: 展示插件的生命周期
* `notification`: TODO
* `log`: TODO
* `quote`: TODO
* `kungfu`: TODO
* `notification-sound`: 插件在后台发送通知，特别是在插件在后台运行的情况下。

### UI

* `hello-world-vue`: 使用vue技术栈实现的hello-world工程
* `widgets`: 
* `style`: 
* `charts`: 

### 集成