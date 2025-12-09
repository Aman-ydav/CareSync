import api from "./axiosInterceptor";

export async function aiImprove(text, context) {
  const res = await api.post("/ai/improve", {
    text,
    context,
  });
  return res.data.result;
}
