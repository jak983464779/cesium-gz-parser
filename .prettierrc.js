module.exports = {
  // (x)=>{},单个参数箭头函数是否显示小括号。(always:始终显示;avoid:省略括号。默认:always)
  arrowParens: 'always',
  // 开始标签的右尖括号是否跟随在最后一行属性末尾，默认false
  bracketSameLine: false,
  // 对象字面量的括号之间打印空格 (true - Example: { foo: bar } ; false - Example: {foo:bar})
  bracketSpacing: true,
  // 是否格式化一些文件中被嵌入的代码片段的风格(auto|off;默认auto)
  embeddedLanguageFormatting: 'auto',
  // 当文件已经被 Prettier 格式化之后，是否会在文件顶部插入一个特殊的 @format 标记，默认false
  insertPragma: false,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: 'es5',
  // 指定缩进方式，空格或tab，默认false，即使用空格
  useTabs: true,
  // 不让prettier检测文件每行结束的格式
  endOfLine: 'auto'
};
