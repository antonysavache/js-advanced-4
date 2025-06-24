declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
}
