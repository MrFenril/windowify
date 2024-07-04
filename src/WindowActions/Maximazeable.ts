import { Window } from "../Window/Window";

export const Maximazeable = (window: Window, _headerActionOverlay: HTMLElement) => {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const el = templateEl.content.firstElementChild!;

    el.addEventListener("click", () => {
        window.Context.classList.toggle("maximized");
    });

    return el;
};

const template: string = `
<button id="maximize">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.8333 2.5H4.16667C3.24167 2.5 2.5 3.24167 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V4.16667C17.5 3.72464 17.3244 3.30072 17.0118 2.98816C16.6993 2.67559 16.2754 2.5 15.8333 2.5ZM15.8333 4.16667V15.8333H4.16667V4.16667H15.8333Z" fill="white"/>
    </svg>
</button>
`;
