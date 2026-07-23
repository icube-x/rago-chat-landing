// 멀티 테넌트 관련 타입 정의

export interface Tenant {
  id: string;
  uuid: string;
  name: string;
  slug: string; // URL friendly name (e.g., 'acme-corp')
  subdomain?: string; // Optional subdomain (e.g., 'acme' for acme.rago-x.chat)
  logo?: string;
  plan: 'TRIAL' | 'PAID';  // TRIAL: 무료 체험, PAID: 인당 과금
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL_EXPIRED';
  createdAt: string;
  updatedAt: string;
  settings?: TenantSettings;
  billing?: BillingInfo;
}

export interface BillingInfo {
  pricePerUser: number;          // 사용자당 월 요금 (원 또는 달러)
  currentUsers: number;          // 현재 활성 사용자 수
  billingCycle: 'MONTHLY' | 'YEARLY';  // 결제 주기
  nextBillingDate: string;       // 다음 결제일
  trialEndsAt?: string;          // Trial 종료일
  trialDaysRemaining?: number;   // Trial 남은 일수
}

export interface TenantSettings {
  maxUsers: number;
  maxProjects: number;
  maxVectors: number;
  allowedModels: string[];
  customBranding: boolean;
}

export interface TenantUser {
  id: string;
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: TenantRole;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  invitedAt?: string;
  joinedAt?: string;
}

export type TenantRole =
  | 'MASTER'           // SaaS 전체 관리자 (플랫폼 운영자)
  | 'OWNER'            // 조직 소유자 (청구, 플랜, 최고 권한)
  | 'ADMIN'            // 조직 관리자 (사용자/프로젝트 관리)
  | 'MEMBER';          // 일반 사용자

export interface TenantInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: TenantRole;
  invitedBy: string;
  inviteCode: string;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
}

export interface UserTenant {
  tenant: Tenant;
  role: TenantRole;
}

// 현재 사용자의 테넌트 컨텍스트
export interface TenantContext {
  currentTenant: Tenant | null;
  role: TenantRole | null;
  setRole: (role: TenantRole) => void;
}
