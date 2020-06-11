/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, RendererFactory2 } from '@angular/core';
import { ImageCompress } from './image-compress';
import { DOC_ORIENTATION } from './DOC_ORIENTATION';
export class NgxImageCompressService {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxImageCompressService.prototype.render;
    /** @type {?} */
    NgxImageCompressService.prototype.DOC_ORIENTATION;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLWNvbXByZXNzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtY29tcHJlc3MvIiwic291cmNlcyI6WyJsaWIvbmd4LWltYWdlLWNvbXByZXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQWEsZ0JBQWdCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUdsRCxNQUFNLE9BQU8sdUJBQXVCOzs7O0lBTWxDLFlBQVksZUFBaUM7UUFGdEMsb0JBQWUsR0FBRyxlQUFlLENBQUM7UUFHdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDOzs7OztJQUVNLFNBQVMsQ0FBQyxLQUFLO1FBQ3BCLE9BQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDOzs7O0lBRU0sVUFBVTtRQUNmLE9BQU8sYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Ozs7Ozs7SUFFTSxZQUFZLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxRQUFnQixFQUFFLEVBQUUsVUFBa0IsRUFBRTtRQUM5RSxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRixDQUFDOzs7WUFyQkYsVUFBVTs7OztZQUpvQixnQkFBZ0I7Ozs7Ozs7SUFPN0MseUNBQTBCOztJQUUxQixrREFBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIFJlbmRlcmVyMiwgUmVuZGVyZXJGYWN0b3J5Mn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0ltYWdlQ29tcHJlc3N9IGZyb20gJy4vaW1hZ2UtY29tcHJlc3MnO1xuaW1wb3J0IHtET0NfT1JJRU5UQVRJT059IGZyb20gJy4vRE9DX09SSUVOVEFUSU9OJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5neEltYWdlQ29tcHJlc3NTZXJ2aWNlIHtcblxuICBwcml2YXRlIHJlbmRlcjogUmVuZGVyZXIyO1xuXG4gIHB1YmxpYyBET0NfT1JJRU5UQVRJT04gPSBET0NfT1JJRU5UQVRJT047XG5cbiAgY29uc3RydWN0b3IocmVuZGVyZXJGYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkyKSB7XG4gICAgdGhpcy5yZW5kZXIgPSByZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG4gIH1cblxuICBwdWJsaWMgYnl0ZUNvdW50KGltYWdlKSB7XG4gICAgcmV0dXJuIEltYWdlQ29tcHJlc3MuYnl0ZUNvdW50KGltYWdlKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGxvYWRGaWxlKCk6UHJvbWlzZTx7aW1hZ2U6IHN0cmluZywgb3JpZW50YXRpb246IERPQ19PUklFTlRBVElPTn0+IHtcbiAgICByZXR1cm4gSW1hZ2VDb21wcmVzcy51cGxvYWRGaWxlKHRoaXMucmVuZGVyKTtcbiAgfVxuXG4gIHB1YmxpYyBjb21wcmVzc0ZpbGUoaW1hZ2UsIG9yaWVudGF0aW9uLCByYXRpbzogbnVtYmVyID0gNTAsIHF1YWxpdHk6IG51bWJlciA9IDUwKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gSW1hZ2VDb21wcmVzcy5jb21wcmVzcyhpbWFnZSwgb3JpZW50YXRpb24sIHRoaXMucmVuZGVyLCByYXRpbywgcXVhbGl0eSk7XG4gIH1cblxufVxuIl19