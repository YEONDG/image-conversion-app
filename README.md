# Image Optimizer

이미지 변환 앱(Image Optimizer)은 Electron과 React 기반으로, sharp 라이브러리를 사용하여 다양한 이미지 포맷과 품질을 설정하고 이미지를 변환할 수 있는 데스크톱 애플리케이션입니다.

### 기능

- 포맷 변환: JPEG, PNG, WEBP, AVIF 지원
- 크기 조절: 가로, 세로 크기 조정 가능
- 품질 설정: 고화질, 중간, 저화질 선택
- 자동 저장: 변환된 이미지를 바탕화면의 ConvertedImages 폴더에 저장

### 설치

#### 요구사항

- Node.js 14+
- Git

### 설치 및 실행

```bash
// 저장소 클론

git clone https://github.com/username/image-optimizer.git
cd image-optimizer
```

```
// 종속성 설치
npm install

// 개발 서버 실행
npm run electron:dev

// prod 실행
npm run build
npm run electron:prod
```

빌드 및 배포

```
# Windows 빌드
npm run deploy:win32
or
npm run deploy:win64

# macOS 빌드
npm run deploy:xos
```

### 사용 기술

- Frontend: React, Tailwind CSS
- Backend: Electron, Sharp

### 기여

기여는 환영합니다! 이슈나 PR을 통해 버그 리포트 또는 기능 추가 제안을 해주세요.
