#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { exampleLines } from '../env.js';

const cwd = process.env.INIT_CWD || process.cwd(), envPath = path.join(cwd, '.env'), [, , sub, ...args] = process.argv;
/**
 * 按 .env 读取规则序列化单行;
 * >查看定义:@see {@link serializePair}
 * @param {string} key 键
 * @param {string} value 值
 * @returns {string} 可被 #parse 原样读回的行
 */
const serializePair = (key, value) => {
  if (value === '') return `${key}=`;
  if (!/[\s#"\'\\]/.test(value)) return `${key}=${value}`;
  const esc = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r');
  return `${key}="${esc}"`;
};

/**
 * 解析单行键值,与 #parse 同规则;
 * >查看定义:@see {@link parseLine}
 * @param {string} line 原始行
 * @returns {{key: string, value: string}|null} 非赋值行返回 null
 */
const parseLine = line => {
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
};

/**
 * 读取 .env 行数组,不存在返回 null;
 * >查看定义:@see {@link readLines}
 * @returns {string[]|null} 行数组
 */
const readLines = () => fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8').split(/\r?\n/) : null;

/**
 * 写入 .env,末尾无换行;
 * >查看定义:@see {@link writeLines}
 * @param {string[]} lines 行数组
 */
const writeLines = lines => fs.writeFileSync(envPath, lines.join('\n').replace(/\n+$/, ''), 'utf8');

/**
 * 解析 KEY:VALUE 参数;
 * >查看定义:@see {@link parsePair}
 * @param {string} raw 原始参数
 * @returns {{key: string, value: string}|null} 键值
 */
const parsePair = raw => {
  const i = raw.indexOf(':');
  return i === -1 ? null : { key: raw.slice(0, i).trim(), value: raw.slice(i + 1).trim() };
};

/**
 * 输出用法;
 * >查看定义:@see {@link printHelp}
 */
const printHelp = () => {
  console.log('用法: env <命令> [参数]');
  console.log('  example            创建 .env 示例文件');
  console.log('  add KEY:VALUE      添加键值对(已存在则警告)');
  console.log('  set KEY:VALUE      设置/覆盖键值对');
  console.log('  del KEY            删除键');
  console.log('  ls                 列出全部 KEY=VALUE');
  console.log('  get KEY            输出单个值');
  console.log('  has KEY            检查键是否存在');
  console.log('  path               显示 .env 路径');
};

const main = () => {
  if (!sub || sub === 'help' || sub === '--help' || sub === '-h') return printHelp(), process.exit(0);
  if (sub === 'path') return console.log(envPath);
  if (sub === 'example') {
    if (fs.existsSync(envPath)) return console.log(`✓ .env 已存在: ${envPath}`);
    fs.writeFileSync(envPath, exampleLines.join('\n').replace(/\n+$/, ''), 'utf8');
    return console.log(`✓ 已创建: ${envPath}`);
  }
  const lines = readLines();
  if (!lines) return console.error(`✗ 未找到 .env: ${envPath};请先运行 env example`), process.exit(1);
  if (sub === 'ls') return lines.map(parseLine).filter(Boolean)
    .forEach(({ key, value }) => console.log(`${key}=${value}`));
  if (sub === 'get' || sub === 'has' || sub === 'del') {
    const key = args[0]; if (!key) return console.error('✗ 缺少 KEY'), process.exit(1);
    const idx = lines.findIndex(l => parseLine(l)?.key === key);
    if (sub === 'get') {
      if (idx === -1) return console.error(`✗ 不存在: ${key}`), process.exit(1);
      return console.log(parseLine(lines[idx]).value);
    }
    if (sub === 'has') return idx === -1 ? process.exit(1) : console.log(`✓ 存在: ${key}`);
    if (idx === -1) return console.error(`✗ 不存在: ${key}`), process.exit(1);
    lines.splice(idx, 1), writeLines(lines);
    return console.log(`✓ 已删除: ${key}`);
  }
  if (sub === 'add' || sub === 'set') {
    const pair = parsePair(args[0] || '');
    if (!pair) return console.error('✗ 参数格式应为 KEY:VALUE'), process.exit(1);
    const idx = lines.findIndex(l => parseLine(l)?.key === pair.key);
    if (sub === 'add' && idx !== -1) return console.error(`✗ 已存在: ${pair.key};如需覆盖用 env set`), process.exit(1);
    if (idx === -1) lines.push(serializePair(pair.key, pair.value)); else lines[idx] = serializePair(pair.key, pair.value);
    return writeLines(lines), console.log(`✓ 已${sub === 'add' ? '添加' : '设置'}: ${pair.key}`);
  }
  console.error(`✗ 未知命令: ${sub}`), printHelp(), process.exit(1);
};

main();
export { serializePair, parseLine, readLines, writeLines, parsePair, printHelp };