export interface NavClickHandler {
  (href: string): void;
}

export interface FormData extends Record<string, string> {
  name: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  subject?: string;
  message?: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface AnnouncementItem {
  badge: string;
  title: string;
  description: string;
  features?: string[];
  actionText?: string;
}