# 🔄 Changelog Version 2 - Nouvelles modifications

## ✅ Modifications effectuées

### 1. 🗑️ Stablecoins retirés

Les stablecoins suivants ont été **supprimés** de la plateforme :

| Stablecoin | Raison |
|-----------|--------|
| ❌ GHO | Retiré sur demande |
| ❌ USDS | Retiré sur demande |
| ❌ USDT0 | Retiré sur demande |
| ❌ SUSDS | Alias de USDS (retiré) |

**Impact :** Les pools utilisant ces stablecoins ne seront plus affichés.

---

### 2. ✅ Nouveaux stablecoins USD ajoutés

| Stablecoin | Nom complet | Logo source |
|-----------|-------------|-------------|
| ✅ USDe | Ethena USD | CoinGecko |
| ✅ USD1 | World Liberty Finance | CoinGecko |
| ✅ USDG | Global Dollar | CoinGecko |

**Configuration :**
```typescript
'USDE': 'USDe',
'USD1': 'USD1',
'USDG': 'USDG',
```

---

### 3. 🏆 Nouvelle catégorie : Tokens adossés à l'OR

Première catégorie non-USD/EUR ajoutée ! Ces tokens sont adossés à l'or physique.

| Token | Nom complet | Devise | Logo source |
|-------|-------------|--------|-------------|
| ✅ XAUT | Tether Gold | GOLD | CoinGecko |
| ✅ PAXG | Pax Gold | GOLD | CoinGecko |

**Configuration :**
```typescript
// Nouveau type de devise
currency: 'USD' | 'EUR' | 'GOLD'

// Mapping
'XAUT': 'GOLD',
'PAXG': 'GOLD',
```

**Affichage :** Ces tokens apparaîtront avec la mention "GOLD" au lieu de "USD" ou "EUR".

---

### 4. 🏦 Nouveaux protocoles de lending ajoutés

#### Cap Money
```typescript
'cap': {
  type: 'lending',
  name: 'Cap Money',
  audits: 2,
  launchYear: 2024,
  exploits: 0,
  earnUrl: 'https://cap.app/',
  logo: 'https://icons.llama.fi/cap.png',
}
```

#### Dolomite
```typescript
'dolomite': {
  type: 'lending',
  name: 'Dolomite',
  audits: 2,
  launchYear: 2022,
  exploits: 0,
  earnUrl: 'https://app.dolomite.io/',
  logo: 'https://icons.llama.fi/dolomite.png',
}
```

**Détection API :**
- DefiLlama doit envoyer `project: "cap"` pour Cap Money
- DefiLlama doit envoyer `project: "dolomite"` pour Dolomite

---

### 5. ✏️ Protocole renommé

**Spark → SparkLend**

```typescript
'spark': {
  type: 'lending',
  name: 'SparkLend', // Anciennement "Spark"
  // ... reste inchangé
}
```

**Impact :** Le nom affiché dans l'interface sera "SparkLend" au lieu de "Spark".

---

### 6. ℹ️ Information de mise à jour ajoutée

Un message discret a été ajouté sous les statistiques :

**Emplacement :** Sous les 4 cartes de statistiques (TVL, APY, Score, Pools)

**Texte :** "Les APY sont mis à jour toutes les heures"

**Style :** Texte petit, discret, centré (`text-xs text-white/30`)

---

## 📊 Récapitulatif des stablecoins supportés

### USD (7 stablecoins)
- ✅ USDC
- ✅ USDT
- ✅ DAI
- ✅ PYUSD
- ✅ USDe (nouveau)
- ✅ USD1 (nouveau)
- ✅ USDG (nouveau)

### EUR (2 stablecoins)
- ✅ EURe
- ✅ EURC

### GOLD (2 tokens)
- ✅ XAUT (nouveau)
- ✅ PAXG (nouveau)

**Total : 11 assets supportés** (contre 9 avant)

---

## 🏦 Récapitulatif des protocoles

### Protocoles de Lending : 19
- Aave V3, Aave V2
- Compound V3
- Morpho V1, Morpho Blue
- SparkLend (renommé)
- Fluid
- Euler V2
- Silo, Silo V2
- Radiant V2
- Venus
- Benqi
- Kamino
- MarginFi
- Ajna
- Drift
- Solend
- Maple
- **Cap Money** (nouveau)
- **Dolomite** (nouveau)

### Protocoles Vault Managers : 9
- Lagoon
- Wildcat
- Steakhouse
- Veda
- Mellow
- Ether.fi
- Re7 Labs
- Smokehouse

**Total : 28 protocoles** (contre 27 avant)

---

## 🧪 Tests à effectuer

### 1. Vérifier les nouveaux stablecoins

Dans la console du navigateur, vérifier que les pools avec ces assets apparaissent :
```
📋 Pools trouvés avec: USDe, USD1, USDG, XAUT, PAXG
```

### 2. Vérifier l'affichage GOLD

Dans l'interface, vérifier que les pools XAUT et PAXG affichent **"GOLD"** au lieu de "USD".

### 3. Vérifier les nouveaux protocoles

Chercher dans les logs :
```
📋 Protocoles: ... Cap Money, Dolomite, ...
```

### 4. Vérifier le renommage Spark

Dans l'interface, le protocole doit s'afficher comme **"SparkLend"**.

### 5. Vérifier le message de mise à jour

Sous les stats, le texte suivant doit apparaître en petit et discret :
> "Les APY sont mis à jour toutes les heures"

---

## ⚠️ Points d'attention

### Stablecoins retirés - Pools manquants

Les pools utilisant GHO, USDS, USDT0 ne seront **plus visibles**. Si beaucoup de pools utilisaient ces assets, le nombre total de pools affichés pourrait diminuer.

**Solution :** Vérifier dans les logs combien de pools sont filtrés.

### Nouveaux stablecoins - Détection

Si DefiLlama utilise des symboles différents pour USDe, USD1, USDG, il faudra peut-être ajouter des alias :

```typescript
// Exemple si DefiLlama envoie "ETHENA-USDe"
'ETHENA-USDE': 'USDe',
```

### Tokens OR - Nouveauté

C'est la **première catégorie non-stablecoin** ajoutée. Les filtres et l'affichage doivent gérer correctement la devise "GOLD".

**Vérifier :**
- Les symboles s'affichent correctement (XAUT, PAXG)
- La devise "GOLD" remplace bien "USD"
- Les filtres permettent de sélectionner ces tokens

### Nouveaux protocoles - API matching

Vérifier que DefiLlama envoie bien :
- `project: "cap"` pour Cap Money
- `project: "dolomite"` pour Dolomite

Si les noms ne correspondent pas, ajuster dans `ALLOWED_PROTOCOLS`.

---

## 📝 Fichiers modifiés

1. **src/types/index.ts**
   - Nouveau type `StablecoinType` avec USDe, USD1, USDG, XAUT, PAXG
   - Nouvelle devise `'GOLD'` dans le type currency

2. **src/hooks/usePools.ts**
   - `SUPPORTED_STABLECOINS` : retrait de GHO, USDS, USDT0, SUSDS
   - `SUPPORTED_STABLECOINS` : ajout de USDe, USD1, USDG, XAUT, PAXG
   - `STABLECOIN_LOGOS` : nouveaux logos
   - `STABLECOIN_CURRENCY` : nouveau mapping avec devise GOLD
   - `ALLOWED_PROTOCOLS` : ajout de Cap et Dolomite
   - `ALLOWED_PROTOCOLS` : renommage Spark → SparkLend

3. **src/components/Stats.tsx**
   - Ajout du message "Les APY sont mis à jour toutes les heures"

4. **src/data/mockPools.ts**
   - Mise à jour des logos stablecoins
   - Mise à jour de la logique de détection de devise (USD/EUR/GOLD)

---

## 🚀 Commandes de test

```bash
# Installer les dépendances
npm install

# Tester le build
npm run build

# Vérifier qu'il n'y a pas d'erreurs TypeScript
# Le build doit se terminer avec succès

# Lancer en développement (optionnel)
npm run dev
```

---

## 📊 Comparaison Avant/Après

| Métrique | Avant | Après | Changement |
|----------|-------|-------|------------|
| Stablecoins USD | 6 | 7 | +1 (net) |
| Stablecoins EUR | 2 | 2 | - |
| Tokens GOLD | 0 | 2 | +2 |
| **Total assets** | **9** | **11** | **+2** |
| Protocoles Lending | 17 | 19 | +2 |
| Protocoles Vault | 9 | 9 | - |
| **Total protocoles** | **27** | **28** | **+1** |

---

## ✅ Résumé des changements

✅ **Retirés :** GHO, USDS, USDT0, SUSDS  
✅ **Ajoutés (USD) :** USDe, USD1, USDG  
✅ **Ajoutés (GOLD) :** XAUT, PAXG  
✅ **Nouveaux protocoles :** Cap Money, Dolomite  
✅ **Renommé :** Spark → SparkLend  
✅ **Info ajoutée :** Message de mise à jour horaire  

Prêt pour le déploiement ! 🚀
