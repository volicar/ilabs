# 🎨 Atualização de Cores - iLABS

## Cores Atualizadas no Tailwind

```javascript
// tailwind.config.js
colors: {
  primary: {
    500: '#22c55e',  // Verde iLABS
    600: '#16a34a',
    700: '#15803d',
  },
  secondary: {
    500: '#3b82f6',  // Azul iLABS
    600: '#2563eb',
    700: '#1d4ed8',
  },
}
```

## 📝 Substituições Manuais Recomendadas

Para usar as cores do iLABS no lugar do azul/ciano anterior, substitua nos componentes:

### Gradientes Principais

**Antes:**
```tsx
from-blue-600 to-cyan-500
```

**Depois (Verde para Azul):**
```tsx
from-primary-600 to-secondary-500
```

**Ou (Azul para Verde - invertido):**
```tsx
from-secondary-600 to-primary-500
```

### Onde Substituir:

1. **components/layout/Header.tsx** (linha ~37)
   - Logo: `from-blue-600 to-cyan-500` → `from-secondary-600 to-primary-500`

2. **components/layout/Footer.tsx** (linha ~9)
   - Logo: `from-blue-600 to-cyan-500` → `from-secondary-600 to-primary-500`

3. **components/sections/HeroSection.tsx** (linha ~14)
   - Título: `from-blue-600 to-cyan-500` → `from-secondary-600 to-primary-500`

4. **components/sections/AboutSection.tsx** (linha ~24)
   - Background: `from-blue-600 to-cyan-500` → `from-secondary-600 to-primary-500`

5. **components/ui/WhatsAppButton.tsx** (linha ~16)
   - Botão: `from-blue-600 to-cyan-500` → `from-secondary-600 to-primary-500`

### Cores de Texto

**Antes:**
```tsx
text-blue-600
hover:text-blue-600
bg-blue-100
```

**Depois:**
```tsx
text-secondary-600    (para azul)
hover:text-primary-600  (para verde no hover)
bg-secondary-100      (para fundo azul claro)
```

## 🚀 Comando Rápido (Linux/Mac)

Se quiser fazer substituição em massa:

```bash
# Substituir gradientes azul→ciano por secondary→primary
find components -name "*.tsx" -type f -exec sed -i 's/from-blue-600 to-cyan-500/from-secondary-600 to-primary-500/g' {} +

# Substituir text-blue-600 por text-secondary-600
find components -name "*.tsx" -type f -exec sed -i 's/text-blue-600/text-secondary-600/g' {} +

# Substituir hover:text-blue-600 por hover:text-primary-600
find components -name "*.tsx" -type f -exec sed -i 's/hover:text-blue-600/hover:text-primary-600/g' {} +
```

## 🎨 Paleta Visual

```
Verde iLABS (primary):
██████ 50  - #f0fdf4  (muito claro)
██████ 100 - #dcfce7
██████ 200 - #bbf7d0
██████ 300 - #86efac
██████ 400 - #4ade80
██████ 500 - #22c55e  ⭐ Principal
██████ 600 - #16a34a
██████ 700 - #15803d
██████ 800 - #166534
██████ 900 - #14532d  (muito escuro)

Azul iLABS (secondary):
██████ 50  - #eff6ff  (muito claro)
██████ 100 - #dbeafe
██████ 200 - #bfdbfe
██████ 300 - #93c5fd
██████ 400 - #60a5fa
██████ 500 - #3b82f6  ⭐ Principal
██████ 600 - #2563eb
██████ 700 - #1d4ed8
██████ 800 - #1e40af
██████ 900 - #1e3a8a  (muito escuro)
```

## 💡 Uso Recomendado

- **CTAs principais**: Verde (primary-600)
- **Links e hovers**: Verde claro (primary-500)
- **Títulos**: Gradiente Azul→Verde
- **Backgrounds**: Verde/Azul claro (100-200)
- **Badges**: Verde (primary-100 bg + primary-700 text)

---

**Nota:** As cores já foram atualizadas no `tailwind.config.js`. 
Agora é só aplicar nos componentes conforme necessário! ✅
