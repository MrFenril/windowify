import { Window } from "../Window/Window";

export const OptionsMenu = (window: Window, _headerActionOverlay: HTMLElement, args: any[]) => {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const el = templateEl.content.firstElementChild!;

    el.addEventListener("click", () => {
        const dropdown = document.createElement("div");
        dropdown.style.left = el.getBoundingClientRect().x + "px";
        dropdown.style.top = el.getBoundingClientRect().y + 30 + "px";

        // debugger;
        args.forEach(arg => {
            const btn = document.createElement("button");
            btn.innerText = arg.optionName;
            btn.addEventListener("click", onClickHandler());
            btn.classList.add("window-dropdown-btn");
            dropdown.appendChild(btn);
            function onClickHandler() {
                return e => {
                    arg.handler(e, window);
                    dropdown.remove();
                };
            }
        });

        dropdown.classList.add("window-dropdown");
        document.body.appendChild(dropdown);

        document.addEventListener("mousedown", onMouseDown);
        function onMouseDown(e: Event) {
            if (!dropdown.contains(e.target as Node)) {
                dropdown.remove();
                document.removeEventListener("mousedown", onMouseDown);
            }
        }
    });

    return el;
};

const template: string = `
<button class="window-header-btn">
    <?xml version="1.0" ?><svg enable-background="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_"/><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_"/><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_"/></svg>
</button>
`;

const dropdownTemplate: string = `
<button class="window-dropdown-btn">

</button>
`;
