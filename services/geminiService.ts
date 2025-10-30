
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateFashionImage(
  personImageBase64: string,
  personImageMimeType: string,
  clothingImageBase64: string,
  clothingImageMimeType: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: personImageBase64,
              mimeType: personImageMimeType,
            },
          },
          {
            inlineData: {
              data: clothingImageBase64,
              mimeType: clothingImageMimeType,
            },
          },
          {
            text: '첫 번째 이미지의 인물에게 두 번째 이미지의 옷을 자연스럽게 입혀주세요. 원본 인물의 얼굴과 배경은 최대한 유지해주세요.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the API response.");
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error(
      "The AI model failed to process the images. Please try again with different images."
    );
  }
}
