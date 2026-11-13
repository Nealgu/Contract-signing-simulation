# Contract-signing-simulation
Contract signing simulation

<img src="src/logo.svg" alt="O一下图标" width="64" height="64">

**O一下 信息科技有限公司**是一款 SAP 咨询与企业 AI 签单模拟游戏。

每轮代表半个月，每月分上半月和下半月，全年共 24 轮，每轮营业 30 秒。每轮结束可进入机遇商店；每个下半月结束结算工资、运营费及到期的月付支持回款。旧版周制存档会自动转换到对应月份，并保留资金、公司属性、员工与经营记录。

## 本地运行

- Windows 版。下载 [O一下 信息科技有限公司.exe](https://github.com/Nealgu/Contract-signing-simulation/raw/refs/heads/main/O%E4%B8%80%E4%B8%8B%20%E4%BF%A1%E6%81%AF%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8.exe) 并双击。程序使用本机 Microsoft Edge 打开游戏窗口，进度保存在本机。
- 浏览器版。下载 [CornerOffice.html](./CornerOffice.html) 后在浏览器打开。需要本地静态部署时，把这个 HTML 放入静态服务器目录即可，游戏资源已嵌入文件。

## 从源码构建

在 Windows PowerShell 中进入仓库目录，执行 `.\build.ps1`。脚本使用 Windows .NET Framework 的 C# 编译器生成独立 HTML 和带图标的 Windows 程序。游戏源码和图标位于 `src/`。
