export interface TelemetryService {
  startSpan(name: string): void;
}

export class MyTelemetryService implements TelemetryService {
  startSpan(name: string) {
    console.log(`Start span: ${name}`);
  }
}
