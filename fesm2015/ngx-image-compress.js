import { Injectable, RendererFactory2 } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const DOC_ORIENTATION = {
    Up: 1,
    Down: 3,
    Right: 6,
    Left: 8,
    UpMirrored: 2,
    DownMirrored: 4,
    LeftMirrored: 5,
    RightMirrored: 7,
    NotJpeg: -1,
    NotDefined: -2,
};
DOC_ORIENTATION[DOC_ORIENTATION.Up] = 'Up';
DOC_ORIENTATION[DOC_ORIENTATION.Down] = 'Down';
DOC_ORIENTATION[DOC_ORIENTATION.Right] = 'Right';
DOC_ORIENTATION[DOC_ORIENTATION.Left] = 'Left';
DOC_ORIENTATION[DOC_ORIENTATION.UpMirrored] = 'UpMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.DownMirrored] = 'DownMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.LeftMirrored] = 'LeftMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.RightMirrored] = 'RightMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.NotJpeg] = 'NotJpeg';
DOC_ORIENTATION[DOC_ORIENTATION.NotDefined] = 'NotDefined';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ImageCompress {
    /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     * @param {?} file
     * @param {?} callback
     * @return {?}
     */
    static getOrientation(file, callback) {
        /** @type {?} */
        const reader = new FileReader();
        try {
            reader.onload = (/**
             * @param {?} $event
             * @return {?}
             */
            function ($event) {
                /** @type {?} */
                const view = new DataView((/** @type {?} */ (reader.result)));
                if (view.getUint16(0, false) !== 0xFFD8) {
                    return callback(-2);
                }
                /** @type {?} */
                const length = view.byteLength;
                /** @type {?} */
                let offset = 2;
                while (offset < length) {
                    /** @type {?} */
                    const marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker === 0xFFE1) {
                        if (view.getUint32(offset += 2, false) !== 0x45786966) {
                            return callback(-1);
                        }
                        /** @type {?} */
                        const little = view.getUint16(offset += 6, false) === 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        /** @type {?} */
                        const tags = view.getUint16(offset, little);
                        offset += 2;
                        for (let i = 0; i < tags; i++) {
                            if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                                return callback(view.getUint16(offset + (i * 12) + 8, little));
                            }
                        }
                    }
                    else if ((marker & 0xFF00) !== 0xFF00) {
                        break;
                    }
                    else {
                        offset += view.getUint16(offset, false);
                    }
                }
                return callback(-1);
            });
            reader.readAsArrayBuffer(file);
        }
        catch (e) {
            return callback(0);
        }
    }
    /**
     * return a promise with the new image data and image orientation
     * @param {?} render
     * @return {?}
     */
    static uploadFile(render) {
        /** @type {?} */
        const promise = new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            /** @type {?} */
            const inputElement = render.createElement('input');
            render.setStyle(inputElement, 'display', 'none');
            render.setProperty(inputElement, 'type', 'file');
            render.setProperty(inputElement, 'accept', 'image/*');
            render.listen(inputElement, 'click', (/**
             * @param {?} $event
             * @return {?}
             */
            ($event) => {
                //console.log('MouseEvent:', $event);
                //console.log('Input:', $event.target);
                $event.target.value = null;
            }));
            render.listen(inputElement, 'change', (/**
             * @param {?} $event
             * @return {?}
             */
            ($event) => {
                /** @type {?} */
                const file = $event.target.files[0];
                /** @type {?} */
                const myReader = new FileReader();
                myReader.onloadend = (/**
                 * @param {?} e
                 * @return {?}
                 */
                (e) => {
                    try {
                        ImageCompress.getOrientation(file, (/**
                         * @param {?} orientation
                         * @return {?}
                         */
                        orientation => {
                            resolve({ image: (/** @type {?} */ (myReader.result)), orientation });
                        }));
                    }
                    catch (e) {
                        //console.log(`ngx-image-compress error ${e}`);
                        reject(e);
                    }
                });
                try {
                    myReader.readAsDataURL(file);
                }
                catch (e) {
                    console.warn(`ngx-image-compress - probably no file have been selected: ${e}`);
                    reject("No file selected");
                }
            }));
            document.body.appendChild(inputElement);
            inputElement.click();
        }));
        return promise;
    }
    /**
     * @param {?} imageDataUrlSource
     * @param {?} orientation
     * @param {?} render
     * @param {?=} ratio
     * @param {?=} quality
     * @return {?}
     */
    static compress(imageDataUrlSource, orientation, render, ratio = 50, quality = 50) {
        /** @type {?} */
        const promise = new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            quality = quality / 100;
            ratio = ratio / 100;
            /** @type {?} */
            const sourceImage = new Image();
            // important for safari: we need to wait for onload event
            sourceImage.onload = (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                const canvas = render.createElement('canvas');
                /** @type {?} */
                const ctx = canvas.getContext('2d');
                /** @type {?} */
                let w;
                /** @type {?} */
                let h;
                w = sourceImage.naturalWidth;
                h = sourceImage.naturalHeight;
                if (orientation === DOC_ORIENTATION.Right || orientation === DOC_ORIENTATION.Left) {
                    /** @type {?} */
                    const t = w;
                    w = h;
                    h = t;
                }
                canvas.width = w * ratio;
                canvas.height = h * ratio;
                /** @type {?} */
                const TO_RADIANS = Math.PI / 180;
                if (orientation === DOC_ORIENTATION.Up) {
                    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                }
                else if (orientation === DOC_ORIENTATION.Right) {
                    ctx.save();
                    ctx.rotate(90 * TO_RADIANS);
                    ctx.translate(0, -canvas.width);
                    ctx.drawImage(sourceImage, 0, 0, canvas.height, canvas.width);
                    ctx.restore();
                }
                else if (orientation === DOC_ORIENTATION.Left) {
                    ctx.save();
                    ctx.rotate(-90 * TO_RADIANS);
                    ctx.translate(-canvas.width, 0);
                    ctx.drawImage(sourceImage, 0, 0, canvas.height, canvas.width);
                    ctx.restore();
                }
                else if (orientation === DOC_ORIENTATION.Down) {
                    ctx.save();
                    ctx.rotate(180 * TO_RADIANS);
                    ctx.translate(-canvas.width, -canvas.height);
                    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }
                else {
                    //console.warn('ngx-image-compress - no orientation value found');
                    // same as default UP
                    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                }
                /** @type {?} */
                const mime = imageDataUrlSource.substr(5, imageDataUrlSource.split(';')[0].length - 5);
                // TODO test on mime
                /** @type {?} */
                const result = canvas.toDataURL(mime, quality);
                resolve(result);
            });
            sourceImage.src = imageDataUrlSource;
        }));
        return promise;
    }
    /**
     * helper to evaluate the compression rate
     * @param {?} s the image in base64 string format
     * @return {?}
     */
    static byteCount(s) {
        return encodeURI(s).split(/%..|./).length - 1;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxImageCompressService {
    /**
     * @param {?} rendererFactory
     */
    constructor(rendererFactory) {
        this.DOC_ORIENTATION = DOC_ORIENTATION;
        this.render = rendererFactory.createRenderer(null, null);
    }
    /**
     * @param {?} image
     * @return {?}
     */
    byteCount(image) {
        return ImageCompress.byteCount(image);
    }
    /**
     * @return {?}
     */
    uploadFile() {
        return ImageCompress.uploadFile(this.render);
    }
    /**
     * @param {?} image
     * @param {?} orientation
     * @param {?=} ratio
     * @param {?=} quality
     * @return {?}
     */
    compressFile(image, orientation, ratio = 50, quality = 50) {
        return ImageCompress.compress(image, orientation, this.render, ratio, quality);
    }
}
NgxImageCompressService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgxImageCompressService.ctorParameters = () => [
    { type: RendererFactory2 }
];

export { DOC_ORIENTATION, NgxImageCompressService };
//# sourceMappingURL=ngx-image-compress.js.map
