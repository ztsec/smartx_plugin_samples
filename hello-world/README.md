# 第一个smart 插件

smartx 的插件体系完全基于web技术栈构建，你可以使用你擅长的任何技术栈来构建你的插件程序。

在一个最简单的插件中，只需要包含两个文件 `index.html` 与 `package.json`。

## package.json

声明一些插件的元数据，格式详见[插件文档](https://smarttest.ztqft.com/sdkDoc/plugin/1.0.0/guide/howTo_develop.html#%E5%88%9B%E5%BB%BA%E5%B7%A5%E7%A8%8B)

## index.html

程序的入口文件，smartx会通过加载index.html文件，加载其中的js和css等资源文件，从而实现整个插件的启动。

## 编译

本示例无需编译

## 效果查看

需要将此目录复制到客户端的插件目录下，具体路径为

### windows

```
%USERPROFILE%\.xtp-smart\plugins
```

说明：使用`%USERPROFILE%`代表用户的主文件夹，比如一个名为`admin`的用户，在win10平台的默认主目录路径为`C:\Users\admin`

### MacOS

```
~/.xtp-smart/plugins
```

最终形成的目录结构应该如下(README.md文件并不需要):

```
plugins
  ├─hello-world
      │   index.html
      │   package.json
```

然后去SmartX客户端中，[扩展] => [安装的插件] 菜单下即可查看此例子了。
当然，此插件就是一个简单的文字展示，并无任何其他接口调用。