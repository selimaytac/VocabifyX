# VocabifyX – Explore Section

> **Reference:** [MVP Scope](./02-mvp-scope.md) · [Features](./04-features.md)

---

## Purpose

Explore gives users a **ready-made library of popular vocabulary lists** they can immediately add to their learning library. This reduces friction for new users and provides content value even before using AI generation.

It's also a critical **discoverability and retention** tool — casual browsers become engaged learners when they find a relevant ready-to-go list.

---

## Structure

```
Explore Screen
├── Categories (horizontal scroll)
│   ├── All
│   ├── Travel ✈️
│   ├── Business 💼
│   ├── Technology 💻
│   ├── Health 🏥
│   ├── Everyday Life 🏠
│   └── Academic 🎓
│
└── List Grid (2 columns)
    └── ExploreListCard
        ├── Cover colour / gradient
        ├── Category icon
        ├── List name
        ├── Word count badge
        └── "Add to My Library" CTA
```

---

## Predefined Lists – English App Language

| # | Category | List Name | Words | Description |
|---|----------|-----------|-------|-------------|
| 1 | Travel | Essential Travel Phrases | 30 | Must-know expressions for any trip |
| 2 | Travel | At the Airport | 20 | Boarding, customs, luggage vocabulary |
| 3 | Business | Business English Basics | 30 | Meetings, emails, negotiations |
| 4 | Business | Finance & Economy 101 | 30 | Investing, markets, banking terms |
| 5 | Technology | AI Fundamentals | 25 | Neural networks, prompting, LLMs |
| 6 | Technology | Programming Basics | 25 | Variables, functions, algorithms |
| 7 | Health | Human Body Parts | 30 | Medical & everyday vocabulary |
| 8 | Health | At the Doctor's | 20 | Symptoms, diagnoses, treatments |
| 9 | Everyday | Around the House | 25 | Furniture, rooms, household items |
| 10 | Academic | IELTS Key Vocabulary | 40 | High-frequency academic words |

---

## Predefined Lists – Turkish App Language

| # | Kategori | Liste Adı | Kelime | Açıklama |
|---|----------|-----------|--------|---------|
| 1 | Seyahat | Temel Seyahat İfadeleri | 30 | Her seyahatte işe yarar ifadeler |
| 2 | Seyahat | Havalimanında | 20 | Uçuş ve pasaport kontrolü kelimeleri |
| 3 | İş & Ekonomi | Business English Temelleri | 30 | Toplantı, e-posta, müzakere |
| 4 | İş & Ekonomi | Ekonomi ve Finans 101 | 30 | Yatırım, borsa, bankacılık |
| 5 | Teknoloji | Yapay Zeka Temelleri | 25 | Model, prompt, LLM, veri |
| 6 | Teknoloji | Programlama Temelleri | 25 | Değişken, fonksiyon, algoritma |
| 7 | Sağlık | Vücut Bölümleri | 30 | Tıbbi ve günlük kullanım |
| 8 | Sağlık | Doktorda | 20 | Belirti, tanı, tedavi |
| 9 | Günlük | Ev Hayatı | 25 | Eşyalar, odalar, ev aktiviteleri |
| 10 | Akademik | YDS / YÖKDİL Kelime Listesi | 40 | Sık çıkan akademik kelimeler |

---

## List Data Structure

```typescript
interface ExploreList {
  id: string
  nameKey: string              // i18n key
  descriptionKey: string      // i18n key
  category: ExploreCategory
  appLanguage: 'TR' | 'EN'    // which app locale this belongs to
  listLanguage: 'TR' | 'EN'   // language of the words
  wordCount: number
  coverGradient: string[]     // [hex, hex]
  words: ExploreWord[]
}

interface ExploreWord {
  term: string
  translation: string
  example: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  partOfSpeech: string
}
```

All predefined list data lives in `constants/predefined-lists.ts` — **shipped with the app bundle**, no network request needed to display Explore.

---

## Add to Library Flow

```
User taps "Add to My Library"
  → If list not already in library:
      → Copy ExploreList → UserVocabList (local)
      → Set source: 'explore', sourceId: exploreList.id
      → Show "Added! 🎉" toast + +5 XP animation
      → Achievement check (Explorer badge)
  → If already in library:
      → Show "Already in your library" toast
      → Button becomes "Go to List →"
```

---

## Analytics Events

```typescript
track('explore_screen_viewed')
track('explore_category_tapped', { category })
track('explore_list_viewed', { listId, listName })
track('explore_list_added', { listId, listName })
```

---

## Future Expansion (Post-MVP)

- Remote-fetched explore lists (update without app release)
- Curated "Staff Picks" / seasonal lists
- User-generated shared lists (community)
- Lists filtered by difficulty level
