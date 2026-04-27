export interface Brand {
  name: string;
  image: string;
  label?: string;
}

export interface BrandShowcaseProps {
  sectionLabel?: string;
  brands?: Brand[];
  footerTagline?: string;
  backgroundColor?: string;
  className?: string;
}
