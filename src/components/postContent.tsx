import style from './postContent.module.css';

export default function PostContent({ children }: any) {
    return (
        <div className={style.container}>
            {children}
        </div>
    );
}