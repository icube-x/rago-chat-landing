import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, TenantContext, TenantRole } from '@/app/types/tenant';

const TenantContextInstance = createContext<TenantContext | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [role, setRole] = useState<TenantRole | null>(null);

  // 초기 로드: 사용자의 조직 정보 가져오기
  useEffect(() => {
    fetchUserTenant();
  }, []);

  const fetchUserTenant = async () => {
    try {
      // 실제 API 호출
      // const response = await fetch('/api/user/tenant');
      // const data = await response.json();

      // Mock 데이터 - 로그인한 사용자의 조직 정보
      const mockTenant: Tenant = {
        id: 'tenant-001',
        uuid: 'uuid-tenant-001',
        name: 'Acme Corporation',
        slug: 'acme-corp',
        subdomain: 'acme',
        plan: 'PAID',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        updatedAt: '2024-04-16',
        settings: {
          maxUsers: 50,
          maxProjects: 10,
          maxVectors: 100000,
          allowedModels: ['gpt-4', 'gpt-3.5-turbo'],
          customBranding: true,
        },
        billing: {
          pricePerUser: 10000,  // 사용자당 월 10,000원
          currentUsers: 15,
          billingCycle: 'MONTHLY',
          nextBillingDate: '2026-06-01',
        },
      };

      const mockRole: TenantRole = 'OWNER';

      setCurrentTenant(mockTenant);
      setRole(mockRole);
    } catch (error) {
      console.error('Failed to fetch user tenant:', error);
    }
  };

  const value: TenantContext = {
    currentTenant,
    role,
    setRole,
  };

  return (
    <TenantContextInstance.Provider value={value}>
      {children}
    </TenantContextInstance.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContextInstance);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
