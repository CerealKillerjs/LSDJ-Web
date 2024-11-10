interface ClipboardData {
  type: 'phrase' | 'chain' | 'table';
  data: any;
}

class ClipboardManager {
  private static instance: ClipboardManager;
  private clipboard: ClipboardData | null = null;

  private constructor() {}

  public static getInstance(): ClipboardManager {
    if (!ClipboardManager.instance) {
      ClipboardManager.instance = new ClipboardManager();
    }
    return ClipboardManager.instance;
  }

  public copy(type: ClipboardData['type'], data: any) {
    this.clipboard = { type, data };
  }

  public paste(): ClipboardData | null {
    return this.clipboard;
  }

  public clear() {
    this.clipboard = null;
  }

  public hasData(): boolean {
    return this.clipboard !== null;
  }

  public getType(): ClipboardData['type'] | null {
    return this.clipboard?.type || null;
  }
}

export const clipboard = ClipboardManager.getInstance(); 