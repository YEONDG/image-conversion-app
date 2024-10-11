const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImagePath = path.join(__dirname, 'input', 'sample.jpg');
const outputImagePath = path.join(__dirname, 'output');

const sizes = [
  { width: 480, suffix: 'small' }, // 작은 사이즈
  { width: 1024, suffix: 'medium' }, // 중간 사이즈
  { width: 1920, suffix: 'large' }, // 큰 사이즈
];

function optimizeAndConvertImage(inputPath, sizes, outputDirectory) {
  // 출력 디렉토리 생성
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // 각 사이즈에 대해 AVIF 포맷 변환 및 저장
  sizes.forEach(({ width, suffix }) => {
    const outputFileName = `${path.basename(
      inputPath,
      path.extname(inputPath)
    )}-${suffix}.avif`;
    const outputPath = path.join(outputDirectory, outputFileName);

    sharp(inputPath)
      .resize({ width }) // 설정된 너비로 리사이징
      .toFormat('avif', { quality: 50 }) // AVIF 포맷으로 변환, 품질은 50으로 설정
      .toFile(outputPath)
      .then(() => {
        console.log(`Optimized and converted image saved to ${outputPath}`);
      })
      .catch((err) => {
        console.error(`Error processing ${suffix} image: ${err.message}`);
      });
  });
}

// 이미지 최적화 및 변환 실행
optimizeAndConvertImage(inputImagePath, sizes, outputDir);
