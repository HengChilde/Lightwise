<p align="center">
  <img src="./assets/favicon.svg" width="72" height="72" alt="Lightwise 标识" />
</p>

<h1 align="center">Lightwise · 光的智慧</h1>

<p align="center"><strong>摄影复盘更直观，照片选片更顺手。</strong></p>

<p align="center">
  回看拍摄参数，理解每一次取舍。<br />
  对比、标记、整理，把喜欢的照片留下来。
</p>

<p align="center">
  <img src="https://img.shields.io/badge/macOS-Apple%20Silicon-111311?style=flat-square&amp;logo=apple&amp;logoColor=white" alt="平台：macOS Apple Silicon" />
  <img src="https://img.shields.io/badge/界面-简体中文-d5e7b2?style=flat-square" alt="界面语言：简体中文" />
  <img src="https://img.shields.io/badge/格式-JPG%20%2F%20JPEG-d5e7b2?style=flat-square" alt="照片格式：JPG / JPEG" />
  <img src="https://img.shields.io/badge/公开下载-v0.1.0-d5e7b2?style=flat-square" alt="公开下载：v0.1.0" />
</p>

<p align="center">
  <strong>简体中文</strong> · <a href="./README.en.md">English</a>
</p>

<p align="center">
  <a href="https://hengchilde.github.io/Lightwise/">官网</a> · <a href="#features">功能亮点</a> · <a href="#download">获取 Lightwise</a> · <a href="#story">为什么做它</a> · <a href="#feedback">交流反馈</a>
</p>

![Lightwise 工作区：左侧浏览照片，中间查看成片，右侧同步显示拍摄参数与规则解读](./assets/workspace-demo.jpg)

拍了一天照片，回到电脑前，往往还有两件事：从相似的照片里选出喜欢的那张，以及弄明白这次的拍摄参数带来了什么效果。

**Lightwise 是一款把摄影复盘与照片选片放在一起的桌面工具。** 照片、参数和对比都在同一个工作区里，让选片的过程，也成为积累拍摄经验的过程。

<a id="features"></a>

## 看照片，也看懂当时的选择

光圈、快门、ISO、焦距，就在照片旁边。切换照片时，参数与解读同步跟随，无需反复打开文件信息。

- **把理论放回照片里。** 结合成片，回看光圈与景深、快门与运动表现、ISO 与噪点之间的取舍。
- **参数不止是一串数字。** 本地规则解读提供理解参数的线索；在符合条件时，给出相同光照下的曝光组合换算，帮助思考下一次可以怎样尝试。
- **几张一起看，差别更清楚。** 对比时可以查看各张照片的参数差异，把视觉感受和拍摄设置联系起来。

参数解读依据照片中的 EXIF 信息生成。目前不包含 AI 看图、场景识别或成片评分；缺失参数不会被猜测补齐。照片好不好、是否符合表达意图，仍由你判断。

## 几张一起比，好照片更好选

![Lightwise 宫格对比：四张示例照片同屏展示，右侧比较光圈、快门、ISO 和焦距差异](./assets/selection-demo.jpg)

旅行风景、连续人像、同一场景的几次尝试，常常只有一点点区别。把照片并排放在一起，比较构图、神态和细节，就更容易做决定。

- **单图、双图、最多六张宫格。** 先看整体，再把需要比较的照片手动放到一起。
- **同步缩放与拖动。** 放大检查细节，也可以解除同步，分别查看每张照片。
- **少一点切换，多一点专注。** 深色工作区减少干扰，左右面板可折叠，把更多空间留给照片；构图网格辅助观察画面。

## 一边标记，一边整理

喜欢就按 `P`，淘汰就按 `X`。设置好目标目录和整理规则后，每次标记都会触发对应的文件整理，减少选完照片后再手动分类的重复劳动。

- **已选与淘汰分别归档。** 按设置复制或剪切到对应文件夹；复制保留来源原片，剪切在核验目标后移除来源照片。
- **改主意，也能接着选。** 修改标记时，应用会按新分类调整受管理的文件，并展示任务进度、失败与重试入口。
- **本地照片，本地处理。** 核心浏览、选片与参数解读离线可用，无需注册账号，不上传照片供分析。

| 快捷键    | 操作                |
| --------- | ------------------- |
| `←` / `→` | 上一张 / 下一张     |
| `P` / `X` | 标记已选 / 淘汰     |
| `+` / `-` | 放大 / 缩小         |
| `0`       | 适合窗口            |
| `G`       | 显示 / 隐藏构图网格 |
| `?`       | 查看快捷键          |

<a id="download"></a>

## 获取 Lightwise

**当前版本：Lightwise 0.1.0。** [下载 macOS Apple Silicon 安装包](https://github.com/HengChilde/Lightwise/releases/download/v0.1.0/Lightwise-0.1.0-arm64.dmg)，或前往 [Release 页面](https://github.com/HengChilde/Lightwise/releases/tag/v0.1.0)查看发布资料。

首发功能与后续版本变化见[更新记录](./CHANGELOG.md)。

| 项目           | 当前支持                           |
| -------------- | ---------------------------------- |
| 设备           | Apple Silicon（M 系列芯片）的 Mac  |
| 照片           | JPG / JPEG                         |
| 软件界面       | 简体中文                           |
| 其他平台与格式 | 暂不支持 Intel Mac、Windows 和 RAW |

拿到安装包后，打开 DMG，将 Lightwise 拖入「应用程序」，再选择照片文件夹即可开始使用。首次标记时，确认整理方式和目标目录，然后继续选片。

遇到安装问题可联系开发者；更新时请先正常退出旧版，再替换应用，选片记录保存在本机。英文 README 用于介绍产品，软件暂未提供英文界面。

<a id="story"></a>

## 从一次新疆旅行开始

Lightwise 的起点，是一次带着索尼 ZV-E10 去新疆的旅行。

从喀什到帕米尔高原，雪山、湖泊和公路都值得多拍几张。作为摄影新手，我一路尝试不同的光圈、快门和 ISO，回来却发现：照片拍了不少，相似的照片很难选，参数和成片之间的关系也还没真正弄明白。

于是，我想给自己做一个简单顺手的工具：**一边选照片，一边复盘；几张放在一起比，选好就顺手整理。**

我把多年做产品经理的习惯带进了这次尝试：先想清楚需求，再收束功能、设计交互，借助 AI 编程工具，在一个下午完成了最初的产品原型。此后继续围绕真实使用打磨。Lightwise，也就是「光的智慧」，由此而来。

这段经历写在了《旅行归来，我给自己做了一款摄影软件》里。希望它也能让更多喜欢拍照的人，少一点选片的纠结，多一点拍摄的体会。

<a id="feedback"></a>

## 交流与反馈

如果你也在学摄影，或者经常要从一大堆照片中挑出几张，欢迎聊聊你的使用习惯和遇到的问题。

- 邮箱：[hh@1000idea.com](mailto:hh@1000idea.com)

反馈问题时，请尽量附上应用版本、Mac 芯片与系统版本、复现步骤及错误截图。

## 关于这个仓库

这里存放 Lightwise 的官网、产品介绍与公开分发资料，桌面软件源码单独维护。仓库公开不代表桌面软件已开源。
