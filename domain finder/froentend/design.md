# Domain Finder Frontend - Design Style Guide

## Design Philosophy

### Visual Language
**Modern Tech Minimalism** - Clean, sophisticated interface that embodies the precision and reliability of domain infrastructure technology. The design balances professional credibility with approachable usability, reflecting the technical nature of domain management while remaining accessible to users of all technical levels.

### Color Palette
**Primary Colors:**
- **Deep Slate**: `#1e293b` - Primary text and navigation
- **Tech Blue**: `#0ea5e9` - Interactive elements and accents
- **Cloud White**: `#f8fafc` - Background and content areas
- **Success Green**: `#10b981` - Available domains and positive actions

**Secondary Colors:**
- **Warning Amber**: `#f59e0b` - Premium domains and cautions
- **Error Red**: `#ef4444` - Unavailable domains and errors
- **Neutral Gray**: `#64748b` - Secondary text and borders
- **Light Blue**: `#e0f2fe` - Subtle backgrounds and highlights

### Typography
**Primary Font**: Inter (Sans-serif) - Modern, highly legible, tech-forward
- **Display**: Inter Bold 32-48px for hero headings
- **Headings**: Inter Semibold 24-32px for section titles
- **Body**: Inter Regular 16-18px for content
- **UI Elements**: Inter Medium 14-16px for buttons and labels

**Secondary Font**: JetBrains Mono (Monospace) - For domain names and technical data
- **Domain Display**: JetBrains Mono 18-24px for domain listings
- **Code/Data**: JetBrains Mono 14-16px for technical information

## Visual Effects & Styling

### Background Treatment
**Animated Gradient Flow** - Subtle, slow-moving gradient that creates depth without distraction
- Base: Linear gradient from `#f8fafc` to `#e2e8f0`
- Overlay: Animated blue accent waves with 20% opacity
- Movement: Gentle 60-second cycle for ambient dynamism

### Interactive Elements
**Micro-interactions** - Subtle animations that provide feedback and delight
- **Buttons**: 0.3s ease-in-out hover transitions with subtle scale (1.02x)
- **Cards**: Gentle lift effect on hover with shadow expansion
- **Form Fields**: Focus states with blue border glow and label animation
- **Search Results**: Staggered fade-in animation with 100ms delays

### Visual Hierarchy
**Layered Information Architecture** - Clear distinction between primary and secondary content
- **Hero Section**: Large, bold typography with animated background
- **Search Interface**: Prominent placement with visual weight
- **Results Grid**: Clean cards with consistent spacing and alignment
- **Footer**: Minimal, non-intrusive design with essential links

## Component Styling

### Navigation Bar
**Fixed Header with Glass Effect**
- Background: `rgba(248, 250, 252, 0.95)` with backdrop blur
- Height: 80px with centered logo and navigation
- Shadow: Subtle `0 1px 3px rgba(0, 0, 0, 0.1)`
- Logo: Custom domain-themed icon with wordmark

### Search Interface
**Centered Search Card**
- Background: Pure white with subtle border radius (12px)
- Shadow: `0 10px 25px rgba(0, 0, 0, 0.1)` for depth
- Input Field: Large, prominent with internal padding (20px)
- Button: Primary blue with hover animation and loading states

### Results Display
**Grid Layout with Status Indicators**
- Card Style: White background with 8px border radius
- Status Colors: Green (available), Red (taken), Amber (premium)
- Typography: Monospace font for domain names, sans-serif for details
- Hover Effects: Subtle elevation with expanded information

### Data Visualization
**Clean, Minimal Charts**
- Color Scheme: Consistent with brand palette (blues and greens)
- Style: Flat design with subtle shadows and clean typography
- Interactivity: Hover states with detailed tooltips
- Animation: Smooth data transitions and loading states

## Animation & Motion

### Page Transitions
**Smooth Navigation** - Seamless transitions between pages and states
- Fade transitions: 300ms ease-in-out for page changes
- Loading states: Skeleton screens with shimmer effects
- Scroll animations: Subtle parallax on hero elements (max 8% movement)

### Micro-animations
**Purposeful Motion** - Animations that enhance usability
- **Search Loading**: Rotating icon with pulse effect
- **Results Appearance**: Staggered fade-in with slide-up motion
- **Hover States**: Quick scale and color transitions
- **Form Validation**: Smooth error state transitions

### Background Effects
**Subtle Environmental Animation**
- **Particle System**: Floating geometric shapes in background
- **Gradient Flow**: Slow-moving color transitions
- **Grid Pattern**: Subtle dot grid overlay for tech aesthetic
- **Shader Effects**: Volumetric noise for depth (using shader-park)

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px (single column, stacked elements)
- **Tablet**: 768px - 1024px (two-column grid, condensed navigation)
- **Desktop**: 1024px+ (full multi-column layout, expanded features)

### Mobile Adaptations
- **Touch Targets**: Minimum 44px for all interactive elements
- **Typography**: Larger base font size (18px) for readability
- **Navigation**: Hamburger menu with slide-out drawer
- **Search**: Full-width input field with optimized keyboard

## Accessibility Features

### Color Contrast
- **Text on Background**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear visual distinction and focus states
- **Status Indicators**: Color plus iconography for colorblind users
- **Dark Mode Support**: Alternative color scheme for low-light usage

### Interaction Design
- **Keyboard Navigation**: Full tab order and focus management
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Motion Preferences**: Respect user's reduced motion settings
- **Error Handling**: Clear, actionable error messages

This design system creates a cohesive, professional, and engaging user experience that reflects the technical sophistication of domain management while remaining accessible and user-friendly.