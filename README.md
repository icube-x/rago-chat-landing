# KL-Store Landing Page

KL-Store 서비스의 랜딩 페이지입니다.

## 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS v4
- Lucide Icons

## 설치 및 실행`

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

배포 대상 S3 버킷은 `apps.icube-x.com-465768368057-ap-northeast-2-an`입니다. 버킷에서 정적 웹사이트 호스팅을 활성화합니다.

- Index document: `index.html`
- Error document: `index.html`

공개 웹사이트로 운영하려면 버킷 퍼블릭 액세스 차단 설정과 버킷 정책을 서비스 정책에 맞게 열어야 합니다. CloudFront를 앞단에 둘 경우에는 S3를 직접 공개하지 않고 OAC/OAI 구성을 사용하는 방식을 권장합니다.

### 2. AWS CLI 설정

```bash
aws configure
```

이미 프로필을 쓰고 있다면 배포 시 `AWS_PROFILE`을 지정합니다.

배포용 IAM 사용자 또는 역할에는 최소한 아래 권한이 필요합니다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::apps.icube-x.com-465768368057-ap-northeast-2-an"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::apps.icube-x.com-465768368057-ap-northeast-2-an/*"
    }
  ]
}
```

### 3. 배포

```bash
S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an pnpm deploy:s3
```

기본 배포 스크립트는 `landing_user` 프로필과 운영 버킷을 사용합니다.

```bash
pnpm deploy
```

선택 옵션:

```bash
# 특정 프로필 사용
AWS_PROFILE=your-profile S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an pnpm deploy:s3

# 특정 리전 지정
AWS_REGION=ap-northeast-2 S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an pnpm deploy:s3

# 버킷 하위 경로에 배포
S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an S3_PREFIX=landing pnpm deploy:s3

# 실제 업로드 전 dry run
S3_DRY_RUN=1 S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an pnpm deploy:s3

# s3:ListBucket 권한 없이 업로드만 수행
S3_UPLOAD_MODE=copy S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an pnpm deploy:s3
```

배포 스크립트는 해시가 붙은 정적 파일에는 장기 캐시를 적용하고, `index.html`에는 `no-cache`를 적용합니다.
기본값은 `aws s3 sync --delete`이며 기존 파일 정리를 위해 `s3:ListBucket` 권한이 필요합니다. `S3_UPLOAD_MODE=copy`를 쓰면 기존 파일 삭제 없이 업로드만 수행합니다.

### Content Security Policy

이 앱은 서버 렌더링이 없는 Vite 정적 앱이므로 요청마다 안전한 nonce를 생성할 서버가 없습니다. 대신 인라인 스크립트를 사용하지 않고 `script-src`를 자체 번들과 Google Tag Manager로 제한합니다. React 컴포넌트와 차트가 동적 `style` 속성을 사용하므로 기능 유지를 위해 `style-src 'unsafe-inline'`만 허용하며, `unsafe-eval`은 허용하지 않습니다.

`index.html`의 메타 정책은 정적 원본을 위한 방어 계층입니다. 보안 점검에서 요구하는 HTTP 응답 헤더와 메타에서 지원되지 않는 `frame-ancestors`는 CloudFront Response Headers Policy로 적용해야 합니다.

1. `infra/cloudfront-response-headers-policy.json`으로 Response Headers Policy를 생성하거나 기존 정책을 갱신합니다.
2. CloudFront 배포의 기본 캐시 동작(Default cache behavior)과 추가 캐시 동작이 있다면 모든 동작에 해당 정책을 연결합니다.
3. 배포가 완료된 후 CloudFront 무효화를 실행하고 아래 명령으로 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ | grep -i '^content-security-policy:'
```

브라우저 개발자 도구의 Console과 Network 탭에서 CSP 위반, API 호출, Google Analytics 요청, Unsplash 문서 미리보기 이미지를 함께 확인합니다. 정책을 강화하거나 외부 서비스를 추가할 때 허용 도메인을 누락하면 해당 기능이 차단될 수 있으므로 운영 반영 전 스테이징에서 먼저 검증해야 합니다.

### HTTP Strict Transport Security

CloudFront Response Headers Policy는 다음 HSTS 헤더를 반환하도록 구성합니다.

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

> **서비스 장애 주의:** `includeSubDomains`는 `icube-x.com` 아래의 모든 서브도메인에 HTTPS 사용을 강제하고, `preload` 등록은 브라우저에 장기간 반영되어 즉시 되돌리기 어렵습니다. 정책을 상위 도메인 전체에 적용하거나 HSTS preload 목록에 제출하기 전에 모든 서브도메인이 유효한 HTTPS 인증서와 HTTPS 서비스를 제공하는지 반드시 확인해야 합니다. 이 저장소의 CloudFront 정책을 `apps.icube-x.com` 응답에 연결하는 것만으로 브라우저 preload 목록에 자동 등록되지는 않습니다.

운영 반영 후 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ | grep -i '^strict-transport-security:'
```

예상 결과는 `max-age=63072000`, `includeSubDomains`, `preload` 세 지시어를 모두 포함해야 합니다. HTTP 접근이 HTTPS로 리디렉션되는지도 함께 확인합니다.

```bash
curl -sSI http://apps.icube-x.com/ | grep -iE '^(HTTP/|location:)'
```

### Clickjacking protection

CloudFront Response Headers Policy는 호환성과 최신 브라우저 방어를 위해 다음 두 헤더를 함께 적용합니다.

```http
X-Frame-Options: DENY
Content-Security-Policy: ...; frame-ancestors 'none'; ...
```

> **서비스 장애 주의:** 이 정책은 같은 출처를 포함한 모든 `<iframe>` 임베딩을 차단합니다. 고객 포털, 사내 대시보드 또는 다른 서비스에서 `apps.icube-x.com`을 iframe으로 표시해야 한다면 운영 반영 전에 요구사항을 확인해야 합니다. 특정 출처의 임베딩이 필요할 경우 `X-Frame-Options: DENY`를 그대로 유지할 수 없으며, 허용 출처를 명시한 CSP `frame-ancestors` 중심 정책으로 별도 설계해야 합니다.

운영 반영 후 두 헤더를 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ \
  | grep -iE '^(x-frame-options:|content-security-policy:)'
```

브라우저에서도 외부 출처의 테스트 HTML에 아래 iframe을 넣고 로드가 거부되는지 확인합니다. 개발자 도구 Console에는 `X-Frame-Options` 또는 `frame-ancestors`에 의한 차단 메시지가 표시되어야 합니다.

```html
<iframe src="https://apps.icube-x.com/" title="clickjacking test"></iframe>
```

### MIME sniffing protection

CloudFront Response Headers Policy의 `ContentTypeOptions`를 활성화하여 모든 연결된 캐시 동작의 응답에 다음 헤더를 적용합니다.

```http
X-Content-Type-Options: nosniff
```

> **서비스 장애 주의:** `nosniff` 적용 후 브라우저는 잘못된 `Content-Type`으로 제공되는 JavaScript와 CSS를 실행하지 않습니다. S3 업로드 시 `.js`는 JavaScript MIME 타입, `.css`는 `text/css`, HTML은 `text/html`로 제공되는지 운영 반영 전에 확인해야 합니다. CloudFront에 추가 캐시 동작이 있다면 일부 경로에서 헤더가 누락되지 않도록 동일한 Response Headers Policy를 모든 동작에 연결해야 합니다.

운영 반영 후 HTML뿐 아니라 정적 JavaScript와 CSS 응답도 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ | grep -i '^x-content-type-options:'
curl -sSI https://apps.icube-x.com/assets/실제-JS-파일.js \
  | grep -iE '^(content-type:|x-content-type-options:)'
curl -sSI https://apps.icube-x.com/assets/실제-CSS-파일.css \
  | grep -iE '^(content-type:|x-content-type-options:)'
```

예상 결과는 모든 응답에 `X-Content-Type-Options: nosniff`가 있고, JavaScript와 CSS의 `Content-Type`이 각각 올바른 MIME 타입으로 반환되는 것입니다. 브라우저 개발자 도구 Console에서도 MIME 타입 불일치 오류가 없는지 확인합니다.

### Referrer information protection

CloudFront Response Headers Policy는 모든 연결된 캐시 동작의 응답에 다음 헤더를 적용합니다.

```http
Referrer-Policy: strict-origin-when-cross-origin
```

이 정책은 같은 출처 요청에는 전체 URL을 전달하고, HTTPS에서 다른 출처로 이동할 때는 경로와 쿼리를 제외한 출처만 전달하며, HTTPS에서 HTTP로 내려가는 요청에는 referrer를 전달하지 않습니다.

> **서비스 장애 주의:** 외부 분석, 결제, 제휴 또는 접근 제어 시스템이 전체 referrer 경로나 쿼리 문자열에 의존한다면 데이터가 축소되거나 연동이 달라질 수 있습니다. 운영 반영 전에 해당 외부 서비스가 origin 단위 referrer만으로 동작하는지 확인해야 합니다. 추가 CloudFront 캐시 동작이 있다면 헤더 누락을 막기 위해 동일 정책을 모든 동작에 연결해야 합니다.

운영 반영 후 헤더를 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ | grep -i '^referrer-policy:'
```

예상 결과는 다음과 같습니다.

```http
Referrer-Policy: strict-origin-when-cross-origin
```

브라우저에서는 `apps.icube-x.com`에서 다른 HTTPS 출처로 요청하거나 이동한 뒤 개발자 도구 Network 탭의 `Referer` 요청 헤더가 전체 경로가 아닌 `https://apps.icube-x.com/` 출처까지만 전달되는지 확인합니다.

### Browser feature permissions

현재 코드에서 사용하는 브라우저 권한 기능은 초대 링크 복사를 위한 `navigator.clipboard.writeText`입니다. 이 기능을 유지하기 위해 `clipboard-write`는 차단하지 않고, 사용 근거가 없는 기능은 CloudFront 사용자 정의 응답 헤더로 비활성화합니다.

```http
Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), xr-spatial-tracking=()
```

> **서비스 장애 주의:** 빈 허용 목록 `()`은 현재 문서와 모든 iframe에서 해당 기능을 차단합니다. 향후 화상 상담, 음성 입력, 위치 정보, WebAuthn 패스키, 결제, 전체화면 또는 화면 공유 기능을 추가하면 브라우저 API 호출이 거부될 수 있으므로 해당 지시어를 명시적으로 재검토해야 합니다. 초대 링크 복사 기능 때문에 `clipboard-write`는 현재 정책에 포함하지 않았습니다.

운영 반영 후 헤더를 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ | grep -i '^permissions-policy:'
```

브라우저 개발자 도구 Console에서 정책 파싱 경고가 없는지 확인하고, 기존 초대 링크 복사 기능이 정상 동작하는지 회귀 테스트합니다. 차단 검증은 HTTPS 환경의 Console에서 다음과 같이 수행할 수 있습니다.

```js
await navigator.mediaDevices.getUserMedia({ video: true });
navigator.geolocation.getCurrentPosition(console.log, console.error);
```

정책 적용 후에는 카메라와 위치 권한 프롬프트가 표시되지 않고 Permissions Policy에 의해 거부되어야 합니다.

### Server information exposure

이 저장소는 Next.js 서버가 아니라 S3 원본과 CloudFront로 정적 파일을 제공합니다. 따라서 `poweredByHeader: false` 같은 Next.js 설정 대신 CloudFront Response Headers Policy에서 원본의 서버 식별 헤더를 제거합니다.

```json
"RemoveHeadersConfig": {
  "Items": [
    { "Header": "Server" },
    { "Header": "X-Powered-By" }
  ]
}
```

> **서비스 장애 주의:** 일반적인 브라우저 기능에는 영향이 없지만, 모니터링·WAF·로그 분석 또는 외부 헬스체크가 `Server`나 `X-Powered-By` 헤더 존재 여부에 의존한다면 탐지 규칙이 달라질 수 있습니다. 운영 반영 전 해당 의존성을 확인하고, 정상 응답뿐 아니라 리디렉션과 4xx/5xx 오류 응답도 테스트해야 합니다.

CloudFront는 원본의 `Server: AmazonS3`를 제거한 뒤 자체 `Server: CloudFront`를 추가합니다. 따라서 S3 원본 정보는 숨길 수 있지만 `Server` 헤더 자체를 Response Headers Policy만으로 완전히 제거할 수는 없습니다. `Via`, `X-Cache`, `X-Amz-Cf-Pop`, `X-Amz-Cf-Id` 같은 CloudFront 진단 헤더도 제거가 제한됩니다. CDN 사용 사실까지 완전히 은폐한다고 간주하지 않고, 원본과 프레임워크 식별 정보를 최소화합니다.

운영 반영 후 정상 응답에서 `AmazonS3`와 `X-Powered-By`가 사라지고 서버 값이 `CloudFront`로 최소화되는지 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/ \
  | grep -iE '^(server:|x-powered-by:)'

curl -sSI https://apps.icube-x.com/ \
  | grep -iE '^(server: AmazonS3|x-powered-by:)' \
  && echo 'unexpected origin/framework header' \
  || echo 'origin/framework headers minimized'
```

존재하지 않는 경로와 정적 파일 응답에서도 확인합니다.

```bash
curl -sSI https://apps.icube-x.com/__security-header-test-not-found__ \
  | grep -iE '^(HTTP/|server:|x-powered-by:)'
curl -sSI https://apps.icube-x.com/assets/실제-JS-파일.js \
  | grep -iE '^(HTTP/|server:|x-powered-by:)'
```

## 특징

- 반응형 디자인
- 5가지 요금제 (Trial, Starter, Pro, Business, Enterprise)
- "준비중입니다" 모달 기능
- 깔끔하고 현대적인 UI

## 배포

S3, CloudFront, Vercel, Netlify 등의 정적 호스팅 플랫폼에 배포 가능합니다.

## 라이선스

MITㅔㅜ
