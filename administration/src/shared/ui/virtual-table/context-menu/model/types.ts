export type ContextMenuItem = {
  title: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  titleClassName?: string;
};
