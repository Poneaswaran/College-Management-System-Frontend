---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics. Focus on bold, intentional design choices in typography, color, motion, composition, and visual details. Prioritize mobile-first design with thumb-friendly navigation and prominent CTAs. Always implement real working code (HTML/CSS/JS, React, Vue, etc.) that is visually striking and cohesive with a clear aesthetic point-of-view.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font. Maintain clear hierarchy with properly sized headings and labels for instant comprehension.
- **Color & Theme**: Commit to a cohesive aesthetic with neutral backgrounds (white, light grey, charcoal) paired with vibrant, complementary accent colors (pink, yellow, purple, green). Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. High-contrast CTAs in bold accent colors demand attention.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise. Apply smooth transitions to carousels and video content.
- **Spatial Composition**: Design for vertical scrolling and thumb-friendly navigation zones (bottom 40% of mobile screens). Place critical actions above the fold. Use asymmetry, overlap, diagonal flow, and grid-breaking elements intentionally. Balance generous negative space OR controlled density based on your aesthetic vision.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.
- **Iconography**: Use a consistent icon system throughout—identical functions must use identical icons. Choose icon sets that match your overall aesthetic (outline vs filled, rounded vs sharp, playful vs professional).
- **Dynamic Content**: Design image carousels, video embeds, and data visualizations (charts, infographics) as first-class citizens with colorful, engaging treatments on neutral backgrounds.

## Mobile-First Mandates

**ALWAYS prioritize mobile experience:**
- **Touch Targets**: Minimum 44×44px tap areas, generously spaced for thumbs
- **Navigation**: Bottom navigation bars or thumb-reachable zones (avoid top-only menus)
- **Forms**: Streamlined, single-column layouts with large inputs, proper input types, and contextual keyboards
- **Content Flow**: Vertical scrolling with clear visual rhythm; avoid horizontal scrolling
- **CTAs**: Prominent, high-contrast buttons for key actions ("Apply," "Courses," "Attendance") positioned in thumb-friendly zones
- **Responsive Breakpoints**: Start at 320px mobile, then scale up to tablet (768px) and desktop (1024px+)
- **Performance**: Optimize images, lazy-load content below fold, use system fonts as fallbacks

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision optimized for mobile-first, Gen Z-focused experiences.
