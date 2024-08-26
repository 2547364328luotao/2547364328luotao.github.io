/*
 * @Author: 2547364328luotao 2547364328@qq.com
 * @Date: 2024-08-26 23:14:02
 * @LastEditors: 2547364328luotao 2547364328@qq.com
 * @LastEditTime: 2024-08-27 00:18:46
 * @FilePath: \hexo\heo\source\js\cursor.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) { }
    return "";
};

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        // 这里改变鼠标指针的颜色 由svg生成
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
<path d="M 9 2.59375 L 9 28.15625 L 10.65625 26.78125 L 14.6875 23.40625 L 16.71875 27.4375 L 17.15625 28.34375 L 18.0625 27.875 L 21.15625 26.28125 L 22.03125 25.84375 L 21.59375 24.9375 L 19.75 21.3125 L 24.8125 20.6875 L 26.84375 20.4375 L 25.40625 19 L 10.71875 4.28125 Z M 11 7.4375 L 22.5625 18.96875 L 18.0625 19.5 L 16.65625 19.6875 L 17.3125 20.96875 L 19.375 24.96875 L 18.0625 25.65625 L 15.90625 21.34375 L 15.3125 20.21875 L 14.34375 21.03125 L 11 23.84375 Z"></path>
</svg>") 4 4, auto}`;
        //<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='1.0' fill='rgb(57, 197, 187)'/></svg>
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = { curr: null, prev: null };
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove = e => { (this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = { x: e.clientX - 8, y: e.clientY - 8 }; this.cursor.classList.remove("hidden"); };
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown = e => this.cursor.classList.add("active");
        document.onmouseup = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();