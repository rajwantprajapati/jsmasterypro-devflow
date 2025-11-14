export * from "./router.mock";
export * from "./toast.mock";
export * from "./editor.mock";
export * from "./nextauth.mock";
export * from "./editDeleteAction.mock";
export * from "./Image.mock";
export * from "./metric.mock";
export * from "./link.mock";

export const resetAllMocks = () => {
  jest.clearAllMocks();
};
