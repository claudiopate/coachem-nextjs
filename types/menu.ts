export type MenuItem = {
  id: number;
  title: string;
  path: string;
  newTab: boolean;
  roles?: string[];
};

export type Menu = MenuItem & {
  submenu?: MenuItem[];
};
