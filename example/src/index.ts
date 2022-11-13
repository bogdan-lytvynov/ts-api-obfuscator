import { MyTelemetryService } from './telemetry';
import type { TelemetryService } from './telemetry';

function main() {
  const telemetry: TelemetryService = new MyTelemetryService();

  telemetry.startSpan("main_span");
  console.log("It is main!");
}

main();
