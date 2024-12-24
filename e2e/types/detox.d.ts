declare module 'detox' {
  export const device: {
    launchApp: (config: { newInstance?: boolean; delete?: boolean; permissions?: { [key: string]: string } }) => Promise<void>;
    reloadReactNative: () => Promise<void>;
  };

  export const element: (matcher: any) => {
    tap: () => Promise<void>;
    typeText: (text: string) => Promise<void>;
    clearText: () => Promise<void>;
    scroll: (pixels: number, direction: 'up' | 'down') => Promise<void>;
    scrollTo: (direction: 'top' | 'bottom') => Promise<void>;
    swipe: (direction: 'up' | 'down' | 'left' | 'right', speed?: 'slow' | 'fast') => Promise<void>;
    isVisible: () => Promise<boolean>;
  };

  export const by: {
    id: (id: string) => any;
    type: (type: string) => any;
    text: (text: string) => any;
    label: (label: string) => any;
    traits: (traits: string[]) => any;
    placeholder: (placeholder: string) => any;
  };

  export const expect: (element: ReturnType<typeof element>) => {
    toBeVisible: () => Promise<void>;
    toExist: () => Promise<void>;
    not: {
      toBeVisible: () => Promise<void>;
      toExist: () => Promise<void>;
    };
    toHaveText: (text: string) => Promise<void>;
    toHaveValue: (value: string) => Promise<void>;
  };

  export const waitFor: (element: ReturnType<typeof element>) => {
    toBeVisible: (timeout?: number) => Promise<void>;
    toExist: (timeout?: number) => Promise<void>;
    not: {
      toBeVisible: (timeout?: number) => Promise<void>;
      toExist: (timeout?: number) => Promise<void>;
    };
  };
}