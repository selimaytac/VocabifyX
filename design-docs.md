# Happit — Design System Reference

> Bu doküman, Happit uygulamasının tasarım sistemini, tema yapısını, renk paletini, tipografiyi, component stillerini ve UI kit kurallarını kapsar. Benzer bir uygulama geliştirirken bu dokümanı referans alabilirsiniz.

---

## İçindekiler

1. [Tech Stack & Bağımlılıklar](#1-tech-stack--bağımlılıklar)
2. [Renk Paleti (Color Palette)](#2-renk-paleti-color-palette)
3. [Tipografi (Typography)](#3-tipografi-typography)
4. [Boşluk Sistemi (Spacing)](#4-boşluk-sistemi-spacing)
5. [Border Radius](#5-border-radius)
6. [Gölge Sistemi (Shadows)](#6-gölge-sistemi-shadows)
7. [Gradient Tanımları](#7-gradient-tanımları)
8. [Responsive Tasarım Yardımcıları](#8-responsive-tasarım-yardımcıları)
9. [Dark Mode / Tema Sistemi](#9-dark-mode--tema-sistemi)
10. [Component Kataloğu](#10-component-kataloğu)
    - [LinearGradientButton](#lineargradientbutton)
    - [SelectableCard](#selectablecard)
    - [Header](#header)
    - [BottomNav](#bottomnav)
    - [DayItem](#dayitem)
    - [HabitItem](#habititem)
    - [TipCard](#tipcard)
    - [TrendCard](#trendcard)
    - [ActivityCard](#activitycard)
    - [PremiumBadge](#premiumbadge)
11. [İkon Kütüphanesi](#11-i̇kon-kütüphanesi)
12. [Rank / XP Renk Sistemi](#12-rank--xp-renk-sistemi)
13. [Modal & Sheet Stilleri](#13-modal--sheet-stilleri)
14. [Predefined Habit Modal Renkleri](#14-predefined-habit-modal-renkleri)
15. [Animasyon Kuralları](#15-animasyon-kuralları)
16. [Tema Dosyası (Tam Kaynak)](#16-tema-dosyası-tam-kaynak)

---

## 1. Tech Stack & Bağımlılıklar

| Paket | Versiyon | Kullanım Amacı |
|---|---|---|
| `react-native` + `expo` | v52 | Temel framework |
| `tamagui` | 1.129.x | UI component kütüphanesi (Sheet, Portal, YStack vb.) |
| `@tamagui/config` | v4 | Tamagui default config (özelleştirilmemiş) |
| `react-native-linear-gradient` | ^2.8.3 | Gradient butonlar ve arkaplanlar |
| `react-native-responsive-screen` | — | `wp()` / `hp()` responsive ölçü fonksiyonları |
| `react-native-responsive-dimensions` | — | `responsiveFontSize()` fonksiyonu |
| `@expo/vector-icons` | — | İkon kütüphanesi (Ionicons, Feather, MaterialIcons) |
| `react-native-reanimated` | — | Animasyonlar |
| `react-native-gesture-handler` | — | Swipeable gesture |
| `react-native-progress` | — | Dairesel progress bar |

---

## 2. Renk Paleti (Color Palette)

### Ana Renkler

```typescript
// Dosya: src/utils/theme.ts → COLORS

primary: {
  main:  "#213448",  // Koyu lacivert — ana buton, header, aktif tab göstergesi
  light: "#3A4366",  // Daha açık ton
  dark:  "#050A1A",  // Daha koyu ton / seçili border
}

secondary: {
  main:  "#547792",  // Çelik mavi — gradient sonu, aksan rengi
  light: "#B04A67",
  dark:  "#5C162E",
}

tertiary: {
  main:  "#BE3144",  // Kırmızı — tehlike, çıkış butonu
  light: "#D15A6A",
  dark:  "#8A232F",
}

accent: {
  main:  "#E17564",  // Mercan/somon — sekonder buton, vurgu
  light: "#E99B8E",
  dark:  "#C94F3F",
}
```

### Nötr Renkler

```typescript
neutral: {
  white:      "#FFFFFF",
  offWhite:   "#F7F8FB",   // Ekran arkaplanları, hafif gri
  lightGray:  "#E0E0E0",   // Border, ayırıcı çizgiler
  mediumGray: "#B0B0B0",   // Disabled state, placeholder
  darkGray:   "#777777",   // İkincil metin
  black:      "#000000",
}
```

### Durum Renkleri (State Colors)

```typescript
success:  { main: "#4CAF50", light: "#81C784", dark: "#388E3C" }
error:    { main: "#F44336", light: "#F6685E", dark: "#C62828" }
warning:  { main: "#FFC107", light: "#FFCA28", dark: "#FFA000" }
info:     { main: "#2196F3", light: "#64B5F6", dark: "#1976D2" }
```

### Arkaplan Renkleri

```typescript
background: {
  default:   "#FFFFFF",   // Açık mod ana arkaplan
  secondary: "#F7F8FB",   // Hafif gri card/section arkaplanı
  dark:      "#1C2526",   // Koyu mod için
}
```

### Metin Renkleri

```typescript
text: {
  primary:   "#09122C",   // Ana metin, koyu lacivert
  secondary: "#777777",   // İkincil metin, açıklama
  disabled:  "#B0B0B0",   // Pasif metin
  white:     "#FFFFFF",
  link:      "#653FFD",   // "View All" bağlantıları, mor
}
```

### Buton Renkleri

```typescript
button: {
  primary:      "#FFFFFF",
  text:         "#09122C",
  secondary:    "#E17564",   // Accent rengi
  disabled:     "#B0B0B0",
  disabledText: "#777777",
  addToRoutine: {
    start:  "#213448",   // Gradient başlangıç
    end:    "#547792",   // Gradient bitiş
    text:   "#FFFFFF",
    solid:  "#3A4D6A",   // Gradient orta tonu (solid fallback)
  },
}
```

### Diğer Sabit Renkler

```typescript
border:         "#E0E0E0"   // Genel border rengi
borderSelected: "#050A1A"   // Seçili durum border rengi (siyaha yakın)

shadow: {
  light:  "rgba(0, 0, 0, 0.1)",
  medium: "rgba(0, 0, 0, 0.2)",
  dark:   "rgba(0, 0, 0, 0.3)",
}
```

### Özel Tek Kullanımlık Renkler

```
#ffb400       — Seçili kart altın rengi (SelectableCard selected & recommended)
#000000       — Recommended badge arkaplanı
#BABABA       — Aktif olmayan tab ikonu rengi
#CDCDD0       — BottomNav dış border ve gölge rengi
#4A90E2       — Explore / Mood popup mavi butonu
#F8F9FC       — TipCard arkaplanı
#E8ECF2       — TipCard içindeki ikon dairesi arkaplanı
#2F9E65       — Yeşil habit ikonları (#E3F6E3 arka planla birlikte)
#3B82F6       — To-do mavi rengi
#653FFD       — Badge rengi (TrendCard habit sayısı, mor ~%90 opasite)
#20a837       — ActivityCard yukarı ok (başarı) rengi
#a82920       — ActivityCard aşağı ok (başarısızlık) rengi
#f4a261       — ActivityCard madalya rengi
#FF9800       — ActivityCard ateş (streak) rengi
#FF5A5F       — Sil (delete) kırmızı rengi
#3BA935       — Tamamlandı (done) yeşil rengi
#FF9800       — Geri al (undone) turuncu rengi
```

---

## 3. Tipografi (Typography)

### Font Ailesi

Uygulamada tek bir özel font kullanılır:

```
Font: Coolvetica
```

Tüm `fontFamily` tanımlamaları `"Coolvetica"` kullanır. Fallback olarak `"Roboto"` tanımlıdır (kullanılmaz).

### Font Ağırlıkları

```typescript
light:     "300"
regular:   "normal" (400)
medium:    "500"
bold:      "bold"   (700)
extraBold: "800"
```

### Font Boyutları (Sabit)

```typescript
// src/utils/theme.ts → SIZES
xSmall:   10px
small:    12px
medium:   14px
large:    16px
xLarge:   18px
xxLarge:  20px
xxxLarge: 24px
subtitle: 28px
title:    32px
```

### Font Boyutları (Responsive)

Responsive boyutlar için iki yöntem kullanılır:

```typescript
// 1) react-native-responsive-dimensions
import { responsiveFontSize } from "react-native-responsive-dimensions";
responsiveFontSize(1.9)  // ~16px — habit başlıkları
responsiveFontSize(1.5)  // ~13px — yardımcı metinler

// 2) react-native-responsive-screen
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
hp(1.8)   // Buton metni (LinearGradientButton)
hp(2.2)   // Popup küçük başlık

// Tipik kullanımlar:
// Header titre:        wp(5.5)    ~22px
// Popup başlık:        responsiveFontSize(1.6)
// Popup alt metin:     responsiveFontSize(1.3)
// CardTitle:           12px (sabit, TipCard)
// TrendCard title:     15px (sabit)
// Aktivite metni:      16px (sabit)
```

---

## 4. Boşluk Sistemi (Spacing)

### Sabit Değerler

```typescript
// src/utils/theme.ts → SIZES.padding / margin
padding:  { small: 8,  medium: 16, large: 24, xLarge: 32 }
margin:   { small: 8,  medium: 16, large: 24, xLarge: 32 }
```

### Responsive Değerler

```typescript
// src/utils/commonStyles.ts
padding: {
  small:  wp("2%"),   // ~8px
  medium: wp("4%"),   // ~16px
  large:  wp("6%"),   // ~24px
}
margin: {
  small:  wp("1%"),
  medium: wp("2%"),
  large:  wp("4%"),
}
```

### Boyutlar

```typescript
buttonHeight: { small: 36, medium: 48, large: 56 }
inputHeight:  48px
iconSize:     { small: 16, medium: 24, large: 32, xLarge: 40 }
```

---

## 5. Border Radius

```typescript
// src/utils/theme.ts → SIZES.borderRadius
small:  4px
medium: 8px
large:  16px
xLarge: 24px
circle: 50px  // Tamamen yuvarlak

// src/utils/commonStyles.ts
small:  8px
medium: 12px
large:  16px

// Responsive kullanımlar (gerçek componentlerde):
wp(4)    // ~16px — SelectableCard
wp(4)    // ~16px — TipCard, TrendCard, ActivityCard
wp(5.5)  // ~22px — HabitItem
wp(6)    // ~24px — BottomNav popup butonları
wp(16)   // ~64px — BottomNav ana bar (tam yuvarlak pill)
```

---

## 6. Gölge Sistemi (Shadows)

### Standart Gölge Deseni

```typescript
// iOS
shadowColor: "#000"
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.08   // hafif — kartlar
shadowRadius: 4

// Android
elevation: 3   // hafif kartlar
elevation: 5   // nav bar, modal
```

### Kullanım Örnekleri

| Bileşen | shadowOpacity | shadowRadius | elevation |
|---|---|---|---|
| HabitItem | 0.05 | 2 | — |
| TipCard | 0.08 | 6 | 3 |
| TrendCard | 0.15 | 6 | 4 |
| ActivityCard | 0.10 | 4 | 3 |
| BottomNav bar | 0.10 | 4 | 5 |
| Popup buton | 0.08 | 10 | 3 |
| DayItem (today) | 0.30 | 4 | 5 |
| PremiumBadge | 0.30 (gold) | 2 | 3 |

### Ortak Shadow Helper

```typescript
// src/utils/commonStyles.ts
createShadowStyle("#000", elevation: 5) → {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation,
}
```

---

## 7. Gradient Tanımları

### Primary CTA Gradient (Ana Buton)

```typescript
// LinearGradientButton default, BottomNav add butonu
colors={["#547792", "#213448"]}  // secondary.main → primary.main
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 0 }}
// Kullanım: horizontal gradient, soldan sağa
```

### BottomNav Add Butonu Gradient

```typescript
colors={[COLORS.primary.main, COLORS.secondary.main]}  // "#213448" → "#547792"
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}
// Kullanım: diagonal gradient (köşeden köşeye)
```

### Modal/Sheet Arkaplan Gradient

```typescript
// HabitItem delete sheet, diğer modal arka planları
colors={['#E8F0F5', '#D8E6F0', '#C8DCE8']}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}
// Hafif mavi-gri tonları, köşeden köşeye
```

### Rank Gradientleri (XP/Seviye Sistemi)

```typescript
bronze:   ["#CD7F32", "#A0522D"]
silver:   ["#C0C0C0", "#808080"]
gold:     ["#FFD700", "#DAA520"]
platinum: ["#E5E4E2", "#B0B0B0"]
diamond:  ["#B9F2FF", "#4DD0E1"]
```

---

## 8. Responsive Tasarım Yardımcıları

### Temel İmportlar

```typescript
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";
```

### Kullanım Kuralı

- `wp(x)` — Genişliğe bağlı yatay boyutlar (padding, width, borderRadius)
- `hp(x)` — Yüksekliğe bağlı dikey boyutlar (padding, height, margin)
- `responsiveFontSize(x)` — Yazı tipi boyutları
- Sabit piksel değerlerinden kaçın (özellikle `fontSize`, `padding`, `width/height`)

### Platform Farkları

```typescript
// Yaygın pattern (BottomNav örneği):
bottom: Platform.select({
  ios:     hp(6.3),
  android: hp(5.5),
}),

// Card boyutları:
width:  Platform.OS === "ios" ? wp(38) : wp(36),
height: Platform.OS === "ios" ? hp(16) : hp(14),
```

---

## 9. Dark Mode / Tema Sistemi

### ThemeProvider

Uygulama dark mode'u destekler. `src/utils/ThemeProvider.tsx` üzerinden yönetilir.

```typescript
import { useTheme } from "../../utils/ThemeProvider";
const { colors, isDarkMode } = useTheme();
```

### Dark/Light Renk Eşlemeleri

| Token | Light Mode | Dark Mode |
|---|---|---|
| `colors.background` | `#FFFFFF` | `#1C2526` |
| `colors.mainContainer` | `#F7F8FB` | `#1C2526` |
| `colors.text` | `#09122C` | `#FFFFFF` |
| `colors.secondaryText` | `#777777` | `#FFFFFF` |
| `colors.tabContainer` | `#E0E0E0` | `#777777` |
| `colors.activeTabButton` | `#FFFFFF` | `#B0B0B0` |
| `colors.sectionCard` | `#FFFFFF` | `#777777` |
| `colors.border` | `#E0E0E0` | `#B0B0B0` |
| `colors.viewAllText` | `#653FFD` | `#653FFD` |
| `colors.logoutButton` | `#BE3144` | `#BE3144` |

---

## 10. Component Kataloğu

### LinearGradientButton

**Dosya:** `src/components/common/LinearGradientButton.tsx`

CTA ve ana aksiyon butonları için kullanılır.

```typescript
interface LinearGradientButtonProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  colors?: string[];          // Default: ["#547792", "#213448"]
  start?: { x: number; y: number };  // Default: { x: 0, y: 0 }
  end?: { x: number; y: number };    // Default: { x: 1, y: 0 }
}
```

**Stiller:**
```typescript
// LinearGradient container
borderRadius: 10
minHeight: hp(5.0)       // ~48px
paddingHorizontal: 16
paddingVertical: hp(1.0)

// Metin
color: "#fff"
fontWeight: "bold"
fontSize: hp(1.8)
textAlign: "center"

// TouchableOpacity
activeOpacity: 0.85
```

---

### SelectableCard

**Dosya:** `src/components/common/SelectableCard.tsx`

Onboarding seçim ekranlarında, alışkanlık tipi seçimlerinde kullanılan kart.

```typescript
type Props = {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  image?: ImageSourcePropType;
  isRecommended?: boolean;
  mascotImageSize?: number;
};
```

**Stiller:**
```typescript
// card (default)
padding:         wp(4)
borderRadius:    wp(4)
backgroundColor: "#b0b0b0ff"    // Gri arkaplan
width:           wp(38) / wp(36)  // iOS / Android
height:          hp(16) / hp(14)
shadowOpacity:   0.08
shadowRadius:    4 / elevation: 4

// selected state
borderWidth:   2
borderColor:   "#ffb400"    // Altın sarısı seçim
elevation:     6 (Android)

// recommended state
backgroundColor: "#ffb400"
borderWidth:     1
borderColor:     "#ffb400"

// recommendedBadge
backgroundColor:  "#000000"
borderRadius:     wp(3)
paddingHorizontal: wp(2)
color:             "#fff"
fontFamily:        "Coolvetica"
fontSize:          wp(3) / wp(2.8)

// checkmark container (selected)
backgroundColor: "#ffb400"
borderRadius:    wp(4)
size:            wp(8) × wp(8)
position:        bottom center overlay

// emoji
fontSize: wp(10)
marginBottom: hp(1.2)

// label
fontSize: wp(3.8)
fontFamily: "Coolvetica"
color: "#000" / "#fff" (selected)
```

---

### Header

**Dosya:** `src/components/common/Header.tsx`

Ana ekran üst başlığı. Selamlama metni, kullanıcı adı, premium badge ve mood görüntüler.

```typescript
interface HeaderProps {
  greeting: string;
  userName: string;
  userId: string;
  selectedDate: string;
  isPremium?: boolean;
}
```

**Stiller:**
```typescript
// headerContainer
flexDirection:    "row"
alignItems:       "center"
justifyContent:   "space-between"
paddingHorizontal: Dimensions.width * 0.05   // ~5%
paddingVertical:   Dimensions.width * 0.03   // ~3%
backgroundColor:  "#fff"
borderBottomWidth: 1
borderBottomColor: "#eee"

// headerTitle
fontSize:    wp(5.5)   // ~22px
fontFamily:  "Coolvetica"
fontWeight:  "600"
marginLeft:  wp(2)
color:       "#000"

// moodImage (emoji resmi)
width:  wp(7.5)
height: wp(7.5)

// badgesContainer
flexDirection: "row"
marginLeft:    wp(2)
gap:           wp(2)
```

**Not:** Mood görüntüleri `veryhappy`, `happy`, `neutral`, `sad` durumları için lokal `.png` dosyaları kullanır.

---

### BottomNav

**Dosya:** `src/components/common/BottomNav.tsx`

Özel bottom tab bar. Floating pill tasarımı + animasyonlu popup menü.

**Tabs:** Home (Feather/home), Explore (MaterialIcons/explore), ADD (gradient btn), Stats (Ionicons/stats-chart), Profile (Ionicons/person-circle-sharp)

```typescript
// bottomNav (bar container)
backgroundColor:  "#fff"
borderColor:      "#CDCDD0"
borderRadius:     wp(16)         // Tam yuvarlak pill
borderWidth:      1
paddingHorizontal: wp(10)
paddingVertical:   hp(1.2)
shadowColor:      "#CDCDD0"
shadowOpacity:    0.1
shadowRadius:     4 / elevation: 5
width:            wp(90)
height:           hp(8)

// Pozisyon
position: "absolute"
bottom: hp(2.5)   (container)
bottom: hp(6.3) iOS / hp(5.5) Android   (override ile)

// addButtonGradient (orta + butonu)
colors:       [COLORS.primary.main, COLORS.secondary.main]  // "#213448" → "#547792"
borderRadius: wp(6)
size:         wp(12) × wp(12)

// activeIndicator (aktif tab alt çizgisi)
width:           18
height:          3
borderRadius:    2
backgroundColor: "#213448"

// Icon renkleri
aktif:   "#213448"  (COLORS.primary.main)
pasif:   "#BABABA"

// popupButton (popup içi butonlar)
backgroundColor:  "#FFFFFF"
borderRadius:     wp(6)
paddingVertical:  hp(2)
paddingHorizontal: wp(3)
shadowOpacity:    0.08
shadowRadius:     10
elevation:        3

// Explore/Mood butonu (popup full width)
backgroundColor: "#4A90E2"
borderRadius:    wp(6)
width:           "100%"
minHeight:       hp(8)
```

**Animasyon:**
- Popup açılış: `withTiming(1, { duration: 300 })` + translateY 50→0
- Add ikonu dönüşü: 0°→45° (açılırken)
- Active indicator: `withSpring({ damping: 14, stiffness: 220 })` + scaleX 0.3→1

---

### DayItem

**Dosya:** `src/components/common/DayItem.tsx`

Yatay scroll ile gün seçim bileşeni.

```typescript
interface DayItemProps {
  day: { id: number; dayNumber: string; dayName: string };
  isSelected: boolean;
  isToday?: boolean;
  onPress: () => void;
}
```

**Stiller:**
```typescript
// dayItem (base)
width:        50
height:       65
borderRadius: 16
borderWidth:  1
borderColor:  COLORS.border  // "#E0E0E0"
marginRight:  10

// State: selected (sadece border rengi değişir)
borderColor:  COLORS.borderSelected  // "#050A1A"

// State: today (tam dolgu)
backgroundColor: COLORS.primary.main  // "#213448"
borderColor:     COLORS.primary.main
borderWidth:     2
shadowColor:     COLORS.primary.main
shadowOpacity:   0.3
shadowRadius:    4 / elevation: 5

// Metin renkleri
today:    white / fontWeight "600"
selected: "#050A1A" / fontWeight "800"
default:  "#000" day number, "#888" day name
```

---

### HabitItem

**Dosya:** `src/components/habit/HabitItem.tsx`

Ana alışkanlık listesi satırı. Swipeable, progress circle, tamamlanma/skip durumları.

**Stiller:**
```typescript
// habitItem (container)
flexDirection:  "row"
backgroundColor: "#fff"
marginBottom:   hp(1.5)
padding:        wp(5)
borderRadius:   wp(5.5)    // ~22px
borderWidth:    0.5
borderColor:    COLORS.border  // "#E0E0E0"
shadowOpacity:  0.05
shadowRadius:   2

// State: skipped
backgroundColor: "#F0F0F0"
opacity:         0.8

// State: completed
backgroundColor: "#E8F5E9"   // Açık yeşil
opacity:         0.9

// completedTag (overlay badge)
position: "absolute", top: 0, left: 0
backgroundColor: "#3BA935"
color: "#fff", borderRadius: wp(5.5) top-left, borderBottomRightRadius: 8

// skippedTag (inline badge)
backgroundColor: "#FF9800"
color: "#fff"
fontSize: responsiveFontSize(1.2)
borderRadius: 4

// habitTitle
fontSize:   responsiveFontSize(1.9)
fontWeight: "500"
color:      "#000"
fontFamily: "Coolvetica"

// habitProgress (alt metin)
fontSize: responsiveFontSize(1.5)
color:    "#666"

// progressCircle
size: wp(12) × wp(12) (Progress.Circle size={48})

// Action box (edit/done/add)
size:         wp(8) × wp(8)
borderRadius: wp(3)
borderWidth:  1
borderColor:  "#EAECF0"

// streakTag (🔥 streak göstergesi)
backgroundColor: "#FFF3E0"
color:           "#FF6D00"
fontSize:        responsiveFontSize(1.4)
borderRadius:    6

// Swipe actions arkaplanları
sağ (delete/done):  backgroundColor: "#f9f9f9"
sol (fail/skip):    backgroundColor: "#f9f9f9"
```

**Progress Circle Renkleri:**
- Tamamlanmış: `#3BA935` (yeşil)
- Devam ediyor: `#213448` (primary)
- Skipped:      `#FF9800` (turuncu)

---

### TipCard

**Dosya:** `src/components/common/TipCard.tsx`

Keşfet ekranındaki küçük ipucu kartları. Yatay scroll içinde kullanılır.

```typescript
// card
width:           wp(28)
backgroundColor: "#F8F9FC"
borderRadius:    16
paddingVertical: 12
paddingHorizontal: 8
shadowColor:     "#213448"
shadowOpacity:   0.08
shadowRadius:    6 / elevation: 3
borderWidth:     1
borderColor:     "rgba(33, 52, 72, 0.06)"

// imageContainer (daire)
width:           56
height:          56
borderRadius:    28    // tam daire
backgroundColor: "#E8ECF2"

// title
fontSize:   12
color:      "#213448"
fontFamily: "Coolvetica"
lineHeight: 16
```

---

### TrendCard

**Dosya:** `src/components/common/TrendCard.tsx`

Trending alışkanlık setleri için görsel kart. Grid içinde 2 sütun.

```typescript
// card
width:           width / 2 - 20   // Ekran genişliğinin yarısı - 20
height:          200
backgroundColor: "#213448"        // Resim yoksa fallback
borderRadius:    16
shadowOpacity:   0.15
shadowRadius:    6 / elevation: 4
overflow:        "hidden"

// image
width:  "100%", height: "100%"
position: "absolute"
resizeMode: "cover"

// overlay (opaklık katmanı)
backgroundColor: "rgba(0, 0, 0, 0.15)"

// badge (habit sayısı)
position:        top: 10, right: 10
backgroundColor: "rgba(101, 63, 253, 0.9)"   // Mor
borderRadius:    12
fontSize:        11, color: "#fff"
fontWeight:      "600"

// titleContainer (alt metin alanı)
backgroundColor:      "rgba(0, 0, 0, 0.5)"
paddingVertical:      10
paddingHorizontal:    10
borderBottomLeftRadius: 16
borderBottomRightRadius: 16

// title
fontSize:   15
color:      "#fff"
fontWeight: "600"
```

---

### ActivityCard

**Dosya:** `src/components/common/ActivityCard.tsx`

Aktivite geçmişi listesi satırı.

```typescript
// activityCard
flexDirection:  "row"
justifyContent: "space-between"
backgroundColor: "#fff"
borderRadius:    16
padding:         15
marginBottom:    10
shadowOpacity:   0.10
shadowRadius:    4 / elevation: 3

// activityText (ana metin)
fontSize:   16
fontWeight: "600"
color:      "#000"
fontFamily: "Coolvetica"

// activityTime
fontSize: 12
color:    "#999"

// habitTitleText
fontSize:   14
fontWeight: "500"
color:      "#333"

// activityIconContainer
backgroundColor: "#f0f0f0"
borderRadius:    20
padding:         5

// İkon renkleri
arrow-up:    "#20a837"  // Başarı / ilerleme
arrow-down:  "#a82920"  // Başarısılık
medal:       "#f4a261"  // Başarım
flame-sharp: "#FF9800"  // Streak
```

---

### PremiumBadge

**Dosya:** `src/components/common/PremiumBadge.tsx`

Premium kullanıcı rozeti. Görsel asset tabanlı (`premium_badge.png`).

```typescript
interface PremiumBadgeProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  text?: string;
  style?: any;
}

// Boyutlar
small:   { width: wp(8),  height: hp(2.2) }
medium:  { width: wp(12), height: hp(3.2) }
large:   { width: wp(16), height: hp(4.2) }

// Gölge
shadowColor:   "#FFD700"   // Altın rengi gölge
shadowOpacity: 0.3
shadowRadius:  2
elevation:     3
```

---

## 11. İkon Kütüphanesi

Tek kaynak: `@expo/vector-icons`

### Kullanılan İkon Setleri

| Set | İmport | Kullanım Alanı |
|---|---|---|
| **Ionicons** | `import { Ionicons } from "@expo/vector-icons"` | Ana ikonlar (stats, person, checkmark, trash, add vb.) |
| **Feather** | `import { Feather } from "@expo/vector-icons"` | Tab bar (home, settings vb.) |
| **MaterialIcons** | `import { MaterialIcons } from "@expo/vector-icons"` | Explore, diğer |

### Yaygın İkonlar

```
home             — Ana sayfa tab (Feather)
explore          — Keşfet tab (MaterialIcons)
stats-chart      — İstatistik tab (Ionicons)
person-circle-sharp — Profil tab (Ionicons, size=26)
add              — Yeni oluştur (Ionicons, size=45, BottomNav)
checkmark        — Tamamlandı (Ionicons, color="#3BA935")
arrow-undo       — Geri al (Ionicons, color="#FF9800")
trash-outline    — Sil (Ionicons, color="#FF5A5F")
create-outline   — Düzenle (Ionicons, color=COLORS.primary.main)
close            — Kapat (Ionicons, color="#666")
leaf-outline     — Alışkanlık (Ionicons, color="#2F9E65")
medal            — Başarım (Ionicons, color="#f4a261")
flame-sharp      — Streak (Ionicons, color="#FF9800")
arrow-up/down    — Aktivite (Ionicons)
shield-outline   — Bronze rank
shield-half-outline — Silver rank
shield           — Gold rank
diamond-outline  — Platinum rank
diamond          — Diamond rank
send             — Gönder
logo-instagram   — Instagram
logo-tiktok      — TikTok
```

### Standart İkon Boyutları

```
Tab bar:     24 (Feather, MaterialIcons)
Tab profil:  26 (Ionicons)
BottomNav +: 45 (Ionicons, gradient buton içi)
Swipe aksiyon: 20
Action box:  18
Popup buton: 16, 22
```

---

## 12. Rank / XP Renk Sistemi

```typescript
// src/services/xpService.ts

bronze:   { primary: "#CD7F32", light: "#E8C9A0", gradient: ["#CD7F32", "#A0522D"] }
silver:   { primary: "#C0C0C0", light: "#E8E8E8", gradient: ["#C0C0C0", "#808080"] }
gold:     { primary: "#FFD700", light: "#FFF3A0", gradient: ["#FFD700", "#DAA520"] }
platinum: { primary: "#E5E4E2", light: "#F5F5F5", gradient: ["#E5E4E2", "#B0B0B0"] }
diamond:  { primary: "#B9F2FF", light: "#E0FAFF", gradient: ["#B9F2FF", "#4DD0E1"] }
```

### Rank Seviyeleri

| Rank | Min Level | Min XP | Gerekli Habit |
|---|---|---|---|
| Bronze | 0 | 0 | — |
| Silver | 5 | 500 | 3 habit, 7 gün |
| Gold | 10 | 2.250 | 3 habit, 14 gün |
| Platinum | 15 | 5.250 | 5 habit, 21 gün |
| Diamond | 20 | 9.750 | 5 habit, 30 gün |

---

## 13. Modal & Sheet Stilleri

### Tamagui Sheet Kullanımı

```typescript
// Standart sheet pattern (HabitItem, NewGoodHabitSheet vb.)
<Sheet
  modal
  open={true}
  snapPoints={[35]}  // %35 yükseklik
  dismissOnSnapToBottom={true}
  animation="medium"
>
  <Sheet.Overlay
    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    animation="lazy"
  />
  <Sheet.Frame style={{ zIndex: 100001 }}>
    {/* İçerik */}
  </Sheet.Frame>
</Sheet>
```

### Sheet İçi Gradient Arkaplan

```typescript
<LinearGradient
  colors={['#E8F0F5', '#D8E6F0', '#C8DCE8']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  }}
>
```

### Modal İçi Butonlar (Confirm/Cancel)

```typescript
// Cancel (iptal) butonu
backgroundColor: "#F5F5F5"
borderRadius:    12
color:           "#333"
fontWeight:      "600"

// Delete/Confirm (tehlikeli aksiyon) butonu
backgroundColor: "#FF5A5F"
borderRadius:    12
color:           "#fff"
fontWeight:      "600"
```

---

## 14. Predefined Habit Modal Renkleri

Her ön tanımlı alışkanlık tipi farklı arkaplan rengine sahiptir:

```typescript
Su içme:       "#E0F7FA"   // Açık turkuaz
Okuma:         "#FFE4B5"   // Moccasin
Yüzme:         "#E0FFFF"   // Açık cyan
Not alma:      "#FFFACD"   // Limon sarısı
Koşu:          "#F0FFF0"   // Honeydew
Kahve:         "#F5DEB3"   // Wheat
Vitamin:       "#FFF5EE"   // Seashell
Meditasyon:    "#E6E6FA"   // Lavender
Uyku:          "#E6E6FA"   // Lavender
Finansal not:  "#FFF8E1"   // Amber açık
```

---

## 15. Animasyon Kuralları

### Kütüphane

```typescript
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, interpolate
} from "react-native-reanimated";
```

### Süreler

```typescript
withTiming(1, { duration: 300 })   // Açılış (popup vb.)
withTiming(0, { duration: 200 })   // Kapanış
withTiming(1, { duration: 600 })   // Yavaş açılış (teaser kart)
```

### Spring (Aktif Tab Göstergesi)

```typescript
withSpring(value, { damping: 14, stiffness: 220 })
// Doğal yaylı animasyon — tab değişiminde kullanılır
```

### Translate + Opacity (Popup)

```typescript
// Yukarıdan aşağıya belirme
opacity:     0 → 1
translateY:  50 → 0

// Premium teaser (dönerek gelme)
translateY:  -150 → 0
rotate:      15° → 0°
scale:       0.8 → 1
```

### İkon Dönüşü (Add Butonu)

```typescript
// Popup açıkken + ikonu 45° döner (× gibi görünür)
rotateZ: 0° → 45°
```

---

## 16. Tema Dosyası (Tam Kaynak)

Tüm tasarım token'larının tek kaynağı:

**Dosya:** `src/utils/theme.ts`

```typescript
import { COLORS, FONTS, SIZES } from "../../utils/theme";

// Kullanım örnekleri:
backgroundColor: COLORS.primary.main       // "#213448"
color:           COLORS.text.secondary     // "#777777"
borderColor:     COLORS.border             // "#E0E0E0"
fontSize:        SIZES.medium              // 14
fontFamily:      FONTS.medium.fontFamily   // "Coolvetica"
fontWeight:      FONTS.bold.fontWeight     // "bold"
borderRadius:    SIZES.borderRadius.large  // 16
padding:         SIZES.padding.medium      // 16
```

---

## Hızlı Başvuru Kartı

```
PRIMARY:   #213448  (koyu lacivert)
SECONDARY: #547792  (çelik mavi)
ACCENT:    #E17564  (mercan)
DANGER:    #BE3144  (kırmızı)
SUCCESS:   #4CAF50  (yeşil)
GOLD:      #ffb400  (seçim altın)
LINK:      #653FFD  (mor bağlantı)

FONT:       Coolvetica
BG_LIGHT:   #FFFFFF / #F7F8FB
BG_DARK:    #1C2526
TEXT:       #09122C / #777777

GRADIENT_CTA:     ["#547792", "#213448"]  → horizontal
GRADIENT_MODAL:   ["#E8F0F5", "#D8E6F0", "#C8DCE8"]  → diagonal
GRADIENT_ADD_BTN: ["#213448", "#547792"]  → diagonal

BORDER_RADIUS: 8 / 12 / 16 / 24 / pill(wp(16))
SHADOW: { color: "#000", opacity: 0.05-0.25, radius: 2-10, elevation: 3-6 }
```
