@module("@cosmonexus/nova-emotion")
external css: {..} => string = "css"

@module("@cosmonexus/nova-emotion")
external rawCss: string => string = "css"

@module("@cosmonexus/nova-emotion")
external cx: array<string> => string = "cx"

@module("@cosmonexus/nova-emotion")
external keyframes: {..} => string = "keyframes"

@module("@cosmonexus/nova-emotion")
external injectGlobal: string => unit = "injectGlobal"

type color = {
  accent1: string,
  accent2: string,
  accent3: string,
  accentBg: string,
  success: string,
  successBg: string,
  error: string,
  errorBg: string,
  errorBorder: string,
  warning: string,
  warningBg: string,
  warningBorder: string,
  surface0: string,
  surface1: string,
  surface2: string,
  surface3: string,
  surface4: string,
  text1: string,
  text2: string,
  text3: string,
}

type space = {
  @as("1") s1: string,
  @as("2") s2: string,
  @as("3") s3: string,
  @as("4") s4: string,
  @as("5") s5: string,
  @as("6") s6: string,
  @as("8") s8: string,
  @as("10") s10: string,
}

type radius = {
  sm: string,
  md: string,
  lg: string,
  full: string,
}

type shadow = {
  md: string,
  glow: string,
}

type transition = {
  fast: string,
  normal: string,
  slow: string,
}

type easing = {
  out: string,
  inOut: string,
}

type font = {
  sans: string,
  mono: string,
}

type fontSize = {
  xs: string,
  sm: string,
  base: string,
  lg: string,
  xl: string,
  xxl: string,
}

type fontWeight = {
  medium: string,
  semibold: string,
  bold: string,
}

type lineHeight = {
  tight: string,
  normal: string,
}

type t = {
  color: color,
  space: space,
  radius: radius,
  shadow: shadow,
  transition: transition,
  easing: easing,
  focusRing: string,
  borderSubtle: string,
  font: font,
  fontSize: fontSize,
  fontWeight: fontWeight,
  lineHeight: lineHeight,
}

@module("@cosmonexus/nova-emotion")
external theme: t = "theme"
