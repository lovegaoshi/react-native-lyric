interface ExecWhenTrue {
  loopCheck: () => Promise<boolean>;
  executeFn: () => unknown;
  catchFn?: () => unknown;
  wait?: number;
  loopGuard?: number;
  funcName?: string;
}

export const execWhenTrue = async ({
  loopCheck,
  executeFn,
  catchFn,
  wait = 50,
  loopGuard = 100,
}: ExecWhenTrue) => {
  let loops = 0;
  while (!(await loopCheck())) {
    await new Promise((res) => setTimeout(() => res(() => undefined), wait));
    loops += 1;
    if (loops > loopGuard) {
      return catchFn?.();
    }
  }
  return executeFn();
};
