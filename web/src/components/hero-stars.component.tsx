const arcStarPath = 'M50 2C53.8 28.2 71.8 46.2 98 50C71.8 53.8 53.8 71.8 50 98C46.2 71.8 28.2 53.8 2 50C28.2 46.2 46.2 28.2 50 2Z'

export function HeroStars(): React.JSX.Element {
  return (
    <div aria-hidden="true" className="hero-stars absolute inset-0 -z-10 overflow-hidden">
      <svg className="hero-star hero-star--one" viewBox="0 0 100 100">
        <path d={arcStarPath} />
      </svg>
      <svg className="hero-star hero-star--two" viewBox="0 0 100 100">
        <path d={arcStarPath} />
      </svg>
      <svg className="hero-star hero-star--three" viewBox="0 0 100 100">
        <path d={arcStarPath} />
      </svg>
      <svg className="hero-star hero-star--four" viewBox="0 0 100 100">
        <path d={arcStarPath} />
      </svg>
      <svg className="hero-star hero-star--five" viewBox="0 0 100 100">
        <path d={arcStarPath} />
      </svg>
      <svg className="hero-star hero-star--six" viewBox="0 0 100 100">
        <path d={arcStarPath} />
      </svg>
    </div>
  )
}
