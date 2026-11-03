import { Category } from '../models';

export const CATEGORIES: readonly Category[] = [
  {
    id: 'fiction',
    slug: 'fiction',
    name: 'Fiction',
    description: 'Novels and stories to get lost in',
    accentColor: '#3b6a9c',
  },
  {
    id: 'mystery',
    slug: 'mystery',
    name: 'Mystery',
    description: 'Whodunits, thrillers and slow-burn suspense',
    accentColor: '#9a3b3b',
  },
  {
    id: 'science',
    slug: 'science',
    name: 'Science',
    description: 'Big ideas from the lab to the cosmos',
    accentColor: '#4a4fa8',
  },
  {
    id: 'history',
    slug: 'history',
    name: 'History',
    description: 'The stories behind the world we live in',
    accentColor: '#9a6a14',
  },
  {
    id: 'children',
    slug: 'children',
    name: 'Children',
    description: 'Picture books and adventures for young readers',
    accentColor: '#1f7a66',
  },
];
