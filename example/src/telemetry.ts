export interface Tracer {
  startRootSpan(name: string): void;
}

export class MyTracer implements Tracer {
  startRootSpan(name: string) {
    console.log(`Start span: ${name}`);
  }
}
