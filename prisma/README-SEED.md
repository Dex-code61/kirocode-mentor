# Database Seeding

Ce projet contient deux fichiers de seed pour la base de données :

## 🌱 Seed Standard (`seed.ts`)
Le seed original avec des données de base.

```bash
npm run db:seed
```

## 🚀 Seed Amélioré (`seed-enhanced.ts`)
Un seed complet avec :
- **Tests unitaires complets** pour tous les challenges
- **Résultats de tests réalistes** avec succès et échecs
- **Analyses Kiro détaillées** pour chaque soumission
- **Données de test plus riches** pour le développement
- **Cas de test variés** incluant edge cases

```bash
npm run db:seed:enhanced
```

## 📊 Contenu du Seed Amélioré

### Challenges avec Tests Unitaires
1. **Sum Two Numbers** - Addition de base avec 6 tests
2. **Find Maximum Number** - Recherche de maximum avec 8 tests
3. **String Reverser** - Inversion de chaîne avec 7 tests
4. **User Profile Component** - Composant React avec 4 tests

### Soumissions de Code
- **3 soumissions complètes** avec résultats de tests réels
- **Scores variés** (85%, 100%) pour tester l'affichage
- **Analyses Kiro détaillées** avec feedback constructif
- **Métriques de qualité** (lisibilité, performance, maintenabilité)

### Fonctionnalités Testées
- ✅ Affichage des résultats de tests (passés/échoués)
- ✅ Gestion des cas d'erreur
- ✅ Tests en lecture seule (non modifiables)
- ✅ Scrolling correct dans la sidebar
- ✅ Badges et indicateurs visuels

## 🎯 Utilisation Recommandée

Pour le développement, utilisez le seed amélioré :

```bash
# Reset et seed avec données complètes
npm run db:reset
npm run db:seed:enhanced
```

Cela vous donnera un environnement de développement riche avec des données réalistes pour tester toutes les fonctionnalités de l'interface utilisateur.