import { MyTracer } from './telemetry';
import type { Tracer } from './telemetry';

function main() {
  const tracer: Tracer = new MyTracer();

  tracer.startRootSpan("main_span");
  console.log("It is main!");
}

main();
