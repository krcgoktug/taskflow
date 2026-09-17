declare module "frappe-gantt" {
  export type GanttTask = {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies?: string;
    custom_class?: string;
  };

  export type GanttOptions = {
    view_mode?: "Day" | "Week" | "Month" | "Year";
    view_mode_select?: boolean;
    language?: string;
    readonly?: boolean;
    scroll_to?: "today" | "start" | "end" | string;
    lines?: "none" | "vertical" | "horizontal" | "both";
    bar_height?: number;
    column_width?: number;
    container_height?: number | "auto";
  };

  export default class Gantt {
    constructor(
      wrapper: string | HTMLElement | SVGElement,
      tasks: GanttTask[],
      options?: GanttOptions,
    );
  }
}
