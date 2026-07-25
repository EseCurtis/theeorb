import type { ImgHTMLAttributes } from 'react'

type BrandLogoVariant = 'black' | 'color' | 'white'

type BrandLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> & {
  alt?: string
  variant?: BrandLogoVariant
}

const brandLogoSources: Record<BrandLogoVariant, string> = {
  black: '/brand/logo-black.png',
  color: '/brand/logo-color.png',
  white: '/brand/logo-white.png',
}

export function BrandLogo({
  alt = 'TheeOrb logo',
  variant = 'color',
  ...imageProps
}: BrandLogoProps): React.JSX.Element {
  return <img {...imageProps} alt={alt} src={brandLogoSources[variant]} />
}
