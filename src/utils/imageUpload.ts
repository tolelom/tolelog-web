import { IMAGE_CONSTRAINTS } from '../lib/constants';
import { IMAGE_API } from '../lib/api';
import type { ImageValidationResult } from '../types';
import { resolveAssetUrl } from '../lib/assetUrl';

export const validateImageFile = (file: File): ImageValidationResult => {
    if (!(IMAGE_CONSTRAINTS.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
        return {
            valid: false,
            error: 'JPG, PNG, GIF, WebP 형식만 지원합니다.'
        };
    }

    if (file.size > IMAGE_CONSTRAINTS.MAX_SIZE) {
        return {
            valid: false,
            error: '파일 크기는 5MB 이하여야 합니다.'
        };
    }

    return { valid: true };
};

const COMPRESS_FAILED_MESSAGE = '이미지를 읽지 못했습니다. 다른 파일로 시도해 주세요.';

export const compressImage = async (
    file: File,
    maxWidth: number = IMAGE_CONSTRAINTS.MAX_WIDTH,
    quality: number = IMAGE_CONSTRAINTS.QUALITY
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const fail = () => reject(new Error(COMPRESS_FAILED_MESSAGE));
        const reader = new FileReader();
        reader.onerror = fail;
        reader.onload = () => {
            const img = new Image();
            img.onerror = fail;
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return fail();
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => (blob ? resolve(new File([blob], file.name, { type: 'image/jpeg' })) : fail()),
                    'image/jpeg',
                    quality
                );
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    });
};

export const uploadImageToServer = async (file: File, token: string): Promise<string> => {
    const response = await IMAGE_API.upload(file, token);
    if (response.status === 'success') {
        return resolveAssetUrl(response.data.url);
    }
    throw new Error('이미지 업로드에 실패했습니다');
};
