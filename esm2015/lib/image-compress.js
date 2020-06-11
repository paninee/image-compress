/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DOC_ORIENTATION } from './DOC_ORIENTATION';
export class ImageCompress {
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
                            resolve({ image: (/** @type {?} */ (myReader.result)), orientation, file });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtY29tcHJlc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtY29tcHJlc3MvIiwic291cmNlcyI6WyJsaWIvaW1hZ2UtY29tcHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVuRCxNQUFNLE9BQU8sYUFBYTs7Ozs7OztJQU14QixNQUFNLENBQUMsY0FBYyxDQUFDLElBQVUsRUFBRSxRQUEyQzs7Y0FDckUsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLENBQUMsTUFBTTs7OztZQUFHLFVBQVUsTUFBTTs7c0JBQ3hCLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxtQkFBQSxNQUFNLENBQUMsTUFBTSxFQUFlLENBQUM7Z0JBQ3ZELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssTUFBTSxFQUFFO29CQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQUU7O3NCQUMzRCxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVU7O29CQUMxQixNQUFNLEdBQUcsQ0FBQztnQkFDZCxPQUFPLE1BQU0sR0FBRyxNQUFNLEVBQUU7OzBCQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO29CQUM1QyxNQUFNLElBQUksQ0FBQyxDQUFDO29CQUNaLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTt3QkFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssVUFBVSxFQUFFOzRCQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQUU7OzhCQUN6RSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLEtB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O0lBQ2pCLENBQUM7Ozs7OztJQU9ELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBUztRQUN4QixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JlbmRlcmVyMn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NfT1JJRU5UQVRJT04gfSBmcm9tICcuL0RPQ19PUklFTlRBVElPTidcblxuZXhwb3J0IGNsYXNzIEltYWdlQ29tcHJlc3Mge1xuXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29ycmVjdCBPcmllbnRhdGlvbiB2YWx1ZSBmcm9tIHRhZ3MsIGluIG9yZGVyIHRvIHdyaXRlIGNvcnJlY3RseSBpbiBvdXIgY2FudmFzXG4gICAqL1xuICBzdGF0aWMgZ2V0T3JpZW50YXRpb24oZmlsZTogRmlsZSwgY2FsbGJhY2s6IChyZXN1bHQ6IERPQ19PUklFTlRBVElPTikgPT4gdm9pZCkge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcocmVhZGVyLnJlc3VsdCBhcyBBcnJheUJ1ZmZlcik7XG4gICAgICAgIGlmICh2aWV3LmdldFVpbnQxNigwLCBmYWxzZSkgIT09IDB4RkZEOCkgeyByZXR1cm4gY2FsbGJhY2soLTIpOyB9XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHZpZXcuYnl0ZUxlbmd0aDtcbiAgICAgICAgbGV0IG9mZnNldCA9IDI7XG4gICAgICAgIHdoaWxlIChvZmZzZXQgPCBsZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBtYXJrZXIgPSB2aWV3LmdldFVpbnQxNihvZmZzZXQsIGZhbHNlKTtcbiAgICAgICAgICBvZmZzZXQgKz0gMjtcbiAgICAgICAgICBpZiAobWFya2VyID09PSAweEZGRTEpIHtcbiAgICAgICAgICAgIGlmICh2aWV3LmdldFVpbnQzMihvZmZzZXQgKz0gMiwgZmFsc2UpICE9PSAweDQ1Nzg2OTY2KSB7IHJldHVybiBjYWxsYmFjaygtMSk7IH1cbiAgICAgICAgICAgIGNvbnN0IGxpdHRsZSA9IHZpZXcuZ2V0VWludDE2KG9mZnNldCArPSA2LCBmYWxzZSkgPT09IDB4NDk0OTtcbiAgICAgICAgICAgIG9mZnNldCArPSB2aWV3LmdldFVpbnQzMihvZmZzZXQgKyA0LCBsaXR0bGUpO1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IHZpZXcuZ2V0VWludDE2KG9mZnNldCwgbGl0dGxlKTtcbiAgICAgICAgICAgIG9mZnNldCArPSAyO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdzOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09PSAweDAxMTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoKG1hcmtlciAmIDB4RkYwMCkgIT09IDB4RkYwMCkgeyBicmVhazsgfSBlbHNlIHsgb2Zmc2V0ICs9IHZpZXcuZ2V0VWludDE2KG9mZnNldCwgZmFsc2UpOyB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKC0xKTtcbiAgICAgIH07XG4gICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKDApO1xuICAgIH1cblxuICB9XG5cblxuICAvKipcbiAgICogcmV0dXJuIGEgcHJvbWlzZSB3aXRoIHRoZSBuZXcgaW1hZ2UgZGF0YSBhbmQgaW1hZ2Ugb3JpZW50YXRpb25cbiAgICovXG4gIHN0YXRpYyB1cGxvYWRGaWxlKHJlbmRlcjogUmVuZGVyZXIyKTpQcm9taXNlPHtpbWFnZTogc3RyaW5nLCBvcmllbnRhdGlvbjogRE9DX09SSUVOVEFUSU9OLCBmaWxlOiBhbnl9PiB7XG5cbiAgICBjb25zdCBwcm9taXNlOiBQcm9taXNlPHtpbWFnZTogc3RyaW5nLCBvcmllbnRhdGlvbjogRE9DX09SSUVOVEFUSU9OLCBmaWxlOiBhbnl9PiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBjb25zdCBpbnB1dEVsZW1lbnQgPSByZW5kZXIuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIHJlbmRlci5zZXRTdHlsZShpbnB1dEVsZW1lbnQsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgIHJlbmRlci5zZXRQcm9wZXJ0eShpbnB1dEVsZW1lbnQsICd0eXBlJywgJ2ZpbGUnKTtcbiAgICAgIHJlbmRlci5zZXRQcm9wZXJ0eShpbnB1dEVsZW1lbnQsICdhY2NlcHQnLCAnaW1hZ2UvKicpO1xuXG4gICAgICByZW5kZXIubGlzdGVuKGlucHV0RWxlbWVudCwgJ2NsaWNrJywgKCRldmVudCkgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdNb3VzZUV2ZW50OicsICRldmVudCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ0lucHV0OicsICRldmVudC50YXJnZXQpO1xuICAgICAgICAkZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbDtcbiAgICAgIH0pO1xuXG5cbiAgICAgIHJlbmRlci5saXN0ZW4oaW5wdXRFbGVtZW50LCAnY2hhbmdlJywgKCRldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlOiBGaWxlID0gJGV2ZW50LnRhcmdldC5maWxlc1swXTtcblxuICAgICAgICBjb25zdCBteVJlYWRlcjogRmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgbXlSZWFkZXIub25sb2FkZW5kID0gKGUpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgSW1hZ2VDb21wcmVzcy5nZXRPcmllbnRhdGlvbihmaWxlLCBvcmllbnRhdGlvbiA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUoe2ltYWdlOm15UmVhZGVyLnJlc3VsdCBhcyBzdHJpbmcsIG9yaWVudGF0aW9uLCBmaWxlfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBuZ3gtaW1hZ2UtY29tcHJlc3MgZXJyb3IgJHtlfWApO1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIG15UmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYG5neC1pbWFnZS1jb21wcmVzcyAtIHByb2JhYmx5IG5vIGZpbGUgaGF2ZSBiZWVuIHNlbGVjdGVkOiAke2V9YCk7XG4gICAgICAgICAgcmVqZWN0KFwiTm8gZmlsZSBzZWxlY3RlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXRFbGVtZW50KTtcbiAgICAgIGlucHV0RWxlbWVudC5jbGljaygpO1xuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG5cbiAgc3RhdGljIGNvbXByZXNzKGltYWdlRGF0YVVybFNvdXJjZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgb3JpZW50YXRpb246IERPQ19PUklFTlRBVElPTixcbiAgICAgICAgICAgICAgICAgIHJlbmRlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICAgICAgcmF0aW86IG51bWJlciA9IDUwLFxuICAgICAgICAgICAgICAgICAgcXVhbGl0eTogbnVtYmVyID0gNTApOiBQcm9taXNlPHN0cmluZz4ge1xuXG4gICAgY29uc3QgcHJvbWlzZTogUHJvbWlzZTxzdHJpbmc+ID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIHF1YWxpdHkgPSBxdWFsaXR5IC8gMTAwO1xuICAgICAgcmF0aW8gPSByYXRpbyAvIDEwMDtcbiAgICAgIGNvbnN0IHNvdXJjZUltYWdlID0gbmV3IEltYWdlKCk7XG5cbiAgICAgIC8vIGltcG9ydGFudCBmb3Igc2FmYXJpOiB3ZSBuZWVkIHRvIHdhaXQgZm9yIG9ubG9hZCBldmVudFxuICAgICAgc291cmNlSW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gcmVuZGVyLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjb25zdCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIGxldCB3LCBoO1xuICAgICAgICB3ID0gc291cmNlSW1hZ2UubmF0dXJhbFdpZHRoO1xuICAgICAgICBoID0gc291cmNlSW1hZ2UubmF0dXJhbEhlaWdodDtcblxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IERPQ19PUklFTlRBVElPTi5SaWdodCB8fCBvcmllbnRhdGlvbiA9PT0gRE9DX09SSUVOVEFUSU9OLkxlZnQpIHtcbiAgICAgICAgICBjb25zdCB0ID0gdztcbiAgICAgICAgICB3ID0gaDtcbiAgICAgICAgICBoID0gdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHcgKiByYXRpbztcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGggKiByYXRpbztcblxuXG4gICAgICAgIGNvbnN0IFRPX1JBRElBTlMgPSBNYXRoLlBJIC8gMTgwO1xuXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gRE9DX09SSUVOVEFUSU9OLlVwKSB7XG5cbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHNvdXJjZUltYWdlLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IERPQ19PUklFTlRBVElPTi5SaWdodCkge1xuXG4gICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICBjdHgucm90YXRlKDkwICogVE9fUkFESUFOUyk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtY2FudmFzLndpZHRoKTtcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHNvdXJjZUltYWdlLCAwLCAwLCBjYW52YXMuaGVpZ2h0LCBjYW52YXMud2lkdGgpO1xuICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gRE9DX09SSUVOVEFUSU9OLkxlZnQpIHtcblxuICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgtOTAgKiBUT19SQURJQU5TKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC1jYW52YXMud2lkdGgsIDApO1xuICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uoc291cmNlSW1hZ2UsIDAsIDAsIGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgY3R4LnJlc3RvcmUoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBET0NfT1JJRU5UQVRJT04uRG93bikge1xuXG4gICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICBjdHgucm90YXRlKDE4MCAqIFRPX1JBRElBTlMpO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoLWNhbnZhcy53aWR0aCwgLWNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uoc291cmNlSW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgY3R4LnJlc3RvcmUoKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vY29uc29sZS53YXJuKCduZ3gtaW1hZ2UtY29tcHJlc3MgLSBubyBvcmllbnRhdGlvbiB2YWx1ZSBmb3VuZCcpO1xuICAgICAgICAgIC8vIHNhbWUgYXMgZGVmYXVsdCBVUFxuICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uoc291cmNlSW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IG1pbWUgPSBpbWFnZURhdGFVcmxTb3VyY2Uuc3Vic3RyKDUsIGltYWdlRGF0YVVybFNvdXJjZS5zcGxpdCgnOycpWzBdLmxlbmd0aCAtIDUpO1xuICAgICAgICAvLyBUT0RPIHRlc3Qgb24gbWltZVxuICAgICAgICBjb25zdCByZXN1bHQgPSBjYW52YXMudG9EYXRhVVJMKG1pbWUsIHF1YWxpdHkpO1xuXG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcblxuICAgICAgfTtcblxuICAgICAgc291cmNlSW1hZ2Uuc3JjID0gaW1hZ2VEYXRhVXJsU291cmNlO1xuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIGhlbHBlciB0byBldmFsdWF0ZSB0aGUgY29tcHJlc3Npb24gcmF0ZVxuICAgKiBAcGFyYW0gcyB0aGUgaW1hZ2UgaW4gYmFzZTY0IHN0cmluZyBmb3JtYXRcbiAgICovXG4gIHN0YXRpYyBieXRlQ291bnQoczogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJKHMpLnNwbGl0KC8lLi58Li8pLmxlbmd0aCAtIDE7XG4gIH1cblxufVxuIl19