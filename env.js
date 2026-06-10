/**
 * 预设的 .env 示例文件内容(行数组),供模块生成示例文件
 * >查看定义:@see {@link exampleLines}
 */
const exampleLines = [
    '# .env 环境变量使用示例(@flun/html-template的登录配置):',
    '# 每行标准格式: 变量名 = 变量值',
    '# 注意!!!,如果键值包含特殊字符或空格,请使用引号包裹整个键值,并正确转义引号内需要转义的特殊字符',
    '# 以 # 开头的行是注释',
    '',
    'SESSION_SECRET = your-strong-secret-key # session的密钥(请替换成足够复杂且保密的字符串)',
    '# 请根据实际网络协议(如http或https)配置ip地址或域名,避免使用localhost,这样可以局域网异机测试;',
    'APP_URL = http://example.com:7290      # 如果没有域名,可以使用局域网ip地址(如192.168.1.100 +端口)',
    'MAIL_HOST = smtp.example.com           # 替换成你自己邮箱服务器地址',
    'MAIL_PORT = 465                        # 你自己的邮箱服务器端口',
    'MAIL_USER = your-email@example.com     # 替换成你自己的邮箱地址',
    'MAIL_PWD = "your-password"             # 替换成你自己的邮箱授权码(注意不是邮箱密码,通常需要在邮箱设置里生成授权码)',
    'PWD = admin123                         # 替换成你想要的管理员密码(请务必修改成足够复杂且保密的密码)',
    '# 阿里云相关配置示例:',
    'ALI_ACCESS_KEY_ID = your-ali-access-key-id         # 替换成你自己的阿里云访问密钥ID',
    'ALI_ACCESS_KEY_SECRET = your-ali-access-key-secret # 替换成你自己的阿里云访问密钥Secret',
    '',
    `# 调用包: import { env } from '@flun/env' ;`,
    '',
    '# 使用格式: env.变量名'
];
export { exampleLines };