interface ClipboardData {
  type: string;
  data: any;
}

export class ClipboardManager {
  private static instance: ClipboardManager;
  private clipboard: ClipboardData | null = null;

  private constructor() {}

  public static getInstance(): ClipboardManager {
    if (!ClipboardManager.instance) {
      ClipboardManager.instance = new ClipboardManager();
    }
    return ClipboardManager.instance;
  }

  public copy(type: string, data: any) {
    this.clipboard = { type, data };
  }

  public paste(): ClipboardData | null {
    return this.clipboard;
  }

  public clear() {
    this.clipboard = null;
  }
} 