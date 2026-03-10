export type QuickSearchItem = {
    id: string;
    kind: 'account' | 'category' | 'transaction';
    title: string;
    subtitle: string;
    keywords: string[];
    target: string;
};
