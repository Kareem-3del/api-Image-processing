import { imagesOptimized} from "../utils/ImageResizer"



it('expect Get FileImages in folder to be array of files', () => {
    expect(!!imagesOptimized()).toBeTrue();
});