# Installation

```shell
npm install windowified --save
```

# Local installation

```shell
    git clone git@github.com:MrFenril/windowify.git
    cd windowify
    npm install
    npm run dev
```

# Exemple usage

### Creating a new window

`windowified` will automaticly generate DOM elements from a predefined template

```typescript
import "windowified/dist/style.css";
import { Window, Minimizeable, Maximazeable, Closable } from "windowified";

const w = new Window({
    windowTitle: "Window title",
    parent: document.getElementById("app"),
    windowActions: [Minimizeable, Maximazeable, Closable],
    x: 600,
    y: 50,
    resizeable: true,
});
```

### Make existing DOM element draggable

```html
    <div id="my-window">
      <div class="window-header">
      </div>
      <div class="window-content">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lacinia elit at tellus aliquet aliquam. Aenean
          at porta velit. Phasellus felis ex, dapibus ut tristique a, porttitor a mi. Nam molestie odio sit amet
          ullamcorper porttitor. Phasellus mauris orci, elementum quis quam nec, pellentesque venenatis turpis. Maecenas
          sit amet dolor ac purus aliquet vehicula. Ut hendrerit sodales lacus quis molestie. Phasellus sagittis posuere
          elit, sed dapibus nisl eleifend et.
        </div>
        <div>
          Etiam auctor felis eu mauris suscipit elementum. Integer at mi in lectus dapibus condimentum et a mauris.
          Aliquam sed justo accumsan, euismod tellus quis, tincidunt felis. Duis ullamcorper nibh gravida augue finibus
          posuere. Nam nec pharetra dolor. Nam nec molestie elit, sit amet porta massa. Integer vel posuere risus.
          Maecenas rhoncus massa vel dolor feugiat, ac laoreet orci hendrerit.
        </div>
        <div>
          Mauris maximus convallis justo, eget volutpat elit. Sed est augue, dignissim ac ex tincidunt, ullamcorper
          sagittis enim. Etiam auctor mollis mi, quis feugiat metus semper euismod. In in tortor ut eros consectetur
          tincidunt mattis sed dolor. Proin eleifend, mi consectetur pellentesque luctus, augue tortor iaculis leo, quis
          porttitor lectus massa eu erat. Mauris condimentum dolor vitae risus euismod hendrerit. Curabitur vitae
          consequat ipsum, pulvinar porta massa.
        </div>
      </div>
    </div>
  </div>
```

`windowified` will check for `.window-header` and `.window-content`.

After the DOM element defined, all you have to do is give to `Window` the node element you want to make draggable with the parameter `context`.

```typescript
import "windowified/dist/style.css";
import { Window, Minimizeable, Maximazeable, Closable } from "windowified";

const w = new Window({
    windowTitle: "Window Title",
    context: document.getElementById("MainModal2"),
    windowActions: [Closable],
    x: 350,
    y: 50,
    resizeable: true,
});
```
