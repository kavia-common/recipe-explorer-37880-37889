import { useMemo, useState, useEffect } from 'react'
import './App.css'
import './index.css'
import { useTizenKeys } from './hooks/useTizenKeys'
import recipesData from './data/recipes.json'

/**
 * PUBLIC_INTERFACE
 * App - Root SPA entry for Recipe Explorer with Ocean Professional theme.
 * - Routes: "/" (home/list), "/recipe/:id" (detail)
 * - Client-side routing implemented without external libs for Tizen Web.
 * - Uses mock data from local JSON.
 */
function App() {
  // Simple hash-based router (no external dependencies) to work in Tizen web
  const [route, setRoute] = useState(getRouteFromHash());
  const [query, setQuery] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);

  // Update route on hash change
  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Remote keys: basic navigation support for TV
  useTizenKeys({
    onBack: () => {
      if (route.name === 'detail') {
        navigateTo('/');
      }
    },
    onLeft: () => {
      if (route.name === 'home') setFocusIndex((i) => Math.max(0, i - 1));
    },
    onRight: () => {
      if (route.name === 'home') setFocusIndex((i) => Math.min(filtered.length - 1, i + 1));
    },
    onUp: () => {
      if (route.name === 'home') setFocusIndex((i) => Math.max(0, i - gridWidth()));
    },
    onDown: () => {
      if (route.name === 'home') setFocusIndex((i) => Math.min(filtered.length - 1, i + gridWidth()));
    },
    onEnter: () => {
      if (route.name === 'home' && filtered[focusIndex]) {
        navigateTo(`/recipe/${filtered[focusIndex].id}`);
      }
    },
  });

  // Filter recipes by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipesData;
    return recipesData.filter((r) => {
      return (
        r.title.toLowerCase().includes(q) ||
        r.tags.join(' ').toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    });
  }, [query]);

  // Reset focus when filter changes
  useEffect(() => {
    setFocusIndex(0);
  }, [query]);

  return (
    <div className="app-shell">
      <Navbar query={query} onQueryChange={setQuery} onLogoClick={() => navigateTo('/')} />
      <main className="main-area">
        {route.name === 'home' && (
          <HomeView
            recipes={filtered}
            focusIndex={focusIndex}
            onCardClick={(id) => navigateTo(`/recipe/${id}`)}
          />
        )}
        {route.name === 'detail' && (
          <DetailView
            recipe={recipesData.find((r) => r.id === route.params.id)}
            onBack={() => navigateTo('/')}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

// PUBLIC_INTERFACE
function Navbar({ query, onQueryChange, onLogoClick }) {
  /** A themed top navigation bar with app title and search input. */
  return (
    <header className="nav">
      <div className="nav-left">
        <button className="brand" onClick={onLogoClick} aria-label="Go Home">
          <span className="brand-logo">🍽️</span>
          <span className="brand-text">Recipe Explorer</span>
        </button>
      </div>
      <div className="nav-center">
        <div className="search-wrap">
          <input
            className="search-input"
            type="text"
            placeholder="Search recipes, tags, ingredients..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      <div className="nav-right">
        <span className="pill">Ocean Professional</span>
      </div>
    </header>
  );
}

// PUBLIC_INTERFACE
function HomeView({ recipes, focusIndex, onCardClick }) {
  /** The responsive list/grid of recipes shown on the home route. */
  return (
    <section className="home">
      <h2 className="section-title">Browse Recipes</h2>
      <div className="grid">
        {recipes.map((r, idx) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            focused={idx === focusIndex}
            onClick={() => onCardClick(r.id)}
          />
        ))}
        {recipes.length === 0 && (
          <div className="empty-state">
            <p>No recipes found. Try a different search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function RecipeCard({ recipe, focused, onClick }) {
  /** A single recipe card with image, title, tags, and meta information. */
  return (
    <button
      className={`card ${focused ? 'focused' : ''}`}
      onClick={onClick}
      aria-label={`Open ${recipe.title}`}
    >
      <div className="card-media">
        <img src={recipe.image} alt={recipe.title} />
        <div className="card-overlay" />
      </div>
      <div className="card-body">
        <h3 className="card-title">{recipe.title}</h3>
        <div className="card-tags">
          {recipe.tags.slice(0, 3).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="card-meta">
          <span>⏱ {recipe.prepTime} min</span>
          <span>•</span>
          <span>⭐ {recipe.rating.toFixed(1)}</span>
        </div>
      </div>
    </button>
  );
}

// PUBLIC_INTERFACE
function DetailView({ recipe, onBack }) {
  /** Detailed recipe layout with hero image, ingredients, and steps. */
  if (!recipe) {
    return (
      <section className="detail">
        <div className="detail-header">
          <button className="btn back" onClick={onBack}>← Back</button>
          <h2 className="section-title">Recipe Not Found</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="detail">
      <div className="detail-header">
        <button className="btn back" onClick={onBack}>← Back</button>
        <h2 className="section-title">{recipe.title}</h2>
        <div className="detail-meta">
          <span className="pill">{recipe.cuisine}</span>
          <span className="pill">⏱ {recipe.prepTime} min</span>
          <span className="pill">⭐ {recipe.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="hero">
        <img src={recipe.image} alt={recipe.title} />
        <div className="hero-gradient" />
      </div>

      <div className="detail-content">
        <article className="panel">
          <h3>Ingredients</h3>
          <ul className="ingredients">
            {recipe.ingredients.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h3>Instructions</h3>
          <ol className="steps">
            {recipe.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Recipe Explorer</span>
    </footer>
  );
}

/**
 * Utilities and routing helpers
 */
function navigateTo(path) {
  // Hash-based routing to work reliably without server config
  const clean = path.startsWith('#') ? path : `#${path}`;
  if (window.location.hash !== clean) {
    window.location.hash = clean;
  } else {
    // Force hashchange-like behavior
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

function getRouteFromHash() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home', params: {} };
  if (parts[0] === 'recipe' && parts[1]) {
    const id = parts[1];
    return { name: 'detail', params: { id } };
  }
  return { name: 'home', params: {} };
}

function gridWidth() {
  // Approximate number of columns for keyboard navigation; this mirrors CSS breakpoints
  const w = window.innerWidth || 1920;
  if (w >= 1400) return 5;
  if (w >= 1100) return 4;
  if (w >= 800) return 3;
  if (w >= 600) return 2;
  return 1;
}

export default App
