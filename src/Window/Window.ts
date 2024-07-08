import "./Window.css";
import WindowActions from "../WindowActions/WindowActions";

export interface IWindowOption {
    windowTitle?: string;
    id?: string;
    x: number;
    y: number;
    windowActions?: WindowActionOption; //WindowActionElement[];
    subHeader?: SubHeaderElement[];
    width?: number;
    height?: number;
    parent?: HTMLElement | string | null;
    clampInsideParent?: boolean;
    context?: HTMLElement;
    resizeable?: boolean;
}

type MoveListenerCallback = (x: number, y: number) => void;
type WindowActionElement = (window: Window, headerActionOverlay: HTMLElement, ...args: object[] | boolean[]) => Element;
type SubHeaderElement = (window: Window, headerActionOverlay: HTMLElement) => HTMLElement;
type actionNames = keyof typeof WindowActions;
type WindowActionOption = {
    [key in actionNames]: boolean | object;
};

export class Window {
    public _windowTitle!: string;

    protected _context!: HTMLElement;
    protected _parent!: HTMLElement | null;
    protected _header: HTMLElement;
    protected _content: HTMLElement;
    protected _windowActions: WindowActionOption;

    protected _options: IWindowOption;

    protected _order: number = 0;

    private _pos1: number = 0;
    private _pos2: number = 0;
    private _pos3: number = 0;
    private _pos4: number = 0;

    private _onMoveListener: MoveListenerCallback[] = [];

    private _onElementDragClose!: () => void;
    private _onElementDrag!: (e: MouseEvent) => void;
    private _onElementLeave!: () => void;

    public get Context() {
        return this._context;
    }

    public get Header() {
        return this._header;
    }

    public get Content() {
        return this._content;
    }

    constructor(options: IWindowOption) {
        const {
            context,
            parent = null,
            windowActions = {} as WindowActionOption,
            width = 100,
            height = 100,
            x = 0,
            y = 0,
            resizeable = false,
        } = options;

        this._options = options;
        this._windowActions = windowActions;

        if (context) this.buildFromContext(context);
        else this.buildFromTemplate(parent);

        const header = this.Context.querySelector<HTMLElement>(".window-header");
        const content = this.Context.querySelector<HTMLElement>(".window-content");

        if (!header) throw new Error("Window header element not found");
        if (!content) throw new Error("Window content element not found");

        this._header = header;
        this._content = content;

        this.Context.style.top = `${y}px`;
        this.Context.style.left = `${x}px`;

        this.Init(width, height, resizeable);
    }

    protected buildFromContext(context: HTMLElement) {
        this._context = context;
        this._parent = context.parentElement;
        this.buildHeader();
    }

    protected buildFromTemplate(parent: HTMLElement | string | null) {
        const fragment = document.createDocumentFragment();

        const windowContext = document.createElement("div");
        this._context = windowContext;

        const windowHeader = this.buildHeader();
        const windowContent = document.createElement("div");

        windowHeader.classList.add("window-header");
        windowContent.classList.add("window-content");

        windowContext.appendChild(windowHeader);
        windowContext.appendChild(windowContent);

        fragment.appendChild(windowContext);

        if (!parent) throw new Error(`Can't append Window to parent ${parent}`);
        this._parent = typeof parent === "object" ? parent : document.querySelector(parent as string);
        this._parent?.appendChild(this.Context);

        this.Context.appendChild(fragment);
    }

    protected buildHeader(): HTMLElement {
        const windowHeader = this.Context.querySelector<HTMLElement>(".window-header") || document.createElement("div");
        if (this._options.windowTitle) {
            const el = document.createElement("span");
            el.classList.add("header-title");
            el.innerText = this._options.windowTitle;
            windowHeader.appendChild(el);
        }

        const actionsEntries: [string, boolean | object][] = Object.entries(this._windowActions);
        if (actionsEntries.length) {
            const actionsHeader = document.createElement("div");
            actionsEntries.forEach(([actionKey, actionsValue]: [string, boolean | object]) => {
                const action: WindowActionElement = WindowActions[actionKey as keyof typeof WindowActions];

                if (!action) throw new Error(`${actionKey} window action not existing`);
                else if (!actionsValue) return;

                const el = action(this, actionsHeader, actionsValue);
                actionsHeader.appendChild(el);
            });
            actionsHeader.classList.add("header-actions-overlay");
            windowHeader.appendChild(actionsHeader);
        }

        return windowHeader;
    }

    protected Init(_width: number, _height: number, resizeable: boolean) {
        if (resizeable) this.Context.classList.add("resizeable-draggable");

        this.Content.setAttribute("data-simplebar", "");

        this.Context.classList.add("draggable");
        // this.Context.style.width = `${width}px`;
        // this.Context.style.height = `${height}px`;

        if (this.Header) this.Header.addEventListener("mousedown", this.dragMouseDown.bind(this));
        else this.Context.addEventListener("mousedown", this.dragMouseDown.bind(this));

        this._onElementDragClose = this.closeDragElement.bind(this);
        this._onElementDrag = this.elementDrag.bind(this);
        this._onElementLeave = this.mouseLeaveScreen.bind(this);

        // Enable focus only one element if other draggable elements in DOM
        this.Context.addEventListener("click", () => {
            document.querySelectorAll(".draggable.focus").forEach(el => {
                el.classList.remove("focus");
            });

            this.Context.classList.add("focus");
        });
    }

    // #region Window actions
    public Move(x: number, y: number, _clamp: boolean = false) {
        this.Context.style.left = x + "px";
        this.Context.style.top = y + "px";

        // Clamping not enabled, we don't have to check positions
        // debugger;
        // if (!clamp && !this._options.clampInsideParent) return;

        return;

        const parentBounds = this._parent!.getBoundingClientRect();
        const parentOffsetX = parentBounds.left + window.scrollX;
        const parentOffsetY = parentBounds.top + window.scrollY;
        // console.log(this._parent!.clientLeft, this._parent!.clientTop, x, y);

        if (x < parentOffsetX) this.Context.style.left = `${parentOffsetX}px`;
        else if (x + this.Context.clientWidth > parentBounds.width + window.scrollX + parentBounds.left) {
            this.Context.style.left = `${parentBounds.width + window.scrollX + parentBounds.x - this.Context.clientWidth}px`;
            // this._pos3 = parentBounds.width - this.Context.clientWidth;
        }

        if (y < parentOffsetY) this.Context.style.top = `${parentOffsetY}px`;
        else if (y + this.Context.clientHeight > parentBounds.height + window.scrollY + parentBounds.y) {
            this.Context.style.top = `${parentBounds.height + window.scrollY + parentBounds.y - this.Context.clientHeight}px`;
            // this._pos4 = parentBounds.height - this.Context.offsetHeight;
        }
    }

    public Show() {
        if (!this.Context.classList.contains("minimized")) return;
        this.Context.classList.toggle("minimized");
    }

    public Hide() {
        if (this.Context.classList.contains("minimized")) return;
        this.Context.classList.toggle("minimized");
    }

    public Destroy() {
        this.Context.remove();
    }
    // #endregion Window actions

    // #region Movement events
    public onMoveEvent(callback: MoveListenerCallback) {
        this._onMoveListener.push(callback);
    }

    private dragMouseDown(e: MouseEvent) {
        // get the mouse cursor position at startup:
        this._pos3 = e.pageX;
        this._pos4 = e.pageY;
        document.querySelectorAll(".draggable.focus").forEach(el => {
            el.classList.remove("focus");
        });
        this.Context.classList.add("focus");

        document.addEventListener("mouseup", this._onElementDragClose);
        document.addEventListener("mousemove", this._onElementDrag);
        document.addEventListener("mouseleave", this._onElementLeave);
    }

    private elementDrag(e: MouseEvent) {
        this.Context.classList.remove("maximized");

        // calculate the new cursor position:
        this._pos1 = this._pos3 - e.pageX;
        this._pos2 = this._pos4 - e.pageY;

        this._pos3 = e.pageX;
        this._pos4 = e.pageY;

        const x: number = this.Context.offsetLeft - this._pos1;
        const y: number = this.Context.offsetTop - this._pos2;

        // const bounds = this.Context.getBoundingClientRect();
        // const x: number = bounds.x - this._pos1;
        // const y: number = bounds.y - this._pos2;

        this.Move(x, y);
        this._onMoveListener.forEach(fn => fn(x, y));
    }

    private closeDragElement() {
        this.Context.classList.remove("focus");

        document.removeEventListener("mouseup", this._onElementDragClose);
        document.removeEventListener("mousemove", this._onElementDrag);
        document.removeEventListener("mouseleave", this._onElementLeave);
    }

    private mouseLeaveScreen() {
        this.closeDragElement();
    }
    // #endregion Movement events
}
