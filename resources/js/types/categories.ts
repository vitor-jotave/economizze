export type Category = {
    id: number;
    name: string;
    slug: string;
    type: string;
    type_label: string;
    color: string;
    icon: string;
    is_active: boolean;
    updated_at: string | null;
};

export type CategoryTypeOption = {
    value: string;
    label: string;
};

export type CategoriesPageProps = {
    categories: Category[];
    categoryTypes: CategoryTypeOption[];
    flash: {
        success?: {
            id: string;
            message: string;
        } | null;
    };
};

export type CategoryFormData = {
    name: string;
    type: string;
    color: string;
    icon: string;
};
