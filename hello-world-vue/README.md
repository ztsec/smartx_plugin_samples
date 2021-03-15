# 使用Vue架构重写Hello World

本样例功能与hello world类型，在插件运行环境准备好以后，展示`"Hello World"`字样。

与之前 api 类的样例的区别如下

## 增加依赖

增加页面展示相关的vue、css、scss等依赖

# 增加webpack打包插件

增加了对css、scss、less、图片、字体等加载插件

## 使用Vue编写组件

### vue对TS的支持

vue 2.x 对Typescript的支持有限，我们采取的措施为，vue中的`<script>`代码块使用普通js编写，其他js文件用TS编写

vue 3.x 刚问世不久，整个体系还需要进一步观察。