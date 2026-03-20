'use client';

import { useLanguage } from '@/components/language-provider';

const LAST_UPDATED = '2026-03-05';

const copy = {
  en: {
    title: 'Terms of Service',
    lastUpdated: `Last updated: ${LAST_UPDATED}`,
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing and using Wordiyo, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.',
      },
      {
        heading: 'Use of the Service',
        body: 'Wordiyo is an educational platform for learning English vocabulary through etymology. The service is provided for personal, non-commercial use. You agree not to misuse the service, interfere with its operation, or attempt to access it through unauthorized means.',
      },
      {
        heading: 'User Accounts',
        body: 'You may sign in using your Google account. You are responsible for maintaining the security of your account credentials. You agree to provide accurate information and to notify us if you suspect unauthorized access to your account.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All content on Wordiyo, including text, graphics, and data compilations, is the property of Wordiyo or its content providers. You may not reproduce, distribute, or create derivative works from our content without explicit permission.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'Wordiyo is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, or consequential damages.',
      },
      {
        heading: 'Changes to Terms',
        body: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.',
      },
      {
        heading: 'Contact',
        body: 'If you have any questions about these terms, please contact us at: hello@wordiyo.com',
      },
    ],
  },
  zh: {
    title: '服务条款',
    lastUpdated: `最后更新：${LAST_UPDATED}`,
    sections: [
      {
        heading: '条款接受',
        body: '访问和使用 Wordiyo 即表示您同意受本服务条款的约束。如果您不同意这些条款，请勿使用本服务。',
      },
      {
        heading: '服务使用',
        body: 'Wordiyo 是一个通过词源学习英语词汇的教育平台。本服务仅供个人非商业用途使用。您同意不会滥用本服务、干扰其运行或试图通过未授权方式访问。',
      },
      {
        heading: '用户账户',
        body: '您可以使用 Google 账户登录。您有责任维护账户凭据的安全。您同意提供准确的信息，并在怀疑账户被未授权访问时通知我们。',
      },
      {
        heading: '知识产权',
        body: 'Wordiyo 上的所有内容，包括文字、图形和数据汇编，均为 Wordiyo 或其内容提供者的财产。未经明确许可，您不得复制、分发或基于我们的内容创建衍生作品。',
      },
      {
        heading: '责任限制',
        body: 'Wordiyo 按「现状」提供，不附带任何形式的保证。我们不对因您使用本服务而产生的任何损害承担责任，包括但不限于直接、间接、附带或后果性损害。',
      },
      {
        heading: '条款变更',
        body: '我们保留随时修改这些条款的权利。在条款变更后继续使用本服务即表示您接受更新后的条款。我们建议您定期查阅本页面。',
      },
      {
        heading: '联系方式',
        body: '如果您对这些条款有任何疑问，请联系我们：hello@wordiyo.com',
      },
    ],
  },
} as const;

export const TermsPage = () => {
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
