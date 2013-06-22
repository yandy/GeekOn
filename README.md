# 极客行动官方网站

## 运行方法

### 安装运行环境

* nodejs
* mongodb
* redis

### 下载代码

```
git clone https://github.com/free-storm/GeekOn.git
```

### 运行代码

```
cd /path/to/source
npm install
node app
```

## 开发

### 样式表

本站采用[scss](http://sass-lang.com/)生成css，scss存放路径为: vendor/assets/stylesheets/

如果需要修改样式，可以执行下面命令，实时将scss编译为css

```
cd /path/to/source
sass --style compressed --watch vendor/assets/stylesheets/geekon.css.scss:public/css/geekon.min.css
```

## 贡献者

[Contributors](https://github.com/free-storm/GeekOn/graphs/contributors)
