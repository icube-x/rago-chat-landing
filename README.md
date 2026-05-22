# KL-Store Landing Page

KL-Store 서비스의 랜딩 페이지입니다.

## 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS v4
- Lucide Icons

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## S3 정적 배포

이 프로젝트는 React/Vite 앱을 유지하되, `pnpm build` 결과물인 `dist/`를 S3 정적 웹사이트로 배포할 수 있습니다.

### 1. S3 버킷 준비

S3 버킷을 만들고 정적 웹사이트 호스팅을 활성화합니다.

- Index document: `index.html`
- Error document: `index.html`

공개 웹사이트로 운영하려면 버킷 퍼블릭 액세스 차단 설정과 버킷 정책을 서비스 정책에 맞게 열어야 합니다. CloudFront를 앞단에 둘 경우에는 S3를 직접 공개하지 않고 OAC/OAI 구성을 사용하는 방식을 권장합니다.

### 2. AWS CLI 설정

```bash
aws configure
```

이미 프로필을 쓰고 있다면 배포 시 `AWS_PROFILE`을 지정합니다.

배포용 IAM 사용자 또는 역할에는 최소한 아래 권한이 필요합니다. `Resource`의 버킷 이름은 실제 배포 버킷으로 바꿔서 사용하세요.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. 배포

```bash
S3_BUCKET=your-bucket-name pnpm deploy:s3
```

선택 옵션:

```bash
# 특정 프로필 사용
AWS_PROFILE=your-profile S3_BUCKET=your-bucket-name pnpm deploy:s3

# 특정 리전 지정
AWS_REGION=ap-northeast-2 S3_BUCKET=your-bucket-name pnpm deploy:s3

# 버킷 하위 경로에 배포
S3_BUCKET=your-bucket-name S3_PREFIX=landing pnpm deploy:s3

# 실제 업로드 전 dry run
S3_DRY_RUN=1 S3_BUCKET=your-bucket-name pnpm deploy:s3

# s3:ListBucket 권한 없이 업로드만 수행
S3_UPLOAD_MODE=copy S3_BUCKET=your-bucket-name pnpm deploy:s3
```

배포 스크립트는 해시가 붙은 정적 파일에는 장기 캐시를 적용하고, `index.html`에는 `no-cache`를 적용합니다.
기본값은 `aws s3 sync --delete`이며 기존 파일 정리를 위해 `s3:ListBucket` 권한이 필요합니다. `S3_UPLOAD_MODE=copy`를 쓰면 기존 파일 삭제 없이 업로드만 수행합니다.

## 특징

- 반응형 디자인
- 5가지 요금제 (Trial, Starter, Pro, Business, Enterprise)
- "준비중입니다" 모달 기능
- 깔끔하고 현대적인 UI

## 배포

S3, CloudFront, Vercel, Netlify 등의 정적 호스팅 플랫폼에 배포 가능합니다.

## 라이선스

MITㅔㅜ
