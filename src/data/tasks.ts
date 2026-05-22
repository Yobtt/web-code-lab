export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  hint: string
  checkKeywords: string[]
}

export interface Phase {
  id: number
  title: string
  description: string
  tasks: Task[]
}

export const taskPhases: Phase[] = [
  {
    id: 1,
    title: '认识HTML结构',
    description: '学习HTML文档的基本结构，创建你的第一个网页框架',
    tasks: [
      {
        id: '1-1',
        title: '创建HTML基本框架',
        description: '输入DOCTYPE、html、head和body标签，搭建网页骨架',
        hint: '试试输入 <!DOCTYPE html> 然后按Tab键自动补全',
        checkKeywords: ['<!DOCTYPE', '<html', '<head', '<body'],
      },
      {
        id: '1-2',
        title: '添加网页标题',
        description: '在head标签里添加title标签，给网页起个名字',
        hint: '在 <head> 和 </head> 之间输入 <title>我的网页</title>',
        checkKeywords: ['<title>', '</title>'],
      },
      {
        id: '1-3',
        title: '添加页面主标题',
        description: '用h1标签在页面上显示一个大标题',
        hint: '在 <body> 里输入 <h1>欢迎光临！</h1>',
        checkKeywords: ['<h1>', '</h1>'],
      },
    ],
  },
  {
    id: 2,
    title: '文字与排版',
    description: '学习如何在网页中添加和美化文字内容',
    tasks: [
      {
        id: '2-1',
        title: '添加段落文字',
        description: '用p标签写一段自我介绍或欢迎语',
        hint: '使用 <p> 标签来写一段文字，例如：<p>大家好，这是我的第一个网页！</p>',
        checkKeywords: ['<p>', '</p>'],
      },
      {
        id: '2-2',
        title: '文字加粗和斜体',
        description: '用strong和em标签让文字有粗细变化',
        hint: '<strong>文字</strong> 让文字加粗，<em>文字</em> 让文字倾斜',
        checkKeywords: ['<strong>', '<em>'],
      },
      {
        id: '2-3',
        title: '设置文字颜色',
        description: '用style属性给文字添加颜色',
        hint: '在标签里添加 style="color: red" 试试看！也可以换成 blue、green、orange 等',
        checkKeywords: ['style=', 'color'],
      },
    ],
  },
  {
    id: 3,
    title: '插入图片',
    description: '学习如何在网页中插入图片，让页面更生动',
    tasks: [
      {
        id: '3-1',
        title: '插入一张图片',
        description: '用img标签在页面上显示一张图片',
        hint: '使用 <img src="图片地址" alt="描述"> 来插入图片。可以用网上的图片链接试试！',
        checkKeywords: ['<img', 'src='],
      },
      {
        id: '3-2',
        title: '调整图片大小',
        description: '设置图片的宽度和高度，让它大小合适',
        hint: '在img标签里加上 width="300" 或 style="width:300px" 来调整大小',
        checkKeywords: ['width', 'img'],
      },
    ],
  },
  {
    id: 4,
    title: '超链接与导航',
    description: '学习创建链接，让多个页面可以互相跳转',
    tasks: [
      {
        id: '4-1',
        title: '添加外部链接',
        description: '用a标签创建一个可以点击跳转的超链接',
        hint: '使用 <a href="https://www.baidu.com">点击访问百度</a> 来创建链接',
        checkKeywords: ['<a ', 'href='],
      },
      {
        id: '4-2',
        title: '创建第二个页面',
        description: '切换到页面二，给它添加一些内容',
        hint: '点击左侧文件列表中的"页面二"，在body里添加标题和内容',
        checkKeywords: ['<h1>', '<p>'],
      },
      {
        id: '4-3',
        title: '页面间互相跳转',
        description: '让首页可以跳转到页面二，页面二也可以回到首页',
        hint: '在首页添加 <a href="page1.html">去页面二</a>，在页面二添加 <a href="index.html">回首页</a>',
        checkKeywords: ['page1.html', 'index.html'],
      },
    ],
  },
  {
    id: 5,
    title: '美化页面',
    description: '学习CSS基础，让你的网页变漂亮',
    tasks: [
      {
        id: '5-1',
        title: '设置背景颜色',
        description: '给网页添加一个好看的背景色',
        hint: '在body标签里添加 style="background-color: #f0f8ff" 试试！',
        checkKeywords: ['background-color', 'background'],
      },
      {
        id: '5-2',
        title: '设置字体样式',
        description: '修改文字的字体和大小，让排版更美观',
        hint: '使用 style="font-family: 微软雅黑; font-size: 18px" 来设置字体',
        checkKeywords: ['font-family', 'font-size'],
      },
      {
        id: '5-3',
        title: '添加CSS样式表',
        description: '在head中用style标签统一管理样式',
        hint: '在 <head> 中添加 <style> body { ... } h1 { ... } </style>，可以一次设置多个样式',
        checkKeywords: ['<style>', '</style>'],
      },
    ],
  },
  {
    id: 6,
    title: '综合实践',
    description: '把学到的知识都用上，完成一个完整的个人网站',
    tasks: [
      {
        id: '6-1',
        title: '完善三个页面内容',
        description: '给三个页面都添加丰富的内容：标题、段落、图片',
        hint: '每个页面至少有一个h1标题、一段p文字和一张img图片',
        checkKeywords: ['<h1>', '<p>', '<img'],
      },
      {
        id: '6-2',
        title: '确保链接可以跳转',
        description: '检查所有页面的导航链接是否正常工作',
        hint: '在预览中点击每个链接，确保它们能正确跳转',
        checkKeywords: ['<a ', 'href='],
      },
      {
        id: '6-3',
        title: '整体美化调整',
        description: '统一三个页面的风格，调整颜色、字体，让网站看起来协调',
        hint: '给三个页面设置相同的配色方案，让它们像一个完整的网站',
        checkKeywords: ['style', 'color'],
      },
    ],
  },
]
