# 📋 Shift Report — 18/06/2026

**Développeur :** Mohamed Bza
**Projets travaillés :** La Ménagère Paris · Pops Villepinte

---

# 🟠 Projet 1 — La Ménagère Paris

## ✅ Travail effectué

**Commits :**
- `014316b` — Composant **LogoHeader** intégré sur plusieurs écrans
- `1616b37` — Refonte de la **gestion du profil utilisateur** et du parcours **onboarding**
- `b006976` — Composant **PhoneInput** (sélecteur d'indicatif pays + validation)
- `76d691b` — **Changement de mot de passe** + amélioration de l'écran **Paramètres**
- `d21421f` — Simplification du **modèle de tarification produit** (migrations)
- `b32c40b` — **Icônes Phosphor** sur toute l'app + refonte UI + animations + endpoint de confirmation de paiement
- *(en cours, non commité)* — `payments.service.ts` : auto-réparation des PaymentIntent introuvables

**Fonctionnalités développées :**
- Refonte **inputs** (conteneur rempli + label flottant animé) et migration **icônes Phosphor** via wrapper `Icon`
- **Animations** : transitions de pages, effet d'appui sur boutons/cartes, apparition en cascade des listes
- **Profil & compte** : refonte profil, onboarding, PhoneInput, changement de mot de passe, écran Paramètres
- **Panier** : bouton « Ajouter au panier » bloqué tant que dimensions/type d'ouverture non saisis + retour visuel « +1 panier »
- **Paiement** : endpoint serveur `POST /payments/confirm` (réconciliation commande après paiement)
- **Tarification** : simplification du modèle de prix produit (migrations DB)

**Bugs corrigés :**
- Mise à jour du **nom de profil** (erreur réelle masquée par une closure obsolète)
- « Ajouter au panier » utilisable sans dimensions → désormais bloqué
- Paiement « No such payment intent » sur intent obsolète → recréation automatique

## 🔄 En cours

**Tâche actuelle :**
> Faire fonctionner le **paiement Stripe de bout en bout** (Payment Sheet → confirmation commande).

**Blocage sur cette tâche :**
> Clés Stripe **publishable (app) et secret (serveur) de deux comptes différents** — confirmé par reproduction de l'appel. Aucun correctif code possible : il faut une paire de clés du **même compte**.

## 🚧 Blocages

- **Clés Stripe incohérentes** → besoin de la clé publique + clé secrète (mode Test) du **même compte Stripe**.
- `STRIPE_WEBHOOK_SECRET` **vide** côté serveur (réconciliation via `/confirm` en attendant).
- Paiement testable seulement en **build natif (dev build)**, pas dans Expo Go.

## 📨 Message pour le client

> Bonjour, le module de paiement est intégré et fonctionnel côté code. Un point bloque l'aboutissement du paiement : les clés Stripe configurées (clé publique côté app et clé secrète côté serveur) appartiennent à **deux comptes Stripe différents**. Merci de nous fournir **la clé publique ET la clé secrète (mode Test) d'un même compte Stripe** ; idéalement aussi le **secret de webhook**. Le paiement sera alors opérationnel.

## 📊 Suivi — Projet 1

| Indicateur | Valeur |
|---|---|
| ⏱️ Heures travaillées | `5` h |
| 🖥️ Avancement Frontend | `85` % |
| ⚙️ Avancement Backend | `80` % |

---

# 🟢 Projet 2 — Pops Villepinte

## ✅ Travail effectué

**Contexte :** app rejetée la veille par Apple / Play Store → **correctifs implémentés, re-build et re-soumission**.

**Commits :**
- `85fafbf` — **Réactivation de compte** lors d'une re-connexion pendant le délai de grâce de suppression (`ReactivationModal`, helpers auth Supabase, migration `0029_account_deletion_cancellable`, `auth-prelude`)
- `8b7dd28` — **Bannière de connexion mode invité** persistante sur les écrans de navigation
- `9253afa` — **URL d'API production** pointée vers le backend Vercel (`eas.json`)
- `14f25d9` — **Correctif `expo-doctor`** pour le build production (alignement `package.json` / plugin Mapbox NDK27)
- `bee0c51` — `.gitignore` des artefacts de build locaux

**Résumé du shift :** correction des motifs de rejet (suppression/réactivation de compte, mode invité), build de production, tests, re-soumission App Store + Play Store.

## 🔄 En cours

**Tâche actuelle :**
> **Suivi des soumissions** auprès d'Apple et Google Play — correctifs déjà implémentés et resoumis, en attente de la décision de review.

## 📊 Suivi — Projet 2

| Indicateur | Valeur |
|---|---|
| ⏱️ Heures travaillées | `3` h |
| 🖥️ Avancement Frontend | `100` % |
| ⚙️ Avancement Backend | `100` % |
| 📦 Statut | Resoumis — en attente de review |

---

## 🧾 Récapitulatif du shift

| Projet | Heures | Frontend | Backend | Statut |
|---|---|---|---|---|
| La Ménagère Paris | 5 h | 85 % | 80 % | Bloqué — clés Stripe client |
| Pops Villepinte | 3 h | 100 % | 100 % | Resoumis — en attente de review |
| **Total** | **8 h** | — | — | — |
