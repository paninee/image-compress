import { Renderer2 } from '@angular/core';
import { DOC_ORIENTATION } from './DOC_ORIENTATION';
export declare class ImageCompress {
    /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     */
    static getOrientation(file: File, callback: (result: DOC_ORIENTATION) => void): void;
    /**
     * return a promise with the new image data and image orientation
     */
    static uploadFile(render: Renderer2): Promise<{
        image: string;
        orientation: DOC_ORIENTATION;
    }>;
    static compress(imageDataUrlSource: string, orientation: DOC_ORIENTATION, render: Renderer2, ratio?: number, quality?: number): Promise<string>;
    /**
     * helper to evaluate the compression rate
     * @param s the image in base64 string format
     */
    static byteCount(s: string): number;
}
