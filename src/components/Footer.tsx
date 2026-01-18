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
    disclaimer: 'Haftungsausschluss',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    dataSource: 'Daten: DefiLlama',
    rights: 'Alle Rechte vorbehalten.',
    hostedOn: 'Gehostet auf',
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
