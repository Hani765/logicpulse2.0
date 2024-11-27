declare module "fast-speedtest-api" {
  class FastSpeedtest {
    constructor(options: FastSpeedtest.Options);
    getSpeed(): Promise<number>;
  }

  namespace FastSpeedtest {
    interface Options {
      token: string;
      verbose?: boolean;
      timeout?: number;
      https?: boolean;
      urlCount?: number;
      bufferSize?: number;
      unit?: "bps" | "Kbps" | "Mbps" | "Gbps";
    }

    const UNITS: {
      bps: "bps";
      Kbps: "Kbps";
      Mbps: "Mbps";
      Gbps: "Gbps";
    };
  }

  export = FastSpeedtest;
}
