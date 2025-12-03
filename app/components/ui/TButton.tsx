import buttonStyles from "../styles/button.module.css"

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    typeStyle: "filled" | "outlined";
    children: React.ReactNode;
}

export default function TButton({ typeStyle, children, ...rest }: IButton) {
    return (
        <button
            className={typeStyle === "filled" ? buttonStyles.filled : buttonStyles.outlined}
            {...rest}
        >
            {children}
        </button>
    );
}
