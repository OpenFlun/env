# 变更日志

## [3.2.2] - 2026-11-05 10:22
### 优化
- `bin/cli.js` 的输出改用 chalk 按语义着色:`用法:` 用 `blueBright`,分组名用 `cyan`,
  命令名用 `cyanBright`,说明用 `gray`,成功用 `green` 与 `greenBright`,错误用 `red`;
- `bin/cli.js` 的 `printHelp` 改为分组结构,命令按「命令」一节列出,说明列按显示宽度对齐;
  各子命令的参数示例写入说明,如 `add FOO:bar`;
- 帮助末尾补一行关于 `INIT_CWD` 的说明,并与其他作用域包的帮助缩进对齐;
- `copy-files.js` 的输出改同套着色,移除 emoji 前缀;
- `bin/cli.js` 的 8 个独立 `const` 合并为一条逗号链;移除无引用的具名导出;
  清除指向自身的 `@see` 注释;
- `package.json` 换行符由 CRLF 改为 LF;

### 新增
- 新增依赖 `chalk`;

### 文档
- README 子命令表补 `help` 行,此前仅在表下文字中说明;

## [3.2.1] - 2026-11-05 08:52
### 优化
- 优化了一些细节;

## [3.2.0] - 2026-11-05 08:43
### 新增
- 新增 `env` 命令行入口(bin/cli.js),以子命令覆盖包的实际能力:example、add、set、del、ls、get、has、path、help;
- 写入侧按现有读取规则序列化,值含空白、#、引号、反斜杠等时自动加双引号并转义,保证写入后读回一致;

### 更改
- 移除 env-init 命令,其行为由 env example 承接;未知命令先报错再打印帮助,退出码 1;