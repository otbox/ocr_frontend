"use client";

// export default function TToggleButtonTheme() {
//     const toggle = () => {
//         document.documentElement.classList.toggle("dark");
//     };

//     return (
//         <button onClick={toggle}>
//             Toggle Theme
//         </button>
//     );
// }

export default function TToggleButtonTheme() {
    const toggle = () => {
        const root = document.documentElement;
        const isDark = root.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    return <button onClick={toggle}>Toggle Theme</button>;
}