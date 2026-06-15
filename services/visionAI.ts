const API_KEY = "API_URL";

export async function describeImage(base64Image: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Describe brevemente esta imagen para una persona con discapacidad visual.
Máximo 2 oraciones.
Describe únicamente lo más importante.
Si hay texto visible, menciónalo brevemente.
No inventes detalles.
Sé claro y directo
`,
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "No se pudo describir la imagen."
  );
}
