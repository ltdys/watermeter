项目名称：数字化运营平台

产品类型：B端

技术栈：vue + vue-router + axios + element-ui + vuex

文件目录：

    dist     打包编译后文件

    src      前端业务文件夹

        assets

        components       公共组件

        filters          全局过滤器

        router           前端路由

        service          服务端api

        store            vuex配置

        style            css文件夹

        utils            工具类文件夹

                                      publicUtil.js             formData数据转换，及其他的数据转换

                                      layout.js                 全局设置element-ui 的table组件高度

                                      request.js                http请求封装（axios）

                                      storageUtil.js            浏览器缓存封装

        views            前端视图文件夹

                                      home                      首页

                                      system-param                    系统参数

                                      system-manage                   系统管理

                                      err                             错误页面

                                      err-log                         错误日志模块  

                                      login                           登录模块                                    

        App.vue          主入口视图组件

        main.js          主入口main.js（webpack打包主入口）

        permisson.js     前端路由权限控制js

    

    .editorconfig
 
    .env.development              开发环境http请求baseUrl变量配置（张奎IP）

    .env.developmentOnline38      开发环境http请求baseUrl变量配置（10.137.36.38:8082 服务器）

    .env.developmentOnline76      开发环境http请求baseUrl变量配置（10.137.36.76:8082 服务器）

    .env.production               生产环境http请求baseUrl变量配置 （10.137.36.76:8082 服务器）

    .eng.staging

    .eslintignore                 配置忽略eslint检查

    .eslintrc                     eslint检查配置

    .gitignore                    配置忽略git提交

    babel.config.js               babel配置（es6 transform es5）
    
    package.json                  项目总配置（npm包，script脚本命令）

    README.md                     项目说明文件

    vue.config.js                 vue-cli-serve配置（实际上是webpack-dev-serve的配置）

    yarn.lock                     npm包版本锁包控制






