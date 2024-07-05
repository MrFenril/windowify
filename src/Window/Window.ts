import "./Window.css";

export interface IWindowOption {
    windowTitle?: string;
    id?: string;
    x: number;
    y: number;
    windowActions?: WindowActionElement[];
    subHeader?: SubHeaderElement[];
    width?: number;
    height?: number;
    parent?: HTMLElement | string | null;
    context?: HTMLElement;
    resizeable?: boolean;
}

type MoveListenerCallback = (x: number, y: number) => void;
type WindowActionElement = (window: Window, headerActionOverlay: HTMLElement) => Element;
type SubHeaderElement = (window: Window, headerActionOverlay: HTMLElement) => HTMLElement;

export class Window {
    public _windowTitle!: string;

    protected _context!: HTMLElement;
    protected _parent!: HTMLElement | null;
    protected _header: HTMLElement;
    protected _content: HTMLElement;
    protected _windowActions: WindowActionElement[];

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
        this._options = options;

        const {
            context,
            parent = null,
            windowActions = [],
            width = 100,
            height = 100,
            x = 0,
            y = 0,
            resizeable = false,
        } = this._options;
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

        if (this._windowActions.length) {
            const actionsHeader = document.createElement("div");
            this._windowActions.forEach(windowAction => {
                const el = windowAction(this, actionsHeader);
                actionsHeader.appendChild(el);
            });
            actionsHeader.classList.add("header-actions-overlay");
            windowHeader.appendChild(actionsHeader);
        }

        return windowHeader;
    }

    protected Init(width: number, height: number, resizeable: boolean) {
        if (resizeable) this.Context.classList.add("resizeable-draggable");

        this.Content.setAttribute("data-simplebar", "");

        this.Context.classList.add("draggable");
        this.Context.style.width = `${width}px`;
        this.Context.style.height = `${height}px`;

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
    public Move(x: number, y: number, clamp: boolean = false) {
        this.Context.style.left = x + "px";
        this.Context.style.top = y + "px";

        // Clamping not enabled, we don't have to check positions
        if (!clamp) return;

        if (this.Context.offsetLeft < 0) this.Context.style.left = "0px";
        if (this.Context.offsetTop < 0) this.Context.style.top = "0px";
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
