import { exampleLines } from './env.js';
import { checkAndCreateEnvFile } from './install.js';
import { env, config } from './main.js';

// =================================== env.js ===================================
/**
 * ```js
 * // 文件导出内容
 * const exampleLines=[]; // 预设的 .env 示例文件内容(行数组),供模块生成;
 * ```
 * >查看定义:@see {@link exampleLines}
 */
declare module './env.js' {
    export * from './env.js';
}

// =================================== install.js ===================================
/**
 * ```js
 * // 文件导出内容
 * checkAndCreateEnvFile(); // 检查并创建 .env 示例文件
 * ```
 * >查看定义:@see {@link checkAndCreateEnvFile}
 */
declare module './install.js' {
    export * from './install.js';
}

// =================================== main.js ===================================
/**
 * ```js
 * // 文件导出内容
 * const env;  // 环境变量代理实例
 * config();   // 自定义配置(对象:路径,编码,是否打印调试信息)
 * ```
 * ---
 * >查看定义:@see {@link env}、{@link config}
 */
declare module './main.js' {
    export * from './main.js';
}

// ================================ 导出入口 ================================
/**
 * 环境变量配置模块 主要功能:
 * ```js
 * const env;          // 环境变量代理实例
 * function config();  // 自定义配置(对象:路径,编码,是否打印调试信息)
 * ```
 * ---
 * >
 * ```js
 *  // 默认使用示例
 *  import { env } from '@flun/env';
 *
 *  console.log(env.PORT); // 访问配置项
 * // ---------------------------------------------------------
 *  // 自定义配置示例
 *  import { config } from '@flun/env';
 *    const cEnv = config({
 *      path: './path/.env',  // 自定义路径(如果配置是相对路径,那么请以工作路径作为基准->向上或向下或同级)
 *      encoding: 'utf8',     // 字符集 (默认utf8)
 *      debug: true           // 调试模式 (默认false)
 *    });
 *
 *   console.log(cEnv.PORT); // 访问配置项
 * ```
 * ---
 * >查看定义:@see {@link env}、{@link config}
 */
declare module './index.js' {
    export * from './main.js';
}