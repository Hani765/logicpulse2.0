export async function fetchData({
  token,
  endPoint,
}: {
  token: string;
  endPoint: string;
}) {
  try {
    const res = await fetch(endPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        data: null,
        message: "Failed to fetch data. Please try again later.",
      };
    }

    const data = await res.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      message: "Unknown error occurred. Please try again later.",
    };
  }
}
