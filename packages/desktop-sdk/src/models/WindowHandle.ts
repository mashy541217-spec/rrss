export interface WindowHandle {
  hwnd: string;
  processId: number;
  className: string;
  title: string;
  bounds: { x: number; y: number; width: number; height: number };
  isVisible: boolean;
}
