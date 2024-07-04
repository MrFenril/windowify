import { Window } from "../Window/Window";

export const Minimizeable = (window: Window, _headerActionOverlay: HTMLElement) => {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const el = templateEl.content.firstElementChild!;

    el.addEventListener("click", () => {
        window.Hide();
    });

    return el;
};

const template: string = `
<button id="minimize">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2339_62)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.08301 10C2.08301 9.66848 2.2147 9.35054 2.44912 9.11612C2.68354 8.8817 3.00149 8.75 3.33301 8.75H16.6663C16.9979 8.75 17.3158 8.8817 17.5502 9.11612C17.7846 9.35054 17.9163 9.66848 17.9163 10C17.9163 10.3315 17.7846 10.6495 17.5502 10.8839C17.3158 11.1183 16.9979 11.25 16.6663 11.25H3.33301C3.00149 11.25 2.68354 11.1183 2.44912 10.8839C2.2147 10.6495 2.08301 10.3315 2.08301 10Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_2339_62">
        <rect width="20" height="20" fill="white"/>
        </clipPath>
        </defs>
    </svg>
</button>
`;
