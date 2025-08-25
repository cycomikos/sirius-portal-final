export interface NavClickHandler {
  (href: string): void;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface AnnouncementItem {
  badge: string;
  title: string;
  description: string;
  features?: string[];
  actionText?: string;
}