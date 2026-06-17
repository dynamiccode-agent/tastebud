interface LogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  xs:  { width: 100, height: 36  },
  sm:  { width: 130, height: 47  },
  md:  { width: 170, height: 61  },
  lg:  { width: 220, height: 79  },
  xl:  { width: 300, height: 108 },
}

export function Logo({ className = '', size = 'sm' }: LogoProps) {
  const { width, height } = sizes[size]
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="TasteBud"
      width={width}
      height={height}
      className={`object-contain flex-shrink-0 ${className}`}
    />
  )
}
