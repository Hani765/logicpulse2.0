import FastSpeedtest from "fast-speedtest-api";

interface SpeedTestResult {
  download: number | null;
  upload: number | null;
}

export const getSpeed = async (): Promise<SpeedTestResult> => {
  const speedtest = new FastSpeedtest({
    token: "2sB3HB0fVmVMkPbrBNBaG-e6mPZQb5zLWVwRhA", // replace with your Fast.com API token
    verbose: false,
    timeout: 5000,
    https: true,
    urlCount: 5,
    bufferSize: 8,
    unit: FastSpeedtest.UNITS.Mbps,
  });

  try {
    const downloadSpeed = await speedtest.getSpeed();
    return { download: downloadSpeed, upload: null }; // fast-speedtest-api currently supports only download speed
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("An unknown error occurred:", e);
    }
    return { download: 0, upload: 0 };
  }
};
