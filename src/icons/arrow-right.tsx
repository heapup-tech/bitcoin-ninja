type IconProps = React.HTMLAttributes<SVGElement>
export default function ArrowRight(props: IconProps) {
  return (
    <svg
      width='11'
      height='10'
      viewBox='0 0 11 10'
      className='group transition-all delay-0 duration-100 ease-linear hover:translate-x-1 group-hover:translate-x-1'
      {...props}
    >
      <rect
        y='4.25'
        width='10.5'
        height='1.5'
        rx='0.75'
        fill='currentColor'
        className='origin-[90%_50%] scale-[.1] transition-transform duration-100 group-hover:transform-none'
      ></rect>
      <path
        d='M5.75 1L9.75 5L5.75 9'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
    </svg>
  )
}
