/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DOC_ORIENTATION } from './DOC_ORIENTATION';
var ImageCompress = /** @class */ (function () {
    function ImageCompress() {
    }
    /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     */
    /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     * @param {?} file
     * @param {?} callback
     * @return {?}
     */
    ImageCompress.getOrientation = /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     * @param {?} file
     * @param {?} callback
     * @return {?}
     */
    function (file, callback) {
        /** @type {?} */
        var reader = new FileReader();
        try {
            reader.onload = (/**
             * @param {?} $event
             * @return {?}
             */
            function ($event) {
                /** @type {?} */
                var view = new DataView((/** @type {?} */ (reader.result)));
                if (view.getUint16(0, false) !== 0xFFD8) {
                    return callback(-2);
                }
                /** @type {?} */
                var length = view.byteLength;
                /** @type {?} */
                var offset = 2;
                while (offset < length) {
                    /** @type {?} */
                    var marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker === 0xFFE1) {
                        if (view.getUint32(offset += 2, false) !== 0x45786966) {
                            return callback(-1);
                        }
                        /** @type {?} */
                        var little = view.getUint16(offset += 6, false) === 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        /** @type {?} */
                        var tags = view.getUint16(offset, little);
                        offset += 2;
                        for (var i = 0; i < tags; i++) {
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
    };
    /**
     * return a promise with the new image data and image orientation
     */
    /**
     * return a promise with the new image data and image orientation
     * @param {?} render
     * @return {?}
     */
    ImageCompress.uploadFile = /**
     * return a promise with the new image data and image orientation
     * @param {?} render
     * @return {?}
     */
    function (render) {
        /** @type {?} */
        var promise = new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            /** @type {?} */
            var inputElement = render.createElement('input');
            render.setStyle(inputElement, 'display', 'none');
            render.setProperty(inputElement, 'type', 'file');
            render.setProperty(inputElement, 'accept', 'image/*');
            render.listen(inputElement, 'click', (/**
             * @param {?} $event
             * @return {?}
             */
            function ($event) {
                //console.log('MouseEvent:', $event);
                //console.log('Input:', $event.target);
                $event.target.value = null;
            }));
            render.listen(inputElement, 'change', (/**
             * @param {?} $event
             * @return {?}
             */
            function ($event) {
                /** @type {?} */
                var file = $event.target.files[0];
                /** @type {?} */
                var myReader = new FileReader();
                myReader.onloadend = (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) {
                    try {
                        ImageCompress.getOrientation(file, (/**
                         * @param {?} orientation
                         * @return {?}
                         */
                        function (orientation) {
                            resolve({ image: (/** @type {?} */ (myReader.result)), orientation: orientation, file: file });
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
                    console.warn("ngx-image-compress - probably no file have been selected: " + e);
                    reject("No file selected");
                }
            }));
            document.body.appendChild(inputElement);
            inputElement.click();
        }));
        return promise;
    };
    /**
     * @param {?} imageDataUrlSource
     * @param {?} orientation
     * @param {?} render
     * @param {?=} ratio
     * @param {?=} quality
     * @return {?}
     */
    ImageCompress.compress = /**
     * @param {?} imageDataUrlSource
     * @param {?} orientation
     * @param {?} render
     * @param {?=} ratio
     * @param {?=} quality
     * @return {?}
     */
    function (imageDataUrlSource, orientation, render, ratio, quality) {
        if (ratio === void 0) { ratio = 50; }
        if (quality === void 0) { quality = 50; }
        /** @type {?} */
        var promise = new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            quality = quality / 100;
            ratio = ratio / 100;
            /** @type {?} */
            var sourceImage = new Image();
            // important for safari: we need to wait for onload event
            sourceImage.onload = (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var canvas = render.createElement('canvas');
                /** @type {?} */
                var ctx = canvas.getContext('2d');
                /** @type {?} */
                var w;
                /** @type {?} */
                var h;
                w = sourceImage.naturalWidth;
                h = sourceImage.naturalHeight;
                if (orientation === DOC_ORIENTATION.Right || orientation === DOC_ORIENTATION.Left) {
                    /** @type {?} */
                    var t = w;
                    w = h;
                    h = t;
                }
                canvas.width = w * ratio;
                canvas.height = h * ratio;
                /** @type {?} */
                var TO_RADIANS = Math.PI / 180;
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
                var mime = imageDataUrlSource.substr(5, imageDataUrlSource.split(';')[0].length - 5);
                // TODO test on mime
                /** @type {?} */
                var result = canvas.toDataURL(mime, quality);
                resolve(result);
            });
            sourceImage.src = imageDataUrlSource;
        }));
        return promise;
    };
    /**
     * helper to evaluate the compression rate
     * @param s the image in base64 string format
     */
    /**
     * helper to evaluate the compression rate
     * @param {?} s the image in base64 string format
     * @return {?}
     */
    ImageCompress.byteCount = /**
     * helper to evaluate the compression rate
     * @param {?} s the image in base64 string format
     * @return {?}
     */
    function (s) {
        return encodeURI(s).split(/%..|./).length - 1;
    };
    return ImageCompress;
}());
export { ImageCompress };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtY29tcHJlc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtY29tcHJlc3MvIiwic291cmNlcyI6WyJsaWIvaW1hZ2UtY29tcHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVuRDtJQUFBO0lBd0xBLENBQUM7SUFyTEM7O09BRUc7Ozs7Ozs7SUFDSSw0QkFBYzs7Ozs7O0lBQXJCLFVBQXNCLElBQVUsRUFBRSxRQUEyQzs7WUFDckUsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLENBQUMsTUFBTTs7OztZQUFHLFVBQVUsTUFBTTs7b0JBQ3hCLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxtQkFBQSxNQUFNLENBQUMsTUFBTSxFQUFlLENBQUM7Z0JBQ3ZELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssTUFBTSxFQUFFO29CQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQUU7O29CQUMzRCxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVU7O29CQUMxQixNQUFNLEdBQUcsQ0FBQztnQkFDZCxPQUFPLE1BQU0sR0FBRyxNQUFNLEVBQUU7O3dCQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO29CQUM1QyxNQUFNLElBQUksQ0FBQyxDQUFDO29CQUNaLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTt3QkFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssVUFBVSxFQUFFOzRCQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQUU7OzRCQUN6RSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElB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QUM7UUFFdkMsQ0FBQyxFQUFDO1FBRUYsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUdEOzs7T0FHRzs7Ozs7O0lBQ0ksdUJBQVM7Ozs7O0lBQWhCLFVBQWlCLENBQVM7UUFDeEIsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVILG9CQUFDO0FBQUQsQ0FBQyxBQXhMRCxJQXdMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVuZGVyZXIyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ19PUklFTlRBVElPTiB9IGZyb20gJy4vRE9DX09SSUVOVEFUSU9OJ1xuXG5leHBvcnQgY2xhc3MgSW1hZ2VDb21wcmVzcyB7XG5cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3JyZWN0IE9yaWVudGF0aW9uIHZhbHVlIGZyb20gdGFncywgaW4gb3JkZXIgdG8gd3JpdGUgY29ycmVjdGx5IGluIG91ciBjYW52YXNcbiAgICovXG4gIHN0YXRpYyBnZXRPcmllbnRhdGlvbihmaWxlOiBGaWxlLCBjYWxsYmFjazogKHJlc3VsdDogRE9DX09SSUVOVEFUSU9OKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICB0cnkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgY29uc3QgdmlldyA9IG5ldyBEYXRhVmlldyhyZWFkZXIucmVzdWx0IGFzIEFycmF5QnVmZmVyKTtcbiAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KDAsIGZhbHNlKSAhPT0gMHhGRkQ4KSB7IHJldHVybiBjYWxsYmFjaygtMik7IH1cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gMjtcbiAgICAgICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlciA9IHZpZXcuZ2V0VWludDE2KG9mZnNldCwgZmFsc2UpO1xuICAgICAgICAgIG9mZnNldCArPSAyO1xuICAgICAgICAgIGlmIChtYXJrZXIgPT09IDB4RkZFMSkge1xuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDMyKG9mZnNldCArPSAyLCBmYWxzZSkgIT09IDB4NDU3ODY5NjYpIHsgcmV0dXJuIGNhbGxiYWNrKC0xKTsgfVxuICAgICAgICAgICAgY29uc3QgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PT0gMHg0OTQ5O1xuICAgICAgICAgICAgb2Zmc2V0ICs9IHZpZXcuZ2V0VWludDMyKG9mZnNldCArIDQsIGxpdHRsZSk7XG4gICAgICAgICAgICBjb25zdCB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpO1xuICAgICAgICAgICAgb2Zmc2V0ICs9IDI7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xuICAgICAgICAgICAgICBpZiAodmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMiksIGxpdHRsZSkgPT09IDB4MDExMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh2aWV3LmdldFVpbnQxNihvZmZzZXQgKyAoaSAqIDEyKSArIDgsIGxpdHRsZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICgobWFya2VyICYgMHhGRjAwKSAhPT0gMHhGRjAwKSB7IGJyZWFrOyB9IGVsc2UgeyBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSk7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soLTEpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soMCk7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8qKlxuICAgKiByZXR1cm4gYSBwcm9taXNlIHdpdGggdGhlIG5ldyBpbWFnZSBkYXRhIGFuZCBpbWFnZSBvcmllbnRhdGlvblxuICAgKi9cbiAgc3RhdGljIHVwbG9hZEZpbGUocmVuZGVyOiBSZW5kZXJlcjIpOlByb21pc2U8e2ltYWdlOiBzdHJpbmcsIG9yaWVudGF0aW9uOiBET0NfT1JJRU5UQVRJT04sIGZpbGU6IGFueX0+IHtcblxuICAgIGNvbnN0IHByb21pc2U6IFByb21pc2U8e2ltYWdlOiBzdHJpbmcsIG9yaWVudGF0aW9uOiBET0NfT1JJRU5UQVRJT04sIGZpbGU6IGFueX0+ID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IHJlbmRlci5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgcmVuZGVyLnNldFN0eWxlKGlucHV0RWxlbWVudCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgcmVuZGVyLnNldFByb3BlcnR5KGlucHV0RWxlbWVudCwgJ3R5cGUnLCAnZmlsZScpO1xuICAgICAgcmVuZGVyLnNldFByb3BlcnR5KGlucHV0RWxlbWVudCwgJ2FjY2VwdCcsICdpbWFnZS8qJyk7XG5cbiAgICAgIHJlbmRlci5saXN0ZW4oaW5wdXRFbGVtZW50LCAnY2xpY2snLCAoJGV2ZW50KSA9PiB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ01vdXNlRXZlbnQ6JywgJGV2ZW50KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnSW5wdXQ6JywgJGV2ZW50LnRhcmdldCk7XG4gICAgICAgICRldmVudC50YXJnZXQudmFsdWUgPSBudWxsO1xuICAgICAgfSk7XG5cblxuICAgICAgcmVuZGVyLmxpc3RlbihpbnB1dEVsZW1lbnQsICdjaGFuZ2UnLCAoJGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGU6IEZpbGUgPSAkZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuXG4gICAgICAgIGNvbnN0IG15UmVhZGVyOiBGaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICBteVJlYWRlci5vbmxvYWRlbmQgPSAoZSkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBJbWFnZUNvbXByZXNzLmdldE9yaWVudGF0aW9uKGZpbGUsIG9yaWVudGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7aW1hZ2U6bXlSZWFkZXIucmVzdWx0IGFzIHN0cmluZywgb3JpZW50YXRpb24sIGZpbGV9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYG5neC1pbWFnZS1jb21wcmVzcyBlcnJvciAke2V9YCk7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbXlSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUud2Fybihgbmd4LWltYWdlLWNvbXByZXNzIC0gcHJvYmFibHkgbm8gZmlsZSBoYXZlIGJlZW4gc2VsZWN0ZWQ6ICR7ZX1gKTtcbiAgICAgICAgICByZWplY3QoXCJObyBmaWxlIHNlbGVjdGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dEVsZW1lbnQpO1xuICAgICAgaW5wdXRFbGVtZW50LmNsaWNrKCk7XG5cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cblxuICBzdGF0aWMgY29tcHJlc3MoaW1hZ2VEYXRhVXJsU291cmNlOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICBvcmllbnRhdGlvbjogRE9DX09SSUVOVEFUSU9OLFxuICAgICAgICAgICAgICAgICAgcmVuZGVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgICAgICByYXRpbzogbnVtYmVyID0gNTAsXG4gICAgICAgICAgICAgICAgICBxdWFsaXR5OiBudW1iZXIgPSA1MCk6IFByb21pc2U8c3RyaW5nPiB7XG5cbiAgICBjb25zdCBwcm9taXNlOiBQcm9taXNlPHN0cmluZz4gPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgcXVhbGl0eSA9IHF1YWxpdHkgLyAxMDA7XG4gICAgICByYXRpbyA9IHJhdGlvIC8gMTAwO1xuICAgICAgY29uc3Qgc291cmNlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgLy8gaW1wb3J0YW50IGZvciBzYWZhcmk6IHdlIG5lZWQgdG8gd2FpdCBmb3Igb25sb2FkIGV2ZW50XG4gICAgICBzb3VyY2VJbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSByZW5kZXIuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNvbnN0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgbGV0IHcsIGg7XG4gICAgICAgIHcgPSBzb3VyY2VJbWFnZS5uYXR1cmFsV2lkdGg7XG4gICAgICAgIGggPSBzb3VyY2VJbWFnZS5uYXR1cmFsSGVpZ2h0O1xuXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gRE9DX09SSUVOVEFUSU9OLlJpZ2h0IHx8IG9yaWVudGF0aW9uID09PSBET0NfT1JJRU5UQVRJT04uTGVmdCkge1xuICAgICAgICAgIGNvbnN0IHQgPSB3O1xuICAgICAgICAgIHcgPSBoO1xuICAgICAgICAgIGggPSB0O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLndpZHRoID0gdyAqIHJhdGlvO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaCAqIHJhdGlvO1xuXG5cbiAgICAgICAgY29uc3QgVE9fUkFESUFOUyA9IE1hdGguUEkgLyAxODA7XG5cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBET0NfT1JJRU5UQVRJT04uVXApIHtcblxuICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uoc291cmNlSW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gRE9DX09SSUVOVEFUSU9OLlJpZ2h0KSB7XG5cbiAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgKiBUT19SQURJQU5TKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKDAsIC1jYW52YXMud2lkdGgpO1xuICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uoc291cmNlSW1hZ2UsIDAsIDAsIGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgY3R4LnJlc3RvcmUoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBET0NfT1JJRU5UQVRJT04uTGVmdCkge1xuXG4gICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICBjdHgucm90YXRlKC05MCAqIFRPX1JBRElBTlMpO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoLWNhbnZhcy53aWR0aCwgMCk7XG4gICAgICAgICAgY3R4LmRyYXdJbWFnZShzb3VyY2VJbWFnZSwgMCwgMCwgY2FudmFzLmhlaWdodCwgY2FudmFzLndpZHRoKTtcbiAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IERPQ19PUklFTlRBVElPTi5Eb3duKSB7XG5cbiAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwICogVE9fUkFESUFOUyk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtY2FudmFzLndpZHRoLCAtY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgY3R4LmRyYXdJbWFnZShzb3VyY2VJbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9jb25zb2xlLndhcm4oJ25neC1pbWFnZS1jb21wcmVzcyAtIG5vIG9yaWVudGF0aW9uIHZhbHVlIGZvdW5kJyk7XG4gICAgICAgICAgLy8gc2FtZSBhcyBkZWZhdWx0IFVQXG4gICAgICAgICAgY3R4LmRyYXdJbWFnZShzb3VyY2VJbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgbWltZSA9IGltYWdlRGF0YVVybFNvdXJjZS5zdWJzdHIoNSwgaW1hZ2VEYXRhVXJsU291cmNlLnNwbGl0KCc7JylbMF0ubGVuZ3RoIC0gNSk7XG4gICAgICAgIC8vIFRPRE8gdGVzdCBvbiBtaW1lXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNhbnZhcy50b0RhdGFVUkwobWltZSwgcXVhbGl0eSk7XG5cbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuXG4gICAgICB9O1xuXG4gICAgICBzb3VyY2VJbWFnZS5zcmMgPSBpbWFnZURhdGFVcmxTb3VyY2U7XG5cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cblxuICAvKipcbiAgICogaGVscGVyIHRvIGV2YWx1YXRlIHRoZSBjb21wcmVzc2lvbiByYXRlXG4gICAqIEBwYXJhbSBzIHRoZSBpbWFnZSBpbiBiYXNlNjQgc3RyaW5nIGZvcm1hdFxuICAgKi9cbiAgc3RhdGljIGJ5dGVDb3VudChzOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiBlbmNvZGVVUkkocykuc3BsaXQoLyUuLnwuLykubGVuZ3RoIC0gMTtcbiAgfVxuXG59XG4iXX0=