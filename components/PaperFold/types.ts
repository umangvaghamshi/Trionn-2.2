export interface PaperFoldCard {
  /** Title text displayed on the card */
  title: string;
  /** Description text displayed on the right side */
  description: string;
}

export interface PaperFoldProps {
  /** Section heading */
  sectionTitle?: string;
  /** Section subtitle / tagline */
  sectionSubtitle?: string;
  /** Array of card data */
  cards?: PaperFoldCard[];
  /** Background color (hex) */
  backgroundColor?: string;
  /** Footer tagline at the bottom */
  footerTagline?: string;
  /** Additional className for the outer wrapper */
  className?: string;
}
