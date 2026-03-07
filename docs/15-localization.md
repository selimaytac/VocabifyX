# VocabifyX – Localization

> **Reference:** [Architecture](./03-app-architecture.md) · [Notifications](./11-notifications.md)

---

## Languages Supported

| Code | Language | Scope |
|------|----------|-------|
| `en` | English | App UI + list content |
| `tr` | Turkish | App UI + list content |

---

## i18n Library: Lingui

**Why Lingui?** Type-safe, works great with React Native, supports plural forms and interpolation. Already in project dependencies.

### Directory Structure

```
locales/
  en/
    messages.po    ← English translations (source)
    messages.js    ← Compiled catalog
  tr/
    messages.po    ← Turkish translations
    messages.js    ← Compiled catalog

lingui.config.ts   ← Lingui configuration
```

### Configuration

```typescript
// lingui.config.ts
export default {
  locales: ['en', 'tr'],
  catalogs: [{
    path: 'locales/{locale}/messages',
    include: ['app', 'components', 'services'],
  }],
  format: 'po',
}
```

---

## Usage in Code

```typescript
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

// In component:
const { i18n } = useLingui()

// Simple string
const title = t`Good morning, ${name}!`

// JSX
<Text><Trans>Create Your First List</Trans></Text>

// Plural
t`{count, plural, one {# word} other {# words}}`
```

---

## Language Detection & Switching

1. **On first launch**: detect device locale → set `appLanguage` in UserProfile
   - If device is `tr-*` → Turkish
   - Otherwise → English
2. **Onboarding Step 4**: user explicitly selects app language
3. **Settings screen**: user can switch at any time
4. **RTL**: Neither TR nor EN are RTL, so no RTL layout changes needed

---

## String Categories

### Shared Strings (both languages)

```
# App Navigation
home = Home / Ana Sayfa
explore = Explore / Keşfet
stats = Stats / İstatistik
profile = Profile / Profil

# Actions
create_list = Create List / Liste Oluştur
add_to_library = Add to My Library / Kütüphaneye Ekle
study_now = Study Now / Hemen Çalış
try_again = Try Again / Tekrar Dene

# Gamification
level_up = Level Up! / Seviye Atladın!
xp_earned = +{xp} XP earned / +{xp} XP kazanıldı
streak_days = {n} day streak / {n} günlük seri

# Learning
flashcard_mode = Flashcards / Kelime Kartları
quiz_mode = Quiz / Quiz
knew_it = I knew it / Biliyordum ✅
didnt_know = Didn't know / Bilmiyorum ❌
session_complete = Session Complete! / Oturum Tamamlandı!

# AI Generation
generating_list = Generating your list... / Listeniz oluşturuluyor...
list_ready = Your list is ready! / Listen Hazır!
```

---

## Pluralisation Examples

```po
# EN
msgid "{wordCount, plural, one {# word} other {# words}}"
msgstr "{wordCount, plural, one {# word} other {# words}}"

# TR (Turkish plural is simpler — no plural suffix for count > 1)
msgid "{wordCount, plural, one {# word} other {# words}}"
msgstr "{wordCount} kelime"
```

---

## Translation Workflow

1. Devs use `t` macro and `<Trans>` in code
2. Run `npx lingui extract` → updates `.po` files
3. Translate `.po` files in Turkish
4. Run `npx lingui compile` → generates `.js` catalogs
5. Commit `.po` + `.js` files
