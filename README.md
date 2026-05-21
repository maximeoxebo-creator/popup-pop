# Popup Pop — Guide d'installation complet

## Vue d'ensemble
App Shopify embedded (Remix + Prisma + Vercel) qui affiche un popup personnalisable sur ta boutique.

---

## ÉTAPE 1 — Créer l'app sur Shopify Partners

1. Va sur **https://partners.shopify.com**
2. Clique **Apps** → **Créer une app** → **Créer manuellement**
3. Nom : `popup-pop`
4. URL de l'app : `https://popup-pop.vercel.app`
5. URL de redirection autorisées :
   - `https://popup-pop.vercel.app/auth/callback`
   - `https://popup-pop.vercel.app/auth`
6. Clique **Créer**
7. Note le **Client ID** et le **Secret API** → tu en as besoin pour les étapes suivantes

---

## ÉTAPE 2 — Créer la base de données PostgreSQL (Railway)

1. Va sur **https://railway.app** → New Project → PostgreSQL
2. Une fois créé, clique sur la base → **Connect** → copie la **DATABASE_URL**
   (format : `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`)

---

## ÉTAPE 3 — Déployer sur Vercel

1. Va sur **https://vercel.com** → New Project
2. Importe ton repo GitHub `popup-pop`
3. Framework : **Remix**
4. Dans **Environment Variables**, ajoute :

| Variable | Valeur |
|---|---|
| `SHOPIFY_API_KEY` | Ton Client ID (étape 1) |
| `SHOPIFY_API_SECRET` | Ton Secret API (étape 1) |
| `SHOPIFY_APP_URL` | `https://popup-pop.vercel.app` |
| `SCOPES` | `write_products,write_metaobjects,write_metaobject_definitions` |
| `DATABASE_URL` | Ta DATABASE_URL PostgreSQL (étape 2) |

5. Clique **Deploy**

---

## ÉTAPE 4 — Configurer le projet en local

```bash
# Cloner le repo
git clone https://github.com/TON_USERNAME/popup-pop.git
cd popup-pop

# Installer les dépendances
npm install

# Copier le fichier d'env
cp .env.example .env
# Remplis .env avec tes vraies valeurs

# Relier l'app Shopify
npm run config:link
# → Choisis "No" pour ne pas créer une nouvelle app
# → Sélectionne "popup-pop" dans la liste
```

---

## ÉTAPE 5 — Mettre à jour shopify.app.toml

Ouvre `shopify.app.toml` et remplace :
```toml
client_id = "REMPLACE_PAR_TON_CLIENT_ID"
```
Par ton vrai Client ID de l'étape 1.

Puis :
```bash
git add shopify.app.toml
git commit -m "feat: add client_id"
git push
```

---

## ÉTAPE 6 — Déployer l'extension Shopify

```bash
npm run deploy
```
→ Appuie sur **y** pour confirmer la release.

---

## ÉTAPE 7 — Installer l'app sur ta boutique de dev

```bash
shopify app dev
```
→ Appuie sur **p** pour ouvrir la preview
→ Clique sur le lien d'installation dans le terminal
→ Installe l'app sur ta boutique

---

## ÉTAPE 8 — Activer le popup sur le thème

1. Shopify Admin → **Boutique en ligne** → **Thèmes** → **Personnaliser**
2. Clique **Ajouter une section** ou **Ajouter un bloc**
3. Cherche **"Popup Pop"**
4. Configure le titre, message, bouton
5. **Enregistrer**

---

## Commandes utiles

```bash
npm run dev          # Développement local
npm run build        # Build production
npm run deploy       # Déployer l'extension Shopify
git push             # Redéployer sur Vercel (automatique)
```
