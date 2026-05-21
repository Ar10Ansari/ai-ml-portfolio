import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

export class ScrollSmoother {
  lenis: Lenis;
  private _paused = false;

  constructor(options: {
    wrapper: string;
    content: string;
    smooth?: number;
    speed?: number;
    effects?: boolean;
    autoResize?: boolean;
    ignoreMobileResize?: boolean;
  }) {
    // ScrollSmoother creates a smooth-scrolling instance using Lenis
    this.lenis = new Lenis({
      lerp: options.smooth ? 0.1 / (options.smooth * 0.5) : 0.1,
      duration: options.smooth ? options.smooth : 1.2,
      smoothWheel: true,
    });

    // Link Lenis scroll event to GSAP ScrollTrigger
    this.lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Add Lenis to GSAP Ticker
    const rafUpdate = (time: number) => {
      this.lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafUpdate);

    // Store custom rafUpdate function to remove it later on kill
    (this as any)._rafUpdate = rafUpdate;
  }

  static create(options: any) {
    return new ScrollSmoother(options);
  }

  static refresh(_force?: boolean) {
    ScrollTrigger.refresh();
  }

  scrollTop(val?: number) {
    if (val !== undefined) {
      this.lenis.scrollTo(val, { immediate: true });
      return val;
    }
    // Return scroll offset
    return window.scrollY || document.documentElement.scrollTop;
  }

  scrollTo(target: any, smooth?: boolean, _position?: string) {
    this.lenis.scrollTo(target, {
      immediate: !smooth,
      duration: smooth ? 1.2 : 0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo out
    });
  }

  paused(val?: boolean): boolean | void {
    if (val !== undefined) {
      this._paused = val;
      if (val) {
        this.lenis.stop();
      } else {
        this.lenis.start();
      }
      return;
    }
    return this._paused;
  }

  kill() {
    if ((this as any)._rafUpdate) {
      gsap.ticker.remove((this as any)._rafUpdate);
    }
    this.lenis.destroy();
  }
}
