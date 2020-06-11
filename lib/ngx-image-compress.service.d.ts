import { RendererFactory2 } from '@angular/core';
import { DOC_ORIENTATION } from './DOC_ORIENTATION';
export declare class NgxImageCompressService {
    private render;
    DOC_ORIENTATION: typeof DOC_ORIENTATION;
    constructor(rendererFactory: RendererFactory2);
    byteCount(image: any): number;
    uploadFile(): Promise<{
        image: string;
        orientation: DOC_ORIENTATION;
    }>;
    compressFile(image: any, orientation: any, ratio?: number, quality?: number): Promise<string>;
}
