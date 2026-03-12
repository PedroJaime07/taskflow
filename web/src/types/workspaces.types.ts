export interface WorkspaceProps {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    projects: number;
    members: number;
  };
}
