import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exampleLines } from './env.js';

// 要复制的文件位置和文件目标位置
const __filename = fileURLToPath(import.meta.url), __dirname = path.dirname(__filename),
    fileName = '.env', targetDir = path.resolve(process.env.INIT_CWD || process.cwd()),
    targetFile = path.join(targetDir, fileName);

/**
 * 检查并创建 .env 示例文件
 *
 * 若项目根目录不存在 .env 文件,则使用预定义的示例内容生成,并输出相应的提示信息;
 * >查看定义:@see {@link copyFile}
 * @returns {boolean} 在 .env 文件已存在或成功创建时返回 `true`,若发生错误则无返回值（`undefined`）
 */
const copyFile = () => {
    console.log('🔍 检查 .env 环境变量文件...'), console.log(`📁 项目根目录: ${targetDir}`);
    try {
        // 目标目录不是 Node 项目 || 包自身的 npm install（开发调试）→ 跳过
        if (!fs.existsSync(path.join(targetDir, 'package.json'))) return true;
        if (targetDir === path.resolve(__dirname, '..')) return true;
        if (fs.existsSync(targetFile)) return true;  // 目标文件已存在 → 直接返回
        console.log('⚠️  在项目根目录未找到 .env 文件，正在创建...');

        const formattedContent = exampleLines.join('\n'); // 动态处理示例内容
        fs.writeFileSync(targetFile, formattedContent, 'utf8');
        console.log(`✓ 已创建 .env 示例文件: ${targetFile}`), console.log('📝 请在该文件中添加环境变量');
        return true;
    } catch (error) {
        console.error('✗ 创建 .env 文件失败:', error.message);
    }
};

// 执行脚本并导出函数
if (process.argv[1] === __filename) copyFile();
export { copyFile };