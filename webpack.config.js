const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // 애플리케이션의 진입점
  output: {
    path: path.resolve(__dirname, 'dist'), // 빌드된 파일이 저장될 위치
    filename: 'bundle.js', // 출력 파일 이름
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // .js, .jsx, .ts, .tsx 파일을 대상으로 합니다
        exclude: /node_modules/, // node_modules 디렉토리는 제외합니다
        use: {
          loader: 'babel-loader', // Babel을 사용하여 변환합니다
        },
      },
      {
        test: /\.css$/, // .css 파일을 대상으로 합니다
        use: ['style-loader', 'css-loader', 'postcss-loader'], // CSS 파일을 처리하기 위한 로더들
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, ''),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 이 확장자들을 가진 파일을 처리합니다
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 템플릿으로 사용할 HTML 파일
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // 개발 서버에서 제공할 폴더
    },
    compress: true,
    port: 3000, // 개발 서버 포트
  },
};
