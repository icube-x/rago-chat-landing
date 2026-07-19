export type PolicySlug = 'terms' | 'privacy';

export interface PolicyTocItem {
  id: string;
  label: string;
}

export interface PolicyDocument {
  slug: PolicySlug;
  title: string;
  effectiveDate: string;
  contentHtml: string;
  toc: PolicyTocItem[];
}
