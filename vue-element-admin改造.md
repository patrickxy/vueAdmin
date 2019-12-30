## vue-element-admin 初始化改造

1. eslint 配置改造 原有配置较为严格，可根据需要修改 eslint 配置

```js
//eslintrc.js
// 总是分号结尾
'semi': [2, 'never']->'semi': [2, 'always'],

 //字符串使用双引号包裹
    'quotes': [2, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
  改为
'quotes': [2, 'double', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
```

2.package.json 配置 修复指令

```js
"lint": "eslint --ext .js,.vue src",
 //改为
 "lint": "eslint --fix --ext .js,.vue src",

//启用自动修复命令
  npm run lint  或者 yarn lint
```

3.使用本地 mock

```javascript
import { mockXHR } from "../mock";
// if (process.env.NODE_ENV === 'production') {
mockXHR();
// }
```

> 原框架自定义 mock 问题点，可以请求并获取数据，但是不能在 network 查看请求与相应
>
> 不建议使用

4.自定义 mock 数据

```javascript
//vue.config.js
"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
const Mock = require("mockjs");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "vue Element Admin"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://127.0.0.1:${port}/mock`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ["^" + process.env.VUE_APP_BASE_API]: ""
    //     }
    //   }
    // },
    // after: require("./mock/mock-server.js")
    before: function(app) {
      const tokens = {
        admin: {
          token: "admin-token"
        },
        editor: {
          token: "editor-token"
        }
      };

      const users = {
        "admin-token": {
          roles: ["admin"],
          introduction: "I am a super administrator",
          avatar:
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          name: "Super Admin"
        },
        "editor-token": {
          roles: ["editor"],
          introduction: "I am an editor",
          avatar:
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          name: "Normal Editor"
        }
      };
      app.post("/dev-api/user/login", function(req, res) {
        res.json({ code: 20000, data: tokens["admin"] });
      });
      app.get("/dev-api/user/info", function(req, res) {
        console.log(req.query); // get
        console.log(req.params); // post
        res.json({ code: 20000, data: users[req.query["token"]] });
      });
      app.get("/dev-api/transaction/list", function(req, res) {
        res.json({
          code: 20000,
          data: Mock.mock({
            total: 20,
            "items|20": [
              {
                order_no: "@guid()",
                timestamp: +Mock.Random.date("T"),
                username: "@name()",
                price: "@float(1000, 15000, 0, 2)",
                "status|1": ["success", "pending"]
              }
            ]
          })
        });
      });
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  }
};
```

> 引入 mockjs [mockjs 文档](http://mockjs.com/)
>
> 注释掉 devseverr 中 proxy proxy 主要用于代理其他人接口对应 npm 模块 http-proxy-middleware
>
> before 中自定义接口路径、方式与返回
>
> configurewebpack 中定义别名等

5.eslint 相关

> 项目默认开启 eslint 部分配置可以自定义调整

space-before-function-paren

配置文件 .eslintrc.js 配置文档 [eslint rules](https://cn.eslint.org/docs/rules/)

6. 其他共享部分

> 常用 vscode 扩展

Bracket Pair Colorizer-- 括号颜色提示

GitLens — Git supercharged -- 查看当前文件之前是由谁编辑的 精确到行

Vue VSCode Snippets -- vue 的代码段 一键生成基础代码 vbase vfor...

> 参考 setting.json 配置

```json
{
  "files.associations": {
    "*.vue": "vue"
  },
  "eslint.validate": ["javascript", "html", "javascriptreact"],
  // {
  //     "language": "vue",
  //     "autoFix": true
  // }
  // "prettier.singleQuote": false,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "auto"
      // "wrap_attributes": "force-aligned"
    },
    "prettyhtml": {
      "printWidth": 100,
      "singleQuote": false,
      "wrapAttributes": false,
      "sortAttributes": false
    },
    "prettier": {
      "printWidth": 400,
      "semi": true, // 格式化加分号 semi 双引号结尾
      "singleQuote": false //字符串 格式化以双引号为主 true=>单引号
    }
  },
  // "eslint.autoFixOnSave": true,
  "editor.formatOnSave": true,
  "files.autoSave": "off",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
  "workbench.colorTheme": "Visual Studio Dark",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
  // "prettier.printWidth": 200 // 保存自动格式化
}
```

### todo

1. 请求封装可能还需要进行改造 根据具体项目加入一些具体配置
2. vuex 持久化 vuex-persistance
