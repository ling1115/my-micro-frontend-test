module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // 为了让主应用能正确识别微应用暴露出来的一些信息，
  // 微应用的打包工具需要增加如下配置：
  configureWebpack: {
    output: {
      library: `sub1`,
      libraryTarget: 'umd',
    },
  },
}
