'use client';

import { ExternalLink } from 'lucide-react';
import { Locale } from '@/utils/i18n';

const footerTranslations = {
  en: {
    description: 'The secure DeFi yield comparison platform. Find the best stablecoin yields with our security scoring system.',
    product: 'Product',
    topYields: 'Top Yields',
    allPools: 'All Pools',
    security: 'Security',
    faq: 'FAQ',
    resources: 'Resources',
    about: 'About',
    disclaimer: 'Disclaimer',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    dataSource: 'Data: DefiLlama',
    rights: 'All rights reserved.',
    hostedOn: 'Hosted on',
  },
  fr: {
    description: 'La plateforme de comparaison de rendements DeFi sécurisée. Trouvez les meilleurs yields stablecoins grâce à notre système de notation de sécurité.',
    product: 'Produit',
    topYields: 'Top Yields',
    allPools: 'Tous les pools',
    security: 'Sécurité',
    faq: 'FAQ',
    resources: 'Ressources',
    about: 'À propos',
    disclaimer: 'Avertissement',
    terms: "Conditions d'utilisation",
    privacy: 'Politique de confidentialité',
    dataSource: 'Données : DefiLlama',
    rights: 'Tous droits réservés.',
    hostedOn: 'Hébergé sur',
  },
  it: {
    description: 'La piattaforma sicura di confronto rendimenti DeFi. Trova i migliori yield stablecoin con il nostro sistema di punteggio sicurezza.',
    product: 'Prodotto',
    topYields: 'Top Rendimenti',
    allPools: 'Tutti i Pool',
    security: 'Sicurezza',
    faq: 'FAQ',
    resources: 'Risorse',
    about: 'Chi siamo',
    disclaimer: 'Disclaimer',
    terms: 'Termini di utilizzo',
    privacy: 'Privacy Policy',
    dataSource: 'Dati: DefiLlama',
    rights: 'Tutti i diritti riservati.',
    hostedOn: 'Ospitato su',
  },
  es: {
    description: 'La plataforma segura de comparación de rendimientos DeFi. Encuentra los mejores yields de stablecoins con nuestro sistema de puntuación de seguridad.',
    product: 'Producto',
    topYields: 'Top Rendimientos',
    allPools: 'Todos los Pools',
    security: 'Seguridad',
    faq: 'FAQ',
    resources: 'Recursos',
    about: 'Acerca de',
    disclaimer: 'Aviso legal',
    terms: 'Términos de uso',
    privacy: 'Política de privacidad',
    dataSource: 'Datos: DefiLlama',
    rights: 'Todos los derechos reservados.',
    hostedOn: 'Alojado en',
  },
  de: {
    description: 'Die sichere DeFi-Rendite-Vergleichsplattform. Finden Sie die besten Stablecoin-Renditen mit unserem Sicherheits-Bewertungssystem.',
    product: 'Produkt',
    topYields: 'Top Renditen',
    allPools: 'Alle Pools',
    security: 'Sicherheit',
    faq: 'FAQ',
    resources: 'Ressourcen',
    about: 'Über uns',
    disclaimer: 'Haftungsausschluss',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    dataSource: 'Daten: DefiLlama',
    rights: 'Alle Rechte vorbehalten.',
    hostedOn: 'Gehostet auf',
  },
  zh: {
    description: '安全的DeFi收益比较平台。通过我们的安全评分系统找到最佳稳定币收益。',
    product: '产品',
    topYields: '最高收益',
    allPools: '所有池',
    security: '安全',
    faq: '常见问题',
    resources: '资源',
    about: '关于我们',
    disclaimer: '免责声明',
    terms: '使用条款',
    privacy: '隐私政策',
    dataSource: '数据：DefiLlama',
    rights: '保留所有权利。',
    hostedOn: '托管于',
  },
  ru: {
    description: 'Безопасная платформа сравнения доходности DeFi. Найдите лучшую доходность стейблкоинов с нашей системой оценки безопасности.',
    product: 'Продукт',
    topYields: 'Топ доходность',
    allPools: 'Все пулы',
    security: 'Безопасность',
    faq: 'FAQ',
    resources: 'Ресурсы',
    about: 'О нас',
    disclaimer: 'Отказ от ответственности',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    dataSource: 'Данные: DefiLlama',
    rights: 'Все права защищены.',
    hostedOn: 'Размещено на',
  },
  ja: {
    description: '安全なDeFi利回り比較プラットフォーム。セキュリティスコアシステムで最高のステーブルコイン利回りを見つけましょう。',
    product: '製品',
    topYields: 'トップ利回り',
    allPools: 'すべてのプール',
    security: 'セキュリティ',
    faq: 'FAQ',
    resources: 'リソース',
    about: '私たちについて',
    disclaimer: '免責事項',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    dataSource: 'データ：DefiLlama',
    rights: '全著作権所有。',
    hostedOn: 'ホスト：',
  },
  ko: {
    description: '안전한 DeFi 수익률 비교 플랫폼. 보안 점수 시스템으로 최고의 스테이블코인 수익률을 찾아보세요.',
    product: '제품',
    topYields: '최고 수익률',
    allPools: '모든 풀',
    security: '보안',
    faq: 'FAQ',
    resources: '리소스',
    about: '소개',
    disclaimer: '면책 조항',
    terms: '이용 약관',
    privacy: '개인정보 처리방침',
    dataSource: '데이터: DefiLlama',
    rights: '모든 권리 보유.',
    hostedOn: '호스팅:',
  },
};

function YiieldLogo() {
  return (
    <div className="flex items-center h-8">
      <span className="text-2xl font-bold text-white leading-none">y</span>
      <div className="flex items-end gap-[3px] h-[22px] mx-[2px] mb-[1px]">
        <div className="w-[5px] h-[13px] bg-red-500 rounded-[2px]" />
        <div className="w-[5px] h-[19px] bg-safe-400 rounded-[2px]" />
      </div>
      <span className="text-2xl font-bold text-white leading-none">eld</span>
    </div>
  );
}

interface FooterProps {
  locale?: Locale;
}

export function Footer({ locale = 'en' }: FooterProps) {
  const t = footerTranslations[locale];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <YiieldLogo />
            <p className="mt-4 text-white/50 text-sm max-w-md">{t.description}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.product}</h4>
            <ul className="space-y-2">
              <li><a href="#top-pools" className="text-white/50 hover:text-white text-sm transition-colors">{t.topYields}</a></li>
              <li><a href="#all-pools" className="text-white/50 hover:text-white text-sm transition-colors">{t.allPools}</a></li>
              <li><a href="#security" className="text-white/50 hover:text-white text-sm transition-colors">{t.security}</a></li>
              <li><a href="/faq" className="text-white/50 hover:text-white text-sm transition-colors">{t.faq}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.resources}</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-white/50 hover:text-white text-sm transition-colors">{t.about}</a></li>
              <li><a href="/disclaimer" className="text-white/50 hover:text-white text-sm transition-colors">{t.disclaimer}</a></li>
              <li><a href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">{t.terms}</a></li>
              <li><a href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">{t.privacy}</a></li>
              <li>
                <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition-colors inline-flex items-center gap-1">
                  {t.dataSource}<ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">© {currentYear} COMMIT MEDIA. {t.rights}</p>
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <span>{t.hostedOn}</span>
              <a 
                href="https://aleph.cloud" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/40 hover:text-white/60 transition-colors"
              >
                Aleph Cloud
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
