// types/tagify.d.ts
declare module '@yaireo/tagify/dist/react.tagify' {
    import { FC } from 'react';

    interface TagifyProps {
        value?: any;
        className?: string | string[];
        placeholder?: string | string[];
        required?: boolean;
        settings?: any;
        whitelist?: any;
        onChange?: (e: any) => void;
    }

    const Tags: FC<TagifyProps>;
    export default Tags;
}
