export interface Brand {
  name: string;
  image: string;
  label?: string;
}

export type AnimationVariant =
  | 'shutterSlice'
  | 'cubeRotate'
  | 'origamiFold'
  | 'origamiFoldIn'
  | 'crossDissolve'
  | 'clipWipe'
  | 'cardStack'
  | 'cascadeDeck'
  | 'slideReveal'
  | 'elasticPop'
  | 'spiralDepth'
  | 'aceCard';

/** Every animation variant receives current + next image elements, returns a timeline */
export type AnimateFn = (
  currentImg: HTMLElement,
  nextImg: HTMLElement
) => gsap.core.Timeline;

export interface BrandShowcaseProps {
  sectionLabel?: string;
  trustedByLabel?: string;
  brands?: Brand[];
  footerTagline?: string;
  backgroundColor?: string;
  animationVariant?: AnimationVariant;
  className?: string;
}
