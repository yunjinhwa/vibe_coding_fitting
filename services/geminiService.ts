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
            text: `당신의 임무는 '가상 피팅'입니다. 제공된 3개의 이미지를 사용해 다음의 엄격한 규칙에 따라 단일 결과 이미지를 생성하세요.

- **이미지 1**: 수정 대상이 되는 '인물' 사진입니다.
- **이미지 2**: 인물이 입을 '상의' 의류 사진입니다.
- **이미지 3**: 인물이 입을 '하의' 의류 사진입니다.

**규칙:**
1. **결과물은 오직 한 명의 인물만 포함해야 합니다.** 이 인물은 반드시 **이미지 1의 인물**이어야 합니다. 두 번째 인물을 절대 추가하지 마세요.
2. **이미지 1의 인물을 '수정'하세요.** 새로운 인물을 만들지 마세요.
3. **인물의 얼굴, 머리 스타일, 포즈, 신체, 그리고 배경은 이미지 1의 것과 완벽하게 동일하게 유지해야 합니다.**
4. **오직 옷만 변경하세요.** 이미지 1의 인물이 입고 있는 옷을 이미지 2의 상의와 이미지 3의 하의로 자연스럽게 교체하세요. 최종 결과는 매우 사실적이어야 합니다.`,
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
