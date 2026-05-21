export class SplitText {
  elements: HTMLElement[] = [];
  originalHTMLs: Map<HTMLElement, string> = new Map();
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];

  constructor(
    target: any,
    options?: { type?: string; linesClass?: string }
  ) {
    if (typeof target === "string") {
      this.elements = Array.from(document.querySelectorAll(target)) as HTMLElement[];
    } else if (Array.isArray(target)) {
      this.elements = [];
      target.forEach((t) => {
        if (typeof t === "string") {
          this.elements.push(...(Array.from(document.querySelectorAll(t)) as HTMLElement[]));
        } else if (t instanceof HTMLElement || t instanceof Element) {
          this.elements.push(t as HTMLElement);
        }
      });
    } else if (target instanceof HTMLElement || target instanceof Element) {
      this.elements = [target as HTMLElement];
    } else if (target instanceof NodeList) {
      this.elements = Array.from(target) as HTMLElement[];
    }
    this.split(options);
  }

  private split(options?: { type?: string; linesClass?: string }) {
    const types = options?.type ? options.type.split(",") : ["words", "chars"];
    const linesClass = options?.linesClass || "";

    this.elements.forEach((el) => {
      if (!this.originalHTMLs.has(el)) {
        this.originalHTMLs.set(el, el.innerHTML);
      }

      this.splitNode(el, types, linesClass);
    });
  }

  private splitNode(el: HTMLElement, types: string[], linesClass: string) {
    const childNodes = Array.from(el.childNodes);
    el.innerHTML = "";

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const wordsArray = text.split(/(\s+)/);

        wordsArray.forEach((part) => {
          if (part === "") return;
          if (/^\s+$/.test(part)) {
            el.appendChild(document.createTextNode(part));
          } else {
            const wordSpan = document.createElement("span");
            wordSpan.style.display = "inline-block";
            wordSpan.style.overflow = "hidden";
            wordSpan.style.verticalAlign = "bottom";
            if (linesClass) {
              wordSpan.classList.add(linesClass);
            }
            this.words.push(wordSpan);

            if (types.includes("chars") || types.includes("char")) {
              const charsArray = part.split("");
              charsArray.forEach((char) => {
                const charSpan = document.createElement("span");
                charSpan.style.display = "inline-block";
                charSpan.textContent = char;
                this.chars.push(charSpan);
                wordSpan.appendChild(charSpan);
              });
            } else {
              wordSpan.textContent = part;
            }
            el.appendChild(wordSpan);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elementNode = node as HTMLElement;
        if (elementNode.tagName === "BR") {
          el.appendChild(elementNode);
        } else {
          // Recursively split the element node, keeping it in the hierarchy
          this.splitNode(elementNode, types, linesClass);
          el.appendChild(elementNode);
        }
      }
    });
  }

  revert() {
    this.elements.forEach((el) => {
      const orig = this.originalHTMLs.get(el);
      if (orig !== undefined) {
        el.innerHTML = orig;
      }
    });
    this.chars = [];
    this.words = [];
  }
}
