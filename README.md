# SafeYield 🛡️

Dashboard de rendements stablecoins sécurisés.


## 🎯 Fonctionnalités

- **Top 3 quotidien** : Les meilleurs yields avec score de sécurité optimal
- **Score de sécurité** : Évaluation 0-100 basée sur audits, ancienneté, TVL et historique
- **Filtres avancés** : Par stablecoin (USDC, USDT, DAI, EURe, EURC) et par chaîne
- **Mise à jour automatique** : Refresh toutes les 10 minutes
- **PWA** : Installable sur mobile
- **UX simple** : Interface épurée sans jargon technique

## 🛠️ Stack technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **Graphiques** : Recharts
- **Animations** : Framer Motion
- **Données** : API DefiLlama (gratuite)

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repo
git clone https://github.com/your-username/safeyield.git
cd safeyield

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Build production

```bash
# Build statique (pour Aleph Cloud)
npm run build

# Les fichiers sont dans ./out/
```

## ☁️ Déploiement sur Aleph Cloud

### Option 1 : Via le Dashboard Aleph

1. Build le projet : `npm run build`
2. Aller sur [console.aleph.cloud](https://console.aleph.cloud)
3. Créer un nouveau site web
4. Uploader le contenu du dossier `out/`
5. Configurer le domaine custom (optionnel)

### Option 2 : Via CLI Aleph

```bash
# Installer le CLI Aleph
pip install aleph-client

# Déployer
aleph file upload ./out --channel safeyield
```

## 📊 Source des données

Les données proviennent de l'API gratuite DefiLlama :
- Endpoint yields : `https://yields.llama.fi/pools`
- Mise à jour : Toutes les heures côté DefiLlama

### Score de sécurité

Le score est calculé sur 100 points :

| Critère | Points | Description |
|---------|--------|-------------|
| Audits | 0-25 | Nombre d'audits de sécurité |
| Ancienneté | 0-25 | Durée d'existence du protocole |
| TVL | 0-25 | Montant total verrouillé |
| Historique | 0-25 | Absence d'exploits passés |

## 💰 Monétisation (à implémenter)

### Phase 1 - Liens d'affiliation
- Ajouter des liens référents vers les protocoles
- Commission sur les dépôts (0.1-1%)

### Phase 2 - Premium
- Alertes personnalisées par email/Telegram
- Données historiques étendues
- Recommandations IA

## 📁 Structure du projet

```
safeyield/
├── public/
│   ├── manifest.json     # Config PWA
│   └── icons/            # Icônes PWA
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Page d'accueil
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TopPools.tsx
│   │   ├── PoolsTable.tsx
│   │   ├── Filters.tsx
│   │   ├── Stats.tsx
│   │   └── SecurityScore.tsx
│   ├── hooks/
│   │   └── usePools.ts   # Hook de données
│   ├── utils/
│   │   ├── api.ts        # Appels API
│   │   └── security.ts   # Calcul score
│   ├── data/
│   │   └── mockPools.ts  # Données démo
│   ├── types/
│   │   └── index.ts      # Types TypeScript
│   └── styles/
│       └── globals.css   # Styles globaux
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🔧 Configuration API (Production)

Pour utiliser l'API DefiLlama en production, modifier `src/hooks/usePools.ts` :

```typescript
// Décommenter cette ligne :
// const data = await fetchYieldPools();

// Et commenter les données mock
```

## 📝 TODO

- [ ] Intégration API DefiLlama réelle
- [ ] Graphiques historiques APY
- [ ] Système d'alertes
- [ ] Mode comparaison
- [ ] Multi-langue (EN)
- [ ] Tests unitaires
- [ ] Liens d'affiliation

## 📄 Licence

MIT © COMMIT MEDIA 2026

---

**Powered by [Aleph Cloud](https://aleph.cloud)** ☁️
