import style from './wrapper.module.css';

export default function Wrapper({ children }: any) {
    return (
        <div className={style.container}>
            {children}
        </div>
    );
}