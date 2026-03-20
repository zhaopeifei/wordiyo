'use client';

import { useLanguage } from '@/components/language-provider';

const LAST_UPDATED = '2026-03-05';

const copy = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: `Last updated: ${LAST_UPDATED}`,
    sections: [
      {
        heading: 'What Data We Collect',
        body: 'When you sign in with Google, we receive your email address, display name, and profile avatar. We do not collect any additional personal information beyond what Google provides during authentication.',
      },
      {
        heading: 'How We Use Your Data',
        body: 'Your information is used solely to maintain your login session and display your profile within the app. We do not use your data for advertising, analytics profiling, or any purpose other than providing the core service.',
      },
      {
        heading: 'Third-Party Sharing',
        body: 'We do not sell, trade, or otherwise transfer your personal information to third parties. Your data stays within our system and is not shared with external services.',
      },
      {
        heading: 'Data Storage & Security',
        body: 'Your account data is stored securely in our database hosted on Supabase. We use industry-standard security measures, including encrypted connections (HTTPS) and secure authentication protocols (OAuth 2.0).',
      },
      {
        heading: 'Data Retention & Deletion',
        body: 'We retain your account data for as long as your account is active. If you wish to delete your account and all associated data, please contact us at the email address below, and we will process your request promptly.',
      },
      {
        heading: 'Contact',
        body: 'If you have any questions about this privacy policy or your data, please contact us at: hello@wordiyo.com',
      },
    ],
  },
  zh: {
    title: '隐私政策',
    lastUpdated: `最后更新：${LAST_UPDATED}`,
    sections: [
      {
        heading: '我们收集哪些数据',
        body: '当您使用 Google 登录时，我们会获取您的电子邮件地址、显示名称和头像。除 Google 在身份验证过程中提供的信息外，我们不会收集任何其他个人信息。',
      },
      {
        heading: '我们如何使用您的数据',
        body: '您的信息仅用于维护登录状态和在应用内显示您的个人资料。我们不会将您的数据用于广告、分析画像或提供核心服务以外的任何目的。',
      },
      {
        heading: '第三方共享',
        body: '我们不会出售、交易或以其他方式将您的个人信息转让给第三方。您的数据保留在我们的系统内，不会与外部服务共享。',
      },
      {
        heading: '数据存储与安全',
        body: '您的账户数据安全地存储在 Supabase 托管的数据库中。我们采用行业标准的安全措施，包括加密连接 (HTTPS) 和安全身份验证协议 (OAuth 2.0)。',
      },
      {
        heading: '数据保留与删除',
        body: '只要您的账户处于活跃状态，我们就会保留您的账户数据。如果您希望删除账户及所有相关数据，请通过以下电子邮件联系我们，我们将及时处理您的请求。',
      },
      {
        heading: '联系方式',
        body: '如果您对本隐私政策或您的数据有任何疑问，请联系我们：hello@wordiyo.com',
      },
    ],
  },
} as const;

export const PrivacyPage = () => {
  const { locale } = useLanguage();
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="text-muted-foreground text-sm">{t.lastUpdated}</p>
      </header>

      {t.sections.map((section) => (
        <section
          key={section.heading}
          className="border-border bg-card rounded-[20px] border p-6 space-y-3"
        >
          <h2 className="font-heading text-foreground text-xl font-semibold">{section.heading}</h2>
          <p className="text-muted-foreground text-base leading-relaxed">{section.body}</p>
        </section>
      ))}
    </article>
  );
};
