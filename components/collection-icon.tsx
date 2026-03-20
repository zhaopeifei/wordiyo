import {
  RiBarChartBoxLine,
  RiBankLine,
  RiAncientGateLine,
  RiGraduationCapLine,
  RiAwardLine,
  RiBookOpenLine,
} from '@remixicon/react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'bar-chart': RiBarChartBoxLine,
  'bank': RiBankLine,
  'ancient-gate': RiAncientGateLine,
  'graduation-cap': RiGraduationCapLine,
  'award': RiAwardLine,
  'book-open': RiBookOpenLine,
};

interface CollectionIconProps {
  icon: string;
  className?: string;
}

export function CollectionIcon({ icon, className = 'h-5 w-5' }: CollectionIconProps) {
  const Icon = ICON_MAP[icon];
  if (!Icon) return <span>{icon}</span>;
  return <Icon className={className} />;
}
