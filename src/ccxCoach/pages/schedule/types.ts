export type CategoryType = 'chapter' | 'sequential' | 'vertical';

export interface BlockAttributes {
  category: CategoryType,
  displayName: string,
  hidden: boolean,
  location: string,
  start: string,
  due?: string,
  children?: BlockAttributes[],
}

export interface EditableBlockAttributes extends BlockAttributes {
  isEditing: boolean,
  onAdd: (location: string, category: CategoryType) => void,
  onRemove: (location: string, category: CategoryType) => void,
}
