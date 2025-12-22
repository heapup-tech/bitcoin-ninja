declare interface Window {
  unisat: Unisat
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
