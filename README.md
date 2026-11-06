# @flun/env

## 简介

一个简单易用的 `.env` 环境变量文件读取工具;

本包以 ESM 模块系统编写;只要你的 Node.js 版本大于 22.12,可保留 CJS `require()` 语法调用,否则请使用 `import` 语法;

---
## 特性

- 自动检查并创建 `.env` 示例文件
- 支持 `env.变量名` 的直接调用方式
- 支持自定义 `.env` 文件路径
- 自动将变量注入到 `process.env`
- 多路径自动查找 `.env` 文件
- 支持注释和空行
- 友好的错误提示

---
## 包目录结构

随包发布的文件:

```
@flun/env/
├── bin/cli.js      命令行入口(bin: env)
├── copy-files.js   postinstall 时生成 .env 示例文件
├── env.js          .env 示例文件内容
├── index.js        库入口,转发 main.js 的导出
├── main.js         env / config 实现
├── index.d.ts      类型声明
├── CHANGELOG.md    更新日志
├── README.md       本文件
├── LICENSE         许可
└── package.json    包配置
```

---
## 安装前准备

### 允许安装脚本执行

本包在安装时可能触发某些依赖包的自动脚本(如 `postinstall` 等);如果你的 npm 全局配置或项目配置禁止了脚本执行(例如设置了
`ignore-scripts=true`),可能会导致安装不完整或运行时异常;

推荐在项目根目录的 `package.json` 中添加 `allowScripts` 字段,显式放行本包及其依赖的脚本:

```json
{
  "allowScripts": {
    "@flun/env": true
  }
}
```

---
## 安装

```bash
npm i @flun/env
```

---
## 命令行

包内声明 `bin` 为 `env`,安装后可直接调用:

### 快速开始

```bash
env add FOO:bar      # 添加键值对(全局)
npx env add FOO:bar  # 添加键值对(当前项目)
```

生成位置为 `INIT_CWD`(npm 传入的原始工作目录),不存在该变量时用 `process.cwd()`;

### 子命令

| 命令            | 作用                              |
| --------------- | --------------------------------- |
| `example`       | 生成 .env 示例文件;已存在时不覆盖 |
| `add KEY:VALUE` | 添加键值对;键已存在时报错,不覆盖  |
| `set KEY:VALUE` | 设置/覆盖键值对                   |
| `del KEY`       | 删除键                            |
| `ls`            | 列出全部 KEY=VALUE                |
| `get KEY`       | 输出单个值                        |
| `has KEY`       | 检查键是否存在                    |
| `path`          | 显示 .env 路径                    |
| `help`          | 显示本帮助                        |

无参数、`help`、`-h`、`--help` 均输出帮助;未知命令先报错再打印帮助,退出码 1;

---
## 函数方式

包入口导出 `env` 与 `config`;

### env

默认实例,自动加载 `.env`:

```js
import { env } from '@flun/env';

env.DATABASE_URL;          // 直接访问变量
env.get('PORT');           // 读取变量值
env.get('PORT', 3000);     // 带默认值
env.has('SECRET_KEY');     // 检查是否存在
env.getAll();              // 获取所有变量
env.load();                // 重新加载
```

### config

创建独立实例,可自定义路径与编码:

```js
import { config } from '@flun/env';

const cEnv = config({
  path: './config/.env',  // 自定义路径,相对路径以工作目录为基准
  encoding: 'utf8',       // 字符集,默认 utf8
  debug: true             // 调试模式,默认 false
});

cEnv.PORT;                // 访问配置项
```

---
## 参考配置

以下为配置项与文件格式参考,使用前无需通读;先按上方命令行或函数方式跑通即可;

### 文件查找顺序

1. 自定义路径(`config({ path })` 指定)
2. 当前工作目录的 `.env`
3. 用户主目录的 `.env`

### config 选项

| 选项       | 类型      | 作用                                        |
| ---------- | --------- | ------------------------------------------- |
| `path`     | `string`  | 自定义 `.env` 路径;相对路径以工作目录为基准 |
| `encoding` | `string`  | 文件编码,默认 `utf8`                        |
| `debug`    | `boolean` | 输出调试信息,默认 `false`                   |


### .env 文件格式

在项目根目录或运行文件所在目录创建 `.env`:

```env
# 数据库配置
DATABASE_URL=mysql://user:password@localhost:3306/dbname
API_KEY=your_api_key_here

# 应用配置
DEBUG=false
PORT=3000
NODE_ENV=development
```
---
## 常见问题

### 找不到 .env 文件会怎样?

包会自动创建示例文件并退出进程,不会静默返回空值;

---
## 许可证

ISC

---
## 贡献

- 源码:[GitHub](https://github.com/OpenFlun/env)
- 中国镜像:[gitee](https://gitee.com/OpenFlun/env)
- 问题反馈:[Issues](https://github.com/OpenFlun/env/issues)
- 主页:[npm 包页面](https://www.npmjs.com/package/@flun/env#readme)