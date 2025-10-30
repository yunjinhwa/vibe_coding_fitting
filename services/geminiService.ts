
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageState } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateFashionImage(
  personImage: ImageState,
  topImage: ImageState,
  bottomImage: ImageState
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: personImage.base64,
              mimeType: personImage.mimeType,
            },
          },
          {
            inlineData: {
              data: topImage.base64,
              mimeType: topImage.mimeType,
            },
          },
          {
            inlineData: {
              data: bottomImage.base64,
              mimeType: bottomImage.mimeType,
            },
          },
          {
            text: '첫 번째 이미지의 인물에게 두 번째 이미지의 상의와 세 번째 이미지의 하의를 자연스럽게 입혀주세요. 원본 인물의 얼굴과 배경은 최대한 유지해주세요.',
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
