import Image, { type ImageProps } from 'next/image'

type BrandLogoVariant = 'black' | 'color' | 'white'

type BrandLogoProps = Omit<ImageProps, 'alt' | 'height' | 'src' | 'width'> & {
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
  return <Image  loading="eager"{...imageProps} alt={alt} height={1024} src={brandLogoSources[variant]} width={1024} />
}
