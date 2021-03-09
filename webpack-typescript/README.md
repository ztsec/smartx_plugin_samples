`xtp-smart` 插件示例工程

使用Typescript语言开发，使用webpack技术栈进行打包一个插件的情形。

为了易于理解，不引入前端展示框架

## install

> npm i

如果使用脚手架生成，可以跳过这一步

## 编译

> npm run build

命令会将插件直接编译到smartx客户端的插件目录

## 编译并持续监控

> npm run watch

除了会有 `npm run build` 功能外，还会持续监控源码目录，当文件变化后，会自动重新编译，并发布到smartx客户端的插件目录

## 生产模式打包

> npm run dist

使用生产模式重新打包，会去除构建产物中的调试信息，构建产物的文件大小会显著缩小。
