#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { exampleLines } from '../env.js';

const cwd = process.env.INIT_CWD || process.cwd(), envPath = path.join(cwd, '.env'), [, , sub, ...args] = process.argv,
  /**
   * 按 .env 读取规则序列化单行;
   * @param {string} key 键
   * @param {string} value 值
   * @returns {string} 可被 parseLine 原样读回的行
   */
  serializePair = (key, value) => {
    if (value === '') return `${key}=`;
    if (!/[\s#"\'\\]/.test(value)) return `${key}=${value}`;
    const esc = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r');
    return `${key}="${esc}"`;
  },
  /**
   * 解析单行键值,与 serializePair 同规则;
   * @param {string} line 原始行
   * @returns {{key: string, value: string}|null} 非赋值行返回 null
   */
  parseLine = line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return null;
    const i = t.indexOf('=');
    if (i === -1) return null;
    const key = t.slice(0, i).trim(); let v = t.slice(i + 1).trimStart();
    if (v === '') return { key, value: '' };
    const q = v[0];
    if (q === '"' || q === "'") {
      let end = -1, inEsc = false;
      for (let j = 1; j < v.length; j++) {
        if (!inEsc && v[j] === q) { end = j; break }
        inEsc = v[j] === '\\' && !inEsc;
      }
      if (end === -1) return { key, value: v };
      const raw = v.slice(1, end);
      return { key, value: raw.replace(/\\(.)/g, (_, c) => c === 'n' ? '\n' : c === 't' ? '\t' : c === 'r' ? '\r' : c) };
    }
    const ci = v.indexOf('#');
    if (ci !== -1) v = v.slice(0, ci).trimEnd();
    else { const ws = v.search(/\s/); if (ws !== -1) v = v.slice(0, ws) }
    return { key, value: v };
  },
  /**
   * 读取 .env 行数组,不存在返回 null;
   * @returns {string[]|null} 行数组
   */
  readLines = () => fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8').split(/\r?\n/) : null,
  /**
   * 写入 .env,末尾无换行;
   * @param {string[]} lines 行数组
   */
  writeLines = lines => fs.writeFileSync(envPath, lines.join('\n').replace(/\n+$/, ''), 'utf8'),
  /**
   * 解析 KEY:VALUE 参数;
   * @param {string} raw 原始参数
   * @returns {{key: string, value: string}|null} 键值
   */
  parsePair = raw => {
    const i = raw.indexOf(':');
    return i === -1 ? null : { key: raw.slice(0, i).trim(), value: raw.slice(i + 1).trim() };
  },
  /**
   * 输出用法;
   */
  printHelp = () => {
    const cmd = (name, desc) => `      ${chalk.cyanBright(name.padEnd(26))}${chalk.gray(desc)}`,
      grp = name => `    ${chalk.cyan(name)}`;
    console.log([
      `  ${chalk.blueBright('用法:')} env <命令> [参数]`, '',
      grp('命令'),
      cmd('example', '创建 .env 示例文件,已存在时不覆盖'),
      cmd('add <KEY:VALUE>', '添加键值对,键已存在则报错;例如 add FOO:bar'),
      cmd('set <KEY:VALUE>', '设置或覆盖键值对;例如 set FOO:bar'),
      cmd('del <KEY>', '删除键;例如 del FOO'),
      cmd('ls', '列出全部 KEY=VALUE'),
      cmd('get <KEY>', '输出单个值;例如 get FOO'),
      cmd('has <KEY>', '检查键是否存在;例如 has FOO'),
      cmd('path', '显示 .env 文件路径'),
      cmd('help', '显示本帮助'), '',
      `  ${chalk.gray('文件位置取 INIT_CWD(npm 传入的原始工作目录),不存在时用 process.cwd();')}`
    ].join('\n'));
  },
  // 命令分发入口;
  main = () => {
    if (!sub || sub === 'help' || sub === '--help' || sub === '-h') return printHelp(), process.exit(0);
    if (sub === 'path') return console.log(envPath);
    if (sub === 'example') {
      if (fs.existsSync(envPath))
        return console.log(chalk.green('✓ ') + chalk.greenBright('已存在: ') + chalk.gray(envPath));
      fs.writeFileSync(envPath, exampleLines.join('\n').replace(/\n+$/, ''), 'utf8');
      return console.log(chalk.green('✓ ') + chalk.greenBright('已生成: ') + chalk.gray(envPath));
    }
    const lines = readLines();
    if (!lines) return console.error(chalk.red('✗ ') + `未找到 .env: ${envPath};请先运行 env example`), process.exit(1);
    if (sub === 'ls') return lines.map(parseLine).filter(Boolean)
      .forEach(({ key, value }) => console.log(chalk.cyanBright(key) + chalk.gray('=') + value));
    if (sub === 'get' || sub === 'has' || sub === 'del') {
      const key = args[0];
      if (!key) return console.error(chalk.red('✗ ') + '缺少 KEY'), process.exit(1);
      const idx = lines.findIndex(l => parseLine(l)?.key === key);
      if (sub === 'get') {
        if (idx === -1) return console.error(chalk.red('✗ ') + `不存在: ${key}`), process.exit(1);
        return console.log(parseLine(lines[idx]).value);
      }
      if (sub === 'has')
        return idx === -1 ? process.exit(1) : console.log(chalk.green('✓ ') + chalk.greenBright('存在: ') + key);
      if (idx === -1) return console.error(chalk.red('✗ ') + `不存在: ${key}`), process.exit(1);
      lines.splice(idx, 1), writeLines(lines);
      return console.log(chalk.green('✓ ') + chalk.greenBright('已删除: ') + key);
    }
    if (sub === 'add' || sub === 'set') {
      const pair = parsePair(args[0] || '');
      if (!pair) return console.error(chalk.red('✗ ') + '参数格式应为 KEY:VALUE'), process.exit(1);
      const idx = lines.findIndex(l => parseLine(l)?.key === pair.key);
      if (sub === 'add' && idx !== -1)
        return console.error(chalk.red('✗ ') + `已存在: ${pair.key}` + chalk.gray(';如需覆盖用 env set')), process.exit(1);
      if (idx === -1) lines.push(serializePair(pair.key, pair.value));
      else lines[idx] = serializePair(pair.key, pair.value);

      writeLines(lines);
      return console.log(chalk.green('✓ ') + chalk.greenBright(`已${sub === 'add' ? '添加' : '设置'}: `) + pair.key);
    }
    console.error(chalk.red('✗ 未知命令: ') + chalk.yellow(sub)), console.log(''), printHelp(), process.exit(1);
  };

main();